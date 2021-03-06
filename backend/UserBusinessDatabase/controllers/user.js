const User = require('../models/user');
const Business = require('../models/business'); 
const Suggestion = require('../models/suggestion');
const Search = require('../models/search');
const Review = require('../models/review'); 
const JWT = require('jsonwebtoken');  
const {JWT_SECRET} = require('../configuration/index'); 
const Engine = require('../recEngine/engine'); 

const e = new Engine(); 

function createToken(user){ 
   return JWT.sign({ 
        iss: 'LOCO', 
        sub: user._id, 
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
} 

exports.signIn = async (req,res,next) => { 
    const token = createToken(req.user); 
    User.findOne({username: req.body.username}) 
    .populate('reviews services') 
    .exec()
    .then((user) => {
        if (!user) {
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ user: user,token: token })
    })
    .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}

exports.signUp = async (req, res, next) => {
    try {
        const searchData = new Search({
        });
        const searchId = await searchData.save(); 

        const foundUser = await User.findOne({username : req.body.user.username}); 
        if(foundUser){ 
            return res.status(403).json({
                error: 'userame already in use',
            });
        }

        const userObj = { ...req.body.user, searchId: searchId._id };
        const user = new User(userObj); 

        await user.encrypt();

        const result = await user.save(); 

        const token = createToken(user);
        
        res.status(201).json({
            message: 'add user success',
            user: result, 
            token: token
        });


    } catch (err) {
        next(err);
    };
}

exports.getUserDataById = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId) 
        .populate('reviews services') 
        .exec()
        .then((user) => {
            if (!user) {
                const error = new Error('Could not find user');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ user: user })
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.deleteUser = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then((user) => {
            if (!user) {
                const error = new Error('Could not find user');
                error.statusCode = 404;
                throw error;
            }
            return User.findByIdAndDelete(userId);
        })
        .then((result) => {
            res.status(200).json({ message: 'deleted', user: result });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updateUserData = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const update = await User.findOneAndUpdate({ _id: userId }, req.body.user, { new: true })

        if (!update) {
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }
         const user = await User.findById(userId);  
         const result = await user.populate('reviews services').execPopulate();
        res.status(200).json({ message: 'updated', user: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


exports.getSuggestions = async (req, res, next) => {
    try {
        const userId = req.params.userId; 
       await e.similars.update(userId); 
       await e.suggestions.update(userId); 
        const suggestions = await Suggestion.findOne({user: userId}).populate('suggestions.business').exec();

        res.status(200).json({ message: 'suggestions', suggestions: suggestions.suggestions });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


