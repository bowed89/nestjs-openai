import OpenAI from "openai";

interface Options {
    threadId: string;
    runId: string;
};

export const checkCompleteStatusUseCase = async (openai: OpenAI, options: Options) => {
    const { runId, threadId } = options;
    const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
    );

    console.log({ status: runStatus.status }); //completed

    if (runStatus.status === "completed") {
        return runStatus;
    }

    if (runStatus.status === "failed") {
        return null;
    }

    // Esperar un segundo para que openai no nos bloquee
    await new Promise(resolve => setTimeout(resolve, 1000));
    // funcion recursiva
    return await checkCompleteStatusUseCase(openai, options);


}