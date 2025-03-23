import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import { useEcommerceStore } from "./store";
import { useEffect } from "react";

function App() {
  const store = useEcommerceStore();

  useEffect(() => {
    // Load initial products
    store.products.set([
      { name: "Laptop", price: 999 },
      { name: "Phone", price: 599 },
      { name: "Tablet", price: 399 },
    ]);
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
