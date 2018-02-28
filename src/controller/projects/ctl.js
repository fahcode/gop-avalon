/**
 * Created by hfh on 17/3/15.
 */

define([], function() {
    var projects = avalon.define({
        $id: "projects",
        name: 'projects',
        //////切换类型
        plist: {},
        ///切换对应的项目
        pjList: [],

        cid: null,
        rowNum: 7,
        ////是否是最后一段，且显示一个dot
        isLastRow: false,
        //当前的页数
        nowpage: 1,
        ///总条数
        total: 1,
        //总页数
        allpage: 1,
        ///总共组数
        allRow: 1,
        /////循环使用的数组
        pagelist: [],
        nopj: false,
        events: {
            changeTab: function(cid, page) {
                var _this = this;
                var ops = {
                    page: page
                };
                if (!!cid) ops.cid = projects.cid = cid;

                //avalon.log(ops);
                $.get(CONFIG.AJAX_URL.plist, ops, function(data) {
                    ////遍历处理图片
                    projects.nopj = false;
                    if(data.data.length<1){
                        projects.nopj = true;
                    };
                    projects.pjList = clImgs(data.data);

                    ////设置翻页数据
                    //总页数
                    projects.allpage = parseInt(data.total/data.per_page) + ( (data.total%data.per_page != 0)? 1: 0);
                    //当前页码
                    projects.nowpage = data.current_page;
                    ///总条数
                    projects.total = data.total;
                    ///总共组数
                    projects.allRow = parseInt(projects.allpage/projects.rowNum)+( (projects.allpage%projects.rowNum != 0)? 1: 0);

                    //////当前需要显示的，在那一段（7条为一组）
                    var gonum = parseInt(projects.nowpage/projects.rowNum)+( (projects.nowpage%projects.rowNum != 0)? 1: 0);

                    //如果是最后一段
                    if(projects.allRow == gonum){
                        projects.isLastRow = true;
                    }else{
                        projects.isLastRow = false;
                    }

                    projects.pagelist = [];
                    for(var i = (gonum-1)*projects.rowNum+1;i<=gonum*projects.rowNum ;i++){
                        /////插入page
                        if(i<=projects.allpage){
                            projects.pagelist.push(i);
                        }
                    }
                    
                    //是点击触发
                    if (!!_this.nodeName) {
                        $(_this).parent().addClass('on').siblings().removeClass('on');
                    };
                });
            },
            /////切换页面
            goPage: function(page){
                /////切换到最后一页
                console.log(page);
                projects.events.changeTab(projects.cid, page);
            },
            prePage:function(){
                if(projects.nowpage != 1){
                    projects.nowpage--;

                    projects.events.changeTab(projects.cid, projects.nowpage);
                }
            },
            nextPage: function(){
                if(projects.nowpage != projects.allpage){
                    projects.nowpage++;
                    
                    projects.events.changeTab(projects.cid, projects.nowpage);
                }
            }
        }
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
        }
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            //avalon.log('22');
            var root = avalon.vmodels.root;

            //默认请求一次全部的内容
            projects.events.changeTab();

            //请求分类列表
            //监听请求是否结束
            projects.plist = !!root.defaultOptions.proj_cates? root.defaultOptions.proj_cates: {};
            root.$watch("defaultOptions", function() {
                projects.plist = root.defaultOptions.proj_cates;
            });
            
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [projects]
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