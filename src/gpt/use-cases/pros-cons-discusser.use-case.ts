import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDicusserUseCase = async (openai: OpenAI, { prompt }: Options) => {
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                        Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                        La respuesta debe estar en formato markdown,
                        Los pros y contras deben de estar en una lista,
                        Los pros deben estar respondidos en base a comentarios reales de personas,
                        Los contras deben estar respondidos en base a comentarios reales de personas,
                
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],

        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 500,

    });

    return response.choices[0].message;

}