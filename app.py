from flask import Flask, render_template, request, jsonify

from chat import process_message
from chat import load_data_and_initialize_model

app = Flask(__name__, template_folder='ui', static_folder='ui')

@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")

    model, intents, all_words, tags = load_data_and_initialize_model()
    response = process_message(model, text, intents, all_words, tags)
    message = {"answer": response}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)