
data_rank = [];
keyword = '어린이홍삼'
var page = 1;
// &sort : date, rel
let url = 'https://search.shopping.naver.com/search/all?frm=NVSHATC&origQuery=' + encodeURI(keyword) + 'pagingIndex=' + page + '&pagingSize=40&productSet=total&query=' + encodeURI(keyword) + '&sort=rel&timestamp=&viewType=list';

async function example(index) {
    const { Builder, By, Key, until } = require('selenium-webdriver');
    //console.log("요청 url : ", url);

    let driver = await new Builder()
        .forBrowser('chrome')
        .build();
    // 네이버 실행 
    await driver.get(url);
    // Javascript를 실행하여 UserAgent를 확인한다. 

    let userAgent = await driver.executeScript("return navigator.userAgent;")
    let last_height, new_height;

    driver.executeScript("return document.body.scrollHeight;").then(value => {
        //console.log("처음구한 높이 :", value);
        last_height = new_height;
    });

    for (var i = 0; i < 70; i++) {
        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    };
    let resultElements = await driver.findElements(By.className('basicList_mall__sbVax'));
    //console.log('[resultElements.length]', resultElements.length)
    //console.log('== Search results ==')
    let check = 0;

    for (var i = 0; i < resultElements.length; i++) {
        Str_data = await resultElements[i].getText();
        data_rank.push(Str_data);
        //console.log(data_rank.length+1, "-", Str_data);
        //console.log(i+1,"-", Str_data);
        if(Str_data == "백세인흑홍삼")  {
            console.log(Str_data+'의 랭킹 -',data_rank.length+1);
            check = 1;
        }
    }
    
    driver.quit();
    return check;
}

function loop() {
    example().then((flag) => {
        //console.log(flag);
        if (flag == 0) {
            console.log("page",page,"에 없음.");
            setTimeout(function () {
                page = page +1;
                url = 'https://search.shopping.naver.com/search/all?frm=NVSHATC&origQuery=' + encodeURI(keyword) + '&pagingIndex=' + page + '&pagingSize=40&productSet=total&query=' + encodeURI(keyword) + '&sort=rel&timestamp=&viewType=list';
                loop();
            }, 800);
        }
    });
}
loop();






