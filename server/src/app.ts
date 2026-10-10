import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { convertToModelMessages, smoothStream, stepCountIs, type UIMessage, pipeUIMessageStreamToResponse, toUIMessageStream } from 'ai';
// import { z } from 'zod';
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

// api route
app.post('/api/chat', async (req, res) => {
  const { messages }: { messages: UIMessage[] } = req.body;

  const result = await streamText({
    model,
    system:
      'You are a helpful shopping assistant. Use showProducts to display products. Keep response short.',
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(4),
  })

  // take the UI message stream to a nodejs reponse object
  pipeUIMessageStreamToResponse({ stream: toUIMessageStream({ stream: result.stream }), response: res })
  
})

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`)
})