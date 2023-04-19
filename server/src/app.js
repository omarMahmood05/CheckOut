
const express = require ('express');
const app = express ();
const hbs = require ('hbs');


const path = require('path');


require('./dataBase/db');



const mongoose = require ('mongoose');


 const User = mongoose.model('User', {
    Firstname : {
        type: String,
        required: true
    },
    Lastname : {
        type: String,
        required: true
    },
    Email : {
        type: String,
        required: true,
        unique: true,
    },
    Gender : {
        type: String,
        required: true
    },
    PhoneNumber :{
        type: Number,
        required: true,
        unique: true
    },
    Password :
    {
        type: String,
        required: true,
    },
    ConfirmPassword :
    {
        type: String,
        required: true,
    }
 })

const port = process.env.PORT || 3000


const static_path = path.join(__dirname, '../public')
const templates_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


app.get("/", (req,res)=>{
    res.render('index')
})

app.get("/signup", (req,res) =>{
    res.render('signup')
})

app.post("/signup", async(req,res) =>{
   
//    if( !name || !email || !phonenumber || !password || !confirmpassword){
//     return res.status(422).json({error : 'please fill the form properly'})
//    }
   try{
       const user = new User({
        Firstname : req.body.firstname,
        Lastname : req.body.lastname,
        Email : req.body.email,
        Gender : req.body.gender,
        PhoneNumber :req.body.phonenumber,
        Password : req.body.password,
        ConfirmPassword : req.body.confirmpassword
       })
       await user.save();
       res.status(201).json({message : 'saved'})

   }
   catch(error){
    res.send(error)
    console.log(error)
   }
   

})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}` );
})