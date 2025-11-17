# Contributing Guide

Thank you for your interest in contributing to the React Spring Chatbot project! This guide will help you get started and ensure a smooth collaboration process.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Code Standards](#code-standards)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment. We ask all contributors to:
- Be respectful and constructive in all interactions
- Provide and accept constructive feedback gracefully
- Focus on what's best for the community
- Report unacceptable behavior to the project maintainers

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Git** - Version control system
- **Node.js** ≥ 20.x - JavaScript runtime
- **Maven** ≥ 3.9 - Java build tool
- **JDK** 21+ - Java Development Kit
- **OpenAI API Key** - For testing

### Fork and Clone

1. **Fork the Repository**
   - Click "Fork" on the main GitHub repository
   - This creates your own copy under your username

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/react-spring-chatbot.git
   cd react-spring-chatbot
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/shihabhasan0161/react-spring-chatbot.git
   git remote -v  # Verify you have both 'origin' and 'upstream'
   ```

### Set Up Development Environment

Follow the setup instructions in [README.md](README.md):

**Backend Setup:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend Setup (in new terminal):**
```bash
cd frontend
npm install
npm run dev
```

Create `.env` file in `frontend/` with:
```
VITE_BACKEND_URL=http://localhost:8080/
```

---

## Development Workflow

### 1. Check for Existing Issues

Before starting work:
- Search [GitHub Issues](https://github.com/shihabhasan0161/react-spring-chatbot/issues)
- Look for similar pull requests
- Comment on existing issues if relevant
- Avoid duplicate work

### 2. Create a Discussion Issue (For Large Changes)

For substantial changes, open an issue first to discuss:
- **What you want to change**: Clear description of the feature or fix
- **Why you want to change it**: Problem you're solving
- **How you plan to approach it**: High-level implementation strategy
- **Files you'll modify**: Relevant components/services

This prevents wasted effort if the maintainers have a different vision.

### 3. Create a Feature Branch

Create a branch with a descriptive name:

```bash
# Update your local main branch
git fetch upstream
git checkout main
git reset --hard upstream/main

# Create feature branch
git checkout -b feature/add-voice-input
# or for bug fixes
git checkout -b bugfix/api-key-validation
# or for documentation
git checkout -b docs/improve-setup-guide
```

**Branch Naming Convention:**
- `feature/<feature-name>` - New features
- `bugfix/<issue-number-or-name>` - Bug fixes
- `docs/<topic>` - Documentation improvements
- `refactor/<topic>` - Code refactoring
- `test/<topic>` - Test additions

### 4. Make Your Changes

Write your code following the [Code Standards](#code-standards) below.

**Keep commits atomic:**
- Each commit should represent one logical change
- Avoid mixing multiple features in one commit
- Write clear commit messages

```bash
# Good commit message
git commit -m "Add voice input support to Chat component

- Integrate Web Speech API for speech-to-text
- Add voice button to input area
- Store voice input in state before sending"

# Avoid unclear messages
git commit -m "Fix stuff"
git commit -m "Updates"
```

### 5. Keep Your Branch Updated

If development continues while you're working:

```bash
git fetch upstream
git rebase upstream/main
# If you have local commits, resolve any conflicts
```

---

## Making Changes

### Frontend Changes

**Location:** `frontend/src/`

**React Best Practices:**
- Use functional components with hooks
- Keep components small and focused
- Extract shared logic into custom hooks
- Use meaningful variable names
- Add comments for complex logic

**File Structure:**
```
frontend/src/
├── components/          # React components
│   ├── Chat.jsx
│   ├── Image.jsx
│   └── Modal.jsx
├── utils/              # Helper functions
│   ├── config.js       # Axios configuration
│   └── helpers.js      # Utility functions
├── App.jsx             # Root component
└── main.jsx            # Entry point
```

**Example Component:**
```javascript
import { useState, useEffect } from 'react'
import axios from 'axios'

const NewFeature = ({ apiKey }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize feature
  }, [])

  const handleAction = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/endpoint', { apiKey })
      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && <p>{data.message}</p>}
      <button onClick={handleAction}>Do Something</button>
    </div>
  )
}

export default NewFeature
```

### Backend Changes

**Location:** `backend/src/main/java/com/chatbot/`

**Java Best Practices:**
- Follow Spring Boot conventions
- Use dependency injection (@Autowired)
- Handle exceptions properly
- Add validation annotations
- Use meaningful class/method names

**File Structure:**
```
backend/src/main/java/com/chatbot/
├── config/              # Configuration classes
├── controller/          # REST endpoints
├── service/            # Business logic
├── model/              # DTOs and entities
└── ChatbotApplication.java
```

**Example Service:**
```java
@Service
public class NewFeatureService {
    
    @Autowired
    private ChatModel chatModel;
    
    public String processRequest(String prompt, String apiKey) 
            throws Exception {
        if (prompt == null || prompt.isEmpty()) {
            throw new IllegalArgumentException("Prompt cannot be empty");
        }
        
        // Implement business logic
        return result;
    }
}
```

**Example Controller:**
```java
@RestController
@RequestMapping("/api")
public class NewFeatureController {
    
    @Autowired
    private NewFeatureService service;
    
