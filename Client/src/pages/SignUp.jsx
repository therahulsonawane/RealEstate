import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { OAuth } from '../components/OAuth';
import { url } from '../utils/url';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // Handle Changes in the form 
  const HandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  // handle submit in the form
  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/signin')
    } catch (error) {
      setLoading(false);
      setError(error.message)
    }
  }
  return (
    <div className='p-3 max-w-lg items-center mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={HandleSubmit} className='flex flex-col gap-4 '>

        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={HandleChange} />
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={HandleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={HandleChange} />
        <button
          disabled={loading}
          type='submit'
          className='bg-slate-700 text-teal-50 p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-80'
        >{loading ? 'Loading' : 'Sign Up'}</button>
        <OAuth />

        <div className='flex gap-1 mt-5'>
          <p>Have an account? </p>
          <Link to={'/signin'} className=' text-blue-600'> Sign-In</Link>
        </div>

        {error ? (<span className='text-red-600 text-[12px] font-semibold'>{error}</span>) : ''}

      </form>
    </div>
  )
}