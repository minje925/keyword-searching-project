const http = require('http');
const express = require('express');
const ejs = require('ejs');
var path = require('path')

const app = express();
const server = http.createServer(app);


var router_tables = require('./routes/tables')
var router_index = require('./routes/callback_index')
var router_blog = require('./routes/blog')
var router_total = require('./routes/total')
var router_myproducts = require('./routes/myproducts')
var router_category = require('./routes/category')
var router_tempname = require('./routes/temp_name')

app.use('/blog', router_blog)
app.use('/total', router_total)
app.use('/', router_index)
app.use('/myproducts', router_myproducts)
app.use('/category', router_category)
app.use('/temp_name', router_tempname)

const hostname = '192.168.0.8';
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public')); // css를 적용하기 위한 공용폴더, ejs에 적용

//app.get('/tables', router_tables.toAddPage);
//app.get('/blog', router_blog.toAddPage);



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


/* ---------------------------------------------------------------------------*/
/*
var request = require('request');
var utf8 = require('axios')
var CryptoJS = require('crypto-js');
const { callbackify } = require('util');
var method = "GET";
var accessKey = "0100000000ad4ba1cb0d7771a195757e227aed9d61d6c191bfe12c3913b45f08adfb237b63";
var secretKey = "AQAAAACtS6HLDXdxoZV1fiJ67Z1hRnataGZB9c3ikgo+tLU+3A==";
var customer_id = '2267997'

var keyword = "조립식"

var api_url2 = 'https://api.naver.com/keywordstool?hintKeywords='+encodeURIComponent(keyword) // 'https://api.naver.com/keywordstool';
console.log(api_url2)
var api_url = '/keywordstool'

var timestamp = Date.now() + '';

var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
hmac.update(timestamp + '.' + method + '.' + api_url);

var hash = hmac.finalize();
hash.toString(CryptoJS.enc.Base64);
request.get({
    uri: api_url2,
    encodeing:null,
    headers:{
        'X-Timestamp':timestamp,
        'X-API-KEY': accessKey,
        'X-API-SECRET': secretKey,
        'X-CUSTOMER': customer_id,
        'X-Signature': hash.toString(CryptoJS.enc.Base64)
    }
  }, function(err, res, body) {
    //console.log(body)
    let data = JSON.parse(body) //json으로 파싱
    console.log("연관키워드 수 : ", data["keywordList"].length) 
    console.log("test : ", data["keywordList"][0]) 

    key_data = []
    for(var i = 0; i<data["keywordList"].length; i++)
        key_data.push([data["keywordList"][i]["relKeyword"], data["keywordList"][i]["monthlyPcQcCnt"], data["keywordList"][i]["monthlyMobileQcCnt"]])

    console.log("key_data", key_data)
    app.get('/', (req, res) => {
        res.render('index.ejs', {data: key_data});
    });

    
    for(var i =0; i<data["keywordList"].length; i++) {
      console.log(data["keywordList"][i]["relKeyword"]," | ", data["keywordList"][i]["monthlyPcQcCnt"]," | ", data["keywordList"][i]["monthlyMobileQcCnt"])
    }
    
    
})
*/
