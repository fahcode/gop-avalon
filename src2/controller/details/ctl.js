/**
 * Created by hfh on 17/3/15.
 */

define([], function() {
    var details = avalon.define({
        $id: "details",
        $skipArray: ["events", "root"],

        name: 'details',
        root: null,
        data: {
            descimg: [],
            ptags: []
        },
        isapply: {
            s: false,
            t: '发送申请意向'
        },
        isshowfile: false,
        filetype: "m1",
        events: {
            apply_btn: function(id, isend){
                var _this = this;
                /////已结束
                if(isend == 1){
                    return false;
                };
                //avalon.log(id)
                $.post(CONFIG.AJAX_URL.apply, {pid: id},  function(data){
                    ///未登陆
                    if(data.status == -9){
                        details.root.pop.events.openLoginPop();
                        return false;
                    };
                    //未填写基本信息
                    if(data.status == -1){
                        details.root.pop.events.openPermisTips();
                        return false;
                    };
                    ///已经提交过
                    if(data.status == -2){
                        details.root.pop.events.openApplyTips();
                        return false;
                    };
                    /////提交成功
                    if(data.status == 1){
                        details.root.pop.events.openApplyTips();
                        _this.innerHTML = "已申请";
                        return false;
                    };
                    //alert();
                    var pp = new im.creatPop(this, { tit: data.msg, cancelTxt: '确认' });
                });
            }
        }
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            
        }
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            details.root = avalon.vmodels.root;
            var pageId = params.pageId !== "" ? params.pageId : 0;
            
            var qs = {
               id: pageId
            }
            var preview = details.root.pageQuery.preview;
            if(preview != undefined){
                qs.preview = preview;
            }

            $.get(CONFIG.AJAX_URL.detail, qs, function(data){
                details.data = data;
                details.data.descimg = (data.descimg.length<1)? []: data.descimg;

                if(data.isapply==1){
                    details.isapply.s = true;
                    details.isapply.t = '已申请';
                };
                //文件显示
                if(details.data.attachment!=""){
                    details.isshowfile = true;
                    //判断类型
                    if(details.data.fileext == "doc"){
                         details.filetype = "img m1";
                    }else if(details.data.fileext == "pdf"){
                        details.filetype = "img m2";
                    }else if(details.data.fileext == "pptx"){
                        details.filetype = "img m3";
                    }else if(details.data.fileext == "rar"){
                        details.filetype = "img m4";
                    }else if(details.data.fileext == "xls"){
                        details.filetype = "img m5";
                    }else if(details.data.fileext == "zip"){
                        details.filetype = "img m6";
                    }
                }
                
                ////控制页面高度铺满
                setTimeout(function(){
                    im.showMaxHeigh('.details', 460);

                    im.goWeizhi('.dt_pj_info', 500);
                },100)
            });

            im.imgbigpop('.imgbig');
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [details]
    })
})