import { useCompletion } from '@ai-sdk/react';

export interface ProductDetails {
  name: string;
  price: number;
  brand: string;
  id: string;
}

interface ProductItemProps {
  products: ProductDetails[];
}

interface ProductCardProps {
  product: ProductDetails;
}

function ProductCard({ product }: ProductCardProps) {
  const { completion, complete, isLoading } = useCompletion({
    api: 'http://localhost:4000/api/completion',
    throttle: 50, // throttle the completion requests to avoid triggering multiple re-renders
  });

  return (
    <div className='border border-amber-700 rounded p-4 bg-gray-800'>
      <h2 className='text-lg font-bold'>{product.name}</h2>
      <p>Brand: {product.brand}</p>
      <p>Price: ${product.price}</p>
      <button
        className='bg-green-500 cursor-pointer border p-1 rounded text-white hover:bg-green-600'
        onClick={() => alert('Product added to cart!')}
      >
        Add to cart
      </button>
      <button
        className='bg-blue-500 cursor-pointer border p-1 rounded text-white hover:bg-blue-600 mt-2'
        disabled={isLoading}
        onClick={() =>
          complete(`Give me a quick insight about ${product.name}`)
        }
      >
        {isLoading ? 'Loading Insight...' : 'AI Quick Insight'}
      </button>
      {completion && (
        <div className='mt-2 p-2 border border-gray-600 rounded bg-gray-700'>
          <h5 className='font-bold'>AI Insight:</h5>
          <p>{completion}</p>
        </div>
      )}
    </div>
  );
}

export function ProductItem({ products }: ProductItemProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {products.map((product: ProductDetails) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
