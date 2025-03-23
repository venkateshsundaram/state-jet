import { useEcommerceStore } from "../store";

export const Cart = () => {
  const store = useEcommerceStore();
  const cart = store.cart.useState();

  return (
    <div>
      <h2>🛒 Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};
