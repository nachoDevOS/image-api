const express = require('express');
const app = express();
const http = require('http');
var fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

require('dotenv').config()

const filesDir = './public';
const URL = process.env.APP_DOMAIN;
const PORT = process.env.APP_PORT;
const ENV = process.env.APP_ENV;

// const server = http.createServer(app);

const server = ENV == 'dev' ? http.createServer(app) : http.createServer(app, {
    key: fs.readFileSync(`/etc/letsencrypt/live/${URL}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${URL}/fullchain.pem`)
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', async (req, res) => {
    res.json({status:1, message: 'Welcome to ImagesGenerator!'});
});

app.get('/generate', async (req, res) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 512,
        height: 0,
        deviceScaleFactor: 1,
    });

    if (!fs.existsSync(filesDir)){
        fs.mkdirSync(filesDir);
    }

    const website_url = req.query.url ? req.query.url : process.env.URL_DEV;

    // Open URL in current page  
    await page.goto(website_url, { waitUntil: 'networkidle0' });
	
	await page.evaluate(() => {
		window.scrollBy(0, window.innerHeight);
	});

    const fileName = new Date().getTime();
	
	await page.screenshot({
		path: `${__dirname}/public/${fileName}.png`,
		fullPage: true
	});
	
	await browser.close();

    // Registrar en los logs
    const date = new Date().toJSON();
    registerLog('generate.log', `{"url": "${website_url}", "date": "${date}"}\n`);
    
    res.json({url: `${URL}:${PORT}/${fileName}.png`});
});

function registerLog(file, text) {
    try {
        fs.writeFile(path.join(__dirname, '/', file), text, {flag: 'a+'}, err => {
            if (err) {
              console.error(err);
            }
        });
    } catch (err) {
        console.error(err);
    }
}

server.listen(PORT, () => {
    console.log(`App escuchando el puerto ${PORT}`)
});