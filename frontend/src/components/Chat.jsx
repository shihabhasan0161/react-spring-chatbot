// --- Markdown rendering support ---

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { toast } from "react-hot-toast";
import { config, endpoint } from "../utils/config.js";
import { MdDelete } from "react-icons/md";

const Chat = ({ apiKey }) => {
  const [prompt, setPrompt] = useState("");
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
    return [{ text: "Hello! How can I help you today?", sender: "bot" }];
  });

  const messagesEndRef = useRef(null);

  // handle responsive sidebar
  useLayoutEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save chat history to local storage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Store previous chats
  useEffect(() => {
    const storedChats = localStorage.getItem("previousChats");
    if (storedChats) {
      try {
        const parsed = JSON.parse(storedChats);
        if (parsed.length > 0) {
          setPreviousChats(parsed);
          setCurrentTitle(parsed[0].title);
          setMessages(parsed[0].messages);
        }
      } catch (error) {
        console.error(
          "Failed to parse previous chats from localStorage:",
          error
        );
      }
    }
  }, []);

  // Persist chats
  useEffect(() => {
    localStorage.setItem("previousChats", JSON.stringify(previousChats));
  }, [previousChats]);

  // update / create chat session in previous chats
  const saveMessagesToSession = (title, newMessages) => {
    setPreviousChats((prevChats) => {
      const index = prevChats.findIndex((c) => c.title === title);
      if (index === -1) {
        return [
          ...prevChats,
          {
            title: title,
            messages: newMessages,
          },
        ];
      } else {
        const updatedChats = [...prevChats];
        updatedChats[index] = {
          ...updatedChats[index],
          messages: newMessages,
        };
        return updatedChats;
      }
    });
  };

  // create new chat
  const createNewChat = () => {
    setCurrentTitle(null);
    setPrompt("");
    setMessages([{ text: "Hello! How can I help you today?", sender: "bot" }]);
  };

  // load previous chat
  const loadPreviousChat = (title) => {
    const chat = previousChats.find((c) => c.title === title);
    if (!chat) return;
    setCurrentTitle(chat.title);
    setMessages(chat.messages);
    setPrompt("");
  };

  // delete chat
  const deleteChat = (title) => {
    setPreviousChats((prevChats) => {
      const filtered = prevChats.filter((chat) => chat.title !== title);
      if (currentTitle === title) {
        if (filtered.length > 0) {
          setCurrentTitle(filtered[0].title);
          setMessages(filtered[0].messages);
        } else {
          createNewChat();
        }
      }
      return filtered;
    });
  };

  // handle sidebar toggle
  const handleSidebarToggle = useCallback(() => {
    setShowSidebar((prev) => !prev);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Something went wrong. Please check your input.");
      return;
    }

    if (!apiKey) {
      toast.error("Please set your OpenAI API key first.");
      return;
    }

    // check for new chat
    const isNewChat = currentTitle === null;
    const title = isNewChat ? prompt : currentTitle;

    if (isNewChat) {
      setCurrentTitle(title);
    }

    const userMessage = { text: prompt, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setPrompt("");

    try {
      const response = await config.post(endpoint.CHAT, { prompt, apiKey });
      const data = response.data;
      const botMessage = { text: data, sender: "bot" };

      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      saveMessagesToSession(title, newMessages);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch response from the server.");
    }
  };

  // Handle key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Sidebar */}
      <aside
        className={showSidebar ? "chat-sidebar visible" : "chat-sidebar hidden"}
      >
        <div className="chat-sidebar-header">
          <span className="sidebar-title">History</span>
          <button className="sidebar-new-chat-btn" onClick={createNewChat}>
            + New Chat
          </button>
        </div>
        <div className="chat-history-list">
          {previousChats.map((chat) => (
            <div
              key={chat.title}
              className={`chat-history-row ${
                currentTitle === chat.title ? "active" : ""
              }`}
            >
              <button
                className="chat-history-item"
                onClick={() => loadPreviousChat(chat.title)}
              >
                {chat.title}
              </button>
              <button
                className="chat-delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.title);
                }}
                aria-label="Delete chat"
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main chat */}
      <div className="chat-main">
        <div className="chat-header-row">
          <button className="sidebar-toggle" onClick={handleSidebarToggle}>
            {showSidebar ? "Hide History" : "Show History"}
          </button>
          <span className="chat-current-title">
            {currentTitle || "New Chat"}
          </span>
        </div>

        <div className="message-list">
            {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                    </ReactMarkdown>
                </div>
            ))}
            <div ref={messagesEndRef} />
            </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
          />
          <button className="send-button" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
