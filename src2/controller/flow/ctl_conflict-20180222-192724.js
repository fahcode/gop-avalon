/**
 * Created by hfh on 17/3/15.
 */
define(['swiper', 'webUploader', 'calendar', '$md5', "sly"], function(swiper, WebUploader) {
    var flow = avalon.define({
        $id: "flow",
        $skipArray: ["events", "root"],
        root: {},
        name: 'flow',
        barwid: "1000%",
        showDetails: false,
        //标签列表
        gmd_tags: [],
        //第一条的基础数据
        uInfo: {},
        //节点内部数据，提取出来方便使用
        nodes_value: {
            check_nodeName: "",
            confirm_remarks: "",
        },
        //进度信息
        allNode: [],
        nowNodeIdx: 0,
        //流程节点的名字
        roles: {},
        nodeInfo: {},
        threads: {},
        //当前节点信息
        nowNode: {},
        lastNodeName: '',
        ///////流程节点信息

        //"选择比价供应商",  这一步没有，后续就没了
        node_cmp_provider: {},
        /////报价是单独的，不是节点，写
        baojia_result: {},
        //报价需求分析
        work_analysis_result: {},

        /////归档只有最后一次，所以必须在nodes里面拿
        work_save: {},
        work_save_confirm: {},

        //提交数据，
        editData: {
            fid: "",
            //报价
            baojia: {
                time: "",
                price: "",
                remark: "",
                fdata: "",
                flist:[],
                /////是否同意条款
                isClause: false
            },
            //需求分析，写
            work_analysis: {
                content: "",
                fdata: "",
                flist: []
            },
            //发起验收，写
            work_submit: {
                stype: 1,
                content: "",
                fdata: "",
                flist: [],
                ubid: ""
            },
            //归档，写
            work_save: {
                mpic: "",
                mcontent: "",
                images: [],
                descs: [],
                
                percent: "0%",
                name: "",
                fpath: [],
                fname: [],
                fdesc: [],
                preview: [],
                fid: 0
            },
            gmd_tags: {
                tags: "",
                taglist: []
            },
            //大文件上传对象
            uploader: null,
        },
        //////显示状态
        showStates: {
            //一票否决的
            submit: true,
            //报价是默认显示的
            baojia: false,
            baojia_result: false,
            //需求分析
            work_analysis: false,
            //PM确认需求,发起人确认  通过是否有对于数据。跟提交是一一对应的

            ////显示发起验收
            work_submit: false,
            ///
            work_check: false,

            ////编辑归档
            work_save: false,
            //展示归档
            work_save_show: false,
            //展示归档确认
            work_save_confirm: false,

            //显示更多tag
            moretag: false,
            customtag: false,
            bigloader: 0
        },
        temp: "",
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
                if(type == "work_submit"){
                    if(key==1){
                        flow.editData.work_submit.stype = 1;
                    }else{
                        flow.editData.work_submit.stype = 2;
                    }
                }
            },
            selectRadio: function(type,val){
                
                if(type == 'isClause'){
                    //现在同意条款
                    flow.editData.baojia.isClause = !flow.editData.baojia.isClause;
                }
            },
            submitBefore: function(type){
                if(type == "save"){
                    flow.events.submitFlow(function(){
                        flow.editData.work_save.fid = data.id;
                        alert('已保存')
                    }, type);
                } 
            },
            //////提交单独的回标信息
            submitFlow: function(callback, type){
                var callback = callback;
                /////////通过当前显示的节点来判断是什么类型的提交
                var url = "",
                    ops = {};
                //报价
                if(flow.showStates.baojia){
                    url = CONFIG.AJAX_URL.workReply,
                    ops = {
                        fid: flow.editData.fid, 
                        finish_date: flow.editData.baojia.time, 
                        price: flow.editData.baojia.price,  
                        remark: flow.editData.baojia.remark, 
                        files: flow.editData.baojia.fdata
                    };
                    //条款
                    if(!flow.editData.baojia.isClause){
                        alert('请阅读并同意承诺条款！');
                        return false;
                    }
                    ///不为空表单验证
                    if (!im.formValidator.noNull([ops.finish_date, ops.price, ops.price_type], ['承诺完成日期', '报价', '付款比例'])) {
                        return false;
                    }
                    //提交成功后
                    callback = function(){
                        alert('成功提交报价！');
                        flow.showStates.baojia = false;
                        flow.showStates.baojia_result = true;
                        //手动添加数据
                        flow.baojia_result = {
                            status: -1,
                            dtime: flow.editData.baojia.time,
                            price: flow.editData.baojia.price,
                            remark: flow.editData.baojia.remark,
                            cmp: flow.editData.baojia.flist
                        };
                    }
                };
                //提交需求分析
                if(flow.showStates.work_analysis){
                    url = CONFIG.AJAX_URL.workSubmit,
                    ops = {
                        flow_order_id: flow.editData.fid, 
                        content: flow.editData.work_analysis.content,
                        files: flow.editData.work_analysis.fdata
                    };
                    ///不为空表单验证
                    if (!im.formValidator.noNull([ops.content], ['需求补充说明'])) {
                        return false;
                    }
                    callback = function(){
                        alert('成功提交需求分析！');
                        flow.showStates.work_analysis = false;

                        flow.threads.push({
                            node_flag: 'node_work_analysis',
                            node_name: "需求分析",
                            data: {
                                content: flow.editData.work_analysis.content,
                                files: flow.editData.work_analysis.flist
                            }
                        })
                    }
                };
                //提交 发起验收
                if(flow.showStates.work_submit){
                    url = CONFIG.AJAX_URL.workSubmit,
                    ops = {
                        flow_order_id: flow.editData.fid,
                        stype: flow.editData.work_submit.stype,
                        content: flow.editData.work_submit.content,
                        files: flow.editData.work_submit.fdata,
                        ubid: flow.root.userInfo.ubid
                    };
                    ///不为空表单验证
                    if (!im.formValidator.noNull([ops.content], ['验收说明'])) {
                        return false;
                    }
                    callback = function(){
                        alert('成功发起验收！');
                        flow.showStates.work_submit = false;

                        flow.threads.push({
                            node_flag: 'node_work_submit',
                            node_name: "发起验收",
                            data: {
                                content: flow.editData.work_submit.content,
                                files: flow.editData.work_submit.flist
                            }
                            
                        })
                    }
                };
                //提交 存档
                if(flow.showStates.work_save){
                    url = CONFIG.AJAX_URL.workSubmit;
                    //ops = {flow_order_id: flow.editData.fid};
                    //临时保存
                    //if(type == "save"){
                        //url = CONFIG.AJAX_URL.material;
                        ops = {
                            flow_order_id: flow.editData.fid,
                            mpic: flow.editData.work_save.mpic,
                            mtags: flow.editData.gmd_tags.tags,
                            mcontent: flow.editData.work_save.mcontent,
                            images: flow.editData.work_save.images,
                            descs: flow.editData.work_save.descs,
                            fpath: flow.editData.work_save.fpath,
                            fname: flow.editData.work_save.fname,
                            fdesc: flow.editData.work_save.fdesc,
                            preview: flow.editData.work_save.preview
                        };

                        callback = function(){
                            //alert('成功提交存档！');
                            window.location.reload();
                            //flow.showStates.work_save = false;
                        }
                    //}
                    if(!confirm("确认提交归档吗？")){
                        return false;
                    }
                };
                 
                im.ajaxget(flow, url, 'POST', 'json', ops, function(data) {
                    console.log(data)
                    if(typeof callback === "function"){
                        callback();
                        return false;
                    }
                    alert('提交成功')
                });
            },
            //////删除上传的文件
            delectFile: function(type, fpath, index){
                if(type=="baojia"){
                    var flist = flow.editData.baojia.flist;
                    flist.splice(index, 1);
                    flow.editData.baojia.flist = flist;
                    //写入需要提交的数据
                    var fdata = flow.editData.baojia.fdata;
                    var nfdata = fdata.split("|");
                        fdata = "";

                    for(var i = 0;i<nfdata.length;i++){
                        if(i!=index) fdata += (i==0? "": "|") + nfdata[i];
                    }
                    flow.editData.baojia.fdata = fdata;
                }
                if(type=="work_analysis"){
                    var flist = flow.editData.work_analysis.flist;
                    flist.splice(index, 1);
                    flow.editData.work_analysis.flist = flist;
                    //写入需要提交的数据
                    var fdata = flow.editData.work_analysis.fdata;
                    var nfdata = fdata.split("|");
                        fdata = "";

                    for(var i = 0;i<nfdata.length;i++){
                        if(i!=index) fdata += (i==0? "": "|") + nfdata[i];
                    }
                    flow.editData.work_analysis.fdata = fdata;
                }
                if(type=="work_submit"){
                    var flist = flow.editData.work_submit.flist;
                    flist.splice(index, 1);
                    flow.editData.work_submit.flist = flist;
                    //写入需要提交的数据
                    var fdata = flow.editData.work_submit.fdata;
                    var nfdata = fdata.split("|");
                        fdata = "";

                    for(var i = 0;i<nfdata.length;i++){
                        if(i!=index) fdata += (i==0? "": "|") + nfdata[i];
                    }
                    flow.editData.work_submit.fdata = fdata;
                }
            },
            addfunc: function(type, val, index){
                if(type == "tag"){
                    if(val == "自定义"){
                        flow.showStates.customtag = !flow.showStates.customtag;
                        return false;
                    }
                    var tag = flow.editData.gmd_tags.tags;
                    //过滤已经存在的
                    if(tag.indexOf(val) == -1){
                        flow.editData.gmd_tags.taglist.push(val);
                        flow.editData.gmd_tags.tags += val + " ";
                    }
                }
                if(type == "customtag"){

                    var vlist = flow.temp.split(" ");
                    var oldtaglist = flow.editData.gmd_tags.taglist,
                        oldtags = flow.editData.gmd_tags.tags;

                    for(var i = 0;i<vlist.length;i++){
                        if(vlist[i] == "") return true;
                        if(oldtags.indexOf(vlist[i]) == -1){
                            flow.editData.gmd_tags.tags += " " + vlist[i];

                            flow.editData.gmd_tags.taglist.push(vlist[i]);
                        }
                    }
                }
                if(type == "contentImgInfo"){
                    //等于当前的
                    flow.editData.work_save.descs[index] = this.value;
                }
                if(type == "moretag"){
                    //等于当前的
                    flow.showStates.moretag = !flow.showStates.moretag;
                }
                if(type == "uploadComlate"){
                    if (!!val && !!val.path) {
                        //{ path: val.path, desc: '', preview: 0, name: val.name, media: val.media }
                        flow.editData.work_save.fpath.push(val.path);
                        flow.editData.work_save.fname.push(val.name);
                        flow.editData.work_save.preview.push(1);
                    }
                    flow.showStates.bigloader = 0;
                }
                if(type == "bigFilesName"){
                    //等于当前的
                    flow.editData.work_save.fname[index] = this.value;
                }
                if(type == "bigFilesDesc"){
                    //等于当前的
                    flow.editData.work_save.fdesc[index] = this.value;
                }
                
            },
            removefunc: function(type, val, index){
                if(type == "tag"){
                    var tag = flow.editData.gmd_tags.taglist;
                    tag.splice(index, 1);
                    flow.editData.gmd_tags.taglist = tag;

                    var reg = new RegExp(val,"g");
                    flow.editData.gmd_tags.tags = flow.editData.gmd_tags.tags.replace(reg, "");
                }
                if(type == "contentImg"){
                    //等于当前的
                    flow.editData.work_save.images.splice(index, 1);
                    flow.editData.work_save.descs.splice(index, 1);
                }

                if(type == "bigFiles"){
                    //等于当前的
                    flow.editData.work_save.fpath.splice(index, 1);
                    flow.editData.work_save.fname.splice(index, 1);
                    flow.editData.work_save.fdesc.splice(index, 1);
                    flow.editData.work_save.preview.splice(index, 1);
                }
            },
            showLoading: function(name, percent) {
                flow.showStates.bigloader = 1;
                flow.editData.work_save.percent = percent;
                flow.editData.work_save.name = name;
            },
            //获取
            ////上传大文件
            setWebUpload: function(userInfo) {
                var upurl = CONFIG.AJAX_URL.bigupload;
                //var upurl = 'http://gmdfile.ztgame.com/upload.php';
                var uniqueFileName = []; //为了避免每次分片都重新计算唯一标识，放在全局变量中，但如果你的项目需要WU支持多文件上传，那么这里你需要的是一个K/V结构，key可以存file.id
                var chunkSize = 1000 * 1024 * 2;

                if (!!flow.uploader) {
                    try {
                        flow.uploader.destroy();
                        flow.uploader = null;
                    } catch (e) {

                    } finally {

                    }
                }
                var formData =  {
                    token: userInfo.token, 
                    user: userInfo.user, 
                    ts: userInfo.ts, 
                    cid1: flow.uInfo.cid1,
                    cid2: flow.uInfo.cid2,
                    cid3: flow.uInfo.cid3,
                    gamecode: flow.uInfo.gamecode
                };
                var uploader = WebUploader.create({
                    auto: true,
                    // swf文件路径
                    swf: 'assets/webuploader/Uploader.swf',
                    // 文件接收服务端。
                    server: upurl,
                    dnd: '.bigUpBtn',
                    paste: document.body,
                    disableGlobalDnd: true,
                    fileNumLimit: 100,
                    fileSingleSizeLimit: 10 * 1024 * 1024 * 1024,
                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: {
                        id: '#bigUpBtn',
                        label: '选择文件'
                    },
                    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                    compress: false,
                    chunked: true,
                    chunkSize: chunkSize,
                    threads: 3,
                    prepareNextFile: true,
                    formData: formData
                });
                flow.uploader = uploader;
                ///选择后显示进度条
                uploader.on('fileQueued', function(file) {
                    flow.events.showLoading(file.name, 0 + '%');
                });

                // 文件上传过程中创建进度条实时显示。
                uploader.on('uploadProgress', function(file, percentage) {

                    var percent = parseInt(percentage * 1000) / 10
                    flow.events.showLoading(file.name, percent + '%');
                });
                uploader.on('beforeFileQueued', function(file) {
                    uniqueFileName[file.id] = $.md5(file.name + file.type + file.lastModifiedDate + file.size);
                });
                uploader.on('uploadComplete', function(file) {
                    var chunksTotal = 0;
                    chunksTotal = Math.ceil(file.size / chunkSize);
                    //if((chunksTotal = Math.ceil(file.size/chunkSize)) > 1){
                    //合并请求
                    var task = new $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: upurl,
                        data: $.extend({
                            action: "chunksMerge",
                            name: file.name,
                            size: file.size,
                            unique: uniqueFileName[file.id],
                            chunks: chunksTotal,
                            ext: file.ext
                        }, formData),
                        cache: false,
                        dataType: "jsonp"
                    }).then(function(rs, textStatus, jqXHR) {
                        //console.info(rs);
                        task.resolve();
                        if (rs.status == 1) {
                            file.path = rs.path;
                            file.media = rs.media;
                            flow.events.addfunc('uploadComlate', file);
                        } else {
                            alert(rs.msg);
                            uploader.stop(true);
                            return false;
                        }
                    }, function(jqXHR, textStatus, errorThrown) {
                        task.reject();
                    });
                    return $.when(task);
                })
                uploader.on('uploadBeforeSend', function(block, percentage) {
                    var task = new $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: upurl,
                        data: $.extend({
                            action: "chunkCheck",
                            unique: uniqueFileName[block.file.id],
                            chunkIndex: block.chunk,
                            size: block.end - block.start
                        }, formData),
                        cache: false,
                        timeout: 1000, //todo 超时的话，只能认为该分片未上传过,
                        dataType: "json"
                    }).then(function(rs, textStatus, jqXHR) {
                        if (rs.status == 1) {
                            if (rs.ifexist) { //若存在，返回失败给WebUploader，表明该分块不需要上传
                                task.reject();
                            } else {
                                task.resolve();
                            }
                        } else {
                            alert(rs.msg);
                            uploader.stop(true);
                            flow.showStates.bigloader = 0;
                            return false;
                        }
                    }, function(jqXHR, textStatus, errorThrown) { //任何形式的验证失败，都触发重新上传
                        task.resolve();
                    });
                    return $.when(task);

                });

                uploader.on('uploadAccept', function(file, response) {
                    //     console.info('uploadAccept');
                    //    console.info(response);
                    if (response.status == 0) {
                        alert(response.msg);
                        flow.showStates.bigloader = 0;
                        uploader.stop(true);
                        return false;
                    }
                });
            },
            switchFN: function(type){
                if(type=='showDetails'){
                    flow.showDetails = !flow.showDetails;
                }
            },
            creatSwiper: function(){
                console.log(33333333)
                //////设置进度条
                ///////节点进度条滚动效果
                var lineSwiper = new swiper ('.swiper-line', {
                    freeMode : true,
                });
            },
            ////取得当前点击位置包含的后续的节点
            switchBox: function(eve){
                var _this = $(this),
                    isclose = _this.hasClass('close')
                if(isclose){
                    _this.removeClass('close')
                }else{
                    _this.addClass('close');
                };
                ////处理后续的节点
                var nextAll = $(this).nextAll();
                var nowNodeArea = [],
                    btnNodeArea = [];
                //记录当前按钮临近后面的节点
                for(var i = 0;i<nextAll.length;i++){
                    var nownode = nextAll[i];
                    if($(nownode).hasClass('nodebtn')) break;
                    //记录节点
                    nowNodeArea.push(nownode);
                    ///切换后续节点
                    if(isclose){ $(nownode).show(); }else{ $(nownode).hide(); };
                };
                //记录后面的全部切换按钮
                for(var j = 0;j<nextAll.length;j++){
                    var nowbtn = nextAll[j];
                    if($(nowbtn).hasClass('nodebtn')) btnNodeArea.push(nowbtn);
                };
                ///最后一个按钮 并且是编辑
                if(btnNodeArea.length==0){
                    if(isclose){
                        $('.nodeboxs .t.et').show();
                    }else{
                        $('.nodeboxs .t.et').hide();
                    }
                };
            }
        }
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function(params, rs) {
            ////同意条款的选择
            im.chkRadio('.radio_input_isdele', true);
            ////时间日历
            $("#calendar").Calendar({time: true, onlyYM: false});
            //报价上传
            ////上传相关附件
            im.setImg('baojia_upfile', CONFIG.AJAX_URL.uploadfile, 'file', {fileType: "file", data: {filetype: "cmp"}}, function(btn, path, res) {
                flow.editData.baojia.flist.push(res);
                //写入需要提交的数据
                var str = flow.editData.baojia.fdata==""? path: ("|" + path);
                flow.editData.baojia.fdata += str;
            });
            ///需求分析上传
            im.setImg('analysis_upfile', CONFIG.AJAX_URL.uploadfile, 'file', {fileType: "file", data: {filetype: "analysis"}}, function(btn, path, res) {
                flow.editData.work_analysis.flist.push(res);
                //写入需要提交的数据
                var str = flow.editData.work_analysis.fdata==""? path: ("|" + path);
                flow.editData.work_analysis.fdata += str;
            });
            ///验收附件上传
            im.setImg('yshou_upfile', CONFIG.AJAX_URL.uploadfile, 'file', {fileType: "file", data: {filetype: "worksubmit"}}, function(btn, path, res) {
                flow.editData.work_submit.flist.push(res);
                //写入需要提交的数据
                var str = flow.editData.work_submit.fdata==""? path: ("|" + path);
                flow.editData.work_submit.fdata += str;
            });
            //上传归档的首页推荐图
            im.setImg('worksave_upfile_index', CONFIG.AJAX_URL.uploadmtimg, 'image', {data: {imgtype: 0}}, function(btn, path, res) {
                flow.editData.work_save.mpic = path;
            });
            //内容图
            im.setImg('worksave_upfile_content', CONFIG.AJAX_URL.uploadmtimg, 'image', {data: {imgtype: 1}}, function(btn, path, res) {
                flow.editData.work_save.images.push(path);
            });
            
        };
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {

            var root = flow.root = avalon.vmodels.root;
            //列表标签
            root.$watch("defaultUserInfo", function() {
                var tags = root.defaultOptions.gmd_tags;
                    tags.push({tagname: "自定义"});
                flow.gmd_tags = tags;
            })

            //avalon.log(root.userInfo.ubid)
            //参数
            var fid = params.fid;
            var ftype = params.type;

            flow.editData.fid = fid;
            flow.editData.work_submit.stype = ftype;

            //默认请求流程信息   
            im.ajaxget(flow, CONFIG.AJAX_URL.workView, 'GET', 'json', {flow_order_id: fid}, function(data) {
                ////获取进度状态,//拷贝，解决复制指针的问题
                var nodes = data.nodes,
                    cpnodes = nodes.slice(0),
                    threads = data.threads;
                    cpthreads = data.threads.slice(0),
                    order = data.order;

                //获取当前的节点
                flow.nowNode = data.order;
                flow.roles = data.roles;
                flow.threads = data.threads;
                //第一个是项目信息
                flow.nodeInfo = data.threads[0];
                flow.lastNodeName = order.node_flag;

                //order节点的名字
                var lastNodeName = order.node_flag;
                /////////处理编辑的显示
                if(lastNodeName == "node_cmp_reply") flow.showStates.baojia = true;
                if(lastNodeName == "node_work_analysis") flow.showStates.work_analysis = true;
                if(lastNodeName == "node_work_submit") flow.showStates.work_submit = true;
                if(lastNodeName == "node_work_save") flow.showStates.work_save = true;
                if(lastNodeName == "node_work_save_confirm") flow.showStates.work_save_confirm = false;

                /////拼接全部节点
                var allNode = cpthreads,
                    flg = false;

                //////拼接全部的节点，threads+order+(nodes-threads)
                flow.nowNodeIdx = cpthreads.length-1;
                /******循环总常规流程节点 ******/
                for(var i = 0,c = 0;i<cpnodes.length;i++){
                    var dd = nodes[i];
                    //第一条的基础数据
                    if(dd.node_flag == "node_work_apply") flow.uInfo = dd.data;
                    /////////////比价邀请的数据在需求分析节点
                    if(dd.node_flag=="node_cmp_provider"){
                        //已经提交报价 但是节点未走过
                        if(dd.data[0].replys.length>0){
                            flow.showStates.baojia = false;
                            flow.showStates.baojia_result = true;
                            //数据
                            flow.baojia_result = dd.data[0].replys[0];
                        }
                    }

                    //归档，因为包含临时保存和提交 所以在nodes里面获取
                    if(dd.node_flag=="node_work_save" && !!dd.material){
                        flow.showStates.work_save_show = true;

                        var material = dd.material;
                        ///同时获取当前的数据
                        flow.editData.gmd_tags.tags = material.mtags;
                        var tagarr = material.mtags.split(" ");
                        for(var j = 0;j<tagarr.length;j++){
                            if(tagarr[j] == "" || typeof(tagarr[j]) == "undefined"){
                                tagarr.splice(j,1);
                                j= j-1;
                            }
                        }
                        flow.editData.gmd_tags.taglist = tagarr;
                        flow.editData.work_save.mpic = material.mpic;
                        flow.editData.work_save.mcontent = material.mcontent;
                        if(!!material.images){
                            flow.editData.work_save.images =  material.images;
                            flow.editData.work_save.descs = material.descs;
                        }
                        if(!!material.sourcefile){
                            flow.editData.work_save.fpath = material.sourcefile.fpath;
                            flow.editData.work_save.fname = material.sourcefile.fname;
                            flow.editData.work_save.fdesc = material.sourcefile.fdesc;
                        }
                    };
                    //归档确认
                    if(dd.node_flag=="node_work_save_confirm" && !!dd.data){
                        flow.showStates.work_save_confirm = true;

                        flow.work_save_confirm = dd.data;
                    }

                    /////////循环插入后续节点，进度条
                    if(dd.node_flag == lastNodeName){
                        //保存通过order查找到的node，当前将要做的节点
                        dd.isLastNode = true;
                        dd.isOrder = true;
                        allNode.push(dd);

                        flg=true;
                        c++;
                    }
                    if(flg && c<cpnodes.length){
                        ///拼接后续的节点，数据为空
                        cpnodes[c].flg_off = true;
                        cpnodes[c].opt_fullname = null;
                        //allNode.push(cpnodes[c]);
                    }
                    c++;
                }
                ///最后一个节点是完成或者是关闭的情况下，单独添加order 节点
                if(lastNodeName=="finish"||lastNodeName=="close") allNode.push(order);
                
                //拼接后的节点
                flow.allNode = allNode;
                console.log(allNode)

                
                

                ////////添加滑动效果
                /*flow.barwid = flow.allNode.length*114 + "px";
                setTimeout(function(){
                    //flow.events.creatSwiper();
                    $('.sly-wrap').sly({
                        horizontal: 1,
                        startAt: flow.nowNodeIdx*114,
                        speed: 300,
                        mouseDragging: 1,
                        touchDragging: 1,
                        elasticBounds:1,
                        scrollBar: $('.sly-wrap .scrollbar'),
                        dynamicHandle: 1
                    });
                    //sly.toStart(2);
                }, 500);*/
                
            });
            ////请求身份令牌
            im.ajaxget(flow, CONFIG.AJAX_URL.upltoken, 'GET', 'json', {}, function(data) {
                flow.$watch('uInfo', function(){
                    flow.events.setWebUpload(data);
                })
                
            })
                  
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [flow]
    });
})