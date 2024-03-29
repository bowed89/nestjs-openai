import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {
    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                    Te serán proveidos textos textos en espanol con posibles errores ortograficos gramaticales,
                    Las palabras deben corregirse en base al diccionario de la Real Academia Espanola,
                    Debes de responder en formato JSON,
                    tu tarea es corregirlos y retornar soluciones,
                    tambien debes dar un porcentaje de acierto por el usuario,


                    Si no hay errores, debes de retornar un mensaje de felicitaciones.

                    Ejemplo de salida:
                    {
                        userScore: number,
                        errors: string[] // ['solucion -> solución']
                        message: string // Usa emojis y texto para felicitar al usuario
                    }

                `
            },
            {
                role: "user",
                content: prompt
            }

        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 150,
        response_format: {
            type: "json_object"
        }
    });

    const jsonResponse = JSON.parse(completion.choices[0].message.content);

    return jsonResponse;

} 