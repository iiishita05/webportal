from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)



CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "https://e1c5-2405-201-6011-4a51-9d18-86f0-3000-f7c4.ngrok-free.app"
]}})


summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    text = data.get('text', '')

    if text:
        result = summarizer(text, max_length=100, min_length=30, do_sample=False)
        summary = result[0]['summary_text']
    else:
        summary = "No input text provided."

    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
