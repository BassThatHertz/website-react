const proxy=require('http-proxy-middleware');
module.exports = function(app) {
    app.use(proxy('/',{target:'http:127.0.0.1:5000'}))
    app.use(proxy('/conversions',{target:'http://127.0.0.1:5000/conversions'}))
}