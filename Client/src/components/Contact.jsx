import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [listowner, setListowner] = useState();
  const [Error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listownerDetail = async () => {
      setLoading(true)
      const res = await fetch(url + `/api/listing/listowner/${listing.userRef}`)

      const data = await res.json();

      if (!data.success === false) {
        setLoading(false)
        setError("no Owener of this list")
      }

      setLoading(false);
      setListowner(data);

    }

    listownerDetail();
  }, [listing.userRef])
  return (
    <div>
      {loading && <h1>Loading . . .</h1>}

      {!loading &&
        <form action="" className='flex flex-col gap-4'>
          <p className='text-black'> Contact <span className='font-semibold'>{listowner?.username}</span> for <span className='font-semibold'>{listing.name}</span>  </p>
        
        <textarea className='p-4 rounded-lg' name='message' id='message' onChange={(e) => setMessage(e.target.value)}>

        </textarea>
        <Link to={`mailto:${listowner?.email}?subject=Regarding ${listing?.name}&body=${message}`}
         className='p-3 text-white bg-slate-700 text-center rounded-lg font-semibold uppercase'>Send Message</Link >
        </form>
      }
    </div>
  )
}

export default Contact