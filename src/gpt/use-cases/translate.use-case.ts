import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCase = async (openai: OpenAI, { prompt, lang }: Options) => {

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt
            },
            {
                role: 'system',
                content: `
                    Eres un asistente que ayuda a traducir texto en diferentes idiomas,
                    Traduce el siguiente texto al idioma ${lang}:${prompt},
                    La respuesta solamente debe contener la traduccion
                `
            }

        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.2
    });

    return { message: completion.choices[0].message.content };
}