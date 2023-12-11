from PyQt5.QtGui import QTextCursor
import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QTextEdit, QLineEdit, QPushButton, QVBoxLayout, QWidget
from model import NeuralNet
from nltkUtils import bag_of_words, tokenize
import torch
import random
import json
import os

from training import all_words, intents as training_intents, intents

os.environ["QT_QPA_PLATFORM"] = "xcb"

class ChatbotGUI(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Chatbot GUI")
        self.setGeometry(100, 100, 600, 400)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        self.layout = QVBoxLayout()

        self.chat_history = QTextEdit(self)
        self.chat_history.setReadOnly(True)
        self.layout.addWidget(self.chat_history)

        self.user_input = QLineEdit(self)
        self.layout.addWidget(self.user_input)

        self.send_button = QPushButton("Send", self)
        self.send_button.clicked.connect(self.send_message)
        self.layout.addWidget(self.send_button)

        self.central_widget.setLayout(self.layout)

        # Initialize chatbot components
        self.initialize_chatbot()

    def initialize_chatbot(self):
        # Load intents and model
        with open('intents.json', 'r') as f:
            intents = json.load(f)

        FILE = "data.pth"
        data = torch.load(FILE)

        input_size = data["input_size"]
        hidden_size = data["hidden_size"]
        output_size = data["output_size"]
        all_words = data['all_words']
        self.tags = data['tags']  # Moved 'self.tags' to __init__
        model_state = data["model_state"]

        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        self.model = NeuralNet(input_size, hidden_size, output_size).to(self.device)
        self.model.load_state_dict(model_state)
        self.model.eval()

        self.bot_name = "Sam"

    def send_message(self):
        user_message = self.user_input.text()
        self.display_message(f"You: {user_message}")

        # Chatbot processing code
        sentence = tokenize(user_message)
        X = bag_of_words(sentence, all_words)
        X = X.reshape(1, X.shape[0])
        X = torch.from_numpy(X).to(self.device)

        output = self.model(X)
        _, predicted = torch.max(output, dim=1)

        tag = self.tags[predicted.item()]

        probs = torch.softmax(output, dim=1)
        probs = torch.softmax(output, dim=1)
        prob = probs[0][predicted.item()]
        if prob.item() > 0.75:
            for intent in intents['intents']:
                if tag == intent["tag"]:
                    bot_response = random.choice(intent['responses'])
                    self.display_message(f"{self.bot_name}: {bot_response}")
        else:
            self.display_message(f"{self.bot_name}: I do not understand...")

        # Clear the user input field
        self.user_input.clear()

    def display_message(self, message):
        current_text = self.chat_history.toPlainText()
        self.chat_history.setPlainText(current_text + message + "\n")
        self.chat_history.moveCursor(QTextCursor.End)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ChatbotGUI()
    window.show()
    sys.exit(app.exec_())
