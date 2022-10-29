require('dotenv').config();

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
        res.status(200).send(usr.userdata);  
    }
    catch(err){
     res.status(404).json('not found');
    }
});

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
       const username = req.body.username;

       const password =  await bcrypt.hash(req.body.password,4);
       
       const newUser = new db({
           username:username,
           password: password,
           
         })
         //res.cookie("code",token);
         const registered = await newUser.save();
         res.json("newUser");
         res.redirect('../login');
     }
     catch(error){
       res.status(400).send(error);
     } 
     
   }
);
router.post( '/cred' , async (req,res) => {
    try
    {
        const user = req.body.username;

        const pwd = req.body.password;
        
        const creds = await db.findOne({username:user});

        const authen = bcrypt.compare(pwd,creds.password);

        if(authen)
        {
            const token = jwt.sign({username:username},secret_key); 
            res.json({message : token});
            res.redirect('../');
        }
        else
        {
            res.json({ message : "auth failure"})
            res.redirect('/')
        }
    }
    catch(error) {

        res.send('not found');
 
    }
})
module.exports = router;