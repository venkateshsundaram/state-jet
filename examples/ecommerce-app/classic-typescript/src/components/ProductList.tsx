import { useEcommerceStore } from "../store";
import { ProductType, CartType } from "../types"

export const ProductList = () => {
  const store = useEcommerceStore();
  const products: any = store.products;
  const cart: any = store.cart;
  const productItems = products.useState() as ProductType[];
  const cartItems = cart.useState() as CartType[];

  const addToCart = (product: ProductType) => {
    if (cartItems.some((cartItem: CartType) => cartItem.name === product.name)) {
      cart.set(cartItems.map((cartItem: CartType) => {
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
        {productItems.map((productItem: ProductType, index: number) => (
          <li key={index}>
            {productItem.name} - ${productItem.price}{" "}
            <button onClick={() => addToCart(productItem)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
