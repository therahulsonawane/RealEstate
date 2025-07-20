import express from 'express'
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyUser.js';
import Listing from '../model/ListingModel.js';
import User from '../model/UserModel.js';

const router = express.Router();

router.post('/create', verifyToken, async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
})

router.get("/list/:id", async (req, res, next) => {
    try {
        const data = await Listing.findById(req.params.id)

        if (!data) return next(errorHandler(404, 'listing not found'))

        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
})

router.delete("/delete/:id", verifyToken, async (req, res, next) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) return next(errorHandler(404, 'Listing not found'))

    if (req.user.id !== listing.userRef) return next(errorHandler(401, "Wrong user"))

    try {
        const deleteList = await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('List is deleted');
    } catch (error) {
        next(error);
    }
})

router.post("/update/:id", verifyToken, async (req, res, next) => {

    const listing = await Listing.findById(req.params.id)

    if (!listing) return next(errorHandler(404, 'Property Does not exist!!'))

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'wrong user trying to edit'))
    }

    try {
        const updateListinfo = await Listing.findByIdAndUpdate(req.params.id, {
            $set: {
                imageUrls: req.body.imageUrls,
                name: req.body.name,
                description: req.body.description,
                address: req.body.address,
                type: req.body.type,
                bedrooms: req.body.bedrooms,
                bathrooms: req.body.bathrooms,
                regularPrice: req.body.regularPrice,
                discountedPrice: req.body.discountedPrice,
                offer: req.body.offer,
                parking: req.body.parking,
                furnished: req.body.furnished,
            }
        },
            { new: true }
        )

        res.status(200).json("Updated Successfully" + updateListinfo)
    } catch (error) {
        next(error)
    }
})

router.get('/listowner/:id', verifyToken, async (req, res, next) => {
    try {

        const listOwner = await User.findById(req.params.id)
        if (!listOwner) return next(errorHandler(404, 'No List owner found'))

        const { password: pass, ...rest } = listOwner._doc
        res.status(200).json(rest)

    } catch (error) {
        next(error);
    }
})

router.get('/get', async (req, res, next) => {
    try {

        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking

        if (parking === undefined || parking === 'false') {
            parking = { $in: [true, false] }
        }

        let type = req.query.type
 
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] }
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';


        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        }).sort(
            { [sort]: order }
        ).limit(limit).skip(startIndex);

        res.status(200).json(listings)



    } catch (error) {
        next(error);
    }
})

export default router