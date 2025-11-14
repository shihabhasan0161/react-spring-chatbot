package com.chatbot.chatbot.controller;

import com.chatbot.chatbot.model.ImageRequest;
import com.chatbot.chatbot.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/generate-image")
    public List<String> generateImage(@RequestBody ImageRequest request) {
        return imageService.generateImage(
                request.getPrompt(),
                request.getApiKey()
        );
    }
}
