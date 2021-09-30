var express = require('express');
var router = express.Router();
var path = require('path')
var request = require('request');
var utf8 = require('axios')
var CryptoJS = require('crypto-js');
const { callbackify } = require('util');



var method = "GET";
var accessKey = "0100000000ad4ba1cb0d7771a195757e227aed9d61d6c191bfe12c3913b45f08adfb237b63";
var secretKey = "AQAAAACtS6HLDXdxoZV1fiJ67Z1hRnataGZB9c3ikgo+tLU+3A==";
var customer_id = '2267997'

var keyword = ""

var api_url2 = 'https://api.naver.com/keywordstool?hintKeywords='+encodeURIComponent(keyword) // 'https://api.naver.com/keywordstool';
console.log(api_url2)
var api_url = '/keywordstool'

var timestamp = Date.now() + '';
var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
hmac.update(timestamp + '.' + method + '.' + api_url);
var hash = hmac.finalize();
hash.toString(CryptoJS.enc.Base64);

key_data = []
function start() {
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
    if(err == null) {
      for(var i = 0; i<data["keywordList"].length; i++)
        key_data.push([data["keywordList"][i]["relKeyword"], data["keywordList"][i]["monthlyPcQcCnt"], data["keywordList"][i]["monthlyMobileQcCnt"], data["keywordList"][i]["monthlyPcQcCnt"] + data["keywordList"][i]["monthlyMobileQcCnt"]])
      }
  })
}

router.get('/', (req, res) => {
  keyword = req.param("keydata")
  console.log(keyword)

  api_url2 = 'https://api.naver.com/keywordstool?hintKeywords='+encodeURIComponent(keyword)
  timestamp = Date.now() + '';
  hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(timestamp + '.' + method + '.' + api_url);
  hash = hmac.finalize();
  hash.toString(CryptoJS.enc.Base64);

  start()
  res.render('index.ejs', {data: key_data}, {clickHandler: clickHandler});
  
});


module.exports = router;
