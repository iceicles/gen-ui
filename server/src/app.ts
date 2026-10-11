import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { convertToModelMessages, stepCountIs, type UIMessage, pipeUIMessageStreamToResponse, toUIMessageStream } from 'ai';
import { streamText } from 'ai-sdk-ollama';
import { model } from './model';
import  { tools }  from './tools';

const app = express();
const PORT = 4000;
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

// smoke test - works!

// for generating text all at once -
/* 
const { text } = await generateText({
  model: ollama('qwen2.5'),
  prompt: 'tell me how to make ice cream at home - the most delicious ice cream ever!!',
  temperature: 0.8
})
console.log('AI Output: ', text) 

// for streaming - 
const result = await streamText({
  model: ollama("qwen2.5"),
  prompt: 'Invent a new holiday and describe its traditions.',
  experimental_transform: smoothStream({
    delayInMs: 50, // 50ms between chunks
    chunking: 'line', // 'word' | 'line' | RegExp
  }),
});

// example: use textStream as an async iterable
for await (const textPart of result.textStream) {
  console.log(textPart);
} 
*/

// api routes
app.post('/api/chat', async (req, res) => {
  try {
    const { messages }: { messages: UIMessage[] } = req.body;

    const result = await streamText({
      model,
      system: 'You are a helpful shopping assistant. Use showProducts to display products. Keep response short.',
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(4),
    });

    const uiStream = toUIMessageStream({ stream: result.stream });

    pipeUIMessageStreamToResponse({ 
      stream: uiStream, 
      response: res
    });

  } catch (error) {
    console.error("Streaming error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/api/completion', async (req, res) => {
  try {
    const { prompt }: { prompt: string } = req.body; // prompt from client on button click

    const result = await streamText({
      model,
      system: 'You are a helpful shopping assistant. Keep response short.',
      messages: [{ role: 'user', content: prompt }],
      stopWhen: stepCountIs(4),
    });

    const uiStream = toUIMessageStream({ stream: result.stream });

    pipeUIMessageStreamToResponse({ 
      stream: uiStream, 
      response: res
    });
  } catch (error) {
    console.log("Streaming error:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
})

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`)
})