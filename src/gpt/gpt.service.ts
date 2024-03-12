import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import {
    orthographyCheckUseCase,
    prosConsDicusserUseCase,
    prosConsStreamUseCase,
    textToAudioUseCase,
    translateUseCase,
    getAudioUseCase,
    audioToTextUseCase,
    imageGenerationUseCase,
    imageVariationUseCase
} from './use-cases';
import {
    AudioToTextDto,
    ImageGenerationDto,
    ImageVariationDto,
    OrthographyDto,
    ProsConsDiscusserDto,
    TextToAudioDto,
    TranslateDto
} from './dtos';

import OpenAI from 'openai';

@Injectable()
export class GptService {
    // Solo se llamara a los casos de uso **

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });


    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(this.openai, orthographyDto);

    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase(this.openai, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsStreamUseCase(this.openai, { prompt });
    }

    async translateLanguage({ prompt, lang }: TranslateDto) {
        return await translateUseCase(this.openai, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase(this.openai, { prompt, voice });
    }

    async getAudio(fileId: string) {
        return await getAudioUseCase(fileId);
    }

    async audioToText(audioFile: Express.Multer.File, audioToTextDto?: AudioToTextDto) {
        const { prompt } = audioToTextDto;
        return await audioToTextUseCase(this.openai, { audioFile, prompt });

    }

    async imageGeneration(imageGenerationDto: ImageGenerationDto) {
        return await imageGenerationUseCase(this.openai, imageGenerationDto);

    }

    async getImageGenerationPath(filename: string) {
        const imagePath = path.resolve(__dirname, `../../generated/images/${filename}`);

        if (!fs.existsSync(imagePath)) throw new NotFoundException(`Image ${imagePath} does not exist`);

        return imagePath;
    }

    async generateImageVariation({ baseImage }: ImageVariationDto) {
        return imageVariationUseCase(this.openai, { baseImage });
    }


}
