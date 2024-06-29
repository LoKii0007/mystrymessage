import { StreamingTextResponse, streamText, StreamData, OpenAIStream } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY
})

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted by a single string. Each question should be seperated by '||'. These questions are for aninymous social messaging platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example your output should be structured like this: 'What's a hobby you have recently started?|| If you could have dinner with historical figure, who would  it be?|| Whats's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute a positive and welcoming converstional enviornment."
    const { messages } = await req.json();

    const response = await openai.completions.create({
        model : 'gpt-3.5-turbo-instruct',
        max_tokens : 400,
        stream : true,
        prompt
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          message,
          headers,
          name,
        },
        { status }
      );
    } else {
      console.log("some error occured", error);
      throw error;
    }
  }
}
