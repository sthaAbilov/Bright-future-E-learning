// use the path of your model
const Listing = require('../models/listing');
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



 describe('Listing Schema test anything', () => {
    id='';
// the code below is for insert testing
 it('Add Listing testing anything', () => {
     
 const listing = {
 'place_name': 'dhulikhel room booking',
 'city': 'dhulikhel',
 'streetName': 'banepa',
 'price': '7000',
 'no_of_rooms': 6,
 'no_of_persons': 6,
 'food_type': 'Non- Veg',
 'facilities': 'good facilities',
 'description': 'Very Long Description',

 };

 return Listing.create(listing)
 .then((list_ret) => {
     id=list_ret._id;
 expect(list_ret.place_name).toEqual('dhulikhel room booking'),
 expect(list_ret.city).toEqual('dhulikhel'),
 expect(list_ret.streetName).toEqual('banepa'),
 expect(list_ret.price).toEqual('7000'),
 expect(list_ret.no_of_rooms).toEqual(6),
 expect(list_ret.no_of_persons).toEqual(6),
 expect(list_ret.food_type).toEqual('Non- Veg'),
 expect(list_ret.facilities).toEqual('good facilities'),
 expect(list_ret.description).toEqual('Very Long Description')
 
 ;

 });
 });


// update
it('to test the update', async () => {
    return Listing.updateOne({_id :id},
   {$set : {streetName:'buspark'}})
    .then((listing)=>{
    expect(listing.ok).toEqual(1)
    })
   
   });
  
// // the code below is for delete testing
it('to test the delete listing is working or not', async () => {
    const status = await Listing.deleteMany();
    expect(status.ok).toBe(1);
   });
})