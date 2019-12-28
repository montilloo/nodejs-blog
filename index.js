const koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const dealUpload = require('./upload');
const dbAPI = require('./db');
const router = require('./routes');
const app = new koa();


app.use(bodyParser());
app.use(router.routes());
app.use(serve(`${__dirname}/static/html`, {
    extensions: ['html']
}));

app.use(views(`${__dirname}/static/html`, {
    extension: 'ejs'
}));

app.listen(3000);