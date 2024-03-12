import OpenAI from "openai";
import * as fs from 'fs';
import * as path from 'path';

import { downloadImageAsPng, downloadBase64ImageAsPng } from "src/helpers";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async (openai: OpenAI, { prompt, maskImage, originalImage }: Options) => {
    // TODO: Verificar original image
    if (!originalImage || !maskImage) {

        const response = await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-2',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
        });

        // TODO: Guardar la img. en FS
        const fileName = await downloadImageAsPng(response.data[0].url);
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

        console.log(response.data[0]);
        
        return {
            url,
            OpenAiUrl: response.data[0].url,
            revised_prompt: response.data[0].revised_prompt

        }
    }
    // originalImage = localhost:3000/gpt/image-generation/1709685955820.png
    // maskImage = Base64;fbsef435t546gerwvw345t66y24df

    const pngImagePath = await downloadImageAsPng(originalImage, true);
    const maskPath = await downloadBase64ImageAsPng(maskImage, true);

    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPath),
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