import Chat from "./components/Chat";
import Image from "./components/Image";
import CustomDropdown from "./components/CustomDropdown";
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
    openai: [
      { value: "gpt-4o", label: "gpt-4o" },
      { value: "gpt-4", label: "gpt-4" },
      { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" }
    ],
    gemini: [
      { value: "gemini-2.5-flash", label: "gemini-2.5-flash" },
      { value: "gemini-2.5-pro", label: "gemini-2.5-pro" }
    ]
  };

  const providerOptions = [
    { value: "openai", label: "OpenAI" },
    { value: "gemini", label: "Google Gemini" }
  ];

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
    if (provider) {
      localStorage.setItem("provider", provider);
    } else {
      localStorage.removeItem("provider");
    }
  }, [provider]);

  useEffect(() => {
    if (model) {
      localStorage.setItem("model", model);
    } else {
      localStorage.removeItem("model");
    }
  }, [model]);

  const openApiModal = () => {
    setShowApiModal(true);
    setTempApiKey(apiKey);
    setTempProvider(provider);
    setTempModel(model);
  };

  const closeApiModal = () => {
    setShowApiModal(false);
    setTempApiKey(apiKey);
    setTempProvider(provider);
    setTempModel(model);
  };

  const saveApiKey = () => {
    setApiKey(tempApiKey);
    setProvider(tempProvider);
    setModel(tempModel);
    setShowApiModal(false);
  };

  const handleProviderChange = (newProvider) => {
    setTempProvider(newProvider);
    setTempModel(modelOptions[newProvider][0].value);
  };

  return (
    <>
      <div className="app-container">
        <div className="app-header">
          <div className="app-logo">
            <img src="/logo.png" alt="Chatbot Logo" />
          </div>
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
              <CustomDropdown
                value={tempProvider}
                options={providerOptions}
                onChange={handleProviderChange}
                placeholder="Select provider"
              />
              <p className="api-modal-text">
                {tempProvider === 'openai'
                  ? "Get your API key from your OpenAI account"
                  : "Get your API key from Google AI Studio"}
              </p>
            </div>

            <div className="api-modal-section">
              <label className="api-modal-label">Model</label>
              <CustomDropdown
                value={tempModel}
                options={modelOptions[tempProvider]}
                onChange={setTempModel}
                placeholder="Select model"
              />
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