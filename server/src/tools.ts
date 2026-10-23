import { tool } from 'ai';
import { z } from 'zod';

// mock db
const PRODUCT_DATABASE = [
    { id: '1', name: 'Altra Escalante 4', price: 130, brand: 'Altra' },
    { id: '2', name: 'Brooks Ghost 16', price: 140, brand: 'Brooks' },
    { id: '3', name: 'Nike Pegasus 41', price: 150, brand: 'Nike' },
    { id: '4', name: 'Altra Lone Peak 8', price: 120, brand: 'Altra' },
];

export const tools = {
    showProducts: tool({
        description: 'Display product cards to the user based on search queries and optional price limits',
        inputSchema: z.object({
            query: z.string().describe('The product, brand, or category the user is looking for (e.g., Altra)'),
            maxPrice: z.number().optional().describe('Maximum budget limit specified by the user'),
        }),
        execute: async ({ query, maxPrice }) => {
            const normalizedQuery = query.toLowerCase();

            const filteredProducts = PRODUCT_DATABASE.filter((product) => {
                const matchesQuery = 
                    product.name.toLowerCase().includes(normalizedQuery) || 
                    product.brand.toLowerCase().includes(normalizedQuery);
                
                const matchesPrice = maxPrice !== undefined ? product.price <= maxPrice : true;

                return matchesQuery && matchesPrice;
            });

            return filteredProducts;
        },
    }),
};
