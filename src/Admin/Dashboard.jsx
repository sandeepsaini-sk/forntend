import React, { useEffect, useState } from 'react'
import { Bar, Line } from "react-chartjs-2";
import {FaBox, FaCog, FaShoppingBag, FaUser} from 'react-icons/fa'
import {Chart as ChartJS, LineElement,BarElement,CategoryScale,LinearScale,PointElement,Tooltip, Legend,} from "chart.js";
import { useProduct } from '../redux/Productprovider';
ChartJS.register(LineElement,BarElement,CategoryScale,LinearScale,PointElement,Tooltip,Legend
);
export default function Dashboard() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  //users api
 const [users, setusers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${backendURL}/api/users`);
      const data = await response.json();
      setusers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 //product api
const{PRODUCT}=useProduct();

const products=PRODUCT.productdata;

//orders api
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
//chart api
  const saledata = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "product",
        data: [30, 50, 40, 60, 70],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };
  const productdata = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales",
        data: [30, 50, 40, 60, 70],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };
  
  const totalAmount = orders.reduce((acc, item) => acc + item.totalAmount, 0);

  return (<>
  <div>
    <div className=' bg-gray-200 text-gray-900 text-2xl font-bold border-b border-gray-300 px-4 p-2'>Dashboard</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 m-6 ">
       
         <div className="bg-white flex gap-8 p-5 shadow-2xl drop-shadow-2xl items-center">
          <div className="text-5xl"><FaUser/></div>
          <div className="">
            <h1 className='text-2xl font-bold py-1 italic'>User</h1>
            <h1 className='text-lg font-semibold text-center'>{users.length}</h1>
          </div>
         </div>
         <div className="bg-white flex gap-8 p-5 shadow-md drop-shadow-2xl items-center">
          <div className="text-5xl"><FaBox/></div>
          <div className="">
            <h1 className='text-2xl font-bold py-1 italic'>Products</h1>
            <h1 className='text-lg font-semibold text-center'>{products.length}</h1>
          </div>
         </div>
         <div className="bg-white flex gap-8 p-5 shadow-md drop-shadow-2xl items-center">
          <div className="text-5xl"><FaShoppingBag/></div>
          <div className="">
            <h1 className='text-2xl font-bold py-1 italic'>Orders</h1>
            <h1 className='text-lg font-semibold text-center'>{orders.length}</h1>
          </div>
         </div>
        
         <div className="bg-white flex gap-8 p-5 shadow-md drop-shadow-2xl items-center">
          <div className="text-5xl"><FaCog/></div>
          <div className="">
            <h1 className='text-2xl font-bold py-1 italic'>Sale</h1>
            <p className='text-lg font-semibold text-center'>{totalAmount}</p>
          </div>
         </div>

      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 m-6">
      <div>
      <h1> Sale data</h1>
      <Line data={saledata}/>
      </div>
      <div>
      <h1> Product data</h1>
      <Bar data={productdata}/>
      </div>
    </div>
    </div>
    </>
  )
}
