package com.chatbot.chatbot.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ChatRequest {
    private String prompt;
    private String apiKey;
    private String provider; // "openai" or "gemini"
    private String model; // e.g., "gpt-4o", "gemini-pro"
}

