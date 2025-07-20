import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { OAuth } from '../components/OAuth';
import { url } from '../utils/url';

export default function SignIn() {
  // hooks and setup
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // change handlers in input box
  const HandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  // submit handlers
  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch('/api/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json();

      if (data.success === false) {
       dispatch(signInFailure(data.message))
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');

    } catch (error) {
     dispatch(signInFailure(error.message))
    }
  }
  return (
    <div className='p-3 max-w-lg items-center mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={HandleSubmit} className='flex flex-col gap-4 '>

        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={HandleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={HandleChange} />

        <button
          disabled={loading}
          type='submit'
          className='bg-slate-700 text-teal-50 p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-80'
        >{loading ? 'Loading' : 'Sign In'}</button>
        <OAuth />

        <div className='flex gap-1 mt-5'>
          <p>{"Don't"} have an account? </p>
          <Link to={'/signup'} className=' text-blue-600'> Sign-Up</Link>
        </div>

        {error ? (<span className='text-red-600 text-[12px] font-semibold'>{error}</span>) : ''}

      </form>
    </div>
  )
}
