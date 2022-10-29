const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/todo-list-data");

//declaring schema

const schema = mongoose.Schema({
    username:{
        
        required:true,
        type:String,
        unique:true

    },
    password:{
        required:true,
        type:String
    },
    userdata:{
        type:Array
    },
    token:{
        type:String
    }

});

//creating a collection

const db = mongoose.model("userdatas",schema);
module.exports = db;