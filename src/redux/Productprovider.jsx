import { createContext, useContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  const [PRODUCT, setPRODUCT] = useState({ productdata: [] });

  // Function to update product list
  const productlist = (newProduct) => {
    setPRODUCT({ productdata: newProduct });
  };
  
  const [cart, setcart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);

  const Addcart = (item) => {
    const itemexist = cart.some(el => el._id === item._id);
    let updatecart;
  
    if (itemexist) {
      updatecart = cart.map((el) =>
        el._id === item._id ? { ...el, qty: el.qty + 1,total:(el.qty+1)*el.price } : el
      );
    } else {
      updatecart = [...cart, { ...item, qty: 1,total: item.price }];
    }
  
    setcart(updatecart);
    localStorage.setItem("cart", JSON.stringify(updatecart));
  };
   // Remove product from cart
   const removecart = (id) => {
    const updatecart = cart.filter((item) => item._id !== id);
    setcart(updatecart);
    localStorage.setItem("cart", JSON.stringify(updatecart));
  };

 // Increase quantity
 const increaseqty = (id) => {
  const updatecart = cart.map((item) =>
    item._id === id ? { ...item, qty: item.qty + 1,total: (item.qty + 1) * item.price  } : item
  );
  setcart(updatecart);
  localStorage.setItem("cart", JSON.stringify(updatecart));
};



  // Decrease quantity
  const decreaseqty = (id) => {
    const updatecart = cart
      .map((item) =>
        item._id === id ? { ...item, qty: Math.max(item.qty - 1, 1),total: Math.max(item.qty - 1, 1)*item.price } : item
      )
      .filter((item) => item.qty > 0);

    setcart(updatecart);
    localStorage.setItem("cart", JSON.stringify(updatecart));
  };
  const clearcart = () => {
    localStorage.removeItem("cart");
  
    setcart([]);
  };


  return (
    <ProductContext.Provider value={{ productlist, PRODUCT ,Addcart,cart,removecart,increaseqty,decreaseqty,clearcart}}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const productContextValue = useContext(ProductContext);
  if (!productContextValue) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return productContextValue;
};
