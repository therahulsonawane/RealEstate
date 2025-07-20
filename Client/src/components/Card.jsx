import React from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom';

const Card = ({ listing }) => {
    console.log(listing?.imageUrls);
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg h-full sm:h-[450px] w-[380px] sm:w-[330px]'>
            <Link to={`/listing/${listing?._id}`} >
                <img
                    className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-110 transition-scale duration-300'
                    src={listing?.imageUrls[0]}
                    alt="cover img" />
            </Link>
            <div className="p-4 flex overflow-hidden flex-col gap-2 w-full">

                <Link to={`/listing/${listing?._id}`} >
                    <h1 className='font-bold truncate text-2xl text-slate-700'>{listing?.name}</h1>
                </Link>
                <div className='flex gap-2 items-center'>
                    <FaMapMarkerAlt className='text-green-700' />
                    <p className='text-sm text-gray-600'>{listing?.address || '456 Serenity Lane, Meadowville'}</p>
                </div>
                <p className='text-slate-600 line-clamp-2'>{listing?.description}</p>
                <h2 className='text-lg font-semibold text-black'> {listing.type === 'sale' ? ' Buy At' : ''} ₹{Number(listing?.regularPrice) - Number(listing?.discountedPrice)}
                    {listing.type === 'rent' ? ' / Month' : ''}
                </h2>
                <div className="flex gap-3 font-semibold">
                    <span> {listing?.bedrooms > 1 ? 'Beds ' : 'Bed ' } {listing?.bedrooms}</span>
                    <span>{listing?.bathrooms > 1 ? 'Baths' : 'Bath'} {listing?.bathrooms}</span>
                </div>

            </div>


        </div>
    )
}

export default Card