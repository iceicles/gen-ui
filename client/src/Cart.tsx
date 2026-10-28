interface CartProps {
  productName: string;
}

export function Cart({ productName }: CartProps) {
  return (
    <button
      className="bg-green-500 cursor-pointer border p-1 rounded text-white hover:bg-green-600"
      onClick={() => alert(`${productName} added to cart`)}
    >
      Add to cart
    </button>
  );
}
