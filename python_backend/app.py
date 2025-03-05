from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import json
from google.cloud import speech
from dotenv import load_dotenv
import os
import uuid
import logging
from logging.handlers import RotatingFileHandler
import sys

from src.store_index import store_chat_message, retrieve_chat_context
from src.auth import auth
from langchain_google_genai import GoogleGenerativeAI
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# Configure logging with more detailed setup
def setup_logging():
    # Create logs directory if it doesn't exist
    log_dir = 'logs'
    os.makedirs(log_dir, exist_ok=True)
    
    # Configure logging to write to both file and console
    log_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # File handler with rotation
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, 'real_estate_chatbot.log'), 
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(log_formatter)
    file_handler.setLevel(logging.DEBUG)
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_formatter)
    console_handler.setLevel(logging.DEBUG)
    
    # Configure root logger
    logging.basicConfig(
        level=logging.DEBUG,
        handlers=[file_handler, console_handler]
    )
    
    # Create logger for this module
    return logging.getLogger(__name__)

# Setup logging
logger = setup_logging()

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]
jwt = JWTManager(app)

# Register authentication blueprint
app.register_blueprint(auth, url_prefix='/auth')

## Load API keys separately
google_stt_key = os.getenv("STT_API_KEY")
google_chatbot_key = os.getenv("GEMINI_API_KEY")

# Set environment for STT
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_stt_key

# Initialize Google STT Client
speech_client = speech.SpeechClient()

# Initialize Chatbot (Gemini)
llm = GoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=google_chatbot_key)

# Initialize more comprehensive prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an AI assistant for real estate agents in India. 
    Carefully analyze the entire chat history and the latest user message.
    Provide a relevant and helpful response based on the conversation context.
    
    Capabilities:
    - Communicate in multiple Indian languages
    - Understand property requirements
    - Identify follow-up items
    - Suggest relevant properties
    - Provide concise and actionable responses"""),
    ("human", "Chat History: {context}\n\nLatest Message: {input}")
])

# Create retrieval-based LLM chain
question_answer_chain = create_stuff_documents_chain(llm, prompt)

@app.route("/start_chat", methods=["POST"])
@jwt_required()
def start_chat():
    """Creates a new chat session for a logged-in user."""
    try:
        user_id = get_jwt_identity()
        chat_id = str(uuid.uuid4())
        
        # Log the chat session start
        logger.info(f"New chat session started - User ID: {user_id}, Chat ID: {chat_id}")
        
        return jsonify({"chat_id": chat_id})
    except Exception as e:
        logger.error(f"Error starting chat session: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to start chat session"}), 500

@app.route("/chat", methods=["POST"])
@jwt_required()
def text_chat():
    """Handles text input, retrieves chat history, and generates an LLM response."""
    try:
        # Parse request data
        data = request.json
        chat_id = data.get("chat_id")
        user_message = data.get("message")
        user_id = get_jwt_identity()

        # Log incoming request details
        logger.info(f"Text chat request - User ID: {user_id}, Chat ID: {chat_id}")
        logger.debug(f"User Message: {user_message}")

        # Validate input
        if not chat_id or not user_message:
            logger.warning("Missing chat_id or message in text chat request")
            return jsonify({"error": "Missing chat_id or message"}), 400

        # Retrieve past messages
        try:
            chat_history_docs = retrieve_chat_context(chat_id)
            chat_history = "\n".join([
                f"{doc.metadata.get('role', 'unknown').capitalize()}: {doc.page_content}"
                for doc in chat_history_docs
            ])
            logger.info(f"Retrieved chat history for Chat ID: {chat_id}")
            logger.debug(f"Chat History: {chat_history}")
        except Exception as e:
            logger.error(f"Error retrieving chat context: {str(e)}")
            chat_history = ""

        # Prepare input for LLM
        full_context = chat_history + "\nUser: " + user_message
        
        try:
            # Invoke LLM chain with detailed logging
            logger.info("Invoking LLM chain for response generation")
            
            llm_response = question_answer_chain.invoke({
                "context": chat_history,
                "input": user_message
            })
            
            # Log the full response for debugging
            logger.debug(f"Full LLM Response: {llm_response}")
            
            # Extract answer with error handling
            try:
                response_answer = llm_response.get("answer", "I couldn't generate a response.")
            except Exception as extract_error:
                logger.error(f"Error extracting LLM response: {str(extract_error)}")
                response_answer = "There was an error processing the response."

            logger.info(f"Generated response: {response_answer}")

            # Store messages
            store_chat_message(user_id, chat_id, user_message, role="user")
            store_chat_message(user_id, chat_id, response_answer, role="agent")

            return jsonify({
                "chat_id": chat_id,
                "user_message": user_message,
                "response": response_answer
            })

        except Exception as llm_error:
            logger.error(f"LLM Invocation Error: {str(llm_error)}", exc_info=True)
            return jsonify({
                "error": f"LLM Processing Failed: {str(llm_error)}",
                "chat_history": chat_history,
                "user_message": user_message
            }), 500

    except Exception as e:
        logger.error(f"Unexpected error in text chat: {str(e)}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/summarize_conversation", methods=["POST"])
@jwt_required()
def summarize_conversation():
    """Generates a summary of the conversation with key points and follow-ups."""
    try:
        data = request.json
        chat_id = data.get("chat_id")
        
        logger.info(f"Conversation summary request for Chat ID: {chat_id}")
        
        if not chat_id:
            logger.warning("Missing chat_id in summarize conversation request")
            return jsonify({"error": "Missing chat_id"}), 400
            
        chat_history_docs = retrieve_chat_context(chat_id)
        chat_history = "\n".join([
            f"{doc.metadata.get('role', 'unknown').capitalize()}: {doc.page_content}"
            for doc in chat_history_docs
        ])
        logger.info(f"Retrieved chat history for summarization")
        
        summary_prompt = chat_history + "\nSummarize the key points, property requirements, and needed follow-ups from this conversation."
        summary = question_answer_chain.invoke({"input": summary_prompt})
        
        logger.info("Conversation summary generated successfully")
        
        return jsonify({
            "summary": summary.get("answer", "Unable to generate summary")
        })
    except Exception as e:
        logger.error(f"Error in conversation summarization: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081, debug=True)