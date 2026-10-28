import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import { ProductComparison } from './ProductComparison';
import { Cart } from './Cart';

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
  productSelected: boolean;
  onProductSelected: (productId: string, checked: boolean) => void;
}

function ProductCard({
  product,
  productSelected,
  onProductSelected,
}: ProductCardProps) {
  const { completion, complete, isLoading } = useCompletion({
    api: 'http://localhost:4000/api/completion',
    throttle: 50, // throttle the completion requests to avoid triggering multiple re-renders
  });

  return (
    <>
      <div
        className={`border border-amber-700 rounded p-4 ${productSelected ? 'bg-gray-700' : 'bg-gray-800'}`}
      >
        <input
          type="checkbox"
          className="cursor-pointer block"
          checked={productSelected}
          onChange={(e) =>
            onProductSelected(
              String(product.id),
              (e.target as HTMLInputElement).checked,
            )
          }
        />
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p>Brand: {product.brand}</p>
        <p>Price: ${product.price}</p>
        <p>
          <i className="text-gray-400 text-xs">ID: {product.id}</i>
        </p>
        <Cart productName={product.name} />
        <button
          className="bg-blue-500 cursor-pointer border p-1 rounded text-white hover:bg-blue-600 mt-2"
          disabled={isLoading}
          onClick={() =>
            complete(`Give me a quick insight about ${product.name}`)
          }
        >
          {isLoading ? 'Loading Insight...' : 'AI Quick Insight'}
        </button>
        {completion && (
          <div className="mt-2 p-2 border border-gray-600 rounded bg-gray-700">
            <h5 className="font-bold">AI Insight:</h5>
            <p>{completion}</p>
          </div>
        )}
      </div>
    </>
  );
}

export function ProductItem({ products }: ProductItemProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const handleProductSelected = (productId: string, checked: boolean) => {
    const productIdString = String(productId);
    if (checked) {
      setSelectedProductIds((prev) =>
        prev.includes(productIdString) ? prev : [...prev, productIdString],
      );
    } else {
      setSelectedProductIds((prev) =>
        prev.filter((id) => id !== productIdString),
      );
    }
  };

  return (
    <>
      {products.length > 0 && (
        <div className="border border-gray-700 rounded p-4 bg-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: ProductDetails) => (
              <ProductCard
                key={product.id}
                product={product}
                productSelected={selectedProductIds.includes(
                  String(product.id),
                )}
                onProductSelected={handleProductSelected}
              />
            ))}
          </div>
          {products.length >= 2 && (
            <ProductComparison
              products={products}
              selectedProductIds={selectedProductIds}
            />
          )}
        </div>
      )}
    </>
  );
}
