/* NPMs */
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const requestIP = require('request-ip');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const randomstring = require("randomstring");
const { createProxyMiddleware } = require('http-proxy-middleware');
const Buffer = require('buffer').Buffer;
const { Transform } = require('stream');
const { fileURLToPath } = require('url');

dotenv = require('dotenv').config()

/* Other Variables */
const port = process.env.PORT;

/* Paths */
app.use(express.static(path.join(__dirname, 'public')));

/* Set */
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Define the folder where the ejs files will be stored
app.set('views', path.join(__dirname, '/views'));

/* Use */
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}));

/* Get */
// Redirects Users From "/" to "/home"
app.get('/', function(req, res) { res.render("home"); });

app.use('/l/:encodedUrl', (req, res, next) => {
    const key = req.query.key;

    // Check if key is valid, if it isnt or if key doesnt exist it sends message
    if (!key || key !== process.env.TOKEN) {
        return res.status(403).send('You don\'t belong here?');
        // For some reason it works regardless for example.com
    }

    try {
        // Decode Base64-encoded URL
        const encodedUrl = req.params.encodedUrl;
        const targetUrl = Buffer.from(encodedUrl, 'base64').toString('utf-8');

        // Validate URL
        if (!/^https?:\/\//.test(targetUrl)) {
            return res.status(400).send('Invalid URL');
        }

        // Create and use the proxy middleware
        return createProxyMiddleware({
            target: targetUrl,
            changeOrigin: true,
            secure: false,
            pathRewrite: { '^/l': '' },
        })(req, res, next);  // Ensure this line is returning correctly

    } catch (err) {
        console.error("Error decoding URL:", err);  // Log the error for debugging
        return res.status(400).send('Error decoding URL');  // Ensure response is sent
    }
});

app.get('*', function(req, res) { res.redirect("/"); });
app.listen(port, () => { console.log(`Server is running on port http://localhost:${port}`); });