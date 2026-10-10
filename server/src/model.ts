import { ollama } from 'ai-sdk-ollama';

export const model = ollama('qwen2.5', {
    options: { num_ctx: 8192 },
});