from flask import Flask, request, jsonify, make_response
from transformers import pipeline

app = Flask(__name__)
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3002'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

@app.route('/tag', methods=['POST', 'OPTIONS'])
def tag():
    if request.method == 'OPTIONS':
        return make_response('', 204)

    data = request.get_json()
    text = data.get('text', '')
    labels = ["Urgent", "Leave", "Budget", "Maintenance", "Meeting", "Complaint", "Request", "General","Medical"]

    if not text:
        return jsonify({"tags": []})

    result = classifier(text, labels)
    tags = [label for label, score in zip(result['labels'], result['scores']) if score > 0.5]

    return jsonify({"tags": tags})

if __name__ == '__main__':
    app.run(port=5002)
