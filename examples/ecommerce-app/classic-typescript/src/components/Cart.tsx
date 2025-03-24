import { useEcommerceStore } from "../store";
import { CartType } from "../types"

export const Cart = () => {
  const store = useEcommerceStore();
  const cart: any = store.cart;
  const cartItems = cart.useState() as CartType[];

  const removeFromCart = (cartObj: CartType) => {
    cart.set(cartItems.filter((cartItem: CartType) => cartItem.name !== cartObj.name));
  };

  return (
    <div>
      <h2>🛒 Cart</h2>
      <ul>
        {cartItems.map((item: CartType, index: number) => (
          <li key={index}>
            {item.name} - ${item.price} - {item.count} {" "}
            <button onClick={() => removeFromCart(item)}>Remove from Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
