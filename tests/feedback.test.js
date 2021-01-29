// use the path of your model
const Feedback = require('../models/feedback');
const mongoose = require('mongoose');
// use the new name of the database
const url = 'mongodb://localhost:27017/roomtest';
beforeAll(async () => {
 await mongoose.connect(url, {
 useNewUrlParser: true,
 useCreateIndex: true
 });
});
afterAll(async () => {
 await mongoose.connection.close();
});



 describe('testing feedback schema', () => {
     id="";
// the code below is for insert testing
 it('testing feedback', () => {
 const feedback = {
 'name': 'sujan',
 'email': 'sujanrajbharat0@gmail.com',
 'subject': 'testing',
 'feedback': 'Feedback'

 };

 return Feedback.create(feedback)
 .then((list_ret) => {
     id=list_ret._id;
 expect(list_ret.name).toEqual('sujan'),
 expect(list_ret.email).toEqual('sujanrajbharat0@gmail.com'),
 expect(list_ret.subject).toEqual('testing'),
 expect(list_ret.feedback).toEqual('Feedback')
 ;

 });
 });


// update
it('to test the update', async () => {
    return Feedback.updateOne({_id :id},
   {$set : {subject:'updated subject'}})
    .then((feedback)=>{
    expect(feedback.ok).toEqual(1)
    })
   
   });
  
// // the code below is for delete testing
it('delete feedback ', async () => {
    const status = await Feedback.deleteMany();
    expect(status.ok).toBe(1);
   });
})