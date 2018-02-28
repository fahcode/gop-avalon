/**
 * Created by hfh on 17/3/15.
 */

var invoice_content_temp = ""; ////临时的发票内容

define(['timexiala'], function() {
    var huibiao = avalon.define({
        $id: "huibiao",
        $skipArray: ["events"],
        dfOptions: null,
        name: 'huibiao',
        showPop: false,
        helpPop: true,
        //默认按钮状态
        buttonState: 2,
        //接口数据
        infos: {
            type: "",
            content: [{},{},{},{},{}],
            medias: []
        },
        files: [],
        fid: "",
        htype: 1,
        
        //提交数据
        editData: {
            //媒体名称
            media_name: "",
            media_id: "",
            //广告媒体 
            ad_medias: "",
            //广告投放平台    
            ad_platform: "",
            //合作模式
            ctype: "",
            //主要广告形式    
            ad_style: "",
            //价格
            price: "",
            //折扣
            discount: "",
            //配送
            distribution: "",
            //账期
            accperiod: "3个月",
            //发票类型 
            invoice_type: "增值税普通发票",
            //发票内容  
            invoice_content: "广告费",
            //是否需要对接
            docking: 3,
            //对接类型
            docking_type: "",
            //数据核对方式
            data_check: "",
            //备注
            remark: "",
            //默认不是修改
            id: false,

            ////上传的文件
            otherfiles: {
                showList: [],
                subList: ""
            },
            //招标附件
            bidfiles: {
                showList: [],
                subList: ""
            },
            /////是否同意条款
            isClause: false
        },
        replys: {
            bidfiles: [],
            otherfiles: []
        },
        result: [],
        result_date: "",
        result_publicity: "",
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
            //选中
            selected: function(type, key, val) {
                if(type == "invoice_content") huibiao.editData.invoice_content = val;
                if(type == "medias"){
                    huibiao.editData.media_name = val;
                    huibiao.editData.media_id = key;
                }
                if(type == "accperiod"){
                    huibiao.editData.accperiod = key;
                }
            },
            selectRadio: function(type,val){
                if (type == 'docking_type') {
                    huibiao.editData.docking_type = val;
                }else if(type == 'docking'){
                    huibiao.editData.docking = val;
                }else if(type == 'ctype'){
                    console.log(val)
                    //合作模式
                    huibiao.editData.ctype = val;
                    console.log(huibiao.editData.ctype)
                }else if(type == 'ad_platform'){
                    //适应版本
                    huibiao.editData.ad_platform = val;
                }else if(type == 'isClause'){
                    //现在同意条款
                    huibiao.editData.isClause = !huibiao.editData.isClause;
                }
            },
            //////删除上传的文件
            delectFile: function(type, fpath, index){
                if(type=="otherfiles"){
                    var flist = huibiao.editData.otherfiles.showList;
                    flist.splice(index, 1);
                    huibiao.editData.otherfiles.showList = flist;
                    //写入需要提交的数据
                    var subList = huibiao.editData.otherfiles.subList;
                    var nfdata = subList.split("|");
                        subList = "";

                    for(var i = 0;i<nfdata.length;i++){
                        if(i!=index) subList += (i==0? "": "|") + nfdata[i];
                    }
                    huibiao.editData.otherfiles.subList = subList;
                }
                if(type=="bidfiles"){
                    var flist = huibiao.editData.bidfiles.showList;
                    flist.splice(index, 1);
                    huibiao.editData.bidfiles.showList = flist;
                    //写入需要提交的数据
                    var subList = huibiao.editData.bidfiles.subList;
                    var nfdata = subList.split("|");
                        subList = "";

                    for(var i = 0;i<nfdata.length;i++){
                        if(i!=index) subList += (i==0? "": "|") + nfdata[i];
                    }
                    huibiao.editData.bidfiles.subList = subList;
                }
            },
            //////提交单独的回标信息,type控制删除
            submitHuibiao: function(type, _ops){
                var ops = {
                    fid: huibiao.fid,
                    ctype: huibiao.editData.ctype,
                    media_name: huibiao.editData.media_name,
                    media_id: huibiao.editData.media_id,
                    ad_platform: huibiao.editData.ad_platform,
                    ad_style: huibiao.editData.ad_style,
                    price: huibiao.editData.price,
                    discount: huibiao.editData.discount,
                    distribution: huibiao.editData.distribution,
                    accperiod: huibiao.editData.accperiod,
                    invoice_type: "增值税普通发票",
                    invoice_content: huibiao.editData.invoice_content,
                    docking: huibiao.editData.docking,
                    docking_type: huibiao.editData.docking_type,
                    data_check: huibiao.editData.data_check,
                    remark: huibiao.editData.remark,
                    otherfiles: huibiao.editData.otherfiles.subList
                }
                var htype = parseInt(huibiao.infos.type);
                //判断类型
                //手游
                if(htype == 1){
                    //广告招标
                    ///不为空表单验证
                    if (type != "del" && !im.formValidator.noNull([ops.media_name, ops.ad_platform, ops.ctype, ops.ad_style, ops.discount, ops.accperiod, ops.invoice_content], ['媒体名称', '适应版本', '合作模式', '主要广告形式', '折扣', '账期', '发票内容'])) {
                        return false;
                    }
                    //是否需要价格
                    if(type != "del" && ops.ctype!="CPT" && ops.ctype!="账户充返" && (ops.price=="" || ops.price.length<1)){
                        alert('价格不能为空！');
                        return false;
                    }
                    //在是cpt的时候，必须填写附件
                    if(type != "del" && ops.ctype=="CPT" && (ops.otherfiles=="" || ops.otherfiles.length<1)){
                        alert('附件不能为空！');
                        return false;
                    }

                    //在不是账户账户充返，必须配送
                    if(type != "del" && ops.ctype!="账户充返" && (ops.distribution=="" || ops.distribution.length<1)){
                        alert('配送不能为空！');
                        return false;
                    }
                    //是否对接后台  单独判断
                    if( type != "del" && (ops.docking==3 || (ops.docking==1 && ops.docking_type=="")) ){
                        alert('请选择是否对接后台和后台对接方式！');
                        return false;
                    }
                }else if(htype == 2){
                    //端游
                    ops = {
                        fid: huibiao.fid,
                        ctype: huibiao.editData.ctype,
                        media_name: huibiao.editData.media_name,
                        media_id: huibiao.editData.media_id,
                        ad_platform: "PC",
                        ad_style: huibiao.editData.ad_style,
                        price: huibiao.editData.price,
                        discount: huibiao.editData.discount,
                        distribution: huibiao.editData.distribution,
                        accperiod: huibiao.editData.accperiod,
                        invoice_type: "增值税普通发票",
                        invoice_content: huibiao.editData.invoice_content,
                        remark: huibiao.editData.remark,
                        otherfiles: huibiao.editData.otherfiles.subList
                    }
                    ///不为空表单验证
                    if (type != "del" && !im.formValidator.noNull([ops.media_name, ops.ctype, ops.ad_style, ops.discount, ops.accperiod, ops.invoice_content], ['媒体名称', '合作模式', '主要广告形式', '折扣', '账期', '发票内容'])) {
                        return false;
                    }
                    //是否需要价格
                    if(type != "del" && ops.ctype!="CPT" && ops.ctype!="账户充返" && (ops.price=="" || ops.price.length<1)){
                        alert('价格不能为空！');
                        return false;
                    }
                     //在不是账户账户充返，必须配送
                    if(type != "del" && ops.ctype!="账户充返" && (ops.distribution=="" || ops.distribution.length<1)){
                        alert('配送不能为空！');
                        return false;
                    }
                    //在是cpt的时候，必须填写备注
                    if(type != "del" && ops.ctype=="CPT" && (ops.otherfiles=="" || ops.otherfiles.length<1)){
                        alert('附件不能为空！');
                        return false;
                    }
                }else if(htype == 3){
                    //赛事招标
                    ops = {
                        fid: huibiao.fid,
                        ctype: huibiao.editData.ctype,
                        price: huibiao.editData.price,
                        invoice_type: "增值税专用发票",
                        invoice_content: huibiao.editData.invoice_content,
                        remark: huibiao.editData.remark,
                        bidfiles: huibiao.editData.bidfiles.subList,
                        otherfiles: huibiao.editData.otherfiles.subList
                    }
                    ////判断赛事回标是否已经提交过了，并且不是修改，隐藏提交按钮
                    if(huibiao.replys.length>0 && !huibiao.editData.id && type != "del"){
                        alert('赛事回标只能提交一个哦！');
                        return false;
                    }
                    ///不为空表单验证
                    if (type != "del" && !im.formValidator.noNull([ops.ctype, ops.price, ops.invoice_content, ops.bidfiles], ['合作模式', '价格', '发票内容', '招标书附件'])) {
                        return false;
                    }
                };

                /////判断是否是修改
                if(!!huibiao.editData.id){
                    ops.id = huibiao.editData.id;
                }

                //////是删除
                if(type == "del"){
                    ops = {
                        fid: huibiao.fid,
                        id: _ops.id,
                        del: 1
                    }
                }
                 
                im.ajaxget(huibiao, CONFIG.AJAX_URL.reply, 'POST', 'json', ops, function(data) {
                    var replys = data.replys;
                    ////处理奇怪的对象数据的问题
                    for(var i = 0;i<replys.length;i++){
                        if(replys[i].bidfiles.length<1) replys[i].bidfiles = false;
                        if(replys[i].otherfiles.length<1) replys[i].otherfiles = false;
                    }
                    
                    if(type != "next") huibiao.events.targePop(false);

                    var txt = '添加成功，可继续添加';
                    if(htype == 3) txt = '添加成功';
                    if(type == "del") txt = '已删除';
                    if(!!huibiao.editData.id) txt = '修改成功';
                    alert(txt);
                    //////保存初始的发票内容
                    invoice_content_temp = huibiao.editData.invoice_content;
                    
                    /////更新列表，清空默认值
                    huibiao.replys = replys;
                    huibiao.editData = resetFrom();
                });
            },
            editHuibiao: function(idx){
                //显示弹窗
                huibiao.events.targePop(true);
                ///////修改 赋值
                huibiao.editData = resetFrom(huibiao.replys[idx]);
            },
            delectHuibiao: function(id, idx){
                //删除当前这条的数据
                huibiao.events.submitHuibiao('del', {id: id});
                //删除结构
                //var replys = huibiao.replys;
                //huibiao.replys = replys.splice(idx, 1);
            },
            cancelSubmit: function(){
                huibiao.events.targePop(false);
                huibiao.editData = resetFrom();
            },
            submitHuibiaoAll: function(){
                //判断是否有回标内容
                if(huibiao.replys.length<1){
                    alert('请填写回标内容！');
                    return false;
                }
                if(!huibiao.editData.isClause){
                    alert('请阅读并同意承诺条款！');
                    return false;
                }

                //自定义confirm
                var oo = im.creatPop(this, { tit: '确认提交回标吗？', sureTxt: '确认', cancelTxt: '取消',confirm: true, sureCallback: function(){
                    
                    im.ajaxget(huibiao, CONFIG.AJAX_URL.huibiaoSubmit, 'POST', 'json', {fid: huibiao.fid}, function(data) {
                        //alert('回标提交成功!');
                        ///刷新页面
                        location.reload();
                    });

                }});
            },
            targePop: function(val){
                huibiao.showPop = val;
            },
            helpPop: function(val){
                huibiao.helpPop = val;
            }
        }

    });


    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            ////单选事件
            im.chkRadio('.radio_input');
            ////同意条款的选择
            im.chkRadio('.radio_input_isdele', true);
            ////上传相关附件
            im.setImg('otherfiles_upBtn', CONFIG.AJAX_URL.uploadfile, 'file', {fileType: "file", data: {filetype: "otherfiles"}}, function(btn, path, res) {
                console.log(res)
                huibiao.editData.otherfiles.showList.push(res);
                //写入需要提交的数据
                var str = huibiao.editData.otherfiles.subList==""? path: ("|" + path);
                huibiao.editData.otherfiles.subList += str;
            });
            ////上传招标书附件
            im.setImg('bidfiles_upBtn', CONFIG.AJAX_URL.uploadfile, 'file', {fileType: "file", data: {filetype: "bidfiles"}}, function(btn, path, res) {
                huibiao.editData.bidfiles.showList.push(res);
                //写入需要提交的数据
                var str = huibiao.editData.bidfiles.subList==""? path: ("|" + path);
                huibiao.editData.bidfiles.subList += str;
            });

            ///////写入cookie的内容
            var ck_fid = im.selectCookie('ck_fid', 'unescape');
            //获取cookie字符串
            var strCookie=document.cookie;
            //将多cookie切割为多个名/值对
            var arrCookie=strCookie.split("; ");
            //遍历cookie数组，处理每个cookie对
            for(var i=0;i<arrCookie.length;i++){
                var arr=arrCookie[i].split("=");
                var val = unescape(arr[1]);
                    val = !!val? val: "";
                //只有单号相同才会自动写入保存
                if(ck_fid!=huibiao.fid) return false;

                //找到名称为userId的cookie，并返回它的值
                if("ck_media_name"==arr[0]) huibiao.editData.media_name=val;
                if("ck_media_id"==arr[0]) huibiao.editData.media_id=val;
                if("ck_ad_platform"==arr[0]) huibiao.editData.ad_platform=val;
                if("ck_ctype"==arr[0]) huibiao.editData.ctype=val;
                if("ck_ad_style"==arr[0]) huibiao.editData.ad_style=val;
                if("ck_price"==arr[0]) huibiao.editData.price=val;
                if("ck_discount"==arr[0]) huibiao.editData.discount=val;
                if("ck_distribution"==arr[0]) huibiao.editData.distribution=val;
                if("ck_accperiod"==arr[0]) huibiao.editData.accperiod=val;
                if("ck_invoice_content"==arr[0]) huibiao.editData.invoice_content=val;
                if("ck_remark"==arr[0]) huibiao.editData.remark=val;
                if("ck_docking"==arr[0]) huibiao.editData.docking=val;
                if("ck_docking_type"==arr[0]) huibiao.editData.docking_type=val;
                if("ck_data_check"==arr[0]) huibiao.editData.data_check=val;
                /*if("ck_otherfiles"==arr[0]){
                    huibiao.editData.otherfiles.subList=val;
                    huibiao.editData.otherfiles.showList=val.split('|');
                }*/
            }

            ///////////添加保存cookie 事件
            window.onbeforeunload=function (){ 
                //alert("===onbeforeunload==="); 
                /*if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey){ 
                    alert("你关闭了浏览器"); 
                }else{ 
                    alert("你正在刷新页面"); 
                }*/
                im.saveCookie({
                    ck_fid: huibiao.fid,
                    ck_media_name: huibiao.editData.media_name,
                    ck_media_id: huibiao.editData.media_id,
                    ck_ad_platform: huibiao.editData.ad_platform,
                    ck_ctype: huibiao.editData.ctype,
                    ck_ad_style: huibiao.editData.ad_style,
                    ck_price: huibiao.editData.price,
                    ck_discount: huibiao.editData.discount,
                    ck_distribution: huibiao.editData.distribution,
                    ck_accperiod: huibiao.editData.accperiod,
                    ck_invoice_content: huibiao.editData.invoice_content,
                    ck_remark: huibiao.editData.remark,
                    ck_docking: huibiao.editData.docking,
                    ck_docking_type: huibiao.editData.docking_type,
                    ck_data_check: huibiao.editData.data_check,
                    //ck_otherfiles: huibiao.editData.otherfiles.subList,
                    //ck_bidfiles: huibiao.editData.bidfiles.subList,
                }) 
            }
            
        };
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            var root = avalon.vmodels.root;
            
            root.$watch('defaultOptions', function(){
                huibiao.dfOptions = root.defaultOptions;
                //huibiao.infos.type = huibiao.dfOptions.bid_types[huibiao.infos.type];
            })
            
            var fid = '' + params.fid;
            //获取页面type
            root.pageType = fid;
            huibiao.fid = fid;

            ////获取回标信息
            im.ajaxget(huibiao, CONFIG.AJAX_URL.bidInfo, 'GET', 'json', {fid: fid}, function(data) {
                var dd = data.info;
                    dd.medias = data.medias;
                    try{
                        dd.content = JSON.parse(data.info.content);
                    }catch(e){
                        dd.content = [];
                    }

                var replys = data.replys;
                for(var i = 0;i<replys.length;i++){
                    replys[i].bidfiles = replys[i].bidfiles.length<1? false: replys[i].bidfiles;
                    replys[i].otherfiles = replys[i].otherfiles.length<1? false: replys[i].otherfiles;
                }

                huibiao.infos = dd;
                huibiao.files = data.attrs;
                huibiao.replys = replys;
                huibiao.result = !!data.result? data.result: [];
                huibiao.result_date = data.result_date;
                huibiao.result_publicity = data.result_publicity;
                huibiao.htype = dd.type;
                
                var nowtype = huibiao.dfOptions.bid_types[huibiao.infos.type];
                huibiao.infos.type_text = nowtype.name;
            });

        };
        //对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [huibiao]
    });
})


