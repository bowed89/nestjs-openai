import * as fs from 'fs';

import OpenAI from "openai";
import { downloadImageAsPng } from "src/helpers";

interface Options {
    baseImage: string;
}

export const imageVariationUseCase = async (openai: OpenAI, { baseImage }: Options) => {
    const pngImagePath = await downloadImageAsPng(baseImage, true); //C:\Users\MSI\ANGULAR PROYECTOS\angular-gpt\nest-backend\generated\images\1709767201488.png

    const response = await openai.images.createVariation({
        model: 'dall-e-2',
        image: fs.createReadStream(pngImagePath),
        n: 1,
        size: '1024x1024',
        response_format: 'url'
    });

    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url,
        OpenAiUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt
    }
}