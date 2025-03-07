function downApp(){
    var u = navigator.userAgent, 
    isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
    isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    urls = {
        'android':'https://gb-pack.75177.com/wan8/prd/child/162106/a_1001521_221329_8.apk?v=0.3935431998201847',
        'ios':'https://s.8wan.com/QFMCwi?14778',
        'other':'https://gb-pack.75177.com/wan8/prd/child/162106/a_1001521_221329_8.apk?v=0.3935431998201847'
    };
    //三元运算
    // window.location.href = isAndroid? urls.android : isiOS? urls.ios : urls.other;
    //简化
    if(isAndroid){
        window.location.href=urls.android;
    }else if(isiOS){
        window.location.href=urls.ios;
    }else{
        window.location.href=urls.other;
    }
}
downApp;