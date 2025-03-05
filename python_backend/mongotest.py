from pymongo import MongoClient

uri = "mongodb+srv://user:user@cluster0.3yuvj.mongodb.net/testdb?retryWrites=true&w=majority"
client = MongoClient(uri, serverSelectionTimeoutMS=5000)

try:
    client.admin.command('ping')
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print("❌ Connection failed:", e)
