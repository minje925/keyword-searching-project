
// BASE_URL = 'https://api.naver.com'
// API_KEY = '0100000000ad4ba1cb0d7771a195757e227aed9d61d6c191bfe12c3913b45f08adfb237b63'
// SECRET_KEY = 'AQAAAACtS6HLDXdxoZV1fiJ67Z1hRnataGZB9c3ikgo+tLU+3A=='
// CUSTOMER_ID = '2267997'
/*
window.addEventListener('DOMContentLoaded', event => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
      // Uncomment Below to persist sidebar toggle between refreshes
      // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
      //     document.body.classList.toggle('sb-sidenav-toggled');
      // }
      sidebarToggle.addEventListener('click', event => {
          event.preventDefault();
          document.body.classList.toggle('sb-sidenav-toggled');
          localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
      });
  }
});

*/

/*
var client_id = "Oi6e85tRU0W5d9M2CAu0"
var client_secret = "TSpaZPOVqN"
//var api_url = 'https://openapi.naver.com/v1/datalab/search'
var api_url = "https://openapi.naver.com/v1/search/shop?query="
var query = "&display=1&start=1&sort=sim"

const option = {
    query  :'홍삼',
    start  :1,
    display:3,
    sort   :'sim'
}

request.get({
    uri: api_url,
    qs : option,
    headers:{
      'X-Naver-Client-Id':client_id,
      'X-Naver-Client-Secret':client_secret
    }
  }, function(err, res, body) {
    console.log(body)
    let json = JSON.parse(body) //json으로 파싱
    console.log(json)
})
*/
/* ----------------------------------------------------------------------------- */
var request = require('request');
var utf8 = require('axios')
var CryptoJS = require('crypto-js');
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
    /*
    for(var i =0; i<data["keywordList"].length; i++) {
      console.log(data["keywordList"][i]["relKeyword"]," | ", data["keywordList"][i]["monthlyPcQcCnt"]," | ", data["keywordList"][i]["monthlyMobileQcCnt"])
    }
    */
    console.log("연관키워드 수 : ", data["keywordList"].length)
    
})

/*
var express = require('express')
var keyword_app = express()

keyword_app.set('views', __dirname + '/views');
keyword_app.set('view engine', 'ejs');

var clubList = {
  //클럽목록
  list : function(req, res){

    //res.send('club list');
    res.render('../views/tables', {data : 'testData list ejs'});
  }
};

module.exports = clubList;
*/
/*
var express = require('express');
var CryptoJS = require('crypto-js');
var app = express();


console.log("??")
    var method = "GET";
    var api_url = "/keywordstool";
    var timestamp = Date.now() + '';
    var accessKey = "0100000000ad4ba1cb0d7771a195757e227aed9d61d6c191bfe12c3913b45f08adfb237b63";
    var secretKey = "AQAAAACtS6HLDXdxoZV1fiJ67Z1hRnataGZB9c3ikgo+tLU+3A==";

  
    var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(timestamp + '.' + method + '.' + api_url);
  
    var hash = hmac.finalize();
    hash.toString(CryptoJS.enc.Base64);
  
    const request = require('request');
    const options = {
      url: 'https://api.naver.com/keywordstool?hintKeywords=' + encodeURI(req.query.hintKeywords) + '&showDetail=1',
      headers: {'X-Timestamp':timestamp, 'X-API-KEY': accessKey, 
                'X-API-SECRET': secretKey, 'X-CUSTOMER': "2267997", 'X-Signature': hash.toString(CryptoJS.enc.Base64)}
        };
      request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
          res.end(body);
          console.log("성공")
        } else {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
          console.log(error)
        }
      });


      */