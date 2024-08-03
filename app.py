from flask import Flask, request, jsonify
from gradio_client import Client
import json

app = Flask(__name__)

client = Client("Sakibrumu/Food_Image_Classification")

# Load dish details
with open('dish_details.json') as f:
    dish_details = json.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    if 'img' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['img']
    result = client.predict(img=file, api_name="/predict")
    return jsonify({'label': result['label'], 'probability': result['probability']})

@app.route('/dish_details/<label>', methods=['GET'])
def get_dish_details(label):
    details = dish_details.get(label, None)
    if details is None:
        return jsonify({'error': 'Dish not found'}), 404
    return jsonify(details)

if __name__ == '__main__':
    app.run(debug=True)
