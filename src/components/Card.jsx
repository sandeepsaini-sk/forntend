import React, { useEffect, useState } from "react";
import { useProduct } from "../redux/Productprovider";
import { FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { useAuth } from "../redux/auth";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 🔹 Loading Skeleton Component
const CardSkeleton = () => (
  <div className="bg-gray-200 animate-pulse w-[270px] h-[340px] rounded-sm flex items-center justify-center text-2xl font-medium">lodding...</div>
)
export default function Card({products}) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { auth } = useAuth();
  const navigate = useNavigate();
  const{Addcart}=useProduct();
  
  const [viewproduct, setviewproduct] = useState(null);

  const handleview = (id) => {
    setviewproduct(viewproduct === id ? null : id);
  };
  const handlecart = (element) => {
    Addcart(element);
  };
  const handlepayment = async (element) => {
    if (!auth.email) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
  
    try {
      const stripe = await loadStripe("pk_test_51Qp0ifJZbD2E3ekUoKH6xtqMKFf4z6j2zswPxBgotgvlu4C5xymoKh1Ndmv0UwtYx2ANyJli7xJRElasxbAFgtRo00hS0Q00F3");
  
      const response = await fetch(`${backendURL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(element)
      });
  
      const resdata = await response.json();
      console.log("Payment API Response:", resdata.sessionId);
  

  
      toast("Redirecting to payment...");
      const result = await stripe.redirectToCheckout({ sessionId: resdata.sessionId });
  
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 90000);
  }, []);

  return (
    <div>
      {/* Product Section */}
      <div className="flex flex-wrap justify-center gap-8 my-5 px-10 py-5 ">
      {loading
        ? [1, 2, 3, 4].map((_, index) => <CardSkeleton key={index} />)
        :products.map((el, i) => (
          <div key={i} className="bg-white relative">
            <div className="w-full  min-w-[300px] sm:max-w-[270px] sm:min-w-[280px] bg-white hover:shadow-lg drop-shadow-2xl hover:scale-105 cursor-pointer  px-4 py-5 rounded-sm">
              <div className="h-40 w-full flex justify-center items-center">
                <img src={el.image} className="h-full object-cover" />
              </div>
              <div
                className="flex flex-col justify-center items-center gap-3 mt-3"
                onClick={() => handleview(el._id)}
              >
                <h1 className="text-xl font-bold text-center">{el.name}</h1>
                <h1 className="text-lg font-semibold text-gray-700">
                  {" "}
                  <span className="text-red-500 px-1">₹</span>
                  {el.price}
                </h1>
                <h1 className="flex text-amber-400 text-xl">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaRegStarHalfStroke />
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row justify-around text-lg gap-4 mt-4">
                <button
                  onClick={() => handlecart(el)}
                  className="bg-amber-300 px-5 p-2 w-full cursor-pointer rounded-2xl font-medium hover:bg-amber-400 transition-all duration-300"
                >
                  Add Cart
                </button>
              </div>
            </div>
            {/*product menu*/}
            {viewproduct === el._id && (
              <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-1">
                <div className="bg-white flex flex-col px-3 min-h-96 rounded-2xl shadow-2xl w-[400px] md:w-[700px]">
                  <button
                    className="self-end text-3xl font-extrabold text-gray-600 hover:text-black"
                    onClick={() => setviewproduct(null)}
                  >
                    X
                  </button>

                  <div className="flex px-6">
                    <div className="h-50 ">
                      <img src={el.image} className="h-full object-cover" />
                    </div>
                    <div className="pl-10 text-xl ">
                      <p>
                        <strong>Name:</strong> {el.name}
                      </p>
                      <div className="flex items-center">
                        <strong>Rating:</strong>{" "}
                        <h1 className="flex text-amber-400 text-xl">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaRegStarHalfStroke />
                        </h1>
                      </div>
                      <p>
                        <strong>Price:</strong> {el.price}
                      </p>
                      <p>
                        <strong>Stock:</strong> {el.stock}
                      </p>
                      <p>
                        <strong>Category:</strong> {el.category}
                      </p>
                      <p>
                        <strong>Description:</strong> {el.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-around text-lg gap-4 mt-4 p-5">
                    <button
                      onClick={() => handlecart(el)}
                      className="bg-amber-300 px-10 p-2 rounded-2xl cursor-pointer font-medium hover:bg-amber-400 transition-all duration-300"
                    >
                      Add Cart
                    </button>
                    <button
                      onClick={() => handlepayment(el)}
                      className="bg-red-400 text-white px-10 p-2 rounded-2xl cursor-pointer font-medium hover:bg-red-500 transition-all duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}
