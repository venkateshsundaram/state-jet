import { useEcommerceStore } from "../store";
import { CartType } from "../types"

export const Cart = () => {
  const store = useEcommerceStore();
  const cart: any = store.cart;
  const cartSliceData: any = cart.useState();
  const cartItems: Array<CartType> = cartSliceData?.items || [];

  const removeFromCart = (cartObj: CartType) => {
    cart.set((cartVal: any) => ({
      ...cartVal,
      items: cartItems.filter((cartItem: CartType) => cartItem.name !== cartObj.name)
    }));
  };

  return (
    <div>
      <h2>🛒 Cart</h2>
      <ul>
        {cartItems && cartItems.map((item: CartType, index: number) => (
          <li key={index}>
            {item.name} - ${item.price} - {item.count} {" "}
            <button onClick={() => removeFromCart(item)}>Remove from Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
