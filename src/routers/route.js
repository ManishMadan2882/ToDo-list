require('dotenv').config();


const con = process.env;

const express = require('express');

const path = require('path');

const router = express.Router();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const db = require('../schemadb/scheme');

const auth  = require('../middleware/auth');

const secret_key =process.env.SECRET_KEY;

router.use(express.json({limit:'100kb'}));
router.get('/',(req,res) => {
    
    res.sendFile(path.join(__dirname, '../../public/user/index.html'));
}); 
router.get("/auth", auth, (req, res) => {
    res.json("Welcome 🙌 ");
  });

router.get('/register',(req,res) =>{
    res.sendFile(path.join(__dirname, '../../public/signup/index.html'));
    //res.send("1-4-8-3-6-9 Representing ABQ whats up Biatch !");
});
//route to get usr list

router.get('/api/userdata',auth,async (req,res) => {
    try
    {
        const username = req.user.username;
        const usr = await db.findOne({username : username});
       
        res.status(200).json({
         userdata : usr.userdata,
         username : username
        });  
    }
    catch(err){
     res.status(404).json('not found');
    }
});
//user data update route
router.patch('/api/userdata',auth,async (req,res) => {
    try
    {
        const username = req.user.username;
        const li = {userdata :  req.body.userdata};
       const usr = await db.findOneAndUpdate({username : username},li,{
            new : true
        });
        res.status(200).send(usr);  
    }
    catch(err){
     res.status(404).json('not found');
    }
});

router.get('/login',(req,res) =>{

    res.sendFile(path.join(__dirname, '../../public/login/index.html'));

});

router.get('/register',(req,res) => {

    res.sendFile(path.join(__dirname, '../../public/signup/index.html'));

});
router.post('/register',async (req,res)=>{
    try{
        console.log(req.body);
       const username = req.body.username;

       const pwd1 = await bcrypt.hash(req.body.password, 4);
       
       const newUser = new db({
           username: username,
           password : pwd1
         });
         const registered = newUser.save((err) => {
             console.log(err);
         });
         res.json(registered);
       //  res.redirect('../login');
     }
     catch(error){
        console.log(error);
       res.status(400).json(error);
     } 
     
   }
);
//login api to authenticate details
router.post( '/cred' , async (req,res) => {
    try
    {

        const user = req.body.username;

        const pwd = req.body.password;
        
        const creds = await db.findOne({username:user});
        
        const authen = await bcrypt.compare(pwd,creds.password);

        if(authen)
        {
            
            const token = jwt.sign({username:user},secret_key); 
      
            res.cookie("code",token)

            res.status(200).json({message : authen});
      
        }
        else
        {

            res.status(403).json({ message : "auth failure"})
     
        }
    }
    catch(error) {
        
        console.log(error);

        res.status(400).json({message: "not found"})
 
    }
})
module.exports = router;