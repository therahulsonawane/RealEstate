import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyUser.js';

import User from '../model/UserModel.js';
import Listing from '../model/ListingModel.js';

const oneFifty = 1000 * 60 * 60 * 24 * 150;

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const { username, email, password } = req.body
    try {

        const hashPass = bcrypt.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashPass })
        await newUser.save();
        res.status(200).json('User Created Successfully');

    } catch (error) {
        next(error)
    }
})

router.post("/signin", async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, "User Not Found"))

        const passOk = bcrypt.compareSync(password, validUser.password);
        if (!passOk) return next(errorHandler(401, "Wrong Password"))

        const token = jwt.sign({ id: validUser._id, email: validUser.email }, process.env.JWT_SECRET, { expiresIn: '10d' })
        const { password: pass, ...rest } = validUser._doc;

        res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: true,
                maxAge: oneFifty
            })
            .status(200)
            .json(rest)

    } catch (error) {
        next(error)
        console.log(error);
    }
})

router.post('/google', async (req, res, next) => {
    const { email, username, avatar } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true, maxAge: oneFifty })
                .status(200)
                .json(rest)
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("_").toLowerCase() + "_" + Math.random().toString(36).slice(-4),
                email: email,
                password: hashPassword,
                avatar: avatar
            })
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, { httpOnly: true, maxAge: oneFifty })
                .status(200)
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
})

router.post('/update/:id', verifyToken, async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "Unauthorized User"))
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })

        const { password, ...rest } = updateUser._doc

        res.status(200).json(rest)
    } catch (error) {
        next(error);
    }
})

router.delete("/delete/:id", verifyToken, async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'Can not delete!! Wrong Credencials'))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200).json("User Has Been Deleted")
    } catch (error) {
        next(error);
    }
})

router.get("/signout", async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json("User has been signout");
    } catch (error) {
        next(error)
    }
})

router.get("/getuserlisting/:id", verifyToken, async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }

    } else {
        return next(errorHandler(401, "Its not your listing"))
    }
})

router.get("/all", async (req, res) => {
    const users = await User.find();

    res.json(users);
})

export default router;