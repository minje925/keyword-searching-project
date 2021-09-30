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

async function get_saleCnt(keyword) {
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
        console.log(Str_data);
        data_section.push(Str_data);
    }

    driver.quit();
    total_str = data_section[0]+">"+data_section[1]+">"+data_section[2]+">"+data_section[3];
    console.log(total_str);
    return total_str;
}
get_saleCnt('홍삼');