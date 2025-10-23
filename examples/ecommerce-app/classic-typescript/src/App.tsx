import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import { useEcommerceStore } from "./store";
import { useEffect } from "react";

function App() {
  const store: any = useEcommerceStore();

  useEffect(() => {
    const { productState } = store.products;
    // Load initial products
    productState.set({
      items: [
        { name: "Laptop", price: 999 },
        { name: "Phone", price: 599 },
        { name: "Tablet", price: 399 },
      ]
    });
  }, []);

  return (
    <div>
      <h1>🛒 E-Commerce Store</h1>
      <ProductList />
      <Cart />
    </div>
  );
}

export default App;
