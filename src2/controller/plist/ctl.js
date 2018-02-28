/**
 * Created by hfh on 17/3/15.
 */

define([], function() {
    var plist = avalon.define({
        $id: "plist",
        name: 'plist',
        list: {},
        colu: ''
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
        }
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            var colu = '' + params.colu;
            if(colu.length>0){
                plist.colu = colu;
            }else{
                plist.colu = '';
            };

            var root = avalon.vmodels.root;
            //监听请求是否结束
            root.$watch("defaultOptions", function(){
                plist.list = root.defaultOptions.proj_cates;
                //console.log(plist.list)
                ///////定位到
                if(root.pageName == 'plist') im.goWeizhi('.plist_pj_list', 500);
            });
            
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [plist]
    })
})