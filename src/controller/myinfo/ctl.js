/**
 * Created by hfh on 17/3/15.
 */
define([], function() {
    var myinfo = avalon.define({
        $id: "myinfo",
        $skipArray: ["events"],
        name: 'myinfo',
        base: {
            bizscope: [],
            bizscope_arr: []
        },
        company: {},
        bizreg: {},
        personal: {},
        payinfo: {},
        work: [],

        //////完整度
        editPlan: {
            headImg: false,
            forme: false,
            base: false,
            works: false,
            comp: false,
            myf: false,
            biz: false,
            pay: false,
            isShowSubmit: false
        },
        ////编辑状态
        editState:{
            isTeamState: false
        },
        is_show: true,
        ////是否是预览
        isPreview: false,
        ///事件方法
        events: {
            //定位
            goWeizhi: function(type) {
                var type = $('#' + type);
                var top = parseInt(type.offset().top) - 80;
                $('body').animate({
                    scrollTop: top
                }, 1000);
            }
        }
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //滚动跟随
            im.scrollFn('.top_bar');
        };
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            var root = avalon.vmodels.root;
            //avalon.log(root.userInfo.ubid)
            //参数
            var ubid = params.ubid;
            ///是否带有预览
            var qs = '?ubid='+ubid;
            var preview = root.pageQuery.preview;
            if(preview != undefined){
                qs = '?ubid='+ubid+"&preview="+preview;
                myinfo.isPreview = true;
            }
            //监听请求是否结束
            root.$watch("defaultOptions", function(){
                var ops  = root.defaultOptions;
                //if(ubid=="") ubid = root.userInfo.ubid;

                $.get(CONFIG.AJAX_URL.allinfo + qs, function(data){
                    var initData = im.initData(data, ops);
                    //////初始化用户数据
                    //myinfo.user = initData.user;
                    myinfo.base = initData.base;
                    //如果无图
                    if(myinfo.base.headimg == "") myinfo.base.headimg=CONFIG.dfPhoto.headimg;
                    myinfo.base.bizscope = initData.base.bizscope.split('/');
                    myinfo.base.bizscope_arr = !!initData.base.bizscope_arr? initData.base.bizscope_arr: [];
                    myinfo.base.aboutme = initData.base.aboutme.replace(/\n/g, "<br>");


                    myinfo.company = !!initData.company?(initData.company):false;
                    myinfo.bizreg = !!initData.bizreg?(initData.bizreg):false;

                    myinfo.personal = !!initData.personal?(initData.personal):false;

                    myinfo.payinfo = !!initData.payinfo?(initData.payinfo):false;

                    myinfo.work = im.setArrar(initData.work);

                    if(initData.base.utype == 3 || initData.base.utype == 4){
                        myinfo.editState.isTeamState = true;
                    };
                    //////判断填写状态
                    submitState(data);
                });
            });
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [myinfo]
    });
    

    ////判断整体编辑的状态，对应的是未处理后的数据
    function submitState(df) {
        myinfo.editPlan.headImg = df.base.headimg.length < 1 ? false : true;
        myinfo.editPlan.forme = df.base.aboutme.length < 1 ? false : true;
        myinfo.editPlan.base = df.base.utype ? true : false;

        myinfo.editPlan.works = df.work.length < 2 ? false : true;

        myinfo.editPlan.comp = !!df.company ? true : false;
        myinfo.editPlan.myf = !!df.personal ? true : false;
        var ist = myinfo.editPlan.biz = !!df.bizreg  ? true : false;
        /////如果当前不是团队，biz是没有的
        if(!myinfo.editState.isTeamState){
            var ist =  true;
        }

        myinfo.editPlan.pay = !!df.payinfo ? true : false;
    };
})