const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
    course_title: {
        type: String
    },
    description: {
        type: String
    },
    fee: {
        type: String
    },
    course_img: {
        type: String
    },
    teachers_id:{
        type: String
    },
    ratings:{
        type: Number
    },
    users_ids:{
        type:Array,
        default : []
    }
},{timestamps: true});

const course = mongoose.model('course', courseSchema);
module.exports = course;