/**
 * Created by hfh on 17/3/15.
 */

define([], function() {
    var connectUs = avalon.define({
        $id: "connectUs",
        name: 'connectUs'
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function() {
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [connectUs]
    })
})