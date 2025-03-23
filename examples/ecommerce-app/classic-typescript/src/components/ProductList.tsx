import { useEcommerceStore } from "../store";

export const ProductList = () => {
  const store = useEcommerceStore();
  const products = store.products.useState();
  const cart = store.cart;
  const cartItems = cart.useState();

  const addToCart = (product: any) => {
    cart.set([...cartItems, product]);
  };

  return (
    <div>
      <h2>🛍️ Products</h2>
      <ul>
        {products.map((product: { name: string, price: number }, index: number) => (
          <li key={index}>
            {product.name} - ${product.price}{" "}
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
