# Auto ToS Summarizer – Chrome Extension using LLaMA 3 70B

This Chrome extension automatically detects and summarizes **Terms of Service (ToS)** links on any web page — without you even opening the link. It leverages **Meta's LLaMA 3 70B** model hosted on Hugging Face to generate concise, human-readable summaries in a side panel.

## 🔥 Key Features

- 🔗 **Auto-detects ToS links** (like "Terms", "Terms of Service", "Privacy Policy")
- 📄 **Scrapes and reads the full ToS page content**
- 🧠 **Summarizes using LLaMA 3 70B** (via Hugging Face Inference API or local deployment)
- 📌 **Displays summary in a sleek side panel**
- 🧭 Works seamlessly across all websites

## 🤝 Collaborators

- [**Tabrez Mohammed**](https://github.com/Tabrez10XDev) 
- [**Ashish Ubale**](https://github.com/ASH367)
- [**Ishan Shah**](https://github.com/ishanshah001)

## 🚀 How to Use

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to bundle the extension.
4. Go to `chrome://extensions/`, enable **Developer Mode**, and click **Load unpacked**.
5. Select the `dist` folder.
6. Navigate to any website — the extension will auto-scan for ToS-related links, fetch them, and display a summary in the side panel.

## ⚙️ Tech Stack

- 🧠 **LLaMA 3 70B** — powerful open-source LLM from Meta
- 🌐 **Hugging Face** — for model inference (optional: local server)
- 📚 **Mozilla Readability** — for clean content extraction
- 🧩 **Chrome Extensions API** — manifest v3, sidebar support

## 🔐 Privacy

This extension does not collect or transmit any personal data. All summarization happens via your selected Hugging Face endpoint or local model runner.

## 📅 Future Roadmap

- Support multiple legal doc types (EULAs, privacy policies)
- Offline summarization with quantized models
- Option to summarize *all* external links on a page

---

This project brings together privacy-first AI, helpful summarization, and a better way to skim those 10,000-word ToS pages — without ever opening them.
