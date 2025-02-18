import React, { useEffect, useState } from "react";
import { useAuth } from "../redux/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Orders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.email) {
      toast.warn("Please log in to view your orders!");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [auth.email]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3900/api/orderget/${auth.email}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Could not fetch orders. Please try again.");
    }
  };
 const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3900/api/orderget/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders(); 
      } else {
        console.error("Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };


 

  return (
    <>
      <div className="bg-gray-200 text-gray-900 text-2xl font-bold border-b border-gray-300 px-4 p-2">
        Order History
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No orders found.
          </p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
              <p className="text-gray-600">
                <strong>User Email:</strong> {order.userEmail}
              </p>
              <p className="text-gray-600">
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    order.status === "Processing"
                      ? "bg-yellow-500 text-white"
                      : order.status === "Completed"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Created At:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* Order Items */}
              <div className="mt-2">
                <h3 className="font-semibold">Items:</h3>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b py-2">
                    <img src={item.image} className="w-16 h-16 object-cover rounded" />
                    <p>{item.name} x {item.qty}</p>
                    <p>₹{item.price * item.qty}</p>
                  </div>
                ))}
              </div>

              {/* Cancel Order Button */}
              {order.status === "Processing" && (
                <button
                  onClick={() => updateOrderStatus(order._id, "Cancelled")}
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded  hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Orders;
