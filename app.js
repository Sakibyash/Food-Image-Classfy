from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
import os
import requests
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['mydatabase']
collection = db['mycollection']

# Hugging Face API setup
HF_MODEL_URL = os.getenv('HF_MODEL_URL')
HF_API_TOKEN = os.getenv('HF_API_TOKEN')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        # Save the file to a temporary location
        file_path = os.path.join('/tmp', file.filename)
        file.save(file_path)

        # Insert metadata into MongoDB
        collection.insert_one({
            'filename': file.filename,
            'file_path': file_path
        })
        
        return jsonify({"message": "File uploaded successfully"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Prepare file for Hugging Face model
    headers = {
        'Authorization': f'Bearer {HF_API_TOKEN}',
        'Content-Type': 'application/json'
    }
    response = requests.post(HF_MODEL_URL, headers=headers, files={'file': file})
    
    if response.status_code != 200:
        return jsonify({"error": "Prediction request failed"}), 500

    prediction = response.json()

    return jsonify(prediction)

@app.route('/data', methods=['GET'])
def get_data():
    documents = collection.find()
    data = [{"_id": str(doc["_id"]), "filename": doc["filename"], "file_path": doc["file_path"]} for doc in documents]
    return jsonify(data)

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
