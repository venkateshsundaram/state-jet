import { useEcommerceStore } from "../store";

export const ProductList = () => {
  const store = useEcommerceStore();
  const products = store.products;
  const cart = store.cart;
  const productItems = products.useState();
  const cartItems = cart.useState();

  const addToCart = (product) => {
    if (cartItems.some((cartItem) => cartItem.name === product.name)) {
      cart.set(cartItems.map((cartItem) => {
        if (cartItem.name === product.name) {
          return { ...cartItem, count: (cartItem.count || 0) + 1 };
        }
        return cartItem;
      }));
    } else {
      cart.set([...cartItems, { ...product, count: 1 }]);
    }
  };

  return (
    <div>
      <h2>🛍️ Products</h2>
      <ul>
        {productItems.map((productItem, index) => (
          <li key={index}>
            {productItem.name} - ${productItem.price}{" "}
            <button onClick={() => addToCart(productItem)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