function resetFrom(ops){
    if(!!ops){
        var list ={
            //媒体名称
            media_name: ops.media_name,
            media_id: ops.media_id,
            //广告媒体 
            ad_medias: ops.ad_medias,
            //广告投放平台    
            ad_platform: ops.ad_platform,
            //合作模式
            ctype: ops.ctype,
            //主要广告形式    
            ad_style: ops.ad_style,
            //价格
            price: ops.price,
            //折扣
            discount: ops.discount,
            //配送
            distribution: ops.distribution,
            //账期
            accperiod: ops.accperiod,
            //发票类型 
            invoice_type: ops.invoice_type,
            //发票内容  
            invoice_content: ops.invoice_content,
            //是否需要对接
            docking: ops.docking,
            //对接类型
            docking_type: ops.docking_type,
            //数据核对方式
            data_check: ops.data_check,
            //备注
            remark: ops.remark,
            //默认不是修改
            id: ops.id,

            ////上传的文件
            otherfiles: {
                showList: ops.otherfiles.showList,
                subList: ops.otherfiles.subList
            },
            //招标附件
            bidfiles: {
                showList: ops.bidfiles.showList,
                subList: ops.bidfiles.subList
            },
            /////是否同意条款
            isClause: false
        };
        list.otherfiles.showList = [];
        list.otherfiles.subList = "";
        list.bidfiles.showList = [];
        list.bidfiles.subList = "";

        for(var i = 0;i<ops.otherfiles.length;i++){
            list.otherfiles.showList.push(ops.otherfiles[i])

            var fp1 = i==0? ops.otherfiles[i].fpath: ("|"+ops.otherfiles[i].fpath);
            list.otherfiles.subList += fp1;
        }
        for(var j = 0;j<ops.bidfiles.length;j++){
            list.bidfiles.showList.push(ops.bidfiles[j]);

            var fp2 = j==0? ops.bidfiles[j].fpath: ("|"+ops.bidfiles[j].fpath);
            list.bidfiles.subList += fp2;
        }

        return list;

    }
    return {
        //媒体名称
        media_name: "",
        media_id: "",
        //广告媒体 
        ad_medias: "",
        //广告投放平台    
        ad_platform: "",
        //合作模式
        ctype: "",
        //主要广告形式    
        ad_style: "",
        //价格
        price: "",
        //折扣
        discount: "",
        //配送
        distribution: "",
        //账期
        accperiod: "3个月",
        //发票类型 
        invoice_type: "增值税普通发票",
        //发票内容  
        invoice_content: (invoice_content_temp!=""? invoice_content_temp: ""),
        //是否需要对接
        docking: 3,
        //对接类型
        docking_type: "",
        //数据核对方式
        data_check: "",
        //备注
        remark: "",
        //默认不是修改
        id: false,

        ////上传的文件
        otherfiles: {
            showList: [],
            subList: ""
        },
        //招标附件
        bidfiles: {
            showList: [],
            subList: ""
        },
        /////是否同意条款
        isClause: false
    }
}