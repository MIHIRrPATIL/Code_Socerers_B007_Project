from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document

# Store Transcribed Text from Voice Input
def create_document_from_text(transcribed_text, chat_id, user_id):
    """
    Converts transcribed speech-to-text into a Document format for embedding.
    
    transcribed_text: Transcribed text from Google STT.
    chat_id: Unique identifier for the chat session.
    user_id: ID of the user.

    Returns: Document object for Pinecone indexing.
    """
    metadata = {"chat_id": chat_id, "user_id": user_id, "source": "voice"}
    return Document(page_content=transcribed_text, metadata=metadata)

# Download the Hugging Face Embeddings
def download_hugging_face_embeddings():
    """
    Downloads and initializes Hugging Face sentence-transformer embeddings.
    
    Returns: HuggingFaceEmbeddings object.
    """
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return embeddings
