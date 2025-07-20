import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Card from '../components/Card';


const sliderImage = [

  {
    url: 'https://firebasestorage.googleapis.com/v0/b/estate-f6a52.appspot.com/o/Roomslisting%2F1704891133524_6671.jpg?alt=media&token=261192c9-b5da-4e3c-880e-c7e5184aa015',
    location: 'listing/659e93259d15ad91b5d9f719'
  },
  {
    url: 'https://images.pexels.com/photos/5531295/pexels-photo-5531295.jpeg',
    location: '/listing/659e98649d15ad91b5d9f771'
  },
  {
    url: 'https://images.pexels.com/photos/2224777/pexels-photo-2224777.jpeg',
    location: '/listing/659e99849d15ad91b5d9f77b'
  },
  {
    url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg',
    location: '/listing/659e9a869d15ad91b5d9f790'
  },
  {
    url: 'https://images.pexels.com/photos/13084497/pexels-photo-13084497.jpeg',
    location: '/listing/659e9b4a9d15ad91b5d9f797'
  },


]

export default function Home() {

  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setsaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=5&order=asc`);
        const data = await res.json();
        setOfferListing(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchOffer();

    const fetchSale = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=5&order=asc`)
        const data = await res.json();
        setsaleListing(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSale();

    const fetchRent = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=5&order=asc`)
        const data = await res.json();
        setRentListing(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRent();

  }, [])

  // console.log( "Offer Listing ", offerListing);
  // console.log( "sale Listing ", saleListing);
  // console.log( "rent Listing ", rentListing);

  return (
    <div className=''>
      {/* Home Detail */}
      <div className='flex flex-col gap-6 sm:px-3 max-w-6xl mx-auto'>
        <div className="mx-6 sm:mx-20 my-6">
          <h1 className='text-3xl lg:text-6xl font-bold text-slate-800'>Find your next <span className='text-slate-600'>destiny</span>
            <br />
            Place with peace
          </h1>
          <div className="text-slate-400 mt-3 text-xs lg:text-sm leading-loose tracking-widest">
            Wix EState will help you find your home fast, easy and comfortable.
            <br />
            We have a wide range of properties for you to choose from.
          </div>
          <Link className='text-blue-800 text-xs sm:text-sm font-semibold hover:underline tracking-wider' to={"/search"}>
            {"Let's start now . . ."}
          </Link>
        </div>
        {/* Home Crousel */}
        <div className='max-w-7xl'>
          <div className=''>

            <h1 className='font-semibold mx-4 text-2xl'>Best Properties For You . . .</h1>
            <div className="h-[500px] my-2">

              <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                {sliderImage.map((data) => (
                  <div className='w-full mx-2'
                    key={data.location}
                  >
                    <SwiperSlide>
                      <img src={data.url} onClick={() => navigate(data.location)} className='object-cover w-full h-[500px] rounded-xl' alt="" />
                    </SwiperSlide>
                  </div>
                ))}
              </Swiper>
            </div>

          </div>

          {/* Offer listings */}
          <div className="mr-4">

            <div className="my-5">
              <div className="mx-5 my-4">
                <h2 className='font-semibold text-xl '>New Offers</h2>
                <Link className='text-blue-800 hover:underline text-sm' to={'/search?offer=true'}>Show More</Link>
              </div>
              <div className="flex flex-wrap gap-4 mx-2 sm:mx-8">
                {offerListing && offerListing.map((data) => (
                  <div key={data._id} className="">
                    <Card listing={data} />
                  </div>
                ))
                }
              </div>
            </div>

            {/* on Sale Listing */}
            <div className="my-5">
              <div className="mx-5 my-4">
                <h1 className='text-xl font-semibold '>Listing For Sale</h1>
                <Link className='text-blue-800 hover:underline text-sm' to={'/search?type=sale'}>Show More</Link>
              </div>
              <div className="flex flex-wrap gap-3 my-3 mx-2 sm:mx-8">
                {saleListing && saleListing.length > 0 && saleListing.map((data) => (
                  <div className="" key={data._id}>
                    <Card listing={data} />
                  </div>
                ))}
              </div>
            </div>

            {/* On Rent Listing */}
            <div className="">
              <div className="mx-5 my-4">
                <h1 className='text-xl font-semibold'>Rent Listings</h1>
                <Link className='text-blue-800 hover:underline' to={`/search?type=rent`}>Show more</Link>
              </div>
              <div className="flex flex-wrap gap-3 my-4 mx-2 sm:mx-8">
                {rentListing && rentListing.length > 0 && rentListing.map((data) => (
                  <div className="" key={data._id}>
                    <Card listing={data} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div >
      </div>
    </div >
  )
}
