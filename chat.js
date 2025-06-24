// 🧠 Import Gemini API library from CDN
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 🔑 Your Gemini API key (keep private in real projects)
const API_KEY = "AIzaSyC75qzCbjdTk1Q6hyJRqYezjq-DTflAQTc";
const genAI = new GoogleGenerativeAI(API_KEY);

// 📦 Get the chat box and input elements from the page
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

// 📝 To store the full conversation (history)
const history = [];

// 💬 This function sends user's message and gets reply from Gemini
async function sendMessage() {
  const userInput = input.value.trim();
  if (!userInput) return;

  // ➕ Show user's message
  appendMessage("user", userInput);
  input.value = "";

  // 🧾 Add user message to history
  history.push({
    role: "user",
    parts: [{ text: userInput }]
  });

  // Show "Searching..."
  const typingElem = document.createElement("div");
  typingElem.className = "bot-message typing";
  typingElem.textContent = "Searching...";
  chatBox.appendChild(typingElem);
  chatBox.scrollTop = chatBox.scrollHeight;

  // 🤖 Create the Gemini model and context
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  try {
    const result = await model.generateContent({ contents: history });
    const response = result.response.text();

    // Add bot response to history
    history.push({
      role: "model",
      parts: [{ text: response }]
    });

    // Show actual reply
    typingElem.classList.remove("typing");
    typingElem.textContent = `🤖 NovaChat: ${response}`;
  } catch (err) {
    typingElem.textContent = "❌ Error: Failed to get response.";
    console.error(err);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

// 📌 Append message in chat box
function appendMessage(sender, message) {
  const msgElem = document.createElement("div");
  msgElem.className = sender === "user" ? "user-message" : "bot-message";
  msgElem.textContent = `${sender === "user" ? "👦 You" : "🤖 Aakarsh"}: ${message}`;
  chatBox.appendChild(msgElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🌐 Make sendMessage accessible in HTML
window.sendMessage = sendMessage;

// ⌨️ Send message on pressing Enter
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// 📋 Copy chat when clicking "Copy"
const copyBtn = document.getElementById("copy-btn");
copyBtn.addEventListener("click", () => {
  const textToCopy = [...chatBox.children].map(child => child.textContent).join("\n");

  if (textToCopy.trim() === "") {
    alert("No chat to copy!");
    return;
  }

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
    })
    .catch(err => {
      alert("Failed to copy chat.");
      console.error(err);
    });
});

// 🔁 Refresh page on "New Chat" click
const newChatBtn = document.getElementById("new-chat");
newChatBtn.addEventListener("click", () => {
  location.reload(); // Refreshes the page
});
