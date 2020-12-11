const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Agileproject',
 { useNewUrlParser: true,
     useUnifiedTopology: true, 
     useFindAndModify: false,
      useCreateIndex: true })
    .then((db) => {
        console.log("Successfully connected to MongodB server");
    }, (err) => console.log(err));
