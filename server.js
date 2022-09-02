const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const apiRouter = require('./Routers/ApiRouter');
const apiController = require('./Routers/ApiController');
const apiFilter = require('./Routers/ApiFilter');
const port = parseInt(process.env.PORT, 10) || 3000;

const dev = process.env.NODE_ENV !== 'production';
//const dev = false;

console.log("dev : " + dev);
console.log("NODE_ENV : " + process.env.NODE_ENV);
console.log("PORT : " + process.env.PORT);
console.log("Running server in ", dev ? "developement" : "production", " mode");
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    server.use(cookieParser());
    server.use('/api', apiFilter.middleware, apiRouter);
    server.use('/api', apiFilter.middleware, apiController);
    server.get('*', (req, res) => handle(req, res));
        server.listen(port, (err) => {
        if (err) throw err;
        console.log(`🤘 http://localhost:${port}`);
    });
}); 

//"deploy-production": "NODE_ENV=production next build && NODE_ENV=production node ./server.js"  --> Package.json -- Linux flavours
//"deploy-production": "SET NODE_ENV=production next build & node server.js"  --> Package.json -- for for Windows