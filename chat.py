import random
import json
import re
import torch
from model import NeuralNet
from nltkUtils import bag_of_words, tokenize
from api_wiki import get_wikipedia_summary
from api_weather import get_weather 

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Ivan"
weather_api_key = 'b546710a0aec466dbc150610231212'

print("Let's chat! (type 'quit' to exit)")
while True:
    sentence = input("You: ")
    if sentence.lower() == "quit":
        break

    wikipedia_search_patterns = re.compile(r"(search\s(wikipedia|wiki)|wikipedia|wiki)\s*['\"]?([^'\"]*)['\"]?")
    weather_search_patterns = re.compile(r"(weather|temperature)\s*['\"]?([^'\"]*)['\"]?")

    if wikipedia_search_patterns.search(sentence.lower()):
        match = wikipedia_search_patterns.search(sentence.lower())
        search_query = match.group(3) if match.group(3) else input("You: What topic would you like to search on Wikipedia? ")
        summary = get_wikipedia_summary(search_query)
        print(f"{bot_name}: Wikipedia Summary for '{search_query}':\n{summary}")

    elif weather_search_patterns.search(sentence.lower()):
        match = weather_search_patterns.search(sentence.lower())
        location = match.group(2) if match.group(2) else input("You: What location would you like the weather for? ")
        weather_info = get_weather(weather_api_key, location)
        print(f"{bot_name}: {weather_info}")

    else:
        sentence = tokenize(sentence)
        X = bag_of_words(sentence, all_words)
        X = X.reshape(1, X.shape[0])
        X = torch.from_numpy(X).to(device)

        output = model(X)
        _, predicted = torch.max(output, dim=1)

        tag = tags[predicted.item()]

        probs = torch.softmax(output, dim=1)
        prob = probs[0][predicted.item()]
        if prob.item() > 0.75:
            for intent in intents['intents']:
                if tag == intent["tag"]:
                    print(f"{bot_name}: {random.choice(intent['responses'])}")
        else:
            print(f"{bot_name}: I do not understand...")
