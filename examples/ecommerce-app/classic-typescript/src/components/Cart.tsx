import { useEcommerceStore } from "../store";
import { CartType } from "../types";

export const Cart = () => {
  const store = useEcommerceStore();
  const cart: any = store.cart;
  const cartSliceData: any = cart.useState();
  const cartItems: Array<CartType> = cartSliceData?.items || [];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.count, 0);

  if (cartItems.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-8 border-2 border-dashed border-slate-200 text-center">
        <p className="text-slate-500 font-medium">Your cart is empty. Start shopping!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 text-white h-fit sticky top-8">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="bg-indigo-500/20 p-2 rounded-lg">🛒</span>
        Your Cart
      </h2>
      <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <div>
              <h4 className="font-semibold text-slate-200">{item.name}</h4>
              <p className="text-sm text-slate-400">${item.price} × {item.count}</p>
            </div>
            <p className="font-bold text-indigo-400">${item.price * item.count}</p>
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400 font-medium">Total Amount</span>
          <span className="text-3xl font-black text-white">${total}</span>
        </div>
        <button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-indigo-500/20">
          Checkout Now
        </button>
      </div>
    </div>
  );
};
