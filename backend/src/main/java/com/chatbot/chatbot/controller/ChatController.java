package com.chatbot.chatbot.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.chatbot.chatbot.model.ChatRequest;
import com.chatbot.chatbot.service.ChatService;
import com.chatbot.chatbot.service.GeminiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final GeminiService geminiService;

    @PostMapping("/chat")
    public String chat(@RequestBody ChatRequest request) {
        // Default to OpenAI if no provider specified
        String provider = request.getProvider() != null ? request.getProvider().toLowerCase() : "openai";

        if ("gemini".equalsIgnoreCase(provider)) {
            return geminiService.generateResponse(
                    request.getPrompt(),
                    request.getApiKey(),
                    request.getModel()
            );
        } else {
            // Default to OpenAI
            return chatService.generateResponse(
                    request.getPrompt(),
                    request.getApiKey()
            );
        }
    }
}

