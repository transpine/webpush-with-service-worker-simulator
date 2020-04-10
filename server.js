var webpush = require('web-push');
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

const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
    'mailto:transpine@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.get('/push/key', function(req, res){
    console.log(`publick key sent: ${vapidKeys.publicKey}`);
    res.send({
        key: vapidKeys.publicKey
    });
});

const temp_subs = [];
app.post('/push/subscribe', function(req, res){
    temp_subs.append(req.body.subscription);
    console.log(req.body);

    res.send('Success');
});

app.post('/push/notify', function(req, res){
    let payload = {};
    payload.title = req.body.title;
    payload.message = req.body.message;

    for(const subs in temp_subs){
        webpush.sendNotification(subs, JSON.stringify(payload))
        .then(function (response) {
            console.log('sent notification');
            res.sendStatus(201);
        });
    }
});

https.createServer(options, app).listen( port, () => {
    console.log(`webpush server running, port:${port}`);
});