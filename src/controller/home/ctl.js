/**
 * Created by hfh on 17/3/15.
 */

define([], function() {
    var flg = true;
    var home = avalon.define({
        $id: "home",
        name: 'home',
        $skipArray: ["events"],
        //////切换类型
        plist: {},
        ///切换对应的项目
        pjList: [],
        nopj: false,
        events: {
            changeTab: function(cid) {
                var _this = this;
                var ops = {
                    index: 1
                };
                if (!!cid) ops.cid = cid;
                //avalon.log(ops);
                $.get(CONFIG.AJAX_URL.plist, ops, function(data) {
                    var dd = data.data;
                    ////遍历处理图片
                    home.nopj = false;
                    if(dd.length<1){
                        home.nopj = true;
                    };
                    home.pjList = clImgs(dd);

                    //是点击触发
                    if (!!_this.nodeName) {
                        $(_this).parent().addClass('on').siblings().removeClass('on');
                    };
                });
            }
        }
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function(params, rs) {

            }
            // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            //avalon.log('22');
            var root = avalon.vmodels.root;

            //默认请求一次全部的内容
            home.events.changeTab();

            //请求分类列表
            //监听请求是否结束
            home.plist = !!root.defaultOptions.proj_cates? root.defaultOptions.proj_cates: {};
            root.$watch("defaultOptions", function() {
                home.plist = root.defaultOptions.proj_cates;
            });


            if (flg) {
                flg = false;
                //添加图片轮播
                im.Viwepager_show('.bannerbox ul', 4000, 1000);
            };
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [home]
    });

    function clImgs(obj){
        var obj = obj;
        for(j in obj){
            switch (parseInt(obj[j].cid1) ) {
                case 1:
                    obj[j].pic = CONFIG.dfHeadImg.c1;
                    break;
                case 2:
                    obj[j].pic = CONFIG.dfHeadImg.c2;
                    break;
                case 14:
                    obj[j].pic = CONFIG.dfHeadImg.c14;
                    break;
                case 15:
                    obj[j].pic = CONFIG.dfHeadImg.c15;
                    break;
                case 16:
                    obj[j].pic = CONFIG.dfHeadImg.c16;
                    break;
                case 24:
                    obj[j].pic = CONFIG.dfHeadImg.c24;
                    break;
                default:
                    // statements_def
                    break;
            }
        }
        //console.log(obj);
        return obj;
    };
})
