import random
import json
import re
import torch
import os
from model import NeuralNet
from nltkUtils import bag_of_words, tokenize
from subprocess import call

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
bot_name = "Caffe Bene"
WEATHER_API_KEY = 'b546710a0aec466dbc150610231212'
FILE = "data.pth"

def load_data_and_initialize_model():
    with open('intents.json', 'r', encoding='utf-8') as json_data:
        intents = json.load(json_data)

    data = torch.load(FILE)
    model = NeuralNet(data["input_size"], data["hidden_size"], data["output_size"]).to(DEVICE)
    model.load_state_dict(data["model_state"])
    model.eval()

    return model, intents, data['all_words'], data['tags']

def process_message(model, sentence, intents, all_words, tags):
    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(DEVICE)
    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]
    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])
    return "Би ойлгохгүй байна..."

def chat():
    model, intents, all_words, tags = load_data_and_initialize_model()
    while True:
        sentence = input("You: ")
        if sentence.lower() == "quit":
            break
        response = process_message(model, sentence, intents, all_words, tags)
        print(f"{bot_name}: {response}")

if __name__ == "__main__":
    chat()