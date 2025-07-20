import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signInFailure,
}
  from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  // console.log(currentUser);

  const [formdata, setFormData] = useState({});
  const fileRef = useRef(null);
  const [fileUp, setFileUp] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUplError, setFileUpError] = useState(null)
  const [userUpdatedSuccessfully, setuserUpdatedSuccessfully] = useState(false);
  const [listings, setListings] = useState([]);
  const [showListing, setShowListing] = useState(false);
  const [deleteListMSG, setDeleteListMSG] = useState();
  const [showListingError, setShowListingError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.id]: e.target.value
    })
  }

  useEffect(() => {
    if (fileUp) {
      handleFileUpload(fileUp);
    }
  }, [fileUp])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "_" + Math.floor(Math.random() * 3000) + "_" + file.name;
    const storageRef = ref(storage, `avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUpError('Choose Another File');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formdata, avatar: downloadURL });
          setFileUpError(false);
        })
      }
    );
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata)
      })
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      setuserUpdatedSuccessfully(true);
      dispatch(updateUserSuccess(data))

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }


  const handleDeleteAC = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch(`/api/user/signout`)
      const data = res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  const getUserlisting = async () => {
      setShowListing(!showListing)
    try {
        const res = await fetch(`/api/user/getuserlisting/${currentUser._id}`)
        const data = await res.json();
        if (data.success === false) {
          setShowListingError(true)
        }

        setListings(data);
        setShowListingError(false)

    } catch (error) {
      setShowListingError(true);
    }

  }
  

  const deleteListings = async (id) => {
    const res = await fetch(`/api/listing/delete/${id}`, {
      method: 'DELETE'
    })

    const data = await res.json();
    if (data.success === false) {
      setDeleteListMSG("Problem : Item is Not Deleted")
    }
    setListings((prev)=> prev.filter((listings) => listings._id !== id) )
    setDeleteListMSG("Item is Deleted")
    setTimeout(() => {
      setDeleteListMSG("")
    }, "5000");
    

  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form action="" onSubmit={handleSubmitUpdate} className='flex flex-col gap-3'>

        <input type="file" onChange={(e) => setFileUp(e.target.files[0])} hidden={true} ref={fileRef} accept='image/*' />

        <img
          onClick={() => fileRef.current.click()}
          className='rounded-full  h-24 w-24 object-cover cursor-pointer self-center mt-2'
          src={formdata.avatar || currentUser.avatar}
          alt="Profile img" />
        <p className='text-sm self-center'>{
          fileUplError ?
            (<span className='text-red-600'>{fileUplError}</span>) :
            filePerc > 0 && filePerc < 100 ?
              (
                <span className="text-gray-700">{`Uploading ${filePerc} %`}</span>
              ) :
              filePerc === 100 ? (<span className='text-green-600'>Image Successfully uploaded!</span>)
                : (' ')
        }</p>
        <input
          onChange={handleChange}
          type="text"
          placeholder='Username'
          defaultValue={currentUser.username}
          id='username'
          className=' border p-3 rounded-lg '
        />

        <input
          onChange={handleChange}
          type="email"
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className=' border p-3 rounded-lg '
        />

        <input
          onChange={handleChange}
          type="password"
          placeholder='password'
          id='password'
          className=' border p-3 rounded-lg '
        />

        <button type='submit' disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:bg-slate-600 disabled:opacity-80'>
          {loading ? 'Loading . . .' : 'Update'}
        </button>
        <p className="text-slate-600 self-center">{error ? error : userUpdatedSuccessfully ? 'Updated Successfully' : ' '}</p>
        <button
          className='bg-green-700 text-white rounded-lg p-3 uppercase hover:bg-green-500 disabled:opacity-80'
          onClick={() => navigate('/create-listing')}
        >Create Listing</button>

      </form>
      <div className="flex justify-between mt-3">
        <span onClick={handleDeleteAC} className="text-red-600 cursor-pointer ">Delete account</span>
        <span onClick={handleSignOut} className="text-red-600 cursor-pointer ">Sign Out</span>
      </div>

      <div className="flex flex-col mt-2">
      

        <span onClick={ getUserlisting } className='self-center text-green-600 cursor-pointer'>{showListing ? "Hide Listing" : "Show Listing"}</span>
        {showListing && (<h1 className='self-center my-2'>Your Properties</h1>)}
        {
          showListing && listings && listings?.map((item, index) => (
            <div key={index} className=" flex mx-3 mt-3 justify-start">
              <img
                onClick={() => navigate(`/listing/${item._id}`)}
                src={item.imageUrls[0]}
                className='w-28 h-28 object-cover rounded-lg'
                alt="listing image" />

              <div className="flex ml-3 gap-2 w-64 mt-2 flex-col items-start">
                <p
                  onClick={() => navigate(`/listing/${item._id}`)}
                  className='cursor-pointer font-semibold' >{item.name}</p>
                <span className='text-xs line-clamp-3'>{item.description}</span>
              </div>

              <div className="flex flex-col gap-1 ml-auto">

                <span
                  onClick={() => navigate(`/propertyEdit/${item._id}`)}
                  className='text-green-600 cursor-pointer'>Edit</span>

                <span
                  onClick={() => deleteListings(item._id)}
                  className='text-red-600 cursor-pointer'>delete</span>
              </div>
            </div>
          ))
        }
        {deleteListMSG && <span className='text-red-600 self-center'>{deleteListMSG}</span>}
      </div>
    </div>
  )
}
