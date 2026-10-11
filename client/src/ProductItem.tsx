export interface ProductDetails {
  name: string;
  price: number;
  brand: string;
  id: string;
}

interface ProductItemProps {
  products: ProductDetails[];
}

export function ProductItem({ products }: ProductItemProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {products.map((product: ProductDetails) => (
        <div
          key={product.id}
          className=' border border-amber-700 rounded p-4 bg-gray-800'
        >
          <h2 className='text-lg font-bold'>{product.name}</h2>
          <p>Brand: {product.brand}</p>
          <p>Price: ${product.price}</p>
          <button
            className='bg-green-500 cursor-pointer border p-1 rounded text-white hover:bg-green-600'
            onClick={() => alert('Product added to cart!')}
          >
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}
