const express = require('express');
const https = require('https');
const fs = require('fs');

var cors = require('cors'); 

const port = process.env.PORT || 4999;

const app = express();

app.use(cors());    //cross origin 허용
app.use(express.json());    //json사용
app.use(express.urlencoded({ extended: true})); //body-parse사용

app.get('/', (req, res) =>{
    res.send("Web Push Server");
});

const options = {
    cert: fs.readFileSync('localhost.pem'),
    key: fs.readFileSync('localhost-key.pem')
};  

https.createServer(options, app).listen( port, () => {
    console.log(`webpush server running, port:${port}`);
});