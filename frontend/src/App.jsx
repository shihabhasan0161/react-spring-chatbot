import Chat from "./components/Chat";
import Image from "./components/Image";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./contexts/ThemeContext";
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("apiKey") || "";
  });
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem("provider") || "openai";
  });
  const [model, setModel] = useState(() => {
    return localStorage.getItem("model") || "gpt-4o";
  });
  const [showApiModal, setShowApiModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempProvider, setTempProvider] = useState(provider);
  const [tempModel, setTempModel] = useState(model);
  const { theme, toggleTheme } = useTheme();

  const modelOptions = {
    openai: ["gpt-4o", "gpt-4", "gpt-3.5-turbo"],
    gemini: ["gemini-pro", "gemini-1.5-pro"]
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("apiKey", apiKey);
    } else {
      localStorage.removeItem("apiKey");
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("provider", provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem("model", model);
  }, [model]);

  const openApiModal = () => {
    setShowApiModal(true);
    setTempApiKey(apiKey);
    setTempProvider(provider);
    setTempModel(model);
  }

  const closeApiModal = () => {
    setShowApiModal(false);
    setTempApiKey(apiKey);
    setTempProvider(provider);
    setTempModel(model);
  }

  const saveApiKey = () => {
    setApiKey(tempApiKey);
    setProvider(tempProvider);
    setModel(tempModel);
    setShowApiModal(false);
  }

  return (
    <>
      <div className="app-container">
        <div className="app-header">
          <h1 className="app-title">ChatBot</h1>
          <div className="header-actions">
            <button className="api-key-button" onClick={openApiModal}>
              {apiKey ? "Update Settings" : "Configure"}
            </button>
            <button className="theme-toggle-button" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => handleTabChange("chat")}
          >
            ChatBot
          </button>
          <button
            className={`tab-button ${activeTab === "image" ? "active" : ""}`}
            onClick={() => handleTabChange("image")}
          >
            Image Generator
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "chat" && <Chat apiKey={apiKey} provider={provider} model={model} />}
          {activeTab === "image" && <Image apiKey={apiKey} />}
        </div>
        <Toaster />
      </div>

      {showApiModal && (
        <div className="api-modal-overlay">
          <div className="api-modal">
            <div className="api-modal-header">Configure API & Model</div>
            
            <div className="api-modal-section">
              <label className="api-modal-label">AI Provider</label>
              <select 
                className="api-modal-select"
                value={tempProvider}
                onChange={(e) => {
                  setTempProvider(e.target.value);
                  setTempModel(modelOptions[e.target.value][0]);
                }}
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Google Gemini</option>
              </select>
              <p className="api-modal-text">
                {tempProvider === 'openai' 
                  ? "Get your API key from your OpenAI account" 
                  : "Get your API key from Google AI Studio"}
              </p>
            </div>

            <div className="api-modal-section">
              <label className="api-modal-label">Model</label>
              <select 
                className="api-modal-select"
                value={tempModel}
                onChange={(e) => setTempModel(e.target.value)}
              >
                {modelOptions[tempProvider].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="api-modal-section">
              <label className="api-modal-label">API Key</label>
              <input
                type="password"
                className="api-modal-input"
                placeholder={`Enter your ${tempProvider === 'openai' ? 'OpenAI' : 'Google Gemini'} API key`}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <p className="api-modal-text">
                We don&apos;t store your API key. It is saved in your browser&apos;s local storage only.
              </p>
            </div>

            <div className="api-modal-actions">
              <button className="button-secondary" onClick={closeApiModal}>
                Cancel
              </button>
              <button className="button-primary" onClick={saveApiKey}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;