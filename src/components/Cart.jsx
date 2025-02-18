import React from "react";
import { useProduct } from "../redux/Productprovider";
import { useAuth } from "../redux/auth";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "./Card";
import Footer from "./Footer";
import emptyCartImage from "../assets/empty.gif";
export default function Cart() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { auth } = useAuth();
  const { PRODUCT, clearcart } = useProduct();
  const products = PRODUCT.productdata;
  const { cart, removecart, increaseqty, decreaseqty } = useProduct();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );


  const handlepayment = async () => {
    if (!auth.email) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
           
          //order api

          const order = await fetch(`${backendURL}/api/order`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cart,
              userEmail: auth.email,
              total: totalPrice,
            }),
          });
    
          const orderData = await order.json();
          if (orderData.alert) {
            console.log("Order Data:", orderData);
          
            toast.success("Order placed successfully!");
          } else {
            toast.error(orderData.error || "Failed to place order.");
          }

      const stripe = await loadStripe(
        "pk_test_51Qp0ifJZbD2E3ekUoKH6xtqMKFf4z6j2zswPxBgotgvlu4C5xymoKh1Ndmv0UwtYx2ANyJli7xJRElasxbAFgtRo00hS0Q00F3"
      );

      const response = await fetch(`${backendURL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });

      if (response.status === 500) {
        return toast.error("Payment server error!");
      }

      const resdata = await response.json();
      toast("Redirecting to payment...");
      clearcart();
      await stripe.redirectToCheckout({ sessionId: resdata.sessionId });
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };   


  return (
    <>
      <div className="flex">
        {/*cart section */}
        <div className="bg-slate-400 h-screen fixed left-0 w-full lg:w-[30%] shadow-2xl p-2">
          <div className="bg-amber-200 w-full p-2 text-xl text-center">
            My Cart
          </div>
          <div className="flex flex-col gap-2 p-2">
            {cart.length === 0 ? (
              <div className="flex w-full h-full justify-center items-center flex-col ">
                <img
                  src={emptyCartImage}
                  className="w-full max-w-96 rounded-full"
                />
                <p className="text-slate-900 text-3xl font-bold">Empty Cart</p>
              </div>
            ) : (
              cart.map((el, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white rounded shadow p-2 relative"
                >
                  <div className="grid grid-cols-4 gap-4">
                    <img src={el.image} className="h-20 rounded" />
                    <div className="w-full">
                      <h1 className="text-lg font-semibold">{el.name}</h1>
                      <p className="text-sm font-medium">
                        <span className="text-base">Price: </span>
                        <span className="text-red-500">₹</span>
                        {el.price}
                      </p>
                      <p className="text-sm font-medium">
                        <span className="text-base">Stock: </span>
                        {el.stock}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseqty(el._id)}
                        className="bg-slate-200 px-2 p-1 rounded"
                      >
                        -
                      </button>
                      <button className="bg-slate-200 text-sm p-1 rounded">
                        {el.qty}
                      </button>
                      <button
                        onClick={() => increaseqty(el._id)}
                        className="bg-slate-200 px-2 p-1 rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <p>Total :</p>
                      <span className="text-red-500">₹</span>
                      <p>{el.total}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removecart(el._id)}
                    className="absolute top-0 right-1 text-sm font-bold hover:scale-105 text-red-300 hover:text-red-500 cursor-pointer"
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between font-bold text-lg">
                <p>Total:</p>
                <p className="text-green-600">₹{totalPrice.toFixed(2)}</p>
              </div>
              <button
                className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                onClick={handlepayment}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
        {/* Right Side: Card */}
        <div className="hidden lg:flex bg-slate-200 h-screen fixed right-0 w-[70%] shadow-2xl overflow-y-auto p-2">
          <div className="overflow-auto">
            <Card products={products} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
