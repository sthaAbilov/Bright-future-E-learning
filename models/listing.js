const mongoose = require('mongoose');


const listingSchema = new mongoose.Schema({
    course_name: {
        type: String
    },
    type: {
        type: String
    },
    video_name: {
        type: String
    },
    price: {
        type: String
    },
    file_name: {
        type: String
    },
    details: {
        type: String
    },
    facilities: {
        type: String
    },
    booking_status: {
        type: Boolean,
        default:false
    },
    image_name: {
        type: String
    },
    description: {
        type: String
    },
    userId: {
        type: String
    },
    booked_by: {
        type: String
    },
    approved_status: {
        type: String
    },

});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;