package com.chatbot.chatbot.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ChatRequest {
    private String prompt;
    private String apiKey;
}
