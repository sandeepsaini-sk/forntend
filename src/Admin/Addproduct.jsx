import React, { useState } from "react";
import { BiSolidCloudUpload } from "react-icons/bi";
import { toast } from "react-toastify";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
export default function Addproduct() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Bakery & Snacks",
    "Beverages",
    "Canned & Packaged Foods",
    "Meat & Seafood",
    "Frozen Foods",
    "Pantry Staples",
    "Spices & Condiments",
    "Personal Care",
    "Household Essentials",
    "Pizza",
    "Dosa",
    "Ice",
    "Rice",
    "Cake"
  ];
  const [data, setdata] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: "",
    stock: "",
  });
  const handledata = (e) => {
    const { name, value } = e.target;
    setdata((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const uploadImage = async (e) => {
    const dataimg = await ImagetoBase64(e.target.files[0]);
    setdata((preve) => {
      return {
        ...preve,
        image: dataimg,
      };
    });
  };

  const submithandle = async (e) => {
    e.preventDefault();
    const { name, category, image, price, description, stock } = data;

    if (name && image && price && category && description && stock) {
      try {
        const response = await fetch(`${backendURL}/api/newproduct`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const datares = await response.json();
        if (datares.alert) {
          toast.success(datares.message);
        } else {
          toast.error("Product added, but no response message received");
        }

        // Reset form after successful submission
        setdata({
          name: "",
          category: "",
          image: "",
          price: "",
          description: "",
          stock: "",
        });
      } catch (error) {
        console.error("Error submitting product:", error);
        toast.error("Failed to submit product");
      }
    } else {
      toast.error("Enter all required fields");
    }
  };

  return (
    <>
      <form
        action=""
        className="flex flex-col gap-3 max-w-sm m-auto my-5 sm:w-lg w-[94%] "
        onSubmit={submithandle}
      >
        <h1 className="text-3xl font-bold text-center italic">
          Add Product Details
        </h1>

        <label htmlFor="name">Item Name </label>
        <input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={handledata}
          placeholder="Enter item name"
          className="bg-slate-200 px-6 text-lg outline-none p-1 "
        />

        <label htmlFor="category">Category</label>
        <select
          value={data.category}
          onChange={handledata}
          name="category"
          className="bg-slate-200 px-6 text-lg outline-none p-1 "
        >
          <option value={"other"}>Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label htmlFor="image">
          Image
          <div className="h-20 w-full bg-slate-200 flex items-center justify-center rounded">
            {data.image ? (
              <img src={data.image} className="h-full" />
            ) : (
              <span className="text-5xl">
                <BiSolidCloudUpload />
              </span>
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={uploadImage}
              className="hidden"
            />
          </div>{" "}
        </label>
        <div className="flex items-center gap-5 max-w-30">
          <div className="flex flex-col w-[80%] md:w-auto">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              className="bg-slate-200 py-1 px-4"
              name="price"
              value={data.price}
              placeholder="0"
              onChange={handledata}
            />
          </div>
          <div className="flex flex-col max-w-30 w-[80%] md:w-auto">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              className="bg-slate-200 py-1 px-4"
              name="stock"
              placeholder="0"
              value={data.stock}
              onChange={handledata}
            />
          </div>
        </div>

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id=""
          rows={2}
          value={data.description}
          onChange={handledata}
          className="bg-slate-200 py-1 resize-none"
        ></textarea>

        <button className="bg-red-500 hover:bg-red-600 text-white py-1 text-lg font-bold drop-shadow">
          Save
        </button>
      </form>
    </>
  );
}
