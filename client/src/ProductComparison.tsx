import { useObject } from '@ai-sdk/react';
import { useEffect } from 'react';
// Import the same schema as the API; no duplicate schema or frontend Zod dependency.
import { comparisonSchema } from '../../server/src/schemas';
import type { ProductDetails } from './ProductItem';

interface ProductComparisonProps {
  products: ProductDetails[];
  selectedProductIds: string[];
}

export function ProductComparison({
  products,
  selectedProductIds,
}: ProductComparisonProps) {
  // the hook handles the POST request, partial JSON parsing, and request state
  const { object, submit, isLoading, error } = useObject({
    api: 'http://localhost:4000/api/objectGeneration',
    schema: comparisonSchema,
    onError: (error) => console.error('Comparison request failed:', error),
  });

  function handleCompare() {
    // submit serializes this value as the request body expected by Express
    submit({
      productIds: selectedProductIds,
      context:
        'Recommend the cheapest option and explain the price differences. If prices are equal, choose any option and explain why one might be better than the other.',
    });
  }

  function getProductName(productId: string | undefined) {
    return products.find((product) => product.id === productId)?.name;
  }

  function parseError() {
    if (!error) return '';
    const err = JSON.parse(error.message);
    if (err && err.error) return String(err.error);
  }

  return (
    <section aria-label="Product comparison" className="mt-4">
      <button
        type="button"
        onClick={handleCompare}
        disabled={isLoading || products.length < 2}
        className="border rounded px-3 py-2 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Compare products
      </button>

      {products.length < 2 && <p>Show at least two products to compare.</p>}

      <p role="status">{isLoading && 'Comparing products...'}</p>
      {error && <p role="alert">{parseError()}</p>}

      {object && !error && (
        <>
          <h2>{object.title}</h2>
          {object.recommendation && (
            <article>
              <h3>
                Recommended: {getProductName(object.recommendation.productId)}
              </h3>
              <p>{object.recommendation.reason}</p>
            </article>
          )}
          {object.alternatives && (
            <>
              <h3>Alternatives</h3>
              <ul>
                {object.alternatives.map((alternative, index) => (
                  // IDs are incomplete while streaming, so keep positional keys
                  <li key={index}>
                    <strong>{getProductName(alternative?.productId)}</strong>
                    <p>{alternative?.reason}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </section>
  );
}
