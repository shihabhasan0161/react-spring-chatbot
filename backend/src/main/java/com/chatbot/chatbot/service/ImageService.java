package com.chatbot.chatbot.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageModel;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.ai.openai.api.OpenAiImageApi;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService {

    public List<String> generateImage(String prompt, String apiKey) {

        OpenAiImageApi imageApi = OpenAiImageApi.builder()
                .apiKey(apiKey)
                .build();

        OpenAiImageModel imageModel = new OpenAiImageModel(imageApi);

        OpenAiImageOptions options = OpenAiImageOptions.builder()
                .model("dall-e-3")
                .build();

        ImageResponse response = imageModel.call(new ImagePrompt(prompt, options));

        return response.getResults().stream().map(a -> a.getOutput().getUrl()).toList();
    }
}
