from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) 

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

@app.route('/tag', methods=['POST'])
def tag():
    data = request.get_json()
    text = data.get('text', '')

    print(">>> Received request:", text)

    labels = ["Urgent", "Leave", "Budget", "Maintenance", "Meeting", "Complaint", "Request", "General", "Medical"]

    if not text.strip():
        print(">>> Empty text")
        return jsonify({"tags": []})

    result = classifier(
    text,
    candidate_labels=labels,
    hypothesis_template="This text is about {}."
)

    print(">>> Raw model result:", result)

    tags_above_threshold = [label for label, score in zip(result['labels'], result['scores']) if score >= 0.3]

    if not tags_above_threshold:
        tags_above_threshold = result['labels'][:3]

    print(">>> Selected tags:", tags_above_threshold)
    return jsonify({"tags": tags_above_threshold})

if __name__ == '__main__':
    app.run(port=5002)
