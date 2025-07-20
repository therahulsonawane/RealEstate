import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking
} from 'react-icons/fa'
import Contact from '../components/Contact'


export const Listing = () => {
  const params = useParams();
  const [listData, setListData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
 
    try {
      setLoading(true);
      const ListData = async () => {
        const id = params.id;
        const res = await fetch(`/api/listing/list/${id}`)
        const data = await res.json();

        if (data.success === false) {
          setLoading(false);
          setError(true)
        }

        setListData(data)
        setLoading(false);
      }

      ListData();

    } catch (error) {
      setError(true);
      setLoading(false);
    }

  }, [params.id])


  console.log(listData);
  return (
    <main className="">

      {loading ? <h2 className='text-center animate-bounce  my-10 text-xl'>Loading <span className='animate-pulse text-black text-lg'>. . .</span> </h2> : ""}
      {error ? <p className='text-center my-10 text-xl animate-pulse text-black'>Something went wrong!</p> : ''}

      {listData && !error && !loading && (
        <>

          <div className="max-w-[1200px] h-[500px] mt-4 w-full m-auto">
          <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                {listData.imageUrls.map((data) => (
                  <div className='w-full'
                    key={data.imageUrls}
                  >
                    <SwiperSlide>
                    <img src={data} className='object-cover w-full h-[500px] rounded-xl' alt="" />
                    </SwiperSlide>
                  </div>
                ))}
              </Swiper>
          </div>

          <div className="flex flex-col max-w-4xl mt-4 mx-auto p-3  my-7 gap-4">
            <div className='flex flex-col gap-2'>
              <div className="flex flex-wrap flex-col gap-2">
                <div className='flex justify-between'>
                  <h1 className='text-[30px] font-bold'>{listData.name}</h1>
                </div>
                <p className='flex flex-wrap gap-2 items-center'>
                    <FaMapMarkerAlt className='cursor-pointer  text-green-600 gap-4' />
                    {listData.address || "India, Maharashtra, Mumbai - 3001"}
                  </p>
                <div className='flex justify-between items-center text-center'>

                  <p className='flex flex-row items-center'>
                    {listData.offer ?
                      <span className='text-black font-bold text-2xl' >₹{listData.regularPrice - listData.discountedPrice + " "}
                        <span className="line-through text-slate-600 text-sm">₹{listData.regularPrice}</span></span>
                      : <span className='text-black font-bold text-2xl'>₹{listData.regularPrice} </span>}

                  </p>
                  <div className='flex justify-end'>
                    <span className='p-2 bg-red-600 font-semibold rounded-lg ml-1'>{listData.type === 'rent' ? " For Rent" : ' For Sale'}</span>

                    {listData.discountedPrice &&
                      <span className='p-2 px-3 mx-2 bg-green-600 font-semibold rounded-lg'>Discount ₹{listData.discountedPrice}</span>
                    }
                  </div>

                </div>
              </div>
              <p> <span className='font-semibold'>Description -</span> {listData.description}</p>

              <ul className='flex flex-wrap items-center my-3 text-green-600 gap-2 sm:gap-6 font-semibold '>
                <li className='flex items-center gap-2 whitespace-nowrap'>
                  <FaBed className='text-lg' />
                  {listData.bedrooms > 1 ? `Beds ${listData.bedrooms}` : `Bad ${listData.bedrooms}`}
                </li>
                <li className='flex items-center gap-2 whitespace-nowrap ml-3'>
                  <FaBath className='text-lg' />
                  {listData.bathrooms > 1 ? `Beds ${listData.bathrooms}` : `Bad ${listData.bathrooms}`}
                </li>
                <li className='flex items-center gap-2 whitespace-nowrap ml-3'>
                  <FaParking className='text-lg' />
                  {listData.parking ? " PArking Spot" : 'No Parking Spot'}
                </li>
                <li className='flex items-center gap-2 whitespace-nowrap ml-3'>
                  <FaChair className='text-lg' />
                  {listData.furnished ? "Furnished" : "Not Furnished"}
                </li>
              </ul>
              {currentUser && currentUser._id !== listData.userRef && !contact && (
                <button onClick={() => setContact(true)} className='bg-slate-700 p-3 uppercase text-white rounded-lg hover:opacity-90 '>Contact Landlord</button>
              )}
              {contact && currentUser._id !== listData.userRef && <Contact listing={listData} />}
            </div>
          </div>


        </>
      )}


    </main>



  )
}
