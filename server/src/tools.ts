import { tool } from 'ai';
import { z } from 'zod';
import PRODUCT_DATABASE from './mock-db';

export const tools = {
    showProducts: tool({
        description: 'Display product cards to the user based on search queries and optional price limits',
        inputSchema: z.object({
            query: z.string().describe([
                'The product, brand, or category the user is looking for (e.g., Altra). ',
                'Consider all products if the query does not match any specific product.',
                'Use "" when the user requests all products'].join('')),
            maxPrice: z.number().optional().describe('Maximum budget limit specified by the user'),
        }),
        execute: async ({ query, maxPrice }) => {
            const normalizedQuery = query.toLowerCase();

            const filteredProducts = PRODUCT_DATABASE.filter((product) => {
                const matchesQuery = 
                    normalizedQuery === '' ||
                    product.name.toLowerCase().includes(normalizedQuery) || 
                    product.brand.toLowerCase().includes(normalizedQuery);
                
                const matchesPrice = maxPrice !== undefined ? product.price <= maxPrice : true;

                return matchesQuery && matchesPrice;
            });

            return filteredProducts;
        },
    }),
};
