// use the path of your model
const User = require('../models/user');
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
describe('User Schema test anything', () => {
    id='';
// the code below is for insert testing
 it('Register User testing anything', () => {
 const user = {
 'first_name': 'Sujan',
 'last_name': 'Rajbharat',
 'username': 'sujan1',
 'password': 'sujan1',
 'phone_no': '9860708944',
 'permanent_address': 'dhulikhel',
 'email': 'sujanrajbharat0@gmail.com',
 'user_type': 'user',
 'gender': 'male',

 };

 return User.create(user)
 .then((user_ret) => {
     id=user_ret._id;
 expect(user_ret.first_name).toEqual('Sujan'),
 expect(user_ret.last_name).toEqual('Rajbharat'),
 expect(user_ret.username).toEqual('sujan1'),
 expect(user_ret.password).toEqual('sujan1'),
 expect(user_ret.phone_no).toEqual('9860708944'),
 expect(user_ret.permanent_address).toEqual('dhulikhel'),
 expect(user_ret.email).toEqual('sujanrajbharat0@gmail.com'),
 expect(user_ret.user_type).toEqual('user'),
 expect(user_ret.gender).toEqual('male')
 
 ;

 });
 });
 // update
 it('to test the update', async () => {
     return User.updateOne({_id :id},
    {$set : {first_name:'Simon'}})
     .then((user)=>{
     expect(user.ok).toEqual(1)
     })
    
    });
   
 // // the code below is for delete testing
 it('to test the delete listing is working or not', async () => {
     const status = await User.deleteMany();
     expect(status.ok).toBe(1);
    });

})