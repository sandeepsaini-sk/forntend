import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProduct } from "../redux/Productprovider";
export default function Product() {
const{PRODUCT,productlist}=useProduct();

const products=PRODUCT.productdata;
const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [viewproduct, setviewproduct] = useState(null);
  const [editproduct, seteditproduct] = useState(null);
  
  const [editform, seteditform] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category:"",
    image:"",
  });

  const handleDelete = async (e) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${backendURL}/api/products/${e}`, {
        method: "DELETE",
      });
      const res = await response.json();

      if (res.alert) {
        productlist(products.filter((product) => product._id !== e));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("An error occurred while deleting the product.");
    }
  };

  const handleview = (id) => {
    setviewproduct(viewproduct === id ? null : id);
  
  };

  const handleUpdate = (product) => {
    seteditproduct(product._id);
    seteditform({ ...product });
    };
  const handleeditchange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          seteditform({ ...editform, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    } else {
      seteditform({ ...editform, [e.target.name]: e.target.value });
    }
  };
   
  const handleeditsave = async(id) => {
    try{
       const response = await fetch(`${backendURL}/api/products/${id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(editform),
       });
       const res=await response.json()
       console.log(res);
       
       if(res.alert){
        productlist(products.map(product=>product._id===id?{...product,...editform}:product))
         toast.success(res.message);
         seteditproduct(null);
       }else{
         toast.error(res.message)
       }
      }
      catch(err){
       toast("while updating trhe user error")
      }
  };

  return (
    <>
      <div className=" bg-gray-200 text-gray-900 text-2xl font-bold border-b border-gray-300 px-4 p-2">
        Product list
      </div>

      <div className="flex flex-col gap-3 py-6 md:px-5 overflow-auto text-sm md:text-xl">
        <div className="flex flex-nowrap justify-between  bg-amber-200 text-sm md:text-xl p-1  rounded-2xl">
          <span>ID</span>
          <h1>IMAGE</h1>
          <h1 className="w-1/6"> Name</h1>
          <h1>PRICE</h1>
          <h1>STOCK</h1>
          <h1>View</h1>
          <h1>Edit</h1>
          <h1>Delete</h1>
        </div>
        {products.length > 0 ? (
          products.map((products, i) => (
            <div key={i} className="bg-slate-200 rounded-2xl relative">
              <div className="flex flex-nowrap justify-between items-center  hover:bg-slate-300 bg-slate-200 p-1 rounded-2xl ">
                <span>{i + 1}</span>
                <img
                  src={products.image}
                  className="h-10 w-10 object-cover"
                />
                <h1 className="truncate w-1/6">{products.name}</h1>
                <h1>{products.price}</h1>
                <h1>{products.stock}</h1>

                
                  <button
                    className="bg-yellow-200 hover:bg-yellow-300 p-1 text-xs md:text-base rounded-lg"
                    onClick={() => handleview(products._id)}
                  >
                    {viewproduct === products._id ? "Hide" : "View"}
                  </button>
            
                
                  <button
                    className="bg-blue-400 hover:bg-blue-500 p-1 text-xs md:text-base rounded-lg"
                    onClick={() => handleUpdate(products)}
                  >
                    Edit
                  </button>
           
                
                  <button
                    className="bg-red-400 hover:bg-red-500 p-1 text-xs md:text-base rounded-lg"
                    onClick={() => handleDelete(products._id)}
                  >
                    Delete
                  </button>
                
              </div>
              {/*product users*/}
              {viewproduct === products._id && (
                <div className="md:w-lg p-4 rounded-2xl mt-4 shadow-2xl mx-auto max-w-lg absolute z-1 bg-white md:ml-64">
                  <p>
                    <img
                      src={products.image}
                      className="max-h-15  max-w-20 mx-auto"
                    />
                  </p>
                  <p>
                    <strong>Name:</strong> {products.name}
                  </p>
                  <p>
                    <strong>Price:</strong> {products.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {products.stock}
                  </p>
                  <p>
                    <strong>Category:</strong> {products.category}
                  </p>
                  <p>
                    <strong>Description:</strong> {products.description}
                  </p>
                </div>
              )}

              {/*edit product*/}
              {editproduct === products._id && (
                <div className="md:w-lg p-1 rounded-2xl mt-4 shadow-2xl mx-auto max-w-lg absolute z-1 bg-white md:ml-64">
                     <input
                    type="text"
                    name="image"
                    value={editform.image}
                    onChange={handleeditchange}
                    placeholder="Enter Image URL"
                    className="border p-1 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    name="name"
                    value={products.username}
                    onChange={handleeditchange}
                    placeholder="Enter Name"
                    className="border p-1 rounded w-full mb-2"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editform.price}
                    onChange={handleeditchange}
                    placeholder="Enter Price"
                    className="border p-1 rounded w-full mb-2"
                  />
                  <input
                    type="tel"
                    name="stock"
                    value={editform.stock}
                    onChange={handleeditchange}
                    placeholder="Enter stock"
                    className="border p-1 rounded w-full mb-2"
                  />
                   <input
                    type="tel"
                    name="category"
                    value={editform.category}
                    onChange={handleeditchange}
                    placeholder="Enter category"
                    className="border p-1 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    name="description"
                    value={editform.description}
                    onChange={handleeditchange}
                    placeholder="Enter Description"
                    className="border p-1 rounded w-full mb-2"
                  />
                  <div className="flex gap-4">
                    <button
                      className="bg-green-400 hover:bg-green-500 p-1 px-5 rounded-2xl"
                      onClick={() => handleeditsave(products._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-green-400 hover:bg-green-500 p-1 px-5 rounded-2xl"
                      onClick={() => seteditproduct(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </div>
    </>
  );
}
