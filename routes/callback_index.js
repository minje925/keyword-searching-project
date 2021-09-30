var express = require('express');
var router = express.Router();
var path = require('path')
var request = require('request');
var utf8 = require('axios')
var CryptoJS = require('crypto-js');
const { rejects } = require('assert');
const cheerio = require('cheerio'); // 웹크롤링을 위한 라이브러리
const { resolve } = require('path');
const moment = require('moment');

// API 요청을 위한 정보
var method = "GET";
var accessKey = "0100000000ad4ba1cb0d7771a195757e227aed9d61d6c191bfe12c3913b45f08adfb237b63";
var secretKey = "AQAAAACtS6HLDXdxoZV1fiJ67Z1hRnataGZB9c3ikgo+tLU+3A==";
var customer_id = '2267997'
var api_url = '/keywordstool'

// 새로운 promise가 만들어질 때는 excute가 바로 실행된다 => 불필요한 네트워크 호출이 된다.
router.get('/', (req, res) => {
    //crol_data = [[],[]];
    key_data = [];

    const KeyPromise = new Promise((resolve, reject)=>{
        // 키워드에 대한 GET 요청을 받음 - 검색버튼 클릭 시
        //keyword = req.param("keydata");
        keyword = req.query['keydata'];
        //keyword = keyword.replace(/\s/gi, "");  
        // 공백을 제거해야 요청이 가능함.
        // 키워드를 입력하지 않을 때 ""에 대한 요청을 함
        if(keyword == undefined)
            keyword = ""
        else 
            keyword = keyword.replace(/\s/gi, "");
        ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
        
        var m = moment();
        //var now = Date();
        console.log(m.format("["+'YYYY/MM/DD h:mm:ss') +"] - '"+ip+"'에서 '"+keyword+"'에 대한 연관키워드 요청");
        var api_url2 = 'https://api.naver.com/keywordstool?hintKeywords='+encodeURIComponent(keyword)+'&showDetail=1';
       
        key_data = [];
    
        // 요청을 위한 정보를 만드는 것
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
            let data = JSON.parse(body) //json으로 파싱
            //console.log(body);
            if(err == null) {
              if(data["keywordList"].length == 0)
                key_data.push([0, 0, 0, 0, 0, 0, 0]);
              for(var i = 0; i<data["keywordList"].length; i++) {
                key_data.push([data["keywordList"][i]["relKeyword"],
                data["keywordList"][i]["monthlyPcQcCnt"],
                data["keywordList"][i]["monthlyMobileQcCnt"],
                data["keywordList"][i]["monthlyPcQcCnt"] + data["keywordList"][i]["monthlyMobileQcCnt"],
                data["keywordList"][i]["monthlyAvePcCtr"],
                data["keywordList"][i]["monthlyAveMobileCtr"],
                data["keywordList"][i]["compIdx"],
                data["keywordList"][i]["plAvgDepth"]]
                );
              }
              resolve(key_data);
              keyword = "";
            } 
            else {
              
            }
            //resolve(key_data);
            
        })
    })
    .then(value => {
      //res.render('index.ejs', {data: value});
      return Crol_request(value);
    })
    .then(value => {
      c_data = value[0];
      k_data = value[1];

      max_data = find_hight(k_data);
      res.render('index.ejs', { data: k_data, data2: c_data, max_data: max_data });
    });
});

function find_hight(data) {
  compare_data = [];
  let max = 0;
  let index = 0;
  temp = [];
  if(data.length == 0)
    return [0,0,0];

  for(let i = 0; i<data.length; i++) {
    if(data[i][6] == "높음") {
      sum = data[i][4]+data[i][5];
      compare_data.push([data[i][0],sum.toFixed(2), data[i][6]]) // 키워드, 클릭률합산, 높음
      //console.log(compare_data[compare_data.length-1]);
      if(max <= sum) {
        max = sum;
        temp = compare_data[compare_data.length-1]
      }
    }
  }
  //console.log("가장 큰놈은 : ", temp);
  return temp;
}

function Crol_request(key_data) {
  return new Promise((resolve, reject) => {
    let crol_data = [[], []];
    let crol_url = 'https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=KR';
    request(crol_url, function (err, res, html) {
      if (!err) {
        var $ = cheerio.load(html, { xmlMode: true });

        $('item').each(function () {
          crol_data[0].push($(this).children('title').text());
        });
        $('item').each(function () {
          crol_data[1].push($(this).children('ht\\:approx_traffic').text());
        });
      }
      resolve([crol_data, key_data]);
    });
  });
}

module.exports = router;