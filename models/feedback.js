const mongoose = require('mongoose');


const feedbackSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    subject: {
        type: String
    },
    feedback: {
        type: String
    }

});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;