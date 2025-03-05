from langchain.schema import Document
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from pinecone import ServerlessSpec
from langchain_pinecone import PineconeVectorStore

from dotenv import load_dotenv
import os
import uuid
import time
import logging
from src.helper import download_hugging_face_embeddings

# Configure logging
logger = logging.getLogger(__name__)

# Load API Key
load_dotenv()
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = "chatbotindex"

# Load Embeddings Model
embeddings = download_hugging_face_embeddings()

def store_transcription_results(transcription_results, chat_id, user_id):
    """
    Stores transcription results in Pinecone under a chat session.
    
    Args:
        transcription_results (list): List of transcription result dictionaries
        chat_id (str): Unique identifier for the chat session
        user_id (str): Unique identifier for the user
    
    Returns:
        list: List of document IDs of the stored messages
    """
    doc_ids = []
    
    try:
        for result in transcription_results:
            doc_id = str(uuid.uuid4())  # Generate a unique document ID
            transcript = result.get("transcript", "")
            confidence = result.get("confidence", "0.00%")

            metadata = {
                "user_id": user_id,
                "chat_id": chat_id,
                "role": "user",  # Assuming all are from user for now
                "confidence": confidence,
                "timestamp": int(time.time())  # Add timestamp
            }

            document = Document(page_content=transcript, metadata=metadata)

            docsearch = PineconeVectorStore.from_documents(
                documents=[document],
                index_name=index_name,
                embedding=embeddings
            )
            
            doc_ids.append(doc_id)  # Store the document ID
            logger.info(f"Message stored successfully - Chat ID: {chat_id}, Role: user, Confidence: {confidence}")
        
        return doc_ids
    
    except Exception as e:
        logger.error(f"Error storing transcription results: {str(e)}")
        return []

def retrieve_chat_context(chat_id, max_messages=5):
    """
    Retrieves relevant past messages from the chat session.
    
    Args:
        chat_id (str): Unique identifier for the chat session
        max_messages (int, optional): Maximum number of messages to retrieve.
    
    Returns:
        List[Document]: List of Document objects containing chat messages
    """
    try:
        docsearch = PineconeVectorStore.from_existing_index(index_name, embeddings)
        
        results = docsearch.similarity_search(
            query="", 
            filter={"chat_id": chat_id},
            k=max_messages
        )

        # Return the Document objects directly
        return results if results else []

    except Exception as e:
        logger.error(f"Error retrieving chat context for {chat_id}: {str(e)}")
        return []

# Example transcription results in the form you're using
transcription_results = [
    {
        "result_number": 1,
        "transcript": "हेलो आपके पास 3 फ्लैट अवेलेबल है। क्या आपके पास अंदर की इस्टमेंट 3 फ्लैट अवेलेबल है। उसका प्रायस कितन है अभि 3 फ्लैट का प्रायस ₹2 करोड़।",
        "confidence": "88.49%"
    }
]

# Example usage of the function
chat_id = "example_chat_id"
user_id = "example_user_id"
stored_doc_ids = store_transcription_results(transcription_results, chat_id, user_id)

print(f"Stored document IDs: {stored_doc_ids}")
