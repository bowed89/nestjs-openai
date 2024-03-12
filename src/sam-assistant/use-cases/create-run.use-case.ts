import OpenAI from "openai";

interface Options {
    threadId: string;
    assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
    //asst_aqckcI63hRcHwmNNjvGxacZx el assistantId del asistente que cree  en  el panel de openai 
    const { threadId, assistantId = 'asst_aqckcI63hRcHwmNNjvGxacZx' } = options;
    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        //instructions ==> Ojo! sobre escribe el asistente...
    });

    console.log({ run });
    return run;
}