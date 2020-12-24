require ('./db/db');
const User = require('./models/user');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
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
        return cb(new Error("You can upload only image files!"), false);
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

app.listen(PORT, function(err){ 
    if (err) console.log("Error in server setup") 
    console.log("App is running at localhost", PORT); 
}) 