import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export const PropertyEdit = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const { currentUser } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({
        imageUrls: [],
        userRef: currentUser._id,
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 100,
        discountedPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });

    const [imageUploadError, setImageUploadError] = useState();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const params = useParams();

    useEffect(() => {

        const fetchListing = async () => {
            const listingId = params.id;

            const res = await fetch(`/api/listing//list//${listingId} `)
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
            }
            setFormData(data);

        }

        fetchListing();
    }, [])

    const handleImageSubmit = async () => {
        if (files.length === 0) {
            setImageUploadError("Choose Another Images")
        }
        else if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false);

            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((url) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(url) });
                setImageUploadError(false)
                setUploading(false);
                setFiles([]);
            })
                .catch((error) => {
                    setImageUploadError('Image upload failed (2mb max per image) or ' + error.message );
                    setUploading(false);
                })

        } else {
            setImageUploadError("You can only upload 6 images")
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '_' + Math.floor(Math.random() * 2000) + file.name;
            const storageRef = ref(storage, `Roomslisting/${fileName}`)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('uploaded is ' + progress + '% done');
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {

        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.type === "number") {
            setFormData({
                ...formData,
                [e.target.id]: Number(e.target.value)
            })
        }

        if (e.target.type === "text" || e.target.type === "textarea") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (formData.imageUrls < 1) return setError("You must upload at least one image")
            if (formData.regularPrice < formData.discountedPrice) return setError("Discount price must be lower than regular price")

            setLoading(true);
            setError(false);

            const res = await fetch(`/api/listing/update/${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json();
            setLoading(false);

            if (data.success === false) {
                setError(data.message)
            }

            setFormData({
              imageUrls: [],
              userRef: currentUser._id,
              name: '',
              description: '',
              address: '',
              type: 'rent',
              bedrooms: 1,
              bathrooms: 1,
              regularPrice: 100,
              discountedPrice: 0,
              offer: false,
              parking: false,
              furnished: false,
            })
            navigate('/listing/'+ params.id)

        } catch (error) {
            setError(error.message)
        }

    }

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-5'>
                <div className="flex flex-col gap-4 flex-1">

                    <input
                        type="text"
                        placeholder='Name'
                        className='border p-3 rounded-lg'
                        id='name'
                        maxLength={'62'}
                        min={'7'}
                        required
                        onChange={handleChange}
                        value={formData.name}

                    />

                    <textarea
                        type="text"
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        maxLength={'5000'}
                        min={'3'}
                        required
                        onChange={handleChange}
                        value={formData.description}

                    />

                    <input
                        type="text"
                        placeholder='address'
                        className='border p-3 rounded-lg'
                        id='address'
                        required
                        onChange={handleChange}
                        value={formData.address}

                    />

                    <div className="flex gap-6 flex-wrap">

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id='sale'
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === 'sale'}

                            />
                            <span>Sell</span>
                        </div>

                        <div className="flex gap-2">

                            <input
                                type="checkbox"
                                id='rent'
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === 'rent'}

                            />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">

                            <input
                                type="checkbox"
                                id='parking'
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.parking}

                            />
                            <span>Parking spot</span>
                        </div>

                        <div className="flex gap-2">

                            <input
                                type="checkbox"
                                id='furnished'
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.furnished}

                            />
                            <span>Furnished</span>
                        </div>

                        <div className="flex gap-2">

                            <input
                                type="checkbox"
                                id='offer'
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.offer}

                            />
                            <span>Offer</span>
                        </div>

                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-3">

                            <input
                                type="number"
                                className='p-2 px-1 border border-gray-300 rounded-lg '
                                id='bedrooms'
                                min='1'
                                max={'30'}
                                required
                                onChange={handleChange}
                                value={formData.bedrooms}

                            />
                            <p>Bedrooms</p>
                        </div>

                        <div className="flex items-center gap-3">

                            <input
                                type="number"
                                className='p-2 px-1 border border-gray-300 rounded-lg '
                                id='bathrooms'
                                min='1'
                                max={'10'}
                                required
                                onChange={handleChange}
                                value={formData.bathrooms}

                            />
                            <p>Bathrooms</p>
                        </div>

                        <div className="flex items-center gap-3">

                            <input
                                type="number"
                                className='p-2 px-1 border border-gray-300 rounded-lg '
                                id='regularPrice'
                                min='500'
                                max={'100000'}
                                required
                                onChange={handleChange}
                                value={formData.regularPrice}

                            />
                            <div className="flex flex-col items-center">
                                <p>₹ Regular Price</p>
                                <span className='text-xs'>(₹ / month)</span>
                            </div>
                        </div>
                        {
                            formData.offer && (
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        className='p-2 px-1 border border-gray-300 rounded-lg '
                                        id='discountedPrice'
                                        min={0}
                                        max={formData.regularPrice}
                                        required
                                        onChange={handleChange}
                                        value={formData.discountedPrice}

                                    />
                                    <div className="flex flex-col items-center">
                                        <p>₹ Discounted Price</p>
                                        <span className='text-xs'>(₹ / month)</span>
                                    </div>
                                </div>
                            )
                        }



                    </div>
                </div>
                <div className="flex flex-col flex-1 ml-5 gap-5">
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be cover ( max 6)</span>
                    </p>
                    <div className="">
                        <input type="file" onChange={(e) => setFiles(e.target.files)} id='images' className='p-3 mb-5 border border-gray-300 rounded w-full' accept='image/*' multiple />
                        <button
                            onClick={handleImageSubmit}
                            disabled={uploading}
                            className='p-3 text-white border bg-green-600 uppercase disabled:opacity-60 hover:border-black rounded-lg'>
                            {uploading ? "uploading . . ." : "upload"}
                        </button>

                        <p className='text-red-600 mt-2 text-sm'>{imageUploadError && imageUploadError}</p>

                        {
                            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (

                                <div key={index} className="flex justify-between my-2 p-1 border items-center">

                                    <img
                                        src={url}
                                        alt='image to upload'
                                        className='w-28 h-28 object-contain rounded-lg ' />

                                    <button
                                        type='button'
                                        onClick={() => handleRemoveImage(index)}
                                        className='p-2 text-red-700 rounded uppercase border border-red-700 hover:shadow-lg'>delete</button>
                                </div>
                            ))
                        }

                    </div>
                    <button
                        disabled={loading || uploading}
                        className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:bg-slate-600 disabled:opacity-80'
                    >{loading ? "Updating . . ." : "Update Listing"}</button>
                    {error && <p className='text-red-600 text-sm self-center'>{"Error : " + error}</p>}
                </div>
            </form>
        </main>
    )
}
