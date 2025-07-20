import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { useEffect, useState } from "react";

export const Header = () => {
    const { currentUser } = useSelector((state) => state.user)
const [searchTerm, setSearchTerm] = useState();

const navigate = useNavigate();

const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`search?${searchQuery}`)
    console.log(`search?${searchQuery}`);

}

useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const SearchtermFromUrl = urlParams.get('searchTerm');
    if(SearchtermFromUrl){
        setSearchTerm(SearchtermFromUrl)
    }
}, [location.search])

    return (
        <header className="bg-slate-300 w-full shadow-md ">
            <div className="flex justify-between items-center mx-auto max-w-6xl p-3">
                <h1 className="font-bold text-sm sm:text-xl flex flex-wrap ">
                    <Link to={'/'}>
                    <span className="text-slate-500">Wix</span>
                    <span className="text-slate-700">EState</span>
                    </Link>
                </h1>
                
                <form 
                onSubmit={handleSubmit}
                className="bg-slate-100  rounded-lg p-3 flex items-center" 
                action="">
                    <input 
                    type="text" 
                    className='bg-transparent focus:outline-none w-24 sm:w-64' 
                    placeholder="Search..." 
                    defaultValue={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                    <FaSearch className="text-slate-700" />
                    </button>
                </form>
                <ul className="flex gap-4 items-center hover:cursor-pointer">
                    <Link to='/'>
                        <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
                    </Link>
                    <Link to='/profile'>
                        {
                            currentUser ? (
                                <img 
                                className="rounded-full h-9 w-9 object-cover"
                                src={currentUser.avatar} alt="profile picture" />
                            ) : (
                                <li className="sm:inline text-slate-700 hover:underline">Sign in</li>
                            )
                        }
                    </Link>
                </ul>
            </div>


        </header>
    )
}
