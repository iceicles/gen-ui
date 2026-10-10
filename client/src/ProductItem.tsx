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
        <div key={product.id} className='border rounded p-4'>
          <h2 className='text-lg font-bold'>{product.name}</h2>
          <p>Brand: {product.brand}</p>
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
}
