const { rejects } = require('assert');
var express = require('express');
const { resolve } = require('path');
var router = express.Router();
var path = require('path')
var request = require('request');

var client_id = "Oi6e85tRU0W5d9M2CAu0"
var client_secret = "TSpaZPOVqN"
var keyword = ""

router.get('/', (req, res) => {
    const TotalPromise = new Promise((resolve, reject)=>{
        //keyword = req.param('keydata');
        keyword = req.query['keydata']
        console.log(keyword)
        // 초기 생성화면이거나 공백을 입력했을 때,
        if(keyword == undefined || keyword == "")
            resolve([0,[0,0,0]]);
        else {
            var api_url = "https://openapi.naver.com/v1/search/shop?query=" + encodeURIComponent(keyword)+"&display=100";
            var options = {
                url: api_url,
                headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
            };
            total_data = [];
            price = [];
            total = [];
            // 연관키워드 검색후 total이 블로그 총 발행량임
            request.get(options, function (error, response, body) {
                console.log(keyword, "에 대한 전체검색 요청 중...");
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body); //json으로 파싱
                    total.push(data['total']);
                    
                    cate = category(data);
                    for(var i = 0; i < data['items'].length; i++) {
                        text = data['items'][i]['title'].replace(/<b\/>/ig, "\n");
                        text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
                        price.push(parseInt(data['items'][i]['lprice']));
                        total_data.push([text, data['items'][i]['brand'], data['items'][i]['maker'], data['items'][i]['lprice'], data['items'][i]['hprice'], cate[i]])
                        //console.log(total_data[i]);
                    }          
                    total.push(Math.max.apply(null,price));
                    total.push(Math.min.apply(null,price));
                    resolve([total_data, total]);
                }
                else {
                    res.status(response.statusCode).end();
                    console.log('error = ' + response.statusCode);
                    reject('전체검색 요청 실패.');
                }
            });
        }
    }).then(value => {
        // 숫자에 3자리수 마다 ',' 찍기
        value[1][0] = Number(value[1][0]).toLocaleString('en');
        value[1][1] = Number(value[1][1]).toLocaleString('en');
        value[1][2] = Number(value[1][2]).toLocaleString('en');
        console.log("total data : " , value[1]);
        res.render('myproducts.ejs', {data:value});
    });
});

function category(jsondata) {
    // 카테고리를 합쳐주는 함수
    cate = []
    for(var i = 0; i < jsondata['items'].length; i++) {
        cate.push(jsondata['items'][i]['category1']+">"+jsondata['items'][i]['category2']+">"+jsondata['items'][i]['category3']);
        //console.log(cate);
    }
    return cate;
}

module.exports = router;
