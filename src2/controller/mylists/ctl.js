/**
 * Created by hfh on 17/3/15.
 */
define(['timexiala'], function() {
    var mylists = avalon.define({
        $id: "mylists",
        $skipArray: ["events"],
        name: 'mylists',
        list_tpl: {
            ///默认显示第几个
            idx: 1,
            tpl: './controller/mylists/myWorkList.html'
        },
        times:{
            dfYear: '',
            dfMonth: '',
            year: ['-', '2028', '2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018','2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008'],
            month: ['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        ///事件方法
        events: {
            //定位
            goWeizhi: function(type) {
                var type = $('#' + type);
                var top = parseInt(type.offset().top) - 80;
                $('body').animate({
                    scrollTop: top
                }, 1000);
            },
            //切换select,控制显示隐藏下拉
            chkSelect: function(ele) {
                var sele = $(this).find('.ul_sele');
                if (!!ele) sele = $(this).find(ele);

                var st = this.getAttribute('st');
                st = st == 1 ? 2 : 1;


                $('.select').attr('st', 1);
                this.setAttribute('st', st);

                if (st == 2) {
                    $('.select>.ul_sele').hide();
                    sele.fadeIn();
                } else {
                    sele.fadeOut();
                }
            },
            selectv: function(el, dw, type){
                var vvdom = $(this).closest('.ul_sele').prev('.selt_v');
                vvdom.text(el + dw);
                if(el == "-") el = "";

                if(type == "work"){
                    if(dw == '年') myWorkList.searchInfo.year = el; 
                    if(dw == '月') myWorkList.searchInfo.month = el;
                }else{
                    if(dw == '年') myBidList.searchInfo.year = el; 
                    if(dw == '月') myBidList.searchInfo.month = el;
                }
            },
            createArr: function(num, start){
                var start = !!start? start: 0;
                var arr = [];
                for(var i = start;i<num;i++){
                    arr.push(i)
                }
                return arr;
            }
        },
        /////模版加载完成回调
        topLoaded: function(){
            if(mylists.list_tpl.idx == 1){

            }else{
                //myBidList.events.Calendar();
            }
            
        }

    });

    var myWorkList = avalon.define({
        $id: "myWorkList",
        $skipArray: ["events", "mylists"],
        mylists: mylists,
        ///status   -1=未中标 0=竞标中 1=中标
        plist: [],
        pages: 0,
        showpage: [],
        cur: 0,
        searchInfo:{
            name: '',
            year: '',
            month: ''
        },
        
        ///事件方法
        events: {
            search: function(idx){
                var cur = 1;
                if(typeof idx === 'number') cur = idx;
                var ops = {
                    keyword: myWorkList.searchInfo.name,
                    year: myWorkList.searchInfo.year,
                    month: myWorkList.searchInfo.month,
                    page: cur
                }
                console.log(ops)
                ////创建表单提交
                im.ajaxget(mylists, CONFIG.AJAX_URL.myworks, 'GET', 'json', ops, function(data) {
                    myWorkList.plist = data.data;
                    var pages = parseInt(data.total/data.per_page)+(data.total%data.per_page==0? 0: 1);

                    var start = parseInt(myWorkList.cur/5) * 5;
                    var end = (start+5)>pages? pages: (start+5);

                    myWorkList.showpage = mylists.events.createArr(end, start);
                });
            },
            dopages: function(idx){
                var idx = idx;
                if(idx == 'pre') idx = myWorkList.cur - 1;
                if(idx == 'next') idx = myWorkList.cur + 1;
                idx = idx>(myWorkList.pages-1)? (myWorkList.pages-1): (idx<0? 0: idx);
                myWorkList.cur = idx;
                myWorkList.events.search(1+idx);
            }
        }
    });
    ////////我的竞标列表
    var myBidList = avalon.define({
        $id: "myBidList",
        $skipArray: ["events", "mylists"],
        mylists: mylists,
        ///status   -1=未中标 0=竞标中 1=中标
        plist: [],
        pages: 0,
        showpage: [],
        cur: 0,
        searchInfo:{
            name: '',
            year: '',
            month: ''
        },
        
        ///事件方法
        events: {
            //添加时间插件
            Calendar: function(){
                //时间选择
                //下拉日历
                var selYear = document.getElementById("myBidList_cd1");
                var selMonth = document.getElementById("myBidList_cd2");
                //var selDay = window.document.getElementById("selDay");
                new DateSelector(selYear, selMonth , null);

                ///设置默认值
                var dt = new Date();
                myBidList.searchInfo.year = dt.getFullYear();
                myBidList.searchInfo.month = dt.getMonth() + 1;
            },
            search: function(idx){
                var cur = 1;
                if(typeof idx === 'number') cur = idx;
                var ops = {
                    keyword: myBidList.searchInfo.name,
                    year: myBidList.searchInfo.year,
                    month: myBidList.searchInfo.month,
                    page: cur
                }
                console.log(ops)
                ////获取竞标数据
                im.ajaxget(mylists, CONFIG.AJAX_URL.myapplys, 'GET', 'json', ops, function(data) {
                    myBidList.plist = data.data;
                    var pages = parseInt(data.total/data.per_page)+(data.total%data.per_page==0? 0: 1);
                    var start = parseInt(myBidList.cur/5) * 5;
                    var end = (start+5)>pages? pages: (start+5);

                    myBidList.showpage = mylists.events.createArr(end, start);
                });
            },
            dopages: function(index){
                var idx = index;
                if(idx == 'pre') idx = myBidList.cur - 1;
                if(idx == 'next') idx = myBidList.cur + 1;
                idx = idx>(myBidList.pages-1)? (myBidList.pages-1): (idx<0? 0: idx);
                myBidList.cur = idx;
                myBidList.events.search(1+idx);
            }
        }
    });

    ////////我的竞标详情
    /*var myDetails = avalon.define({
        $id: "myDetails",
        $skipArray: ["events", "mylists"],
        mylists: mylists,
        ///status   -1=未中标 0=竞标中 1=中标
        plist: [],
        searchInfo:{
            name: '',
            year: '',
            month: ''
        },
        
        ///事件方法
        events: {
            //添加时间插件
            Calendar: function(){
                //时间选择
                //下拉日历
                var selYear = document.getElementById("myBidList_cd1");
                var selMonth = document.getElementById("myBidList_cd2");
                //var selDay = window.document.getElementById("selDay");
                new DateSelector(selYear, selMonth , null);

                ///设置默认值
                var dt = new Date();
                myBidList.searchInfo.year = dt.getFullYear();
                myBidList.searchInfo.month = dt.getMonth() + 1;
            },
            search: function(){
                var ops = {
                    pname: myBidList.searchInfo.name,
                    year: myBidList.searchInfo.year,
                    month: myBidList.searchInfo.month
                }
                ////创建表单提交
                im.ajaxget(mylists, CONFIG.AJAX_URL.myapplys, 'GET', 'json', ops, function(data) {
                    myBidList.plist = data.data;
                });
            }
        }
    });*/



    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            
        };
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            var root = avalon.vmodels.root;
            var type = '' + params.type;

            root.pageType = type;

            /////////获取当前的数据
            var url = CONFIG.AJAX_URL.myworks;

            if(type == 'bidlist'){
                mylists.list_tpl.idx = 2;
                mylists.list_tpl.tpl = './controller/mylists/myBidList.html';
                url = CONFIG.AJAX_URL.myapplys;
            }else if(type == 'worklist'){
                mylists.list_tpl.idx = 1;
                mylists.list_tpl.tpl = './controller/mylists/myWorkList.html';
            };


            //默认请求数据
            $.getJSON(url, function(data) {
                var pages = parseInt(data.total/data.per_page)+(data.total%data.per_page==0? 0: 1),
                    pageArr = mylists.events.createArr( (pages>5? 5: pages) );

                if(type == 'bidlist'){
                    myBidList.plist = data.data
                    myBidList.pages = pages;
                    myBidList.showpage = pageArr;
                }else{
                    myWorkList.plist = data.data;
                    myWorkList.pages = pages;
                    myWorkList.showpage = pageArr;
                }
            });


            ////控制页面高度铺满
            setTimeout(function(){
                im.showMaxHeigh('.mylists', 334);
            },100);
            //设置默认当前年月
            var dt = new Date();

            //myWorkList.searchInfo.year = myBidList.searchInfo.year = mylists.times.dfYear = dt.getFullYear();
            //myWorkList.searchInfo.month = myBidList.searchInfo.month = mylists.times.dfMonth = dt.getMonth() + 1;

        };
        //对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [mylists]
    });
})
