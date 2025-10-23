import { useEcommerceStore } from "../store";

export const ProductList = () => {
  const store = useEcommerceStore();
  const { productState } = store.products;
  const cart = store.cart;
  const productSliceData = productState.useState();
  const cartSliceData = cart.useState();
  const productItems = productSliceData?.items || [];
  const cartItems = cartSliceData?.items || [];

  const addToCart = (product) => {
    if (cartItems.some((cartItem) => cartItem.name === product.name)) {
      cart.set((cartVal)=> ({
        ...cartVal,
        items: cartItems.map((cartItem) => {
          if (cartItem.name === product.name) {
            return { ...cartItem, count: (cartItem.count || 0) + 1 };
          }
          return cartItem;
        })
      }));
    } else {
      cart.set((cartVal)=> ({
        ...cartVal,
        items: [...cartItems, { ...product, count: 1 }]
      }));
    }
  };

  return (
    <div>
      <h2>🛍️ Products</h2>
      <ul>
        {productItems && productItems.map((productItem, index) => (
          <li key={index}>
            {productItem.name} - ${productItem.price}{" "}
            <button onClick={() => addToCart(productItem)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
