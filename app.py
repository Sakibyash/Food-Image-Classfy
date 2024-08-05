from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

HF_API_URL = 'https://api-inference.huggingface.co/models/Sakibrumu/Food_Image_Classification'
HF_API_TOKEN = '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'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    image = request.files['image'].read()
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    response = requests.post(HF_API_URL, files={"file": image}, headers=headers)
    result = response.json()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
