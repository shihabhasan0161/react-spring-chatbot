# Chatbot (Spring AI + React)

A full-stack open-source chatbot app built using Spring AI backend and React front-end to deliver chat completions and OpenAI image generation in a single experience.

## Features
- Conversational UI with session history, local persistence, and responsive sidebar driven by [`Chat`](frontend/src/components/Chat.jsx).
- Image generation workflow using [`Image`](frontend/src/components/Image.jsx) and [`com.chatbot.chatbot.service.ImageService`](backend/src/main/java/com/chatbot/chatbot/service/ImageService.java).
- Client-side API key modal stored safely in localStorage (`[`App`](frontend/src/App.jsx)`).
- REST endpoints backed by Spring AI models via [`com.chatbot.chatbot.controller.ChatController`](backend/src/main/java/com/chatbot/chatbot/controller/ChatController.java) and [`com.chatbot.chatbot.controller.ImageController`](backend/src/main/java/com/chatbot/chatbot/controller/ImageController.java).
- CORS Configuration in [`com.chatbot.chatbot.config.Config`](backend/src/main/java/com/chatbot/chatbot/config/Config.java).

## Architecture
| Layer | Responsibilities |
| --- | --- |
| Frontend (Vite + React) | Renders chat/image tabs, stores conversations in localStorage, forwards prompts to backend with the user-provided API key. |
| Gateway (`axios` instance) | [`config`](frontend/src/utils/config.js) targets `VITE_BACKEND_URL` for both chat and image routes. |
| Backend (Spring Boot) | [`com.chatbot.chatbot.service.ChatService`](backend/src/main/java/com/chatbot/chatbot/service/ChatService.java) streams prompts to OpenAI chat models, while [`com.chatbot.chatbot.service.ImageService`](backend/src/main/java/com/chatbot/chatbot/service/ImageService.java) orchestrates DALL·E generation. |
| Container | [`backend/Dockerfile`](backend/Dockerfile) builds a production-ready container;

## Requirements
- Node.js ≥ 20
- Maven ≥ 3.9
- JDK 21
- OpenAI API key with GPT-4o + DALL·E-3 access

## Setup

1. **Clone & install**

    ```
    git clone https://github.com/shihabhasan0161/react-spring-chatbot.git
    cd react-spring-chatbot
    ```

3. **Environment and CORS config Setup**

    ```
    Backend: 
    set defaults to application.properties:
    spring.ai.openai.chat.options.model=gpt-4o
    spring.ai.openai.api-key="" (No need to set API key here, just passing "" will work as we are passing the key by backend\src\main\java\com\chatbot\chatbot\model)

    Frontend: set in .env VITE_BACKEND_URL=http://localhost:8080/
    ```


2. **Backend**

    ```
    cd backend
    mvn spring-boot:run
    ```

3. **Frontend**

    ```
    cd frontend
    npm install
    npm run dev
    ```

4. Open `http://localhost:5173`, click “Set API Key”, paste your OpenAI key, then start chatting or generating images.

## API Reference
| Method | Path | Handler |
| --- | --- | --- |
| `POST /chat` | [`com.chatbot.chatbot.controller.ChatController`](backend/src/main/java/com/chatbot/chatbot/controller/ChatController.java) |
| `POST /generate-image` | [`com.chatbot.chatbot.controller.ImageController`](backend/src/main/java/com/chatbot/chatbot/controller/ImageController.java) |

Both endpoints expect `{ prompt, apiKey }` JSON payloads.

## Project Structure
```
backend/   # Spring Boot, Spring AI, Maven
frontend/  # React
```

## Additional Docs
- [LEARN.md](LEARN.md) — deep-dive into architecture and extension ideas.
- [CONTRIBUTING.md](CONTRIBUTING.md) — workflow for issues, branches, and reviews.

  MIT License

## License
MIT License - feel free to use this project for learning and development.

Happy hacking!
