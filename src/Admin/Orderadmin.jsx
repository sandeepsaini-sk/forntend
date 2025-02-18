import React, { useEffect, useState } from "react";

export default function Orderadmin() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [orders, setorder] = useState([]);
  const fetchorder = async () => {
    try {
      const response = await fetch(`${backendURL}/api/orderget`);
      const data = await response.json();
      setorder(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchorder();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${backendURL}/api/orderget/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchorder(); 
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
        Order List
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
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
                <div key={index} className="flex justify-between text-sm">
                  <p>{item.name} × {item.qty}</p>
                  <p>₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>

            {/* Buttons for Status Update */}
            <div className="mt-3 flex gap-2">
              <button  onClick={() => updateOrderStatus(order._id, "Completed")} className="bg-green-500 text-white px-3 py-1 rounded">
                Mark as Completed
              </button>
              <button onClick={() => updateOrderStatus(order._id, "Cancelled")} className="bg-red-500 text-white px-3 py-1 rounded">
                Cancel Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
