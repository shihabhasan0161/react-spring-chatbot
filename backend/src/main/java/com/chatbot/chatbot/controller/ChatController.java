package com.chatbot.chatbot.controller;

import com.chatbot.chatbot.model.ChatRequest;
import com.chatbot.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ChatController {

    public final ChatService chatService;

    @PostMapping("/chat")
    public String chat(@RequestBody ChatRequest request) {
        return chatService.generateResponse(request.getPrompt(), request.getApiKey());
    }
}
