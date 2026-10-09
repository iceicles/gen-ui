import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createDataStreamResponse, streamText, tool, stepCountIs } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

const app = express();
const PORT = 4000;

// Enable CORS so your React frontend (usually on port 3000 or 5173) can communicate with Express
// app.use(cors({ origin: 'http://localhost:5173' })); 
// app.use(express.json());

// // Initialize Ollama Provider
// const ollama = createOllama({
//   baseURL: 'http://localhost:11434/api', 
// });

// // POST Route for Chat and Gen UI
// app.post('/api/chat', async (req, res) => {
//   const { messages } = req.body;

//   // 1. Create a data stream response compatible with standard Node/Express HTTP
//   const streamResponse = createDataStreamResponse({
//     execute: async (dataStream) => {
      
//       // 2. Run your streamText function inside the execution wrapper
//       const result = streamText({
//         model: ollama('qwen3:8b'),
//         // Pass historical messages forwarded from your React state
//         messages: messages, 
//         tools: {
//           showProducts: tool({
//             description: 'Display product cards to the user',
//             inputSchema: z.object({
//               query: z.string(),
//               maxPrice: z.number().optional(),
//             }),
//             execute: async ({ query, maxPrice }) => {
//               // Mock database data that matches your React Gen UI expectation
//               return [
//                 { id: '1', name: 'Altra Escalante 4', price: 130, brand: 'Altra' },
//                 { id: '2', name: 'Brooks Ghost 16', price: 140, brand: 'Brooks' }
//               ];
//             },
//           }),
//         },
//         stopWhen: stepCountIs(3),
//       });

//       // 3. Pipe the AI result into the dataStream to send chunks seamlessly to React
//       result.mergeIntoDataStream(dataStream);
//     },
//   });

//   // 4. Set correct streaming headers and send down to client
//   res.writeHead(streamResponse.status, streamResponse.headers);
//   streamResponse.body.pipeTo(new WritableStream({
//     write(chunk) {
//       res.write(chunk);
//     },
//     close() {
//       res.end();
//     }
//   }));
// });




app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`)
})