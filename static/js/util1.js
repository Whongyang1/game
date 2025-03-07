function util() {
        this.getUrlParam = function (name) { //获取url值
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        },
        this.filterLanguage = function () { //获取url值
            var reg = new RegExp("language=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r) {
                return window.location.search.replace(r[0], "").replace("?", "&");
            } else if (window.location.search) {
                return window.location.search.replace("?", "&");
            } else {
                return null;
            }
        },
        this.toSchemeFn = function (scheme, url) { //跳转到app
            var _scheme = scheme;
            var _url = url;
            var u = navigator.userAgent;

            if (/MicroMessenger/gi.test(u)) { //是微信 在浏览器打开
                // 引导用户在浏览器中打开
                alert('请在浏览器中打开');
                return;
            }

            var d = new Date();
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
                this.openApp(_scheme, _url);
            } else if (u.indexOf('iPhone') > -1) {
                this.openApp(_scheme, _url);
            }
        },
        this.openApp = function (_scheme, _url) {
            if (this.checkUA() == "pc") {
                return false
            } else {
                try {
                    window.AndroidUtils.jumpBrowser(_scheme, _url);
                } catch (error) {
                    try {
                        window.DownloadGame.getGameUrl(_url);
                    } catch (error) {
                        alert("该功能只有最新游戏包才有，请更新。")
                        //window.location.href = _scheme;
                    }
                }
            }
        },
        this.checkUA = function () {
            var browser = {
                versions: function () {
                    var u = navigator.userAgent,
                        app = navigator.appVersion;
                    return { //移动终端浏览器版本信息  
                        trident: u.indexOf('Trident') > -1, //IE内核  
                        presto: u.indexOf('Presto') > -1, //opera内核  
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器  
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器  
                        iPad: u.indexOf('iPad') > -1, //是否iPad  
                        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部  
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            }
            if (browser.versions.mobile) { //判断是否是移动设备打开。browser代码在下面  
                var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象 
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return "weixin"
                }
                if (ua.match(/WeiBo/i) == "weibo") {
                    return "weibo"
                }
                if (ua.match(/QQ/i) == "qq") {
                    return "qq"
                }
                if (browser.versions.ios) {
                    return "ios"
                }
                if (browser.versions.android) {
                    return "android"
                }
            } else {
                return "pc"
            }
        },
        this.PrtSc = function (status, acc, psw) {
            try {
                window.PrtScFun.add(status); //2017.11.23之前的端使用
                window.PrtScFun.screenShot(1, acc, psw);
            } catch (e) {
                console.log(e);
            }
        },
        this.calliPhone = function (handlerInterface, handlerMethod, parameters) {
            //handlerInterface由iOS addScriptMessageHandler与andorid addJavascriptInterface 代码注入而来。
            var dic = {
                'handlerInterface': handlerInterface,
                'function': handlerMethod,
                'parameters': parameters
            };
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                window.webkit.messageHandlers[handlerInterface].postMessage(dic);
            }
            // else{
            // 	//安卓传输不了js json对象
            // 	window[handlerInterface][handlerMethod](JSON.stringify(dic));
            // }
        },
        this.calliPhoneNative = function (handlerMethod, parameters) {
            this.calliPhone("Native", handlerMethod, parameters);
        },
        this.CSRegular = function () {
            return {
                reguname: function (v) {
                    var rule1 = /^[a-zA-Z0-9\_\@]{6,20}$/.test(v); // 新注册帐号长度必须6-20
                    return rule1;
                },
                uname: function (v) {
                    var rule1 = /^[a-zA-Z0-9\_]{4,20}$/.test(v); // 老用户为4-20位
                    return rule1;
                },
                pass: function (v) {
                    return /^([a-z0-9\.\_\+\-\@\!\#\$\%\^\&\*\(\)]){6,20}$/i.test(v);
                },
                loginPass: function (v) {
                    return /^(.*?){2,50}$/i.test(v);
                },
                phone: function (v) {
                    return /^\d{11}$/.test(v);
                },
                captcha: function (v) {
                    return /^\d{4,6}$/.test(v);
                },
                idcard: function (v) {
                    return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(v);
                },
                readName: function (v) {
                    return /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(v);
                },
                isNumber: function (v) {
                    return Object.prototype.toString.call(v) == "[object Number]"
                },
                isString: function (v) {
                    return Object.prototype.toString.call(v) == "[object String]"
                },
                isBool: function (v) {
                    return Object.prototype.toString.call(v) == "[object Boolean]"
                },
                isNull: function (v) {
                    return Object.prototype.toString.call(v) == "[object Null]"
                },
                isArray: function (v) {
                    return Object.prototype.toString.call(v) == "[object Array]"
                },
                isObject: function (v) {
                    return Object.prototype.toString.call(v) == "[object Object]"
                },
                isDate: function (v) {
                    return Object.prototype.toString.call(v) == "[object Date]"
                },
                isFun: function (v) {
                    return Object.prototype.toString.call(v) == "[object Function]"
                }

            }
        },
        this.checkProtocol = function () {
            if (window.location.protocol.indexOf('https') >= 0) {
                return 'https:'
            } else {
                return 'http:'
            }
        },
        this.judgeUrl = function (url1, url2) {
            var url1 = this.formatUrl(url1);
            var url2 = this.formatUrl(url2);

            if (url1.indexOf(url2) >= 0) {
                return true
            } else {
                return false
            }
        },
        this.sameUrl = function (url1, url2) {
            var url1 = this.formatUrl(url1);
            var url2 = this.formatUrl(url2);

            if (url1 == url2) {
                return true
            } else {
                return false
            }
        },
        this.formatUrl = function (url, isAll) {
            var _url = url;
            _url = _url.split("?")[0];
            var last_url1 = _url.substring(_url.length - 1);
            if (last_url1.lastIndexOf('/') >= 0) {
                _url = _url.substr(0, _url.length - 1);
            }
            if (isAll && url.split("?")[1]) {
                return _url + "?" + url.split("?")[1];
            }
            return _url
        },
        this.share = {
            weibo: function (url, title, img) {
                var _url = url || window.location.href;
                var _title = title || document.title;

                if (img) {
                    window.location.href = "http://service.weibo.com/share/share.php?url=" + encodeURIComponent(_url) + "&title=" + _title + "&pic=" + img; //自定义图片用这个
                } else {
                    window.location.href = "http://service.weibo.com/share/share.php?url=" + encodeURIComponent(_url) + "&title=" + _title + "&searchPic=true"; //微博自动抓取图片用这个
                }
            },
            qq: function (url, title, desc, img) {
                var share = {
                    title: title || document.title,
                    desc: desc || document.desc,
                    image_url: img ? [img] : [],
                    share_url: url || window.location.href
                };

                var image_urls = share.image_url.map(function (image) {
                    return encodeURIComponent(image);
                });

                location.href = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(share.share_url) + '&site=掌上理工大&title=' + share.title + '&pics=' + image_urls.join('|') + '&summary=' + share.desc;
            },
        },
        this.copyUrl2 = function (eleId) {
            var Url2 = document.getElementById(eleId).innerText;
            var oInput = document.createElement('input');
            oInput.value = Url2;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display = 'none';
        },
        this.getTimestamp = function () {
            return (new Date).getTime() / 1000 + 365 * 24 * 60 * 60 * 1000;
        },
        this.formatHideMobile = function (mobile) {
            var _mobile = mobile;
            return _mobile.substr(0, 3) + '****' + _mobile.substr(7);
        },
        this.getPixelRatio = function (context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        },
        //依赖html2canvas.min 
        this.savePhoto = function (element, successCB) {
            var _this = this;

            html2canvas(element, {
                    scale: 2,
                    foreignObjectRendering: false,
                    ignoreElements: false,
                    allowTaint: false,
                    useCORS: true,
                })
                .then(function (canvas) {
                    var dataURL = canvas.toDataURL("image/png");
                    $(cut_pic).html("<img src='" + dataURL + "'/>")
                })
        },
        this.saveAs = function (Url) {
            var blob = new Blob([''], {
                type: 'application/octet-stream'
            });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = Url;
            a.download = Url.replace(/(.*\/)*([^.]+.*)/ig, "$2").split("?")[0];
            var e = document.createEvent('MouseEvents');
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            URL.revokeObjectURL(url);
        },
        this.reverse = function (a) {
            var len = a.length; //获取数组的长度
            var mid = parseInt(len / 2); //获取数组长度的中间值，由于有可能是不是整数，将得到的数字转为整数
            //利用交换的思想，将数组内的元素放在相应的地方，循环次数为mid+1次
            for (i = 0; i <= mid; i++) {
                var temp = a[i];
                a[i] = a[len - 1 - i];
                a[len - 1 - i] = temp;
            }
            return a;
        },
        this.debounce = function (func, delay) {
            var timer = null;
            return function () {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    func.apply(context, args);
                }, delay);
            }
        },
        this.initScreen = function (landscapeFun, portraitFun) { //判断横竖屏方法 解决安卓键盘问题
            function detectOrient() {
                var storage = localStorage; // 不一定要使用localStorage，其他存储数据的手段都可以
                var data = storage.getItem('J-recordOrientX');
                var cw = window.screen.width;

                var _Width = 0,
                    _Height = 0;
                if (!data) {
                    sw = window.screen.width;
                    sh = window.screen.height;
                    // 2.在某些机型（如华为P9）下出现 srceen.width/height 值交换，所以进行大小值比较判断
                    _Width = sw < sh ? sw : sh;
                    _Height = sw >= sh ? sw : sh;
                    storage.setItem('J-recordOrientX', _Width + ',' + _Height);
                } else {
                    var str = data.split(',');
                    _Width = str[0];
                    _Height = str[1];
                }

                if (cw == _Width) {
                    portraitFun && portraitFun();
                    //竖屏
                    return;
                }
                if (cw == _Height) {
                    // 横屏
                    landscapeFun && landscapeFun();
                    return;
                }

            }

            // 3.函数去抖处理
            window.onresize = this.debounce(detectOrient, 300);
            detectOrient();
        },
        this.setHistoryList = function (username, password, historyList, type) {
            if (username && password) {
                var _history_list = this.delHistoryList(username, false, historyList);

                _history_list.push({
                    username: username,
                    password: (type == 1) ? password : Base64.encode(password),
                    type: type || 0 //0密码,1token
                })
                C9377.setcookie('history_list', JSON.stringify(_history_list), Util.getTimestamp());
            }
        },
        this.delHistoryList = function (username, isSetCookie, historyList) {
            var _history_list = historyList;
            if (_history_list) {
                for (var i = 0; i < _history_list.length; i++) {
                    if (_history_list[i].username == username) {
                        _history_list.splice(i, 1);
                    }
                }
            }
            if (isSetCookie) {
                C9377.setcookie('history_list', JSON.stringify(_history_list), Util.getTimestamp());
            }
            return _history_list;
        },
        this.OS = function () {
            var ua = navigator.userAgent,
                iPad = ua.match(/(iPad).*OS\s([\d_]+)/),
                isIphone = !iPad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
                isAndroid = ua.match(/(Android)\s+([\d_]+)/),
                isMobile = isIphone || isAndroid;
            if (isAndroid) {
                return {
                    name: 'Android',
                    ver: isAndroid
                };
            } else if (iPad) {
                return {
                    name: 'iPad',
                    ver: iPad
                };
            } else if (isIphone) {
                return {
                    name: 'iPhone',
                    ver: isIphone
                };
            } else {
                return {
                    name: 'PC',
                    ver: ua
                };
            }
        },
        this.million = function (value) {
            // 过万处理
            var num;

            if (value > 9999999) {
                // 大于9999999显示x.xx千万
                num = "".concat(Math.floor(value / 1000 / 1000) / 10, "千万+");
            } else if (value > 9999 && value < 9999999) {
                num = "".concat(Math.floor(value / 1000) / 10, "万+");
            } else if (value < 9999 && value > -9999) {
                num = value;
            } else if (value < -9999) {
                // 小于-9999显示-x.xx万
                num = "".concat(-(Math.floor(Math.abs(value) / 1000) / 10), "万+");
            }
            return num;
        },
        this.nativeFunc = function (url, game_name, game_id) {
            try { //安卓包
                if (window.CSGameSDKAndroidJS.jumpBrowser) {
                    window.CSGameSDKAndroidJS.jumpBrowser(url);
                }
            } catch (error) {
                try { //H5壳包
                    if (window.AndroidUtils.jumpBrowser) {
                        window.AndroidUtils.jumpBrowser(url);
                    }
                } catch (error) {
                    try { // 盒子新方法
                        window.Gamebox.download(url, game_name, game_id);
                    } catch (error) { // 盒子老方法
                        try {
                            window.Native.download(url, game_name, game_id);
                        } catch (error) {
                            window.location.href = url;
                        }
                    }
                }
            }
        },
        this.payClose = function () { // 关闭充值弹窗
            try {
                if (Util.OS().name == 'Android') {
                    andClosePayUI();
                } else {
                    try {
                        calliPhoneNative('get_end', {
                            'status': 1
                        }); //2017.12.08之后ios端使用
                    } catch (e) {
                        get_end();
                        console.log(e);
                    }
                }

                function andClosePayUI() {
                    window.Pay.closePayUI();
                }
            } catch (e) {
                window.parent.postMessage('{"event":"closePayIframe"}', '*');
            }
        },
        this.getCookiesObj =function() {
            // 获取cookie对象，以对象表示
            const cookies = {};
            if (document.cookie) {
                const objs = document.cookie.split("; ");
                for (const i in objs) {
                const index = objs[i].indexOf("=");
                const name = objs[i].substr(0, index);
                const value = objs[i].substr(index + 1, objs[i].length);
                cookies[name] = value;
                }
            }
            return cookies;
        },
        this.Cookie = function() {
            return {
                // 设置cookie
                set: (name, value, opts) => {
                  // opts maxAge, path, domain, secure
                  if (name && value) {
                    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
                    // 可选参数
                    if (opts) {
                      if (opts.maxAge) {
                        cookie += `; max-age=${opts.maxAge}`;
                      } else {
                        let _time = new Date().getTime() + 86400 * 7 * 1000;
                        cookie += `; max-age=${_time}`;
                      }
            
                      if (opts.path) {
                        cookie += `; path=${opts.path}`;
                      } else {
                        cookie += `; path=/`;
                      }
                      if (opts.domain) {
                        cookie += `; domain=${opts.domain}`;
                      }
                      if (opts.secure) {
                        cookie += "; secure";
                      }
                    }
                    document.cookie = cookie;
                    return cookie;
                  }
                  return "";
                },
                // 获取cookie
                get: name => decodeURIComponent(this.getCookiesObj()[name]) || null,
                // 清除某个cookie
                remove: name => {
                  if (this.getCookiesObj()[name]) {
                    document.cookie = `${name}=; max-age=0; path=/`;
                  }
                },
                //清楚某个cookie并指定domain
                removeNet: (name, net) => {
                    if (this.getCookiesObj()[name]) {
                        document.cookie = `${name}=; max-age=0; path=/;domain=${net}`;
                    }
                },
                // 清除所有cookie
                clear: () => {
                  const cookies = this.getCookiesObj();
                  for (const key in cookies) {
                    document.cookie = `${key}=; max-age=0; path=/`;
                  }
                },
                // 清除所有cookie并指定domain
                clearNet: () => {
                    const cookies = this.getCookiesObj();
                    for (const key in cookies) {
                        document.cookie = `${key}=; max-age=0; path=/;domain=${net}`;
                    }
                },
                // 获取所有cookies
                getCookies: () => this.getCookiesObj(),
                // 解决冲突
                noConflict: name => {
                  if (name && typeof name === "string") {
                    if (name && window.cookie) {
                      window[name] = window.cookie;
                      delete window.cookie;
                      return window[name];
                    }
                  } else {
                    return window.cookie;
                  }
                }
            };
        },
        this.encodeSearchParams = function(obj) {
            const params = [];
            
            Object.keys(obj).forEach(key => {
                let value = obj[key];
                // 如果值为undefined我们将其置空
                if (typeof value === "undefined") {
                value = "";
                }
                // 对于需要编码的文本（比如说中文）我们要进行编码
                params.push([key, encodeURIComponent(value)].join("="));
            });
            
            return params.join("&");
        },
        this.showDialog = function(vue, msg) {
            setTimeout(() => {
                vue.$toast(msg);
            }, 0);
        },
        this.getFetch = async function(vue, opt){//移动端用的
            let { url, type, data, noToekn = false, host = window.Config.api } = opt;
            let _body = null;
            let _contentType = "application/x-www-form-urlencoded; charset=UTF-8";
            switch (type.toLocaleUpperCase()) {
                case "GET":
                url = data ? `${url}?${this.encodeSearchParams(data)}` : `${url}`;
                break;
                case "PUT":
                _body = JSON.stringify(data);
                break;
                case "DELETE":
                _body = JSON.stringify(data);
                break;
                default:
                // POST 接收字符串模式
                _body = Object.keys(data)
                    .map(key => {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
                    })
                    .join("&");
            }
            let _headers = { "Content-Type": _contentType }; //设置header值

            return await fetch(host + url, {
                method: type,
                headers: _headers,
                body: _body
            })
                .then(res => res.text())
                .then(res => {
                  if (res) {
                    const _returnData = JSON.parse(res);
                    if (
                        _returnData.code == 40021 || //用户信息错误
                        _returnData.code == 45008 ||
                        _returnData.code == 45007 ||
                        _returnData.code == 45006 ||
                        _returnData.code == 45009
                    ) {
                        let envirhref = window.location.href.toString();
                        if (
                            envirhref.indexOf("//adm.93wgames.com/") != -1 ||
                            envirhref.indexOf("//test-adm.93wgames.com/") != -1
                        ) {
                            console.log("预览模式");
                        } else {
                            Cookie().clearNet(window.Config.wapHost.replace(/^(http||https):\/\//, ""));
                            //登录失败回到登录页面
                            window.location.href = window.Config.wapHost + "/user/login";
                            return false;
                        }
                    }
            
                    if (_returnData.code == 1) {
                        return _returnData;
                    } else {
                        this.showDialog(vue, _returnData.msg);
                        return false;
                    }
                  }
                  //alert(`系统错误${url + JSON.stringify(_body)}`); //不会到这里的。
                });
        },
        this.jumplink = function(url) {
            if (url) {
				window.location.href = window.Config.wapHost + "/" + url;
			} else {
				window.location.href = window.Config.wapHost + "/";
			}
        },
        this.userLogin = async function() {
            let access_token = this.Cookie().get("access_token");
            if (access_token == "undefined" || access_token == "") {
                window.userInfo = null;
            } else if (window.userInfo == null) {
                let opt = {
                    url: "/web/user/userInfo",
                    type: "POST",
                    data: {
                        access_token: access_token
                    }
                };
                const res = await this.getFetch(this, opt);
                if (res.code == 1) {
                    //登录成功
                    window.userInfo = res.data;
                }
            }
        },
        //domain的值
        this.getDomain = function() {
        const location_host = window.Config.wapHost.replace(
            /^(http||https):\/\//,
            ""
        );
        return location_host.substr(location_host.indexOf(".") + 1);
    }
}