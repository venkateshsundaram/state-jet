import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import { useEcommerceStore } from "./store";
import { useEffect } from "react";

function App() {
  const store = useEcommerceStore();

  useEffect(() => {
    const { productState } = store.products;
    // Load initial products with some more items for a better look
    productState.set({
      items: [
        { name: "MacBook Pro M3", price: 1999 },
        { name: "iPhone 15 Pro", price: 999 },
        { name: "iPad Air", price: 599 },
        { name: "AirPods Max", price: 549 },
        { name: "Apple Watch Ultra", price: 799 },
        { name: "Studio Display", price: 1599 },
      ]
    });
  }, [store.products]);

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-12 px-8 mb-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              <span className="text-blue-600 italic">Store</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-full text-sm border border-blue-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Live Store (Vite JS)
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ProductList />
          </div>
          <div>
            <Cart />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-200 text-center text-slate-400 font-medium">
        <p>Built with StateJet & Vite JS</p>
      </footer>
    </main>
  );
}

export default App;
