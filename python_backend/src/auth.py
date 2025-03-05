import logging
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from pymongo import MongoClient
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

auth = Blueprint("auth", __name__)

# Connect to MongoDB
try:
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        raise ValueError("MONGO_URI is not set in environment variables")
    
    mongo_client = MongoClient(MONGO_URI)
    db = mongo_client["chatbot_db"]
    users_collection = db["users"]
    mongo_client.admin.command('ping')  # Test connection
    logger.info("Connected to MongoDB successfully.")
except Exception as e:
    logger.error("Failed to connect to MongoDB: %s", e)
    raise

bcrypt = Bcrypt()

@auth.route("/signup", methods=["POST"])
def signup():
    """Registers a new user."""
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            logger.warning("Signup failed: Missing email or password")
            return jsonify({"error": "Email and password are required"}), 400

        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            logger.warning("Signup failed: User with email %s already exists", email)
            return jsonify({"error": "User already exists"}), 409

        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        user_id = str(users_collection.insert_one({
            "email": email,
            "password_hash": password_hash,
            "chat_sessions": []
        }).inserted_id)

        logger.info("User registered successfully: %s", email)
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    except Exception as e:
        logger.error("Error during signup: %s", e)
        return jsonify({"error": "Internal server error"}), 500

@auth.route("/login", methods=["POST"])
def login():
    """Logs in a user and returns an access token."""
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        user = users_collection.find_one({"email": email})
        if not user or not bcrypt.check_password_hash(user["password_hash"], password):
            logger.warning("Login failed: Invalid credentials for email %s", email)
            return jsonify({"error": "Invalid email or password"}), 401

        access_token = create_access_token(identity=str(user["_id"]))
        logger.info("User logged in successfully: %s", email)
        return jsonify({"access_token": access_token, "user_id": str(user["_id"])}), 200
    except Exception as e:
        logger.error("Error during login: %s", e)
        return jsonify({"error": "Internal server error"}), 500
