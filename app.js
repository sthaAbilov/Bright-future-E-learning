require ('./db/db');
const Comment = require('./models/comment');
const User = require('./models/user');
const Listing = require('./models/listing');
const Feedback = require('./models/feedback');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const auth = require('./middleware/auth');
const path = require('path');

const app = express();
var PORT = 8080; 
app.use(express.json());
app.use(cors());


app.use('/uploads', express.static('./public/uploads'));
app.use(bodyParser.urlencoded({
    extended: false
}));

/*------------------------image upload api-------------------*/

//uploads image
var storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, file.fieldname + '-' + Date.now() + ext);
    }
});


//validations
var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|gif)$/)) {
        return cb(new Error("You can upload only video files!"), false);
    }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 1000000
    }
});

//uploads image
app.post('/upload', upload.single('imageFile'), (req, res) => {
    res.json(req.file);
});


/*------------------------file upload api-------------------*/

//file image
var storage = multer.diskStorage({
    destination: './public/files',
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, file.fieldname + '-' + Date.now() + ext);
    }
});


//validations
var fileFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(doc|docs|pdf|ppt)$/)) {
        return cb(new Error("You can upload only  files!"), false);
    }
    cb(null, true);
};

var file = multer({
    storage: storage,
    fileFilter: fileFileFilter,
    limits: {
        fileSize: 1000000
    }
});

//video 
app.post('/file', upload.single('fileFile'), (req, res) => {
    res.json(req.file);
});


/*------------------------video upload api-------------------*/

//video 
var storage = multer.diskStorage({
    destination: './public/videos',
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, file.fieldname + '-' + Date.now() + ext);
    }
});


//validations
var videoFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|webm|ogg|gif)$/)) {
        return cb(new Error("You can upload only image files!"), false);
    }
    cb(null, true);
};

var video = multer({
    storage: storage,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 1000000
    }
});

//video 
app.post('/video', upload.single('videoFile'), (req, res) => {
    res.json(req.file);
});



/*---------Register user API--------------*/
/*---------------------Register User API------------------------------*/
app.post("/registeruser", (req, res) => {
    User.find({
            username: req.body.username
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(201).json({
                    message: "username already exists"
                });
            } else {
                var user = new User(req.body);
                user.save().then(function (user) {
                        res.status(201).json({
                            message: "User Registered"
                        })
                    })
                    .catch(function (err) {
                        res.status(500).json({
                            message: err
                        });
                    });
            }
        }).catch(function (err) {
            res.status(500).json({
                message: err
            });
        });
});
/*----------------END-----Register User API------END-------------------*/

