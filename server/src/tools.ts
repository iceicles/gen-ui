import { tool } from 'ai';
import { z } from 'zod';

export const tools = {
    showProducts: tool({
        description: 'Display product cards to the user',
        inputSchema: z.object({
            query: z.string().describe('What is the user looking for'),
            maxPrice: z.number().optional(),
        }),
        execute: async ({ query, maxPrice }) => {
            // Mock database data that matches your React Gen UI expectation
            return [
                { id: '1', name: 'Altra Escalante 4', price: 130, brand: 'Altra' },
                { id: '2', name: 'Brooks Ghost 16', price: 140, brand: 'Brooks' }
            ];
        },
    }),
}