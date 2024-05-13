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

def handle_coffee_order(sentence):
    coffee_order_pattern = re.compile(r"order\s*['\"]?([^'\"]*)['\"]?")
    if coffee_order_pattern.search(sentence):
        match = coffee_order_pattern.search(sentence)
        coffee_name = match.group(1)
        with open('coffee.txt', 'r', encoding='utf-8') as coffee_file:
            for line in coffee_file:
                name, price, *aliases = line.strip().split(',')
                if coffee_name.lower() == name.lower() or coffee_name.lower() in [alias.lower() for alias in aliases]:
                    return f"{name.capitalize()}: {price.strip()}"
        return f"{coffee_name.capitalize()} is not available in our menu."
    return None

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
                """
               if tag == intent["tag"] and tag in ["location"]:
                   
                   return get_user_location() 
                """
                return random.choice(intent['responses'])
    return "Би ойлгохгүй байна..."

def chat():
    model, intents, all_words, tags = load_data_and_initialize_model()
    while True:
        sentence = input("You: ")
        if sentence.lower() == "quit":
            break
        response = handle_coffee_order(sentence) or process_message(model, sentence, intents, all_words, tags)
        print(f"{bot_name}: {response}")

if __name__ == "__main__":
    chat()