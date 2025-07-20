import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/Card';

export const Search = () => {

    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: true,
        sort: 'created_at',
        order: 'desc'
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [listing, setListing] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        setLoading(true);

        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        setLoading(false);

        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl | orderFromUrl) {

            setSideBarData({
                ...sideBarData,
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: orderFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            })
        }

        const fetchListing = async () => {
            setLoading(true);

            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();

            if (data.length > 8) {
                setShowMore(true)
            } else {
                setShowMore(false)
            }

            setLoading(false);
            setError(false);
            setListing(data);
        }

        fetchListing();

    }, [location.search])

    const handleSearchBarData = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSideBarData({ ...sideBarData, type: e.target.id })
        }

        if (e.target.id === 'searchTerm') {
            setSideBarData({
                ...sideBarData,
                searchTerm: e.target.value
            })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSideBarData({
                ...sideBarData,
                [e.target.id]: e.target.checked ? true : false
            })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc'

            setSideBarData({
                ...sideBarData,
                sort, order
            })

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm)
        urlParams.set('type', sideBarData.type)
        urlParams.set('parking', sideBarData.parking)
        urlParams.set('furnished', sideBarData.furnished)
        urlParams.set('offer', sideBarData.offer)
        urlParams.set('sort', sideBarData.sort)
        urlParams.set('order', sideBarData.order)


        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    };

    const onShowMore = async () => {
        const numberoflisting = listing.length;
        const startIndex = numberoflisting;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(url + `/api/listing/get/?${searchQuery}`)
        const data = await res.json();
        setListing([...listing, ...data])
        if (listing.length < 9) {
            setShowMore(false)
        }
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 my-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                    <div className="flex my-3 flex-row gap-3 items-center">
                        <label className='font-semibold'>Search : </label>
                        <input onChange={(e) => handleSearchBarData(e)}
                            type="text"
                            id='searchTerm'
                            placeholder='Search . . .'
                            className='border p-3 px-4 text-black text-start rounded-lg'
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className='font-semibold'>Type : </label>
                        <div className="flex gap-2 ">
                            <input
                                onChange={handleSearchBarData}
                                type="checkbox"
                                id='all'
                                className='w-5'
                                checked={sideBarData.type === 'all'}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input
                                checked={sideBarData.type === 'rent'}
                                onChange={handleSearchBarData}
                                type="checkbox"
                                id='rent'
                                className='w-5'
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input
                                checked={sideBarData.type === 'sale'}
                                onChange={handleSearchBarData}
                                type="checkbox"
                                id='sale'
                                className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input
                                checked={sideBarData.offer}
                                onChange={handleSearchBarData}
                                type="checkbox"
                                id='offer'
                                className='w-5' />
                            <span>Offer</span>
                        </div>

                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className='font-semibold'>Amenities : </label>
                        <div className="flex gap-2 ">
                            <input
                                checked={sideBarData.parking}
                                onChange={handleSearchBarData}
                                type="checkbox"
                                id='parking'
                                className='w-5' />
                            <span>parking</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input
                                checked={sideBarData.furnished}
                                onChange={handleSearchBarData}
                                type="checkbox"
                                id='furnished'
                                className='w-5' />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className='font-semibold'>Sort : </label>
                        <select
                            onChange={handleSearchBarData}
                            defaultValue={'created_at_desc'}
                            id="sort_order"
                            className='border hover:bg-slate-100 rounded-lg p-3 bg-transparent'>

                            <option value="regularPrice_desc">Price low to high</option>
                            <option value="regularPrice_asc">Price high to low</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>

                        </select>
                    </div>
                    <button className='bg-slate-700 leading-9 tracking-wider p-2 rounded-lg text-white hover:opacity-95 uppercase'>Search</button>
                </form>

            </div>

            <div className="flex flex-col flex-1">
                <h1 className='text-3xl font-semibold border-b mx-6 my-6 p-3 text-slate-800'>Listing Result</h1>
                <div className="p-7 mx-5 flex flex-wrap gap-4">
                    {loading ? <h2> Please wait Loading . . .</h2> : ''}
                    {error && !loading ? <h2>Sorry No Listing Awailable . . .</h2> : ''}
                    {
                        !error && !loading && (
                            <>
                                {!loading && listing && listing?.map((data) => (
                                    <Card key={data._id} listing={data} />
                                ))}
                            </>
                        )
                    }

                </div>
                {showMore && (
                    <button className='text-green-700 p-7 hover:underline self-start mx-6' onClick={onShowMore}>Show More</button>
                )}


            </div>
        </div>
    )
}