    @PostMapping("/new-feature")
    public ResponseEntity<?> newFeature(
            @RequestBody NewFeatureRequest request) {
        try {
            String result = service.processRequest(
                request.getPrompt(), 
                request.getApiKey()
            );
            return ResponseEntity.ok(new Response(result));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
}
```

---

## Submitting Changes

### Prepare Your Pull Request

1. **Test Your Changes Locally**
   ```bash
   # Frontend
   cd frontend && npm run build
   
   # Backend
   cd backend && mvn clean package
   ```

2. **Verify No Breaking Changes**
   - Test all related features
   - Check browser console for errors
   - Verify API responses with Postman/curl

3. **Update Documentation**
   - Update README.md if needed
   - Update LEARN.md for architectural changes
   - Add comments to complex code

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Create a Pull Request

1. **Go to GitHub** and navigate to your forked repository
2. **Click "New Pull Request"**
3. **Set Base to:** `main` on `shihabhasan0161/react-spring-chatbot`
4. **Set Compare to:** your feature branch
5. **Fill out the PR Template:**

```markdown
## Description
Briefly describe what your PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Related Issue(s)
Closes #123 (if applicable)

## How to Test
Steps to verify the changes:
1. Start the backend: `cd backend && mvn spring-boot:run`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to http://localhost:5173
4. Try [specific action]
5. Verify [expected result]

## Checklist
- [ ] I have tested this locally
- [ ] I have updated relevant documentation
- [ ] I have added comments to complex code
- [ ] My code follows the project's code style
- [ ] I have no console errors or warnings

## Screenshots (if applicable)
Add before/after screenshots for UI changes.
```

### Code Review Process

1. **Maintainers will review your PR**
   - Provide feedback and suggestions
   - Ask clarifying questions if needed
   - Request changes if necessary

2. **Address Feedback**
   - Make requested changes on your branch
   - Commit and push updates
   - Don't create a new PR

3. **PR Gets Approved**
   - Maintainers will merge when ready
   - Your changes become part of the project!

---

## Code Standards

### JavaScript/React Standards

**Naming:**
```javascript
// ✅ Good
const handleSubmit = () => {}
const isLoading = true
const fetchChatResponse = async () => {}
const ChatHistory = () => {} // Component names in PascalCase

// ❌ Avoid
const handlesubmit = () => {}
const Isloading = true
const fetch_chat_response = () => {}
```

**Formatting:**
```javascript
// Use 2 spaces for indentation
// Max line length: 100 characters
// Use const/let, avoid var
// Use arrow functions for callbacks

// ✅ Good
const items = data.map(item => item.name)

// ❌ Avoid
const items = data.map(function(item) { return item.name })
```

### Java Standards

**Naming:**
```java
// ✅ Good
public class ChatService { }
private String apiKey;
public void processChatRequest() { }

// ❌ Avoid
public class Chat_Service { }
private String apikey;
public void Process_Chat_Request() { }
```

**Formatting:**
```java
// Use 4 spaces for indentation
// Braces on same line: if (condition) {
// One statement per line
```

### General Standards

- **Comments**: Explain "why", not "what" (code shows what)
- **DRY**: Don't Repeat Yourself - extract common patterns
- **KISS**: Keep It Simple, Stupid - avoid over-engineering
- **Error Handling**: Always handle errors gracefully
- **Logging**: Use appropriate log levels

---

## Testing

### Frontend Testing

```bash
# If Jest/Vitest is configured
cd frontend
npm test

# Manual testing checklist
- [ ] Component renders without errors
- [ ] User interactions work as expected
- [ ] API calls complete successfully
- [ ] Error states display properly
- [ ] Responsive design works on mobile
```

### Backend Testing

```bash
# Unit tests
cd backend
mvn test

# Integration tests
mvn verify

# Manual testing with curl
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello","apiKey":"sk-..."}'
```

---

## Documentation

### When to Update Documentation

Update documentation if you:
- Add a new feature or API endpoint
- Change how something works
- Add new configuration options
- Fix a confusing implementation detail

### Files to Update

- **README.md**: Setup and basic usage
- **LEARN.md**: Architecture details
- **CONTRIBUTING.md**: Process changes
- **Inline Comments**: Complex code logic

### Documentation Style

- Use clear, concise language
- Include code examples
- Add links to related sections
- Use proper Markdown formatting

---

## Issue Guidelines

### When to Create an Issue

Create an issue to:
- Report a bug
- Request a feature
- Ask a question
- Start a discussion

### Bug Report Template

```markdown
## Description
Brief description of the bug.

## Steps to Reproduce
1. Start application with...
2. Navigate to...
3. Click on...
4. Observe...

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- Browser: Chrome 120
- Node.js: 20.x
- OS: Windows 11

## Screenshots
[If applicable]
```

### Feature Request Template

```markdown
## Description
What feature would you like to see?

## Motivation
Why is this feature useful?

## Proposed Solution
How might you implement it?

## Alternative Solutions
Any other approaches?
```

---

## Questions?

- Check [README.md](README.md) for setup questions
- Review [LEARN.md](LEARN.md) for architecture questions
- Open a GitHub Discussion for general questions
- Check existing issues for common problems

---

## Recognition

Contributors make this project better! We'll recognize your contributions by:
- Adding your name to the project
- Mentioning you in release notes
- Welcoming you as a project collaborator

Thank you for helping make this project better! 🙏

---

**Happy Contributing!** 🚀

For any issues, feel free to open a GitHub issue or reach out to the maintainers.
