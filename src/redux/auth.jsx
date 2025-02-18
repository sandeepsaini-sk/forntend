import { createContext, useContext, useState } from "react";


export const AuthContext=createContext();

export const AuthProvider=({children})=>{
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
    email: localStorage.getItem("email") || null,
    isAdmin: JSON.parse(localStorage.getItem("isAdmin")) || false,
  });

  // Function to store token & username in local storage and state
  const storeTokeninls=(serverToken, username,isAdmin,email)=>{
    localStorage.setItem("token",serverToken);
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
    localStorage.setItem("email", email);
    setAuth({ token: serverToken, username:username ,isAdmin: Boolean(isAdmin),email:email });
  };
      
    // Function to logout
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("email");
      setAuth({ token: null, username: null ,isAdmin:null,email:null});
    };
  
    // Function to check if user is authenticated
    const isAuthenticated = () => !!auth.token;

  return <AuthContext.Provider value={{auth,storeTokeninls,logout,isAuthenticated}}>
    {children}
  </AuthContext.Provider>
}

export const useAuth=()=>{
  const authContextvalue=useContext(AuthContext);
  if(!authContextvalue){
throw new Error("useAuth used outside of the provider");
  }
  return useContext(AuthContext)
}