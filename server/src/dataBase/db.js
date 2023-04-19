
const mongoose = require ('mongoose');


const url = 'mongodb+srv://sruti:sruti28@cluster0.b8jue1w.mongodb.net/Signup?retryWrites=true&w=majority'
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>console.log('connection successful'))
  .catch((err)=>console.log(err));