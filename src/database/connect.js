const  mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/todo-list-data")
.then(()=>{
    console.log('connection to database - success');
})
.catch((e)=>{
    console.log('connection to database - failure',e);
});