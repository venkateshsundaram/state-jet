import { useEcommerceStore } from "../store";

export const Cart = () => {
  const store = useEcommerceStore();
  const cart = store.cart;
  const cartSliceData = cart.useState();
  const cartItems = cartSliceData?.items || [];

  const removeFromCart = (cartObj) => {
    cart.set((cartVal) => ({
      ...cartVal,
      items: cartItems.filter((cartItem) => cartItem.name !== cartObj.name)
    }));
  };

  return (
    <div>
      <h2>🛒 Cart</h2>
      <ul>
        {cartItems && cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price} - {item.count} {" "}
            <button onClick={() => removeFromCart(item)}>Remove from Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
