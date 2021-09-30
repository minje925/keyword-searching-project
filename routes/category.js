const { rejects } = require('assert');
var express = require('express');
const { resolve } = require('path');
var router = express.Router();
var path = require('path')
var request = require('request');
var fs = require('fs');
const { totalmem } = require('os');

var client_id = "Oi6e85tRU0W5d9M2CAu0"
var client_secret = "TSpaZPOVqN"
var api_url = 'https://openapi.naver.com/v1/datalab/shopping/categories'

// 카테고리 ID정의
const CATEGORY_INFO = {"패션의류":"50000000", "화장품/미용":"50000002", "패션잡화":"50000001", "디지털/가전":"50000003",
"가구/인테리어": "50000004", "출산/육아":"50000005", "식품":"50000006", "스포츠/레저":"50000007", "생활/건강":"50000008", 
"여가/생활편의":"50000009", "면세점":"50000010"};

router.get('/', (req, res) => {
    total = [];
    const CatePromis = new Promise((resolve, rejects) =>{
        //console.log(req.query['cate'], req.query['date'],req.query['device'], req.query['sex']);
        cate_date = [];
        request_body = makebody(req.query['cate'],makedate(req.query['date']), req.query['device']);
        total.push(req.query['cate']);
        //console.log("요청 body : ", request_body);
        request.post({
            url: api_url,
            body: JSON.stringify(request_body),
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret,
                'Content-Type': 'application/json'
            }
        },
        function (error, response, body) {
            console.log(response.statusCode);
            body = JSON.parse(body);
            if(response.statusCode == 200){
                body_length = body['results'][0]['data'].length;
                console.log("길이 : ", body_length);
                cate_data = body['results'][0]['data']; // push 과정을 배열대입으로 하였음.
                resolve(cate_data);
            } else {
                resolve([{period: '', ratio: ''}]);
            }
            //console.log(body['results'][0]['data'][0]);
        });

    }).then(value => {
        period = [];
        ratio = [];
        
        for(var i =0; i<value.length; i++) {
            period.push(value[i]['period']);
            ratio.push(value[i]['ratio'])
        }
        total.push(period);
        total.push(ratio);
        res.render('category.ejs', {data:total});
        // total[0] : 카테고리, total[1] : 날짜, total[2] : 클릭량
        //console.log("export 완료.");
    });
});

function makedate(date) {
    // 요청 날짜 구하기
    reqdate = [];
    let today = new Date();
    month = today.getMonth()+1;
    day = today.getDate();

    if(month < 10) 
        reqdate.push(today.getFullYear()+"-0"+month+"-"+day);
    else
    reqdate.push(today.getFullYear()+"-"+month+"-"+day);

    if(date == "월간"){
        var oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
        month = oneMonthAgo.getMonth()+1;
        if(month < 10) 
            reqdate.push(oneMonthAgo.getFullYear()+"-0"+month+"-"+oneMonthAgo.getDate());
        else 
            reqdate.push(oneMonthAgo.getFullYear()+"-"+month+"-"+oneMonthAgo.getDate());
        console.log(reqdate[0], reqdate[1]);
    }
    else if (date == "주간") {
        var oneMonthAgo = new Date(today.setDate(today.getDate() - 7));
        month = oneMonthAgo.getMonth() + 1;
        if (month < 10)
            reqdate.push(oneMonthAgo.getFullYear() + "-0" + month + "-" + oneMonthAgo.getDate());
        else
            reqdate.push(oneMonthAgo.getFullYear() + "-" + month + "-" + oneMonthAgo.getDate());
        console.log(reqdate[0], reqdate[1]);
    }
    // reqdate[0] : 현재날짜, reqdate[1] : 한달전날짜
    return reqdate;
}

function makebody(cate, date, device) {
    var param = CATEGORY_INFO[cate];
    console.log(param);
    // 요청 body 구성
    var request_body = {
        "startDate": date[1],
        "endDate": date[0],
        "timeUnit": "date",
        "category": [
            {"name": cate, "param": [param]},
            //{"name": "화장품/미용", "param": ["50000002"]},
        ],
        //"device": "pc"
        //"ages": ["20", "30"],
        //"gender": "f"
    };
    //console.log("요청 body : ", request_body);
    return request_body;
}

module.exports = router;
