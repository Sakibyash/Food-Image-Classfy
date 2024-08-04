from flask import Flask, request, jsonify, send_from_directory
import json
import requests

app = Flask(__name__)

# Load dish details
with open('dish_details.json', 'r') as file:
    dish_details = json.load(file)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/app.js')
def serve_js():
    return send_from_directory('.', 'app.js')

@app.route('/dish_details.json')
def serve_json():
    return send_from_directory('.', 'dish_details.json')

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['img']
    if file:
        # Call the Hugging Face Space API
        response = requests.post(
            'https://hf.space/embed/Sakibrumu/Food_Image_Classification/api/predict/',
            files={'img': file.read()}
        )
        prediction = response.json()[0]
        return jsonify(prediction)
    else:
        return jsonify({"error": "No image provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)
