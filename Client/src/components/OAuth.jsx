import React from 'react'
import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            
            const res = await fetch('/api/user/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, avatar: result.user.photoURL })
            })

            const data = await res.json();

            if(data.success === false) {
                dispatch(signInFailure(data.message));
            }
            else{
                dispatch(signInSuccess(data))
                navigate('/profile')
            }
        } catch (error) {
            console.log('Got Error From Google : ' + error);
        }
    }

    return (
        <button
            type='button'
            onClick={handleClick}
            className='bg-red-700 text-teal-50 p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-80'
        >Continue With Google</button>
    )
}
