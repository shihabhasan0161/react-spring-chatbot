# Learning Guide: Architecture & Design Patterns

This document provides a deep dive into the React Spring Chatbot architecture, helping you understand the design decisions and extend the project with new features.

---

## 📚 Table of Contents

1. [Request Flow](#request-flow)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Data Persistence Strategy](#data-persistence-strategy)
5. [Security Considerations](#security-considerations)
6. [Extension Ideas](#extension-ideas)
7. [Common Development Tasks](#common-development-tasks)

---

## Request Flow

Understanding how data flows through the application is crucial for making modifications and troubleshooting issues.

### Complete User Interaction Flow

```
1. User enters a prompt in the React Chat component
                        ↓
2. Chat component validates input and displays user message
                        ↓
3. Axios client sends HTTP POST request to backend with:
   - User prompt/message
   - User's OpenAI API key (from localStorage)
                        ↓
4. Backend receives request in ChatController or ImageController
                        ↓
5. Controller passes data to appropriate Service:
   - ChatService for text completions
   - ImageService for image generation
                        ↓
6. Service constructs request with:
   - User prompt
   - User's API key (passed via HTTP headers)
   - Model configuration (GPT-4o or DALL·E-3)
                        ↓
7. Spring AI forwards request to OpenAI API
                        ↓
8. OpenAI processes request and returns response
                        ↓
9. Response streams back through Spring controller to frontend
                        ↓
10. React component receives response and:
    - Displays message/image in chat interface
    - Saves to localStorage for persistence
```

### Frontend Request Path
- **File**: `frontend/src/utils/config.js` - Axios instance configuration
- **File**: `frontend/src/components/Chat.jsx` - Chat message handling
- **File**: `frontend/src/components/Image.jsx` - Image generation handling
- **File**: `frontend/src/App.jsx` - API key modal and state management

### Backend Request Path
- **Endpoint**: `POST /api/chat` - ChatController
- **Endpoint**: `POST /api/generate-image` - ImageController
- **Service Layer**: ChatService, ImageService
- **Configuration**: CORS setup in Config class

---

## Frontend Architecture

### Component Structure

```
App (Root Component)
├── Header
│   └── API Key Modal (modal.jsx)
└── TabContainer
    ├── Chat Tab
    │   └── Chat Component (Chat.jsx)
    │       ├── MessageList
    │       ├── InputBox
    │       └── Sidebar (previousChats)
    └── Image Tab
        └── Image Component (Image.jsx)
            ├── PromptInput
            └── GalleryView
```

### State Management Strategy

The application uses **React hooks** and **localStorage** for state management:

#### App.jsx - Root State
```javascript
// API Key state
const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey'))

// Tab switching
const [activeTab, setActiveTab] = useState('chat')

// Modal visibility
const [showModal, setShowModal] = useState(!apiKey)
```

#### Chat.jsx - Chat State
```javascript
// Active conversation
const [messages, setMessages] = useState([])
const [chatHistory, setChatHistory] = useState('')

// Previous conversations
const [previousChats, setPreviousChatts] = useState([])

// UI state
const [isLoading, setIsLoading] = useState(false)
const [input, setInput] = useState('')
```

#### localStorage Data Structure

```javascript
// User's OpenAI API key
localStorage.apiKey = 'sk-...'

// Chat conversations (stringified array)
localStorage.previousChats = JSON.stringify([
  {
    title: "Machine Learning Basics",
    messages: [
      { role: 'user', content: '...' },
      { role: 'assistant', content: '...' }
    ]
  },
  // ... more conversations
])

// Current chat session
localStorage.chatHistory = JSON.stringify([
  { role: 'user', content: '...' },
  { role: 'assistant', content: '...' }
])
```

### Key Frontend Features

#### Responsive Sidebar
- Uses `useLayoutEffect` for breakpoint detection
- Automatically hides/shows history on small screens
- Mobile-friendly conversation switching

#### Keyboard Shortcuts
- **Enter** - Send message
- **Shift+Enter** - Add newline to message
- Matches conventions of popular messaging apps

#### Session Persistence
- Messages persist across browser refreshes
- Conversation history stored in previousChats
- Multiple conversation management for power users

---

## Backend Architecture

### Spring Boot Structure

```
backend/src/main/java/com/chatbot/
├── config/
│   └── Config.java                 # CORS and Bean configurations
├── controller/
│   ├── ChatController.java         # /api/chat endpoint
│   └── ImageController.java        # /api/generate-image endpoint
├── service/
│   ├── ChatService.java            # OpenAI chat completion logic
│   └── ImageService.java           # DALL·E image generation logic
├── model/
│   ├── ChatRequest.java            # DTO for chat requests
│   ├── ChatResponse.java           # DTO for chat responses
│   └── ImageResponse.java          # DTO for image responses
└── ChatbotApplication.java         # Application entry point
```

### Service Layer Deep Dive

#### ChatService
Responsible for:
- Validating chat requests
- Injecting user API key into Spring AI ChatModel
- Streaming responses from OpenAI
- Error handling and fallback responses

Key Method:
```java
public String getChatResponse(String prompt, String apiKey)
// Takes user prompt and API key
// Returns chat completion from GPT-4o
```

#### ImageService
Responsible for:
- Validating image generation requests
- Lazy-loading OpenAiImageModel with user credentials
- Configuring DALL·E-3 model options
- Returning image URLs

Key Method:
```java
public String generateImage(String prompt, String apiKey)
// Takes image description prompt and API key
// Returns DALL·E-3 generated image URL
```

### Controller Layer

Controllers are intentionally thin:
- Accept HTTP requests
- Validate input format
- Delegate to services
- Return JSON responses
- No business logic in controllers

### CORS Configuration

Located in `Config.java`:
```java
@Configuration
public class Config implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")  // Frontend URL
            .allowedMethods("GET", "POST")
            .allowCredentials(true);
    }
}
```

**Note**: Update `allowedOrigins` when deploying to production.

---

## Data Persistence Strategy

### Client-Side Persistence (Primary)

All conversation data lives in the **browser localStorage**:

```javascript
{
  apiKey: "sk-...",                    // User's OpenAI key (encrypted recommended)
  chatHistory: "[...]",                // Current chat messages
  previousChats: "[...]",              // All saved conversations
  imageHistory: "[...]",               // Generated images (optional)
}
```

**Advantages:**
- User data never stored on server
- Fast access and retrieval
- Works offline for historical data
- User maintains full control

**Limitations:**
- Limited storage (~5-10MB per domain)
- Single device only
- Lost if browser data is cleared
- No end-to-end encryption by default

### Server-Side Considerations

Currently, the backend is **stateless**:
- No session management
- No database persistence
- Each request is independent
- Scalable horizontally

**Future Enhancement Options:**
- Add user authentication system
- Implement MongoDB/PostgreSQL for conversation archival
- Enable cross-device synchronization
- Add conversation sharing features

---

## Security Considerations

### API Key Handling

#### Current Approach
1. User enters API key in modal
2. Key stored in browser localStorage
3. Key passed with each request to backend
4. Backend never stores the key (only in memory during request)

#### Recommended Improvements

```javascript
// 1. Encrypt API key before storing in localStorage
import { AES, enc } from 'crypto-js'

const encryptKey = (apiKey) => {
  const encrypted = AES.encrypt(apiKey, 'secret-key').toString()
  localStorage.setItem('apiKey', encrypted)
}

// 2. Use environment variables for sensitive config
// Backend should validate API keys more thoroughly

// 3. Consider OAuth for production applications
```

### Communication Security

- ✅ Use **HTTPS** in production (not HTTP)
- ✅ Enable **CORS** only for trusted domains
- ✅ Validate **API key format** on backend
- ✅ Implement **rate limiting** to prevent abuse
- ⚠️ Consider **authentication middleware** for multi-user scenarios

### Input Validation

Always validate on both frontend and backend:
```javascript
// Frontend validation
const validatePrompt = (prompt) => {
  return prompt && prompt.trim().length > 0 && prompt.length < 5000
}

// Backend validation (Spring)
@PostMapping("/api/chat")
public ResponseEntity<?> chat(@RequestBody @Valid ChatRequest request) {
  // Spring validates using @Valid annotation
  // Check for null/empty values
  // Verify API key format
}
```

---

## Extension Ideas

### Feature Additions

#### 1. **Conversation Export**
Export chat history as JSON, CSV, or PDF
- Location: Add method to Chat component
- Backend: Create `/api/export` endpoint

#### 2. **User Authentication**
Allow users to save conversations across devices
- Add Spring Security with JWT
- Implement user registration/login
- Link conversations to user accounts

#### 3. **Advanced Prompt Templates**
Pre-built prompts for common tasks
```javascript
const templates = {
  codeReview: "Review this code for...",
  contentWriter: "Write content about...",
  tutor: "Explain to me how...",
}
```

#### 4. **Multi-Model Support**
Support GPT-3.5, Claude, other models
- Add model selector to UI
- Update backend to support multiple providers
- Extend ChatService to handle different APIs

#### 5. **Voice Input/Output**
Add speech-to-text and text-to-speech
- Use Web Speech API for voice input
- Integrate text-to-speech service
- Add audio playback controls

#### 6. **Conversation Sharing**
Share conversations with unique URLs
- Generate unique conversation IDs
- Implement viewing-only public links
- Backend: Add conversation storage

#### 7. **Custom Instructions**
Let users set system prompts
- Store custom instructions in localStorage
- Pass system prompt to ChatService
- Personalize responses per user

#### 8. **Image Enhancement**
Advanced image editing and generation
- Image upscaling using DALL·E
- Style transfer
- Image variation generation

### Code Extension Patterns

#### Adding a New API Endpoint

**Backend (Spring Boot):**
```java
@PostMapping("/api/new-feature")
public ResponseEntity<NewFeatureResponse> newFeature(
    @RequestBody NewFeatureRequest request) {
  try {
    String result = newFeatureService.process(request);
    return ResponseEntity.ok(new NewFeatureResponse(result));
  } catch (Exception e) {
    return ResponseEntity.status(500).body(new ErrorResponse(e.getMessage()));
  }
}
```

**Frontend (React):**
```javascript
const callNewFeature = async (data) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/new-feature`,
      { ...data, apiKey }
    )
    return response.data
  } catch (error) {
    console.error('Feature error:', error)
    throw error
  }
}
```

---

## Common Development Tasks

### Adding a New Component

1. Create component file: `frontend/src/components/NewFeature.jsx`
2. Design component state using hooks
3. Add to routing/tabs in `App.jsx`
4. Style with CSS or Tailwind
5. Test with backend endpoints

### Adding a New Service

1. Create `backend/src/main/java/com/chatbot/service/NewService.java`
2. Implement business logic
3. Add error handling
4. Create corresponding controller endpoint
5. Test with Postman/curl

### Debugging Tips

**Frontend Debugging:**
- Use React Developer Tools browser extension
- Check localStorage in DevTools
- Monitor Network tab for API requests
- Use console.log for component state

**Backend Debugging:**
- Check Spring Boot logs in terminal
- Use IDE debugger with breakpoints
- Monitor OpenAI API responses
- Validate request/response formats

### Running Tests

```bash
# Frontend tests (if Jest is configured)
cd frontend
npm test

# Backend tests (if JUnit is configured)
cd backend
mvn test
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| API requests fail with CORS error | Update CORS allowedOrigins in Config.java |
| Invalid API key error | Verify OpenAI API key format and permissions |
| Frontend can't connect to backend | Check VITE_BACKEND_URL in .env file |
| Images not generating | Verify DALL·E-3 access in OpenAI account |
| localStorage not persisting | Check browser privacy settings |

### Getting Help

- Review error messages in browser console
- Check backend logs in Spring Boot terminal
- Consult [Spring AI docs](https://spring.io/projects/spring-ai)
- Open an issue on [GitHub](https://github.com/shihabhasan0161/react-spring-chatbot)

---

## Next Steps

Ready to extend the project? Start with:
1. Set up your development environment (see README.md)
2. Run the application locally
3. Modify a small component to understand the flow
4. Implement one of the extension ideas
5. Submit a pull request! (see CONTRIBUTING.md)

Happy learning! 📚