/*-----------------------------Login API-------------------------------*/
app.post("/login", async function (req, res) {

    if (req.body.username == "") {
        res.json({
            message: "Username is empty"
        });
    } else if (req.body.password == "") {
        res.json({
            message: "password is empty"
        });
    } else {
        try {
            const user = await User.checkCrediantialsDb(req.body.username, req.body.password);
            var user_type = user.user_type;
            var id = user._id;
            var username = user.username;
            if (user) {
                const token = await user.generateAuthToken();
                res.send({
                    token,
                    user_type,
                    id,
                    username
                });

            } else {
                res.json({
                    message: "User not found"
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

});
/*-------------------END-----Login API----END---------------------------*/

/*---------------Add Listing(Add course by host user ) API----------------*/
app.post("/addListings", auth, (req, res) => {

    var listings = new Listing(req.body);
    listings.save().then(function (listings) {
        res.status(201).json({
            message: "Listing Added Successfully"
        })
    }).catch(function () {
        res.send(e);
    });

});
/*-------------------END-------Add Listing API------END-------------------*/


/*-----------------------User/me or Dashboard API--------------------------*/
app.get('/dashboard', auth, function (req, res) {
    console.log("We are here")
    res.send(req.user);
});
/*----------------------END---- Dashboard API-----END----------------------*/

/*--------------------------------Logout User API---------------------------------------*/
app.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
});
/*---------------------------END------logout User API-----END---------------------------*/


/*-------------------------------Logout User All Devices API-----------------------------*/
app.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
});
/*---------------------END-------Logout User All Devices API------END---------------------*/


/*---------------------Get Single Listings by ID  API-----------------------*/
app.get('/fetchOne/:id', function (req, res) {
    var listingsID = req.params.id.toString();

    Listing.find({
        _id: listingsID
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});
/*----------------END-----Get Single Listings by ID  API-----END------------*/

/*---------------------Get Single Listings by USER  API------------------------*/
app.get('/fetchlisting/:id', function (req, res) {
    var userID = req.params.id.toString();

    Listing.find({
        userId: userID
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });

});
/*----------------END-----Get Single Listings by USER  API-------END------------*/


/*----------------------Get Bookings of particular User API---------------------------*/
app.get('/mybookings/:username', function (req, res) {
    var username = req.params.username.toString();

    Listing.find({
        booked_by: username
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});
/*-----------------------END-------Get Bookings API------END--------------------------*/


/*--------------------------Count  by USER  API--------------------------*/
app.get('/countList/:id', function (req, res) {
    var userID = req.params.id.toString();

    Listing.find({
        userId: userID
    }).count(function (err, count) {

        res.json({
            count
        });
    });
});
/*----------------------END----Count Listings by USER  API----END-----------------*/

/*----------------------------Booking Enquiries API--------------------------------*/
app.get('/fetchunapproved/:id', function (req, res) {
    var userID = req.params.id.toString();
    var status = false;

    Listing.find({
        userId: userID,
        approved_status: status
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});
/*------------------END------Booking Enquiries API-------END------------------------*/

/*---------------------------------Search course API---------------------------------*/
app.post('/search', function (req, res) {
    var city = req.body.city;
    var price = req.body.price;
    var food_type = req.body.food_type;

    Listing.find({
        'city': new RegExp(city, 'i'),
        'booking_status': false,
        'approved_status': "",
        'price': new RegExp(price, 'i'),
        'food_type': new RegExp(food_type, 'i')

    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});
/*------------------------END--------Search Listings API------END-----------------------*/



/*-------------------------------Get User Detail By ID API---------------------------*/
app.get('/getUser/:id', function (req, res) {
    var id = req.params.id.toString();

    User.find({
        _id: id
    }).then(function (user) {
        res.send(user);

    }).catch(function (e) {
        res.send(e);
    });
});
/*-----------------------END------Get User Detail By ID API------END------------------*/

/*---------------------Update Listings by ID  API----------------------------*/
app.put('/updateListing/:id', auth, function (req, res) {
    listingId = req.params.id.toString();

    Listing.findByIdAndUpdate(listingId, req.body, {
        new: true
    }).then(function (listing) {
        res.send(listing);
    }).catch(function (e) {
        res.send(e);
    });
});
/*----------------END-----Update Listings by ID  API-------END----------------*/

/*----------------------------Booking Enquiries API--------------------------------*/
app.get('/fetchunapproved/:id', function (req, res) {
    var userID = req.params.id.toString();
    var status = false;

    Listing.find({
        userId: userID,
        approved_status: status
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});
/*------------------END------Booking Enquiries API-------END------------------------*/

/*-----------------------Count Booking Enquiries API--------------------------------*/
app.get('/countEnquiries/:id', function (req, res) {
    var userID = req.params.id.toString();
    var status = false;

    Listing.find({
        userId: userID,
        approved_status: status
    }).count(function (err, count) {

        res.json({
            count
        });
    });
});
/*----------------------END----Count Booking Enquiries API------END------------------*/

/*---------------------------Delete course By User API----------------------------*/
app.delete('/deleteListing/:id', auth, function (req, res) {
    Listing.findByIdAndDelete(req.params.id).then(function (listing) {
        res.json({
            message: "Deleted Successfully"
        })
    }).catch(function () {
        res.send(e);
    });
});
/*------------------END------Delete Listings By User API-----END---------------------*/


/*--------------------Get Listings (for user) API-------------------------*/
app.get('/getListings', function (req, res) {
    Listing.find({
        booking_status: false,
        approved_status: ""
    }).then(function (listing) {
        res.send(listing);
    }).catch(function (e) {
        res.send(e);
    });
});
/*--------------------END-----Get Listings API------END-------------------*/

/*--------------------------------Post Comment API----------------------------------------*/
app.post('/comment', auth, function (req, res) {
    var date = new Date();
    data = {
        'listingId': req.body.listingId,
        'comment': req.body.comment,
        'Userid': req.user._id,
        'date': date
    }

    var comment = new Comment(data);
    comment.save().then(function () {
        res.send({
            message: "Succesfull"
        })
    });
});
/*---------------------------END--------Post Comment API-------END-----------------------*/

/*-----------------------------Update Comment Data API------------------------------------*/
app.put('/updatecommentdata/:id', auth, function (req, res) {

    cid = req.params.id.toString();
    Comment.findByIdAndUpdate(cid, {
        comment: req.body.comment
    }, {
        new: true
    }, (err, user) => {
        res.send({
            message: "succesfull"
        });

    })
})
/*-------------------------END------Update Comment Data API------END---------------------*/


/*------------------------------Delete Comment Data API--------------------------------*/
app.delete('/deletecommentdata/:id', auth, function (req, res) {
    uid = req.params.id.toString();
    Comment.findByIdAndDelete(uid).then(function () {
        res.send({
            message: "succesfull"
        })
    })

})
/*-------------------------END------Delete Comment Data API-----END--------------------*/

/*----------------------------Get User Detail By username API------------------------*/
app.get('/fetchuser/:id', function (req, res) {
    var username = req.params.id.toString();

    User.find({
        username: username
    }).then(function (user) {
        res.send(user);

    }).catch(function (e) {
        res.send(e);
    });
});
/*--------------------END------Get User Detail By username API-------END--------------*/

/*--------------------------------Update User Detail API-----------------------------*/
app.put('/updateUser/:id', auth, function (req, res) {
    user_id = req.params.id.toString();

    User.findByIdAndUpdate(user_id, req.body, {
        new: true
    }).then(function (user) {
        res.send(user);
    }).catch(function (e) {
        res.send(e);
    });
});
/*-------------------END-------Update User Detail API------END------------------------*/

/*---------------------------Delete User API----------------------------*/
app.delete('/deleteUser/:id', auth, function (req, res) {
    Listing.findByIdAndDelete(req.params.id).then(function (listing) {
        res.json({
            message: "Deleted Successfully"
        })
    }).catch(function () {
        res.send(e);
    });
});
/*------------------END------Delete  User API-----END---------------------*/


/*----------------------------------Get Comment Data API----------------------------------*/
app.get('/getcommentdata/:id', auth, function (req, res) {
    listingId = req.params.id.toString();
    console.log(listingId)
    Comment.find({
            listingId: listingId
        })
        .populate('Userid')
        .exec()
        .then(function (docs) {

            if (docs) {
                res.json({
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            listingId: doc.listingId,
                            comment: doc.comment,
                            date: doc.date,
                            Userid: doc.Userid
                        };
                    })
                })

            }

        })
})
/*----------------------------END------Get Comment Data API-------END---------------------*/

/*-------------------------------Get Single Comment Data API------------------------------*/
app.get('/getSingleComment/:id', function (req, res) {
    var comment_id = req.params.id.toString();
    console.log(comment_id);
    Comment.find({
        _id: comment_id
    }).then(function (comment) {
        res.send(comment);

    }).catch(function (e) {
        res.send(e);
    });
});
/*-----------------------END------Get Single Comment Data API------END--------------------*/

/*--------------------------------Feedback API-----------------------------------------*/
app.post("/feedback", (req, res) => {

    var feedback = new Feedback(req.body);
    feedback.save().then(function (feedback) {
        res.status(201).json({
            message: "Your feedback is sucessfully passed"
        })
    }).catch(function () {
        res.send(e);
    });

});
/*-------------------------END------Feedback API------END------------------------------*/








app.listen(PORT, function(err){ 
    if (err) console.log("Error in server setup") 
    console.log("App is running at localhost", PORT); 
})
