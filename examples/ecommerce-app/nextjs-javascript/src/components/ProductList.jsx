"use client";

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
      cart.set((cartVal) => ({
        ...cartVal,
        items: cartItems.map((cartItem) => {
          if (cartItem.name === product.name) {
            return { ...cartItem, count: (cartItem.count || 0) + 1 };
          }
          return cartItem;
        })
      }));
    } else {
      cart.set((cartVal) => ({
        ...cartVal,
        items: [...cartItems, { ...product, count: 1 }]
      }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        <span className="bg-blue-500 text-white p-2 rounded-lg text-xl">🛍️</span>
        Available Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productItems.map((product, index) => (
          <div 
            key={index} 
            className="group flex items-center justify-between p-6 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-700">{product.name}</h3>
              <p className="text-blue-600 font-bold">${product.price}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-transform active:scale-95 shadow-lg shadow-blue-200"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
