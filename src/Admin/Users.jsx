import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";

export default function Users() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [users, setusers] = useState([]);
  const [viewuser, setviewuser] = useState(null)
  const [edituser, setedituser] = useState(null)
  const [editform, seteditform] = useState({username:"",email:"",phone:"",isAdmin:""})
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${backendURL}/api/user/${id}`, {
        method: "DELETE",
      });

      const res = await response.json();

      if (res.alert) {
        setusers(users.filter((user) => user._id !== id));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("An error occurred while deleting the user.");
    }
  };
  const handleview=async(id)=>{
    setviewuser(viewuser===id?null:id)
  };


   const handleUpdate=(user)=>{
     setedituser(user._id)
    }
     const handleeditchange=(e)=>{
      seteditform({...editform,[e.target.name]:e.target.value});
     }
     
  const handleeditsave=async(id)=>{
   try{
    const response = await fetch(`${backendURL}/api/user/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editform),
    });
    const res=await response.json()
    if(res.alert){
      setusers(users.map(user=>user._id===id?{...user,...editform}:user))
      toast.success(res.message);
      setedituser(null);
    }else{
      toast.error(res.message)
    }
   }
   catch(err){
    toast("while updating trhe user error")
   }
 
  }
   

  return (
    <>
      <div className="bg-gray-200 text-gray-900 text-2xl font-bold border-b border-gray-300 px-4 p-2">
        User List
      </div>

      <div className="flex flex-col gap-3 py-6 sm:px-2 overflow-y-auto pb-64 ">
        <div className="flex flex-nowrap justify-between md:px-16 bg-amber-200 md:text-xl p-1 text-sm  rounded-2xl">
          <span>ID</span>
          <h1 className='w-1/6'>Name</h1>
          <h1 className='w-1/6'>Email</h1>
          <h1 className='w-1/6'>View</h1>
          <h1 className='w-1/6' >Edit</h1>
          <h1>Delete</h1>
        </div>

        {users.length > 0 ? (
          users.map((e, i) => (
            <div key={e._id} className="bg-slate-200 rounded-2xl relative ">
            <div  className="flex flex-wrap md:flex-nowrap justify-between items-center md:pl-16 hover:bg-slate-300 bg-slate-200 sm:p-2 rounded-2xl">
            <span className="text-xs md:text-base">{i + 1}</span>
                <h1 className="w-1/6 text-xs md:text-base truncate">{e.username}</h1>
                <h1 className="w-1/6 text-xs md:text-base truncate">{e.email}</h1>

            
                <button
                  className="w-1/6 bg-yellow-200 hover:bg-yellow-300 text-xs md:text-base p-1 md:px-5 font-semibold rounded-2xl"
                  onClick={() => handleview(e._id)}
                >
                  {viewuser===e._id?'Hide':'View'}
                </button>
            
          
                <button
                  className="w-1/6 bg-blue-400 hover:bg-blue-500 text-xs md:text-base p-1 md:px-5 rounded-2xl"
                  onClick={() => handleUpdate(e)}
                >
                  Edit
                </button>
             
                <button
                  className="w-1/6 bg-red-400 hover:bg-red-500 text-xs md:text-base p-1 md:px-3 rounded-2xl"
                  onClick={() => handleDelete(e._id)}
                >
                  Delete
                </button>
              
            </div>
              {/*view users*/}
              {
                viewuser===e._id&&(
                  <div className="h-30  p-2 rounded-2xl mt-4 shadow-2xl mx-auto max-w-lg absolute z-1 bg-white md:ml-64">
                      <p><strong>Username:</strong>{e.username}</p>
                      <p><strong>Email:</strong>{e.email}</p>
                      <p><strong>Phone no.:</strong>{e.phone}</p>
                   </div>
                )}
                {/*view users*/}
                {
                  edituser===e._id&&(
                    <div className="md:w-sm  p-4 rounded-2xl mt-4 shadow-2xl mx-auto max-w-lg absolute z-1 bg-white md:ml-64">
                      <input type="text"
                      name='username'
                      value={editform.username}
                      onChange={handleeditchange}
                      placeholder='Enter username'
                      className='border p-1 rounded w-full mb-2'
                      />
                       <input type="email"
                      name='email'
                      value={editform.email}
                      onChange={handleeditchange}
                      placeholder='Enter email'
                      className='border p-1 rounded w-full mb-2'
                      />
                       <input type="tel"
                      name='phone'
                      value={editform.phone}
                      onChange={handleeditchange}
                      placeholder='Enter phone'
                      className='border p-1 rounded w-full mb-2'
                      />
                        <input type="text"
                      name='isAdmin'
                      value={editform.isAdmin}
                      onChange={handleeditchange}
                      placeholder='Enter false and true'
                      className='border p-1 rounded w-full mb-2'
                      />
                      <div className="flex gap-4">
                        <button className='bg-green-400 hover:bg-green-500 p-1 px-5 rounded-2xl' onClick={()=>handleeditsave(e._id)}>Save</button>
                        <button className='bg-green-400 hover:bg-green-500 p-1 px-5 rounded-2xl'
                        onClick={()=>setedituser(null)}>Cancel</button>
                      </div>
                    </div>
                  )
                }

            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No users available</p>
        )}
      </div>
    </>
  );
}
