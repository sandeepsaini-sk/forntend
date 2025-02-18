import React from 'react';
import { FaBox, FaCog, FaShoppingCart, FaTachometerAlt, FaUser } from "react-icons/fa";
import { TbPlaylistAdd } from "react-icons/tb";
import { Link } from 'react-router-dom';

export default function Slidebar() {
const slider=[
  {icon: <FaTachometerAlt />,name:'Dashboard',link:"dashboard"},
  {icon:<FaUser />, name:'Users',link:"users"},
  {icon:<FaShoppingCart />,name:'Orders',link:"order"},
  {icon:<FaBox />,name:'Products',link:"product"},
  {icon:<TbPlaylistAdd />,name:'Add Product', link:"addproduct"},
  {icon:<FaCog />,name:'Setting',link:""},
]

  return (
    <div className="bg-gray-200 text-gray-900 h-screen w-[23%] md:w-[20%] border-r border-gray-300 fixed top-16 left-0 flex flex-col p-4">
      <h1 className='font-extrabold md:text-3xl sm:px-4 sm:mb-6'>Balaji <span className='text-red-400'>Mart</span></h1>
      
      <ul className='flex flex-col space-y-4 sm:text-xl text-sm'>
        {slider.map((e,i)=>(
             <Link to={e.link} key={i} className='flex items-center py-3 sm:px-4 space-x-4 hover:bg-gray-300 rounded cursor-pointer'>
               {e.icon}
             <span className='hidden md:inline'>{e.name}</span>
           </Link>
        ))}
        
      </ul>
    </div>
  );
}

