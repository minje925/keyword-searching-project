const { rejects } = require('assert');
var express = require('express');
const { resolve } = require('path');
var router = express.Router();
var path = require('path')
var request = require('request');
var request2 = require('request');
var CryptoJS = require('crypto-js');

// API 요청을 위한 정보
var method = "GET";
var accessKey = "0100000000ad4ba1cb0d7771a195757e227aed9d61d6c191bfe12c3913b45f08adfb237b63";
var secretKey = "AQAAAACtS6HLDXdxoZV1fiJ67Z1hRnataGZB9c3ikgo+tLU+3A==";
var customer_id = '2267997'
var api_url = '/keywordstool'

var client_id = "Oi6e85tRU0W5d9M2CAu0"
var client_secret = "TSpaZPOVqN"
var keyword = ""

router.get('/', (req, res) => {
    const BlogPromise = new Promise((resolve, reject)=>{
        //keyword = req.param('keydata');
        keyword = req.query['keydata']
        console.log(keyword)
        // 초기 생성화면이거나 공백을 입력했을 때,
        if(keyword == undefined || keyword == "")
            resolve([0,0]);
        else {
            var api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURIComponent(keyword);
            var options = {
                url: api_url,
                headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
            };
            blog_data = [];

            // 연관키워드 검색후 total이 블로그 총 발행량임
            request.get(options, function (error, response, body) {
                console.log(keyword, "에 대한 블로그 요청 중...");
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body); //json으로 파싱
                    //console.log(data);
                    total = data['total'];

                    if(total == 0) {
                        // 데이터가 0개일 때, 터지는 현상을 고쳤음.
                        console.log('불러온 데이터가 없습니다.');
                        resolve([0,0]);
                    }
                    else {
                        for(var i = 0; i < 10; i++) {
                            text = data['items'][i]['title'].replace(/<b\/>/ig, "\n");
                            text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
                            blog_data.push([text, data['items'][i]['bloggername'], data['items'][i]['postdate'],data['items'][i]['bloggerlink']]);
                            //console.log(blog_data[i]);
                        }
                        resolve([blog_data, total]);
                    }
                    
                }
                else {
                    res.status(response.statusCode).end();
                    console.log('error = ' + response.statusCode);
                    reject('블로그 요청 실패.');
                }
            });
        }
    }).then(value => {
        console.log("블로그 수 : " , value[1]);
        res.render('blog.ejs', {data:value});
    });

});

module.exports = router;
/*
keyword = "abc마트"
var api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURIComponent(keyword); // json 결과
var request = require('request');
var options = {
    url: api_url,
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
};
// 연관키워드 검색후 total이 블로그 총 발행량임
request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        let data = JSON.parse(body); //json으로 파싱
        console.log("블로그 게시글 수 : ", data['total']);
        console.log("최근 한달간 블로그 글(10개)");
        for(var i = 0; i < 10; i++) {
            console.log("날짜/링크 : ",data['items'][i]['postdate'], "/",data['items'][i]['bloggerlink']);
        }
    } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
    }
});
*/

/* json 구조

lastBuildDate: 'Fri, 25 Jun 2021 03:34:44 +0900',
  total: 105084,
  start: 1,
  display: 10,
  items: [
    {
      title: '괌 쇼핑 목록 : K마트, <b>ABC마트</b> 쇼핑목록',
      link: 'https://blog.naver.com/godbooji?Redirect=Log&logNo=221791750671',
      description: 'k마트에서 저렇게 잔뜩사고 <b>abc마트</b>를 다시 온 이유는 뭐냐면.. 순전히 소주를 위해서였어욬ㅋㅋㅋㅋㅋㅋㅋ k마트에서 
는 소주를 안팔아요.. 근데 제가 술을 안먹(못먹)다보니..이번여행은 미리 소주를 사올... ',
      bloggername: '찡아일기 ♬',
      bloggerlink: 'https://blog.naver.com/godbooji',
      postdate: '20200131'
    },
*/
