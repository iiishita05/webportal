from flask import Flask, request, jsonify, make_response
from transformers import pipeline

app = Flask(__name__)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3001'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

@app.route('/summarize', methods=['POST', 'OPTIONS'])
def summarize():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3001'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
        return response

    data = request.get_json()
    text = data.get('text', '')

    # Actual summarization using Hugging Face
    if text:
        result = summarizer(text, max_length=100, min_length=30, do_sample=False)
        summary = result[0]['summary_text']
    else:
        summary = "No input text provided."

    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(port=5001)
