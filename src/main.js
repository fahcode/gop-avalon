/**
 * Created by tony on 2016-01-18.
 */
require(['AllAvalon', 'ajaxupload'], function() {
    //一个顶层VM
    var root = avalon.define({
        $id: "root",
        $skipArray: ["events", "publics"],
        //////当前的页面
        pageName: "page",
        pageQuery: {},
        //////当前页面的参数
        pageType: "",
        ///头部导航切换class
        top_class: 'home_top',
        //用户信息
        defaultUserInfo: {},
        //配置信息
        defaultOptions: {},
        pop: null,
        //自定义用户状态信息
        userInfo: {
            isLogin: false,
            nickname: '',
            headimg: '',
            //审核信息
            status_msg: '',
            //性别,f代表不显示，1男，2女
            gender: false,
            ///城市
            city: false,
            //职业
            utype: false,
            //业务范围
            bizscope: [],
            //工作经验
            expyear: false,
            //关于我
            aboutme: '',
            //当前的uid
            ubid: '',
            bidnum: 0,
            worknum: 0
        },
        events: {
            
            applyEve: function(){
                //登陆了
                if(root.userInfo.isLogin){
                    avalon.router.go('myinfo', {ubid: root.defaultUserInfo.user.ubid});

                    return false;
                };
                pop.events.openLoginPop();
            },
            //退出登陆
            loginOut: function() {
                im.ajaxget(root, CONFIG.AJAX_URL.logout, 'GET', 'json', {}, function(data) {
                    //alert(data.msg);
                    $('#login_subNav').hide();
                    root.publics.setPermission(false);
                    avalon.router.go('home');
                });
            },
            //定位
            goWeizhi: function(type){
                if(root.top_class != 'home_top'){
                    avalon.router.go('home');
                    return false;
                }
                var type = $('#'+type);
                var top = parseInt(type.offset().top);
                $('body,html').animate({
                    scrollTop: top
                },1000);
            },
            ///返回顶部
            goTop: function(){
                $('body,html').stop().animate({
                    scrollTop: 0
                },1000);
            }

        },
        publics: {
            //刷新获取状态
            upState: function(page, got) {
                var dfUserInfo;
                //defaultOptions,修改为通过页面静态引入
                root.defaultOptions = gop_options;
                getUserData();

                /*$.getJSON(CONFIG.AJAX_URL.options, function(data){
                    root.defaultOptions = data;
                    getUserData();
                });*/
                function getUserData(){
                    im.ajaxget(root, CONFIG.AJAX_URL.state, 'GET', 'json', {}, function(data) {
                        dfUserInfo = data;

                        //判断是否登陆
                        var isLogin = data.status == 1 ? true : false;
                        //是否需要弹出info弹窗
                        if (isLogin && data.user.ubid == 0 ) {
                            pop.events.openLoginInfo();
                            return false;
                        };

                        root.publics.setPermission(isLogin);

                        //////格式化用户数据
                        root.defaultUserInfo = im.initData(dfUserInfo, root.defaultOptions);
                        /////初始化最基本的用户数据
                        root.publics.initUser(root.defaultUserInfo);

                        if(!!got){
                            ///跳转到个人页面
                            avalon.router.go('myinfo', {ubid: data.user.ubid});
                        }
                        
                    }, function() {
                        // || page == "huibiao" 
                        ////////未登陆的页面跳回到首页
                        if( page == "edit" || (page == "myinfo" && root.pageQuery.preview!=1) || page == "mylists" || page == "flow"){
                            avalon.router.go("home");
                        };
                    });
                };


                /////添加隐藏下拉功能
                $('body').on('click', function(e){
                    var nodeName = e.target.nodeName;
                    var className = e.target.className;

                    if($(e.target).closest('.select').length > 0){
                        return false;
                    }
                    $('.select').attr('st', 1);
                    $('.select>.ul_sele, .select>.selectBox').hide();
                })
            },
            //设置权限和用户状态
            setPermission: function(isLogin) {
                root.userInfo.isLogin = isLogin;
            },
            /////初始化最基本的用户数据
            initUser: function(dd){
                root.userInfo.headimg = dd.base.headimg.length<1?(CONFIG.dfPhoto.headimg):dd.base.headimg;
                root.userInfo.nickname = dd.base.nickname;
                root.userInfo.status_msg = dd.base.status_msg;
                //性别,f代表不显示，1男，2女
                root.userInfo.gender = dd.base.gender;
                if (dd.base.gender != 1 && dd.base.gender != 2) {
                    root.userInfo.gender = false;
                };
                ///城市
                root.userInfo.city = dd.base.city.length < 1 ? '' : (dd.base.city);
                //职业
                root.userInfo.utype = dd.base.utype_v.length < 1 ? false : (dd.base.utype_v);
                //业务范围
                if (dd.base.bizscope.length > 0){
                    var narr = [],
                        tmps = dd.base.bizscope_arr;
                    for(var g in tmps){
                        if( !isNaN(Number(g)) ){narr.push(tmps[g]);}
                    }
                    root.userInfo.bizscope = narr;
                };
                //工作经验
                root.userInfo.expyear = dd.base.expyear_v.length < 1 ? false : (dd.base.expyear_v);
                //关于我
                root.userInfo.aboutme = dd.base.aboutme.length < 1 ? '' : (dd.base.aboutme.replace(/\n/g, "<br>"));

                root.userInfo.ubid = dd.user.ubid;
                ////获取数据
                root.userInfo.bidnum = dd.wcount.bid;
                root.userInfo.worknum = dd.wcount.work;
            }
        }

    });

    //pop的VM
    var pop = avalon.define({
        $id: "pop",
        $skipArray: ["events"],
        //$root: root,
        //图片验证码
        captimg: CONFIG.AJAX_URL.captimg,
        //手机验证码倒计时控制
        clickTime: 0,
        //from数据
        forms: {
            login: {
                phone: '',
                password: ''
            },
            register: {
                phone: '',
                imgCode: '',
                msgCode: '',
                password: '',
                isGou: false
            },
            info: {
                headimg: '',
                nickname: ''
            },
            fgtpwd: {
                sep2: false,
                sep3: false,
                password1: '',
                password2: ''
            }
        },
        //显示弹窗
        showPop: {
            dologinPop: false,
            registerPop: false,
            infoPop: false,
            forgetPasPop: false,
            submitTips: false,
            permisTips: false,
            applyTips: false,
            inputCodeTips: false
        },
        events: {
            //打开登陆弹窗
            openLoginPop: function() {
                pop.forms.login.phone = '';
                pop.forms.login.password = '';
                
                //全部隐藏
                pop.events.closeAllPop();
                pop.showPop.dologinPop = true;
            },
            //打开注册弹窗
            openRegister: function() {
                //全部隐藏
                pop.events.closeAllPop();
                pop.showPop.registerPop = true;
                //重置数据
                pop.forms.register.phone = '';
                pop.forms.register.imgCode = '';
                pop.forms.register.msgCode = '';
            },
            openLoginInfo: function() {
                //全部隐藏
                pop.events.closeAllPop();
                pop.showPop.infoPop = true;
                ////创建图片上传提交
                im.setImg('uploadImgBtn',CONFIG.AJAX_URL.headimg,'headimg', {},function(btn, path){
                    console.log(btn)
                    console.log(path)
                    btn.find('img').attr('src', path).show();
                });
            },
            //打开忘记密码弹窗
            forgetPasPop: function() {
                //全部隐藏
                pop.events.closeAllPop();
                pop.showPop.forgetPasPop = true;
                //重置数据
                pop.forms.register.phone = '';
                pop.forms.register.imgCode = '';
                pop.forms.register.msgCode = '';
            },
            openSubmitTips: function(){
                pop.events.closeAllPop();
                pop.showPop.submitTips = true;
            },
            openPermisTips: function(){
                pop.events.closeAllPop();
                pop.showPop.permisTips = true;
            },
            openApplyTips: function(){
                pop.events.closeAllPop();
                pop.showPop.applyTips = true;
            },
            openInputCodeTips: function(){
                var gg = pop.showPop.registerPop;
                var fg = pop.showPop.forgetPasPop;
                pop.events.closeAllPop();
                if(gg) pop.showPop.registerPop = true;
                if(fg) pop.showPop.forgetPasPop = true;

                pop.showPop.inputCodeTips = true;
            },
            closeAllPop: function() {
                pop.showPop.dologinPop = false;
                pop.showPop.registerPop = false;
                pop.showPop.forgetPasPop = false;

                pop.showPop.submitTips = false;
                pop.showPop.permisTips = false;
                pop.showPop.applyTips = false;

                pop.showPop.inputCodeTips = false;
                //不能手动关闭
                //pop.showPop.infoPop = false;
                //重置值
                //重置数据
                
            },
            closeCodePop: function(){
                pop.showPop.inputCodeTips = false;
            },
            //切换图片验证码
            cg_captimg: function() {
                pop.captimg = CONFIG.AJAX_URL.captimg + '&tm=' + (new Date().getSeconds());
                pop.forms.register.imgCode = '';
            },
            doGou: function(){
                pop.forms.register.isGou = !pop.forms.register.isGou;
            },
            //弹窗输入图片验证码
            popInputCode: function(){
                var _this = this;
                if (pop.forms.register.phone.length < 11) {
                    //alert('');
                    var oo = new im.creatPop(this, { tit: '请填写手机号码！', cancelTxt: '确认' });
                    return false;
                };
                pop.events.openInputCodeTips();
                ///////////开始获取
                //pop.events.getPhoneCode();
            },
            //获取手机验证码
            getPhoneCode: function(btnele) {
                
                ///计数器
                if (pop.clickTime != 0) {
                    return false;
                };
                var _this = this;
                /////有按钮参数时
                if(!!btnele) _this = document.getElementById(btnele);
                ////点击的是注册弹窗
                if(pop.showPop.registerPop) _this = document.getElementById(btnele+'_pop');
                ////点击是忘记密码弹窗
                if(pop.showPop.forgetPasPop) _this = document.getElementById(btnele+'_fg');
                
                var text = _this.textContent;
                var dfColor = _this.style.color;

                var phone = pop.forms.register.phone;
                var imgCode = pop.forms.register.imgCode;
                if(pop.showPop.forgetPasPop){
                    ////参数未改变
                    phone = pop.forms.register.phone;
                    imgCode = pop.forms.register.imgCode;
                }
                if (phone.length < 11 || imgCode.length < 4) {
                    //alert();
                    var pp = new im.creatPop(this, { tit: CONFIG.TIPS.registerCode, cancelTxt: '确认' });

                    return false;
                };
                ////开启按钮计时
                pop.clickTime = 59;
                var timer = setInterval(function() {
                    _this.textContent = pop.clickTime + "s后获取";
                    _this.style.color = "#838383";
                    pop.clickTime--;
                    if (pop.clickTime <= 0) {
                        resetBtn();
                    }
                }, 1000);

                var ops = {
                    mobile: phone,
                    captcha: imgCode
                };
                //获取短信验证码
                im.ajaxget(pop, CONFIG.AJAX_URL.smscode, 'POST', 'json', ops, function(data) {
                    //alert();
                    var oo = new im.creatPop(this, { tit: data.msg, cancelTxt: '确认' });

                    /////隐藏窗口
                    pop.showPop.inputCodeTips = false;

                }, function(result) {
                    //alert(result.msg);
                    var oo = new im.creatPop(this, { tit: result.msg, cancelTxt: '确认' });
                    pop.events.cg_captimg();
                    resetBtn();
                });

                //重置按钮
                function resetBtn() {
                    clearInterval(timer);
                    pop.clickTime = 0;
                    _this.style.color = dfColor;
                    _this.textContent = text;
                }
            },
            //提交表单
            setFrom: function(type, isRule) {
                var url = CONFIG.AJAX_URL.login;
                var ops = {};
                var _callback;
                //登陆提交
                if (type == 'login') {
                    ops = {
                        mobile: pop.forms.login.phone,
                        password: pop.forms.login.password
                    };
                    ////////手机登陆验证
                    if( !im.formValidator.phoneLogin(pop.forms.login.phone, pop.forms.login.password) ){
                        return false;
                    };
                    _callback = function(data) {
                        //修改登陆状态
                        root.publics.setPermission(true);
                        //关闭弹窗
                        pop.events.closeAllPop();

                        //是否需要弹出info弹窗
                        if (data.user.ubid == 0) {
                            pop.events.openLoginInfo();
                        }else{
                            ////处理登陆后的用户信息
                            root.defaultUserInfo = im.initData(data, root.defaultOptions);
                            ////初始化最基本的用户数据
                            root.publics.initUser(root.defaultUserInfo);
                        }
                    };
                } else if (type == 'register') {
                    //注册提交
                    url = CONFIG.AJAX_URL.register;
                    ops = {
                        mobile: pop.forms.register.phone,
                        smscode: pop.forms.register.msgCode,
                        password: pop.forms.register.password
                    };
                    ////////手机注册验证
                    if( !im.formValidator.phoneLogin(pop.forms.register.phone, pop.forms.register.password, pop.forms.register.msgCode) ){
                        return false;
                    };
                    ///////用户协议 判断
                    if(!!isRule){
                        if(!pop.forms.register.isGou){
                            //alert('请同意《用户协议》');
                            var oo = new im.creatPop(this, { tit: '请同意《用户协议》', cancelTxt: '确认' });
                            return false;
                        }
                    };
                    _callback = function() {
                        //打开info弹窗
                        pop.events.openLoginInfo();
                    };
                } else {
                    //注册信息提交
                    url = CONFIG.AJAX_URL.nickname;
                    ops = {
                        headimg: pop.forms.info.headimg,
                        nickname: pop.forms.info.nickname
                    };
                    if(pop.forms.info.nickname.length<1){
                        //alert('请输入昵称！');
                        var oo = new im.creatPop(this, { tit: '请输入昵称！', cancelTxt: '确认' });
                        return false;
                    };
                    _callback = function(data) {
                        //修改用户状态
                        //root.userInfo.headimg = (pop.forms.info.headimg.length<1)?(CONFIG.dfPhoto.headimg):pop.forms.info.headimg;
                        //root.userInfo.nickname = pop.forms.info.nickname;
                        ////再次请求初始化数据
                        root.publics.upState('home', true);
                        //关闭弹窗
                        pop.showPop.infoPop = false;
                        //修改登陆状态
                        root.publics.setPermission(true);
                    };
                };
                //发送
                im.ajaxget(pop, url, 'POST', 'json', ops, function(data) {
                    /////登陆后
                    /////注册后
                    /////填写昵称
                    _callback(data);
                });
            },
            //忘记密码
            forgetPas: function(type){
                var url = '';
                var ops = {};
                var _callback;
                //找回密码第一步
                if (type == 'sep1') {
                    //注册提交
                    url = CONFIG.AJAX_URL.fgtpwd;
                    ops = {
                        mobile: pop.forms.register.phone,
                        smscode: pop.forms.register.msgCode
                    };
                    ////////手机注册验证
                    if( !im.formValidator.phoneLogin(pop.forms.register.phone, pop.forms.register.msgCode) ){
                        return false;
                    };
                    _callback = function() {
                        //显示第二部
                        pop.forms.fgtpwd.sep2 = true;
                    };
                };
                if (type == 'sep2') {
                    //注册提交
                    url = CONFIG.AJAX_URL.resetpwd;
                    ops = {
                        password: pop.forms.fgtpwd.password1,
                        repassword: pop.forms.fgtpwd.password2
                    };
                    ///不为空，且相等表单验证
                    if (!im.formValidator.noNUll_deng([pop.forms.fgtpwd.password1, pop.forms.fgtpwd.password2], ['新密码', '重复密码'])) {
                        return false;
                    }
                    _callback = function() {
                        //显示第三部
                        pop.forms.fgtpwd.sep2 = false;
                        pop.forms.fgtpwd.sep3 = true;
                    };
                }
                //发送
                im.ajaxget(pop, url, 'POST', 'json', ops, function(data) {
                    /////登陆后
                    /////注册后
                    /////填写昵称
                    _callback(data);
                });
            },
            goHome: function(){
                if(root.pageName == 'home'){
                    pop.events.closeAllPop();
                }else{
                    avalon.router.go('home');
                }
            }
        }
    });


    /************* 路由 **************/
    avalon.state("index", {
        url: "/",
        views: {
            "": {
                templateUrl: "./controller/home/tpl.html",
                controllerUrl: "./controller/home/ctl.js"
            }
        }
    }).state("home", {
        url: "/home",
        views: {
            "": {
                templateUrl: "./controller/home/tpl.html",
                controllerUrl: "./controller/home/ctl.js"
            }
        }
    }).state("details", {
        url: "/details/{pageId}",
        views: {
            "": {
                templateUrl: "./controller/details/tpl.html",
                controllerUrl: "./controller/details/ctl.js"
            }
        }
    }).state("plist", {
        url: "/plist/{colu}",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/plist/tpl.html",
                controllerUrl: "./controller/plist/ctl.js"
            }
        }
    }).state("guide", {
        url: "/guide",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/guide/tpl.html"
            }
        }
    }).state("edit", {
        url: "/edit",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/edit/tpl.html",
                controllerUrl: "./controller/edit/ctl.js",
                cacheController: false
            }
        }
    }).state("myinfo", {
        url: "/myinfo/{ubid}",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/myinfo/tpl.html",
                controllerUrl: "./controller/myinfo/ctl.js"
            }
        }
    }).state("mylists", {
        url: "/mylists/{type}",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/mylists/tpl.html",
                controllerUrl: "./controller/mylists/ctl.js"
            }
        }
    }).state("connectUs", {
        url: "/connectUs",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/connectUs/tpl.html",
                controllerUrl: "./controller/connectUs/ctl.js"
            }
        }
    }).state("projects", {
        url: "/projects",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/projects/tpl.html",
                controllerUrl: "./controller/projects/ctl.js"
            }
        }
    }).state("flow", {
        url: "/flow/{fid}/{type}",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/flow/tpl.html",
                controllerUrl: "./controller/flow/ctl.js"
            }
        }
    }).state("huibiao", {
        url: "/huibiao/{fid}",
        //abstract: true,
        views: {
            "": {
                templateUrl: "./controller/huibiao/tpl.html",
                controllerUrl: "./controller/huibiao/ctl.js"
            }
        }
    });

    avalon.state.config({
        onError: function() {
            //avalon.log(arguments);
        },
        onBeforeUnload:function(){
            //avalon.log('00');
        },
        onBegin: function(params, rs) {
            //avalon.log('11');

            var pageName = this.currentState.stateName;
            root.pageName = pageName;
            root.pageQuery = this.query;
            /////不带有路由
            /*if (pageName == undefined) {
                avalon.router.go("home", {
                    reload: true
                });
            };*/
            //////控制头部
            if (pageName == 'index'||pageName == 'home') {
                root.top_class = "home_top";
            } else if (pageName == 'guide') {
                root.top_class = "guide_top";
            } else if (pageName == 'edit' || pageName == 'myinfo' || pageName == 'mylists' || pageName == 'flow' || pageName == 'huibiao') {
                root.top_class = "edit_top";
            } else {
                root.top_class = "inner_top";
            };

            root.pop = pop;
            
            ////控制在1366屏幕下
            if( parseInt($(document).width()) <= 1366){
                $('body').addClass('small');
            }
        },
        ///进入视图
        onLoad: function(params, rs) {
            //avalon.log('44');
            /**** 需要监听的方法在后续请求 ****/
            ////获取状态
            root.publics.upState(rs.stateName);
            //添加滚动事件监听
            $(window).scroll(function(){
                var top = $(document).scrollTop();
                if(top>300){
                    $('#goTop').show();
                }else{
                    $('#goTop').hide();
                }
            });
            /////登陆菜单下拉效果
            im.pullDown('login_isl', 'login_subNav');

        },
        onViewEnter: function(newNode, oldNode) {
            avalon(oldNode).animate({
                marginLeft: "-100%"
            }, 500, "easein", function() {
                oldNode.parentNode && oldNode.parentNode.removeChild(oldNode)
            })

        } // 不建议使用动画，因此实际使用的时候，最好去掉onViewEnter和ms-view元素上的oni-mmRouter-slide
    });

    //启动路由
    avalon.history.start({
        //basepath: "/mmRouter"
        fireAnchor: false
    });
    //自定义过滤器
    avalon.filters.htmlwrap = function(str){
        if(!!str){
            var nowstr = str.replace(/\n/g, "<br/>");
            return nowstr;
        }
        return str;
    }
    avalon.filters.wutxt = function(str){
        if(str==""||str==undefined) return "/"; 
        return str;
    }
    //go!!!!!!!!!
    avalon.scan();

});




