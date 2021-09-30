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
const { data } = require('cheerio/lib/api/attributes');

// 연관키워드 API 요청을 위한 정보
var method = "GET";
var accessKey = "0100000000ad4ba1cb0d7771a195757e227aed9d61d6c191bfe12c3913b45f08adfb237b63";
var secretKey = "AQAAAACtS6HLDXdxoZV1fiJ67Z1hRnataGZB9c3ikgo+tLU+3A==";
var customer_id = '2267997'
var api_url = '/keywordstool'

// 카테고리와 가격을 가져오기 위한 API 정보
var client_id = "Oi6e85tRU0W5d9M2CAu0"
var client_secret = "TSpaZPOVqN"


var array = [] // 전체데이터를 저장하는 배열
keyword = '홍삼성찬';

const get_Relkeyword = function (keyword) {
    return new Promise((resolve, reject) => {
        var url = 'https://api.naver.com/keywordstool?hintKeywords=' + encodeURIComponent(keyword) + '&showDetail=1';
        //console.log("요청 키 : "+keyword);
        var timestamp = Date.now() + '';
        var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(timestamp + '.' + method + '.' + api_url);
        var hash = hmac.finalize();
        hash.toString(CryptoJS.enc.Base64);
        key_data = [];

        request.get({
            uri: url,
            encodeing: null,
            headers: {
                'X-Timestamp': timestamp,
                'X-API-KEY': accessKey,
                'X-API-SECRET': secretKey,
                'X-CUSTOMER': customer_id,
                'X-Signature': hash.toString(CryptoJS.enc.Base64)
            }
        }, function (err, res, body) {
            let data = JSON.parse(body) //json으로 파싱
            //console.log(body);
            if (err == null) {
                array.push({
                    title: data["keywordList"][0]["relKeyword"],
                    pccnt: data["keywordList"][0]["monthlyPcQcCnt"],
                    mocnt: data["keywordList"][0]["monthlyMobileQcCnt"],
                    totalcnt: data["keywordList"][0]["monthlyMobileQcCnt"] + data["keywordList"][0]["monthlyPcQcCnt"],
                    category: null,
                    salecnt_6month: null,
                    salecnt_1date: null,
                    postingcnt: null,
                    section: null
                });
                if (data["keywordList"].length == 0)
                    key_data.push([0, 0, 0, 0, 0, 0, 0]);
                for (var i = 0; i < data["keywordList"].length; i++) {
                    key_data.push([data["keywordList"][i]["relKeyword"], data["keywordList"][i]["monthlyPcQcCnt"], data["keywordList"][i]["monthlyMobileQcCnt"], data["keywordList"][i]["monthlyPcQcCnt"] + data["keywordList"][i]["monthlyMobileQcCnt"],
                    data["keywordList"][i]["monthlyAvePcCtr"], data["keywordList"][i]["monthlyAveMobileCtr"], data["keywordList"][i]["compIdx"], data["keywordList"][i]["plAvgDepth"]]);
                }
            }
            else {
                console.log("Error.");
            }
            resolve(key_data);
        });
    });
}
/*
// 전체적인 기능!! 실행하기!
get_Relkeyword(keyword).then(value =>{
    return get_Category(keyword);
})
.then(value=>{
    array[0]['category'] = value[0];
    return get_ViewCnt(keyword);
})
.then(value=> {
    array[0]['postingcnt'] = value;
    return get_saleCnt(keyword);
})
.then((value) =>{
    sum = get_sum(value)
    array[0]['salecnt_6month'] = sum;
    array[0]['salecnt_1date'] = sum/180;
    //console.log(array);

    setTimeout(function() {
        get_section(keyword).then(value => {
            console.log(value);
            array[0]['section'] = value;
            console.log(array);
        });
    }, 1000)
});
*/

const get_Category = function(keyword) {
    return new Promise((resolve, reject) => {
        var api_url = "https://openapi.naver.com/v1/search/shop?query=" + encodeURIComponent(keyword) + "&display=1";
        var options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        };

        request.get(options, function(err, res, body){
            if(!err && res.statusCode == 200) {
                let data = JSON.parse(body);
                cate = category(data);
                //console.log(cate);
                resolve(cate);
            }
            else {
                console.log('카테고리 요청 에러.');
            }
        });
    });
}

const get_ViewCnt = function(keyword) {
    return new Promise((resolve, reject) => {
        var api_url = "https://openapi.naver.com/v1/search/webkr.json?query=" + encodeURIComponent(keyword) + "&display=1";
        var options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        };

        request.get(options, function(err, res, body){
            if(!err && res.statusCode == 200) {
                let data = JSON.parse(body);
                //console.log("View 개수 : ", data['total']);;
                resolve(data['total']);
            }
            else {
                console.log('웹문서 요청 에러.');
            }
        });
    });
}

function category(jsondata) {
    // 카테고리를 합쳐주는 함수
    cate = []
    for(var i = 0; i < jsondata['items'].length; i++) {
        if(jsondata['items'][i]['category4'] != '')
            cate.push(jsondata['items'][i]['category1']+">"+jsondata['items'][i]['category2']+">"+jsondata['items'][i]['category3']+">"+jsondata['items'][i]['category4']);
        else
            cate.push(jsondata['items'][i]['category1']+">"+jsondata['items'][i]['category2']+">"+jsondata['items'][i]['category3']);
        //console.log(cate);
    }
    return cate;
}

async function get_saleCnt(keyword) {
    const { Builder, By, Key, until } = require('selenium-webdriver');
    var page = 1;
    let url = 'https://search.shopping.naver.com/search/all?frm=NVSHCHK&origQuery=' + encodeURI(keyword) + 'pagingIndex=' + page + '&pagingSize=20&productSet=checkout&query=' + encodeURI(keyword) + '&sort=rel&timestamp=&viewType=list';
    data_sale = [];

    let driver = await new Builder()
        .forBrowser('chrome')
        .build();
    await driver.get(url); 
    let userAgent = await driver.executeScript("return navigator.userAgent;")

    // 스크롤
    for (var i = 0; i < 100; i++) {
        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    };
    let resultElements = await driver.findElements(By.css('div.basicList_etc_box__1Jzg6 > a:nth-child(2) > em'));
    //console.log(resultElements,"dd..");
    for (var i = 0; i < resultElements.length; i++) {
        Str_data = await resultElements[i].getText();
        //console.log(Str_data);
        data_sale.push(Str_data);
    }
    driver.quit();

    return data_sale;
}

async function get_section(keyword) {
    const { Builder, By, Key, until } = require('selenium-webdriver');
    let url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query='+ encodeURI(keyword);
    data_section = [];

    let driver = await new Builder()
        .forBrowser('chrome')
        .build();
    await driver.get(url); 
    let userAgent = await driver.executeScript("return navigator.userAgent;")
    let resultElements = await driver.findElements(By.className('menu'));

    console.log(resultElements.length);
    for (var i = 1; i < 5; i++) {
        Str_data = await resultElements[i].getText();
        //console.log(Str_data);
        data_section.push(Str_data);
    }

    driver.quit();
    total_str = data_section[0]+">"+data_section[1]+">"+data_section[2]+">"+data_section[3];
    //console.log(total_str);
    return total_str;
}

function get_section2(keyword) {
    return new Promise((resolve, reject) => {
        let url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=' + encodeURI(keyword);
        let data = [];
        request(url, function (err, res, html) {
            if (!err) {
                var $ = cheerio.load(html, { xmlMode: true });
                
                data.push($('ul.base li:nth-child(2)').text());
                data.push($('ul.base li:nth-child(3)').text());
                data.push($('ul.base li:nth-child(4)').text());
                data.push($('ul.base li:nth-child(5)').text());
                resolve(data);
            }
            else {
                console.log('section 요청 실패.');
            }
        });
    });
}


function get_sum(data) {
    var sum = 0;
   
    for(i=0; i<data.length; i++) {
        data[i] = Number(data[i].replace(',',""));
        sum = sum+data[i];
    }
    return sum;
}
/*
get_saleCnt('거울').then(value => {
    console.log(value);
    var sum = 0;
    console.log(typeof(sum));
    
    for(i=0; i<value.length; i++) {
        value[i] = Number(value[i].replace(',',""));
        sum = sum+value[i];
        if(i == 19)
            console.log("Top20 판매량 : ", sum);
        if(i == 39)
            console.log("Top40 판매량 : ", sum);
        if(i == 59)
            console.log("Top60 판매량 : ", sum);

    }
    console.log("Top80 판매량 : ", sum, "\n광고제외 수 : ",value.length);
});
*/

// 웹페이지 구동 코드
/*
keyword = "";
router.get('/', (req, res) => { 
    var data;
    keyword = req.query['keydata'];
    console.log("keyword", keyword);
    if(keyword == undefined) {
        console.log("페이지 init()");
        res.render('temp_name.ejs', {data:0});
    }
    else {
        // 전체적인 기능!! 실행하기!
        get_Relkeyword(keyword).then(value => {
            return get_Category(keyword);
        })
            .then(value => {
                array[0]['category'] = value[0];
                return get_ViewCnt(keyword);
            })
            .then(value => {
                array[0]['postingcnt'] = value;
                return get_saleCnt(keyword);
            })
            .then((value) => {
                sum = get_sum(value)
                array[0]['salecnt_6month'] = sum;
                array[0]['salecnt_1date'] = (sum / 180).toFixed(2);

                setTimeout(function () {
                    get_section(keyword).then(value => {
                        console.log(value);
                        array[0]['section'] = value;
                        console.log(array);

                        res.render('temp_name.ejs', {data: array})
                        array = [];
                        keyword = "";
                    });
                }, 1000)
            });
        ;
    }

});
*/
keyword = "";
router.get('/', (req, res) => { 
    var data;
    keyword = req.query['keydata'];
    console.log("keyword", keyword);
    if(keyword == undefined) {
        console.log("페이지 init()");
        res.render('temp_name.ejs', {data:0});
    }
    else {
        // 전체적인 기능!! 실행하기!
        get_Relkeyword(keyword).then(value => {
            return get_Category(keyword);
        })
            .then(value => {
                array[0]['category'] = value[0];
                return get_ViewCnt(keyword);
            })
            .then(value => {
                array[0]['postingcnt'] = value;
                return get_saleCnt(keyword);
            })
            .then((value) => {
                sum = get_sum(value)
                array[0]['salecnt_6month'] = sum;
                array[0]['salecnt_1date'] = (sum / 180).toFixed(2);

                return get_section2(keyword);
            })
            .then(value => {
                array[0]['section'] = value;
                console.log(array);

                res.render('temp_name.ejs', { data: array })
                array = [];
                keyword = "";
            });
    }

});

module.exports = router;
