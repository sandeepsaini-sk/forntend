import React, { useRef, useState } from "react";
import { LuListFilter } from "react-icons/lu";
import { useProduct } from "../redux/Productprovider";
import Card from "../components/Card";
import Footer from "../components/Footer";


export default function Home() {
  const { PRODUCT } = useProduct();
  const products = PRODUCT.productdata;
  const slideProductRef = useRef();
  const uniqueCategories = [
    "All",
    ...new Set(products.map((el) => el.category)),
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((el) => el.category === selectedCategory);

  return (
    <>
      <div className=" p-3 min-h-screen bg-slate-100 m-auto">
        {/*left side of hero*/}
        <div className="lg:w-full flex flex-col gap-3 md:px-5 border-b border-slate-300 bg-slate-400 p-2 pb-14">
          <div className="flex gap-4 bg-slate-900 w-40 px-4 items-center rounded-full">
            <p className="text-sm font-medium text-white">Bike Delivery</p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
              className="h-7"
            />
          </div>
          <h2 className="text-base sm:text-5xl md:text-7xl font-bold py-3 text-center md:text-left">
            The Fastest Delivery in{" "}
            <span className="text-red-600">Your Home</span>
          </h2>

          <p className="py-3 text-sm sm:text-base text-justify max-h-30  ">
            Discover the power of seamless shopping! Elevate your experience
            with our intuitive platform, where every product is just a click
            away. Whether you're looking for the latest trends, essential deals,
            or exclusive finds, we bring you convenience, quality, and
            unbeatable prices. <span className="hidden md:flex"> Your journey to effortless shopping starts
            here—browse, add to cart, and enjoy a hassle-free checkout. Because
            you deserve a smarter way to shop.</span>
          </p>
          <div className="text-center md:text-start">
            <button className="font-bold bg-red-500 text-white px-4 py-2 rounded-full text-sm sm:text-xl w-full sm:w-48">
              Order Now
            </button>
          </div>
        </div>
        {/*category section*/}
        <div
          className="flex items-start md:justify-center gap-5 py-5 px-5 border-b border-slate-300 overflow-x-auto scrollbar-none snap-x"
          ref={slideProductRef}
        >
          {uniqueCategories.map((el, id) => (
            <div
              key={id}
              onClick={() => setSelectedCategory(el)}
              className="flex flex-col gap-2 items-center max-w-30 "
            >
              <h1 className="bg-amber-400 rounded-full cursor-pointer hover:bg-amber-600 text-center text-3xl text-white p-3">
                <LuListFilter />
              </h1>
              <p className="text-lg font-medium text-center">{el}</p>
            </div>
          ))}
        </div>

        {/* Show products based on selected category */}
        <Card products={filteredProducts} />
      </div>

      <Footer />
    </>
  );
}
