const port = 5500 || process.env.PORT;

const express = require('express');

const path = require('path');

require("../src/database/connect");

const route = require("../src/routers/route");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public/signup')));

app.use('/user',route);

app.get('/',(req,res) => {
    res.redirect('/user');
});

app.listen(port,()=>{

    console.log(`server runnning at... ${port}`);

});
