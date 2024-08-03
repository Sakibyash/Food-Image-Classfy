from flask import Flask, request, send_from_directory, jsonify
import gradio as gr
import os

app = Flask(__name__)

# Serve the index.html file
@app.route('/')
def index():
    return send_from_directory('', 'index.html')

# Serve static files (CSS, JS)
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# Serve the dish_detail.json file
@app.route('/dish_detail.json')
def get_dish_details():
    return send_from_directory('', 'dish_detail.json')

# Prediction endpoint using Gradio
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Ensure temp directory exists
    temp_dir = 'temp'
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    temp_file_path = os.path.join(temp_dir, file.filename)
    
    try:
        # Save the file to a temporary location
        file.save(temp_file_path)

        # Load the Gradio interface
        iface = gr.Interface.load("huggingface/Sakibrumu/Food_Image_Classification")
        
        # Make a prediction
        prediction = iface.predict([temp_file_path])[0]
        
        # Return the prediction
        return jsonify(prediction)
    
    except Exception as e:
        # Log the error
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == '__main__':
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)
