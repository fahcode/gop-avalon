/**
 * Created by hfh on 17/3/15.
 */
var workflg = true;
define(['calendar','kuCity'], function() {
    var edit = avalon.define({
        $id: "edit",
        $skipArray: ["events"],
        name: 'edit',
        root: null,
        defaultOptions: {
            user_types: {},
            expyears: {},
            company_scales: [],
            proj_cates: {},
            gender: {}
        },
        defaultWorks: [],
        ubid: '',
        //编辑进度
        editPlan: {
            headImg: false,
            forme: false,
            base: false,
            works: false,
            comp: false,
            myf: false,
            biz: false,
            pay: false,
            isSubmit: false,
            isShowSubmit: true
        },
        //临时变量
        temps: {
            nickname: '',
            headimg: '',
            //关于我
            aboutme: '',
            //入驻类型
            utype: {
                key: '',
                val: ''
            },
            //业务范围
            bizscope: {
                key: [],
                val: []
            },
            //其他业务补充
            bizother: '',
            //工作经验
            expyear: {
                key: '',
                val: ''
            },
            //日新（8小时）
            daywage: '',
            //性别
            gender: {
                key: '',
                val: ''
            },
            //城市
            city: '',
            ////////////作品
            //作品id
            wid: null,
            //对象
            editEle: null,
            //作品图片
            wpic: '',
            //作品名称
            wname: '',
            //职责
            wduty: '',
            //作品链接
            wlink: '',
            //作品描述
            wdesc: '',
            ///公司信息
            company: {
                cname: '',
                scale: {
                    key: '',
                    val: ''
                },
                addr: '',
                zipcode: '',
                phonenum: '',
                website: '',
                contact: '',
                mobile: '',
                qq: '',
                email: ''
            },
            //个人信息
            personal: {
                addr: '',
                zipcode: '',
                contact: '',
                mobile: '',
                qq: '',
                email: '',
                idcode: '',
                idpica: '',
                idpicb: ''
            },
            //工商登记
            bizreg: {
                bname: '',
                regnum: '',
                licdate: '',
                licdate2: '',
                lperson: '',
                regaddr: '',
                regcaptal: '',
                licpic: '',
                bankpic: ''
            },
            //付款信息
            payinfo: {
                accname: '',
                bank: '',
                branch: '',
                accnum: '',
                city: ''
            }
        },
        //编辑状态
        editState: {
            /////公司信息和个人信息
            isTeamState: false,

            isbase: false,
            //是否有关于我
            isforme: false,
            //隐藏全部select
            hideAllSele: 0,
            //作品
            isWorks: false,
            //作品按钮状态
            isWorksBtn: true,

            //公司信息
            isComp: false,
            //个人信息
            isPersonal: false,
            //工商登记
            isBizreg: false,
            //付款信息
            isPayinfo: false
        },
        //处理后的用户数据
        userData: {
            nickname: '',
            headimg: '',
            //审核状态
            shStatus: '',
            shStatusTxt: '',

            //入驻类型
            utype: '',
            //业务范围
            bizscope: {
                key: [],
                val: []
            },
            //其他业务补充
            bizother: '',
            //工作经验
            expyear: '',
            //关于我
            aboutme: '',
            //日新（8小时）
            daywage: '',
            //性别
            gender: '',
            //城市
            city: '',
            ////////////作品,不需要
            ///公司信息
            company: {
                cname: '',
                scale: '',
                addr: '',
                zipcode: '',
                phonenum: '',
                website: '',
                contact: '',
                mobile: '',
                qq: '',
                email: ''
            },
            //个人信息
            personal: {
                addr: '',
                zipcode: '',
                contact: '',
                mobile: '',
                qq: '',
                email: '',
                idcode: '',
                idpica: '',
                idpicb: ''
            },
            //工商登记
            bizreg: {
                bname: '',
                regnum: '',
                licdate: '',
                licdate2: '',
                lperson: '',
                regaddr: '',
                regcaptal: '',
                licpic: '',
                bankpic: ''
            },
            //付款信息
            payinfo: {
                accname: '',
                bank: '',
                branch: '',
                accnum: '',
                city: ''
            }
        },
        thirdSele: {
            first: {},
            second: {},
            third: {},
            sele: []
        },
        AreaThirdSele: {
            first: {},
            second: {},
            third: {},

            firstsele: '',
            secondsele: '',
            sele: ''
        },
        ///事件方法
        events: {
            work_edit: function(el, isDel) {
                var _this = this;
                //获取当前的jq对象
                var editEle = $(_this).closest('.work_box');
                var el = el;
                var url = CONFIG.AJAX_URL.work,
                    ops = {};
                //删除
                if (!!isDel) {
                    ops = { wid: el.id, status: -1 };
                    //创建弹窗
                    var workPop = new im.creatPop(edit, {
                        tit: '确认删除此作品案例吗？',
                        btns: '<div class="pa pbtns"><a href="javascript:;" class="btn sureBtn">确认</a><a href="javascript:;" class="cancelBtn">取消</a></div>',
                        havBg: false,
                        sureCallback: function(modalTpl) {
                            ////创建表单提交
                            im.ajaxget(edit, url, 'POST', 'json', ops, function(data) {
                                //更新作品视图
                                modalTpl.remove();
                                //转换为数组
                                edit.defaultWorks = im.setArrar(data.list);
                                
                                ////////判断状态
                                submitState(edit.userData);
                            });
                        }
                    }, $(_this).closest('dd'));

                } else {
                    //修改
                    edit.temps.wid = el.id;
                    //记录当前操作对象
                    edit.temps.editEle = editEle;

                    //修改当前编辑的对象池
                    edit.temps.wpic = el.wpic;
                    edit.temps.wname = el.wname;
                    edit.temps.wduty = el.wduty;
                    edit.temps.wlink = el.wlink;
                    edit.temps.wdesc = el.wdesc;

                    //第一次点击编辑的时候创建上传
                    //creatUpWork();
                    //显示编辑
                    edit.events.showEdit('works', true, true);
                }
            },
            ///显示隐藏编辑器
            ///ops额外的参数，控制作品
            showEdit: function(type, isShow, ops) {
                //第一次点击编辑的时候创建上传
                //creatUpWork();
                var isShow = !!isShow ? true : false;
                //判断类型
                if (type == 'base') {
                    edit.editState.isbase = isShow;
                    console.log(isShow)
                    /////添加定位
                    setTimeout(function(){
                        im.goWeizhi('.form_base', 500, 80);
                    },100)
                    
                } else if (type == 'forme') {
                    edit.editState.isforme = isShow;
                } else if (type == 'works') {
                    //判断是否是修改状态
                    if (!!ops) {
                        //增加表单隐藏
                        edit.editState.isWorks = false;
                        edit.editState.isWorksBtn = false;
                        if (isShow) {
                            /////jq隐藏全部的编辑
                            $('.works_show .work_box').removeClass('ed');
                            edit.temps.editEle.addClass('ed');
                            //创建当前的的图片上传功能

                        } else {
                            edit.temps.editEle.removeClass('ed');
                            edit.editState.isWorksBtn = true;
                        };
                    } else {
                        edit.editState.isWorks = isShow;
                        edit.editState.isWorksBtn = !isShow;
                    };
                    //////取消的时候重置
                    if (!isShow) edit.events.resetWorks();

                } else if (type == 'company') {
                    edit.editState.isComp = isShow;

                } else if (type == 'personal') {
                    edit.editState.isPersonal = isShow;
                } else if (type == 'bizreg') {
                    edit.editState.isBizreg = isShow;
                } else if (type == 'payinfo') {
                    edit.editState.isPayinfo = isShow;
                };

                //触发

            },
            //每次取消都重置works
            resetWorks: function() {
                edit.temps.wid = null;
                edit.temps.wpic = '';
                edit.temps.wname = '';
                edit.temps.wlink = '';
                edit.temps.wdesc = '';
                edit.temps.wduty = '';
            },
            //切换select
            chkSelect: function(ele) {
                var sele = $(this).find('.ul_sele');
                if (!!ele) sele = $(this).find(ele);

                var st = this.getAttribute('st');
                st = st == 1 ? 2 : 1;

                $('.select').attr('st', 1);
                this.setAttribute('st', st);

                if (st == 2) {
                    $('.select>.ul_sele, .select>.selectBox').hide();
                    sele.fadeIn();
                } else {
                    sele.fadeOut();
                }
            },
            //阻止事件冒泡
            stopEven: function(evt) {
                //avalon.log(evt)
                var e = (evt) ? evt : window.event;
                if (window.event) {
                    // ie下阻止冒泡
                    e.cancelBubble = true;
                } else {
                    // 其它浏览器下阻止冒泡
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
            hideAllSele: function() {
                edit.editState.hideAllSele = 1;
            },
            //选中
            selected: function(type, key, val) {
                if (type == 'user_types') {
                    edit.temps.utype.val = val;
                    edit.temps.utype.key = key;

                    //判断选择的入驻控制公司信息还是个人信息显示
                    if (edit.temps.utype.key == 1 || edit.temps.utype.key == 2) {
                        edit.editState.isTeamState = false;
                    } else edit.editState.isTeamState = true;
                } else if (type == 'gender') {
                    edit.temps.gender.val = val;
                    edit.temps.gender.key = key;
                } else if (type == 'expyear') {
                    edit.temps.expyear.val = val;
                    edit.temps.expyear.key = key;
                } else if (type == 'company_scales') {
                    edit.temps.company.scale.val = val;
                    edit.temps.company.scale.key = key;
                }
            },
            ///确定提交
            submitForm: function(type) {
                var type = type;
                var url, ops = {},
                    callback;
                if (type == 'forme') {
                    url = CONFIG.AJAX_URL.baseinfo;
                    //关闭编辑
                    if (edit.temps.aboutme.length < 10 || edit.temps.aboutme.length > 500) {
                        var pp = new im.creatPop(this, { tit: '请输入正确长度的描述！', cancelTxt: '确认' });

                        return false;
                    };
                    ops = {
                        aboutme: edit.temps.aboutme
                    };
                    callback = function(data) {
                        edit.userData.aboutme = edit.temps.aboutme.replace(/\n/g, "<br>");
                        ///当前有值
                    };
                };
                if (type == 'base') {
                    url = CONFIG.AJAX_URL.baseinfo;
                    var bizscope_ids = '';
                    for (var i = 0; i < edit.temps.bizscope.key.length; i++) {
                        bizscope_ids += "/" + edit.temps.bizscope.key[i];
                        if (i == 0) bizscope_ids = edit.temps.bizscope.key[i];
                    };

                    ops = {
                        nickname: edit.temps.nickname,
                        utype: edit.temps.utype.key,
                        bizscope: bizscope_ids,
                        bizother: edit.temps.bizother,
                        expyear: edit.temps.expyear.key,
                        daywage: edit.temps.daywage,
                        city: edit.temps.city
                    };
                    var varr = [
                        edit.temps.nickname,
                        edit.temps.utype.key,
                        bizscope_ids,
                        edit.temps.expyear.key,
                        edit.temps.daywage,
                        edit.temps.city,
                        edit.temps.gender.key
                    ];
                    var tarr = ['昵称', '入驻类型', '业务范围', '工作经验', '日薪', '城市', '性别'];
                    /////如果有性别
                    if (edit.temps.utype.key == 1 || edit.temps.utype.key == 2) {
                        ops.gender = edit.temps.gender.key;
                    }else{
                        varr = [
                            edit.temps.nickname,
                            edit.temps.utype.key,
                            bizscope_ids,
                            edit.temps.expyear.key,
                            edit.temps.daywage,
                            edit.temps.city
                        ];
                        tarr = ['昵称', '入驻类型', '业务范围', '工作经验', '日薪', '城市'];
                    };
                    ///不为空表单验证
                    if (!im.formValidator.noNull(varr, tarr)) {
                        return false;
                    }
                    callback = function(data) {
                        edit.userData.nickname = edit.temps.nickname;
                        edit.userData.utype = edit.temps.utype.val;
                        edit.userData.bizscope.val = edit.thirdSele.sele;
                        edit.userData.bizother = edit.temps.bizother;
                        edit.userData.expyear = edit.temps.expyear.val;
                        edit.userData.daywage = edit.temps.daywage;
                        edit.userData.city = edit.temps.city;
                        edit.userData.gender = edit.temps.gender.key;
                        ///当前有值
                        
                    };
                };
                if (type == 'works') {
                    url = CONFIG.AJAX_URL.work;

                    //是否修改作品
                    if (!!edit.temps.wid) ops.wid = edit.temps.wid;

                    ops.wpic = edit.temps.wpic;
                    ops.wname = edit.temps.wname;
                    ops.wduty = edit.temps.wduty;
                    ops.wlink = edit.temps.wlink;
                    ops.wdesc = edit.temps.wdesc;
                    ///表单验证
                    ///不为空表单验证
                    if (!im.formValidator.noNull([
                            edit.temps.wpic,
                            edit.temps.wname,
                            edit.temps.wduty,
                            edit.temps.wdesc
                        ], ['作品图片', '作品名称', '职责', '作品简介'])) {
                        return false;
                    }
                    callback = function(data) {
                        //avalon.log(data);
                        edit.defaultWorks = im.setArrar(data.list);
                        ///当前有值
                    };
                };
                if (type == 'company') {
                    url = CONFIG.AJAX_URL.company;
                    ops = {
                        cname: edit.temps.company.cname,
                        scale: edit.temps.company.scale.key,
                        addr: edit.temps.company.addr,
                        zipcode: edit.temps.company.zipcode,
                        phonenum: edit.temps.company.phonenum,
                        website: edit.temps.company.website,
                        contact: edit.temps.company.contact,
                        mobile: edit.temps.company.mobile,
                        qq: edit.temps.company.qq,
                        email: edit.temps.company.email
                    };
                    ///表单验证
                    ///不为空表单验证
                    if (!im.formValidator.noNull([
                            edit.temps.company.cname,
                            edit.temps.company.scale.key,
                            edit.temps.company.addr,
                            edit.temps.company.zipcode,
                            edit.temps.company.phonenum,
                            edit.temps.company.contact,
                            edit.temps.company.mobile,
                            edit.temps.company.qq,
                            edit.temps.company.email
                        ], ['公司全称', '公司规模及人数', '公司地址', '邮编', '公司电话', '联系人', '联系方式', 'QQ', 'E-MAIL'])) {
                        return false;
                    }
                    callback = function(data) {
                        //avalon.log(data);
                        edit.userData.company.cname = edit.temps.company.cname;
                        edit.userData.company.scale = edit.temps.company.scale.val;
                        edit.userData.company.addr = edit.temps.company.addr;
                        edit.userData.company.zipcode = edit.temps.company.zipcode;
                        edit.userData.company.phonenum = edit.temps.company.phonenum;
                        edit.userData.company.website = edit.temps.company.website;
                        edit.userData.company.contact = edit.temps.company.contact;
                        edit.userData.company.mobile = edit.temps.company.mobile;
                        edit.userData.company.qq = edit.temps.company.qq;
                        edit.userData.company.email = edit.temps.company.email;
                    };
                };
                if (type == 'personal') {
                    url = CONFIG.AJAX_URL.personal;
                    ops = {
                        addr: edit.temps.personal.addr,
                        zipcode: edit.temps.personal.zipcode,
                        contact: edit.temps.personal.contact,
                        mobile: edit.temps.personal.mobile,
                        qq: edit.temps.personal.qq,
                        email: edit.temps.personal.email,
                        idcode: edit.temps.personal.idcode,
                        idpica: edit.temps.personal.idpica,
                        idpicb: edit.temps.personal.idpicb
                    };
                    ///表单验证
                    ///不为空表单验证
                    if (!im.formValidator.noNull([
                            edit.temps.personal.addr,
                            edit.temps.personal.zipcode,
                            edit.temps.personal.contact,
                            edit.temps.personal.mobile,
                            edit.temps.personal.qq,
                            edit.temps.personal.email,
                            edit.temps.personal.idcode,
                            edit.temps.personal.idpica,
                            edit.temps.personal.idpicb
                        ], ['个人地址', '邮编', '联系人', '联系方式', 'QQ', 'E-MAIL', '身份证正面', '身份证反面'])) {
                        return false;
                    }
                    callback = function(data) {
                        //avalon.log(data);
                        edit.userData.personal.addr = edit.temps.personal.addr;
                        edit.userData.personal.zipcode = edit.temps.personal.zipcode;
                        edit.userData.payinfo.accname = edit.userData.personal.contact = edit.temps.personal.contact;
                        edit.userData.personal.mobile = edit.temps.personal.mobile;
                        edit.userData.personal.qq = edit.temps.personal.qq;
                        edit.userData.personal.email = edit.temps.personal.email;
                        edit.userData.personal.idcode = edit.temps.personal.idcode;
                        edit.userData.personal.idpica = edit.temps.personal.idpica;
                        edit.userData.personal.idpicb = edit.temps.personal.idpicb;
                    };
                };
                if (type == 'bizreg') {
                    url = CONFIG.AJAX_URL.bizreg;
                    ops = {
                        bname: edit.temps.bizreg.bname,
                        regnum: edit.temps.bizreg.regnum,
                        licdate: edit.temps.bizreg.licdate,
                        licdate2: edit.temps.bizreg.licdate2,
                        lperson: edit.temps.bizreg.lperson,
                        regaddr: edit.temps.bizreg.regaddr,
                        regcaptal: edit.temps.bizreg.regcaptal,
                        licpic: edit.temps.bizreg.licpic,
                        bankpic: edit.temps.bizreg.bankpic
                    };
                    ///表单验证
                    ///不为空表单验证
                    if (!im.formValidator.noNull([
                            edit.temps.bizreg.bname,
                            edit.temps.bizreg.regnum,
                            edit.temps.bizreg.licdate,
                            edit.temps.bizreg.licdate2,
                            edit.temps.bizreg.lperson,
                            edit.temps.bizreg.regaddr,
                            edit.temps.bizreg.regcaptal,
                            edit.temps.bizreg.regcaptal,
                            edit.temps.bizreg.bankpic
                        ], ['公司名称', '注册号', '营业执照有效期', '营业执照有效期','法定代表人', '注册地', '注册资本金', '营业执照复印件', '银行账户开户许可证'])) {
                        return false;
                    }
                    callback = function(data) {
                        //avalon.log(data);
                        edit.userData.payinfo.accname = edit.userData.bizreg.bname = edit.temps.bizreg.bname;
                        edit.userData.bizreg.regnum = edit.temps.bizreg.regnum;
                        edit.userData.bizreg.licdate = edit.temps.bizreg.licdate;
                        edit.userData.bizreg.licdate2 = edit.temps.bizreg.licdate2;
                        edit.userData.bizreg.lperson = edit.temps.bizreg.lperson;
                        edit.userData.bizreg.regaddr = edit.temps.bizreg.regaddr;
                        edit.userData.bizreg.regcaptal = edit.temps.bizreg.regcaptal;
                        edit.userData.bizreg.licpic = edit.temps.bizreg.licpic;
                        edit.userData.bizreg.bankpic = edit.temps.bizreg.bankpic;
                    };
                };
                if (type == 'payinfo') {
                    url = CONFIG.AJAX_URL.payinfo;
                    //使用个人 联系人
                    edit.userData.payinfo.accname = edit.userData.personal.contact;
                    if(edit.editState.isTeamState) edit.userData.payinfo.accname = edit.userData.bizreg.bname;
                    //edit.temps.payinfo.city
                    ops = {
                        accname: edit.userData.payinfo.accname,
                        bank: edit.temps.payinfo.bank,
                        branch: edit.temps.payinfo.branch,
                        accnum: edit.temps.payinfo.accnum,
                        city: edit.AreaThirdSele.sele
                    };
                    ///表单验证
                    ///不为空表单验证
                    if (!im.formValidator.noNull([
                            edit.userData.payinfo.accname,
                            edit.temps.payinfo.bank,
                            edit.temps.payinfo.branch,
                            edit.temps.payinfo.accnum,
                            edit.AreaThirdSele.sele
                        ], ['账户名称', '开户银行', '开户支行', '账号', '银行所在地'])) {
                        return false;
                    }
                    callback = function(data) {
                        //avalon.log(data);
                        //edit.userData.payinfo.accname = edit.temps.payinfo.accname;
                        edit.userData.payinfo.bank = edit.temps.payinfo.bank;
                        edit.userData.payinfo.branch = edit.temps.payinfo.branch;
                        edit.userData.payinfo.accnum = edit.temps.payinfo.accnum;
                        edit.userData.payinfo.city = edit.temps.payinfo.city= edit.AreaThirdSele.sele;

                    };
                };

                //avalon.log(ops);
                ////创建表单提交
                im.ajaxget(edit, url, 'POST', 'json', ops, function(data) {
                    callback(data);
                    ///关闭当前的
                    edit.events.showEdit(type);
                    //判断当前提交状态
                    submitState(edit.userData);
                });
            },
            //定位
            goWeizhi: function(type) {
                var type = $('#' + type);
                var top = parseInt(type.offset().top) - 80;
                $('body').animate({
                    scrollTop: top
                }, 1000);
            },
            //三级联动
            thirdSele: function(type, key, value) {
                var i = 0;
                //console.log(key);

                $(this).addClass('on').siblings().removeClass('on');

                //点击第一层
                if (type == 1) {
                    edit.thirdSele.second = [];
                    edit.thirdSele.third = [];

                    edit.thirdSele.second = edit.thirdSele.first[key].child;
                    //双层循环
                    for (k in edit.thirdSele.second) {
                        if (i == 0) {
                            edit.thirdSele.third = edit.thirdSele.second[k].child;
                            return false;
                        }
                    };
                };
                //点击第2层
                if (type == 2) {
                    edit.thirdSele.third = [];

                    edit.thirdSele.third = edit.thirdSele.second[key].child;
                };
                //点击第3层
                if (type == 3) {
                    if (edit.thirdSele.sele.length >= 5) {
                        //alert('');
                        var pp = new im.creatPop(this, { tit: '最多添加5个！', cancelTxt: '确认' });
                        return false;
                    }
                    if ($.inArray(value, edit.thirdSele.sele) != -1) {
                        return false;
                    }
                    
                    edit.temps.bizscope.key.push(key);
                    edit.thirdSele.sele.push(value);
                    //隐藏窗口
                    $(this).closest('.selectBox').fadeOut();
                    $(this).closest('.select').attr('st', 1);
                };
            },
            AreaThirdSele: function(type, key, value) {
                var i = 0;
                //console.log(key);

                $(this).addClass('on').siblings().removeClass('on');

                //点击第一层
                if (type == 1) {
                    edit.AreaThirdSele.firstsele = edit.AreaThirdSele.first[key].name;
                    ///可能不点击第二个
                    edit.AreaThirdSele.secondsele = edit.AreaThirdSele.first[key].name;

                    edit.AreaThirdSele.second = [];
                    edit.AreaThirdSele.third = [];

                    edit.AreaThirdSele.second = edit.AreaThirdSele.first[key].child;
                    ////取第三层的值
                    //双层循环
                    for (k in edit.AreaThirdSele.second) {
                        if (i == 0) {
                            var third = edit.AreaThirdSele.second[k].child;
                            edit.AreaThirdSele.third = !!third? third: [];
                            return false;
                        }
                    };
                };
                //点击第2层
                if (type == 2) {
                    edit.AreaThirdSele.secondsele = edit.AreaThirdSele.second[key].name;

                    edit.AreaThirdSele.third = [];
                    var third = edit.AreaThirdSele.second[key].child;
                    /////如果有第三级
                    if(!!third){
                        edit.AreaThirdSele.third = third;
                    }else{
                        edit.AreaThirdSele.sele = edit.AreaThirdSele.firstsele +"/"+ edit.AreaThirdSele.second[key].name;
                        //隐藏窗口
                        $(this).closest('.selectBox').fadeOut();
                        $(this).closest('.select').attr('st', 1);
                    };
                    
                };
                //点击第3层
                if (type == 3) {
                    
                    edit.AreaThirdSele.sele = edit.AreaThirdSele.firstsele +"/"+ edit.AreaThirdSele.secondsele +"/"+ key;
                    //隐藏窗口
                    $(this).closest('.selectBox').fadeOut();
                    $(this).closest('.select').attr('st', 1);
                };
            },
            ///清除当前点击选项
            removeArr: function(index){
                //edit.events.stopEven(e);
                edit.thirdSele.sele.splice(index ,1);
                edit.temps.bizscope.key.splice(index ,1);
            },
            ////数据全部填写 提交审核
            submitFormSure: function(is) {
                if (!is) return false;

                //创建弹窗
                var workPop = new im.creatPop(edit, {
                    tit: "",
                    txt: '作为巨人网络的供应商伙伴，贵公司应坚决遵守并督促本公司员工遵守有关反商业贿赂的法律法规。<br>如您发现巨人网络的雇员有违法商业道德或法律法规的行为，请联系我们的反贿赂举报邮箱：ac@ztgame.com<br><br>我承诺，以上内容均为我公司真实信息。',
                    btns: '<div class="pa pbtns"><a href="javascript:;" class="btn sureBtn">同意</a><a href="javascript:;" class="cancelBtn">取消</a></div>',
                    havBg: true,
                    txtstyle: "text-align: left",
                    sureCallback: function(modalTpl) {
                        ///////提交操作
                        $.getJSON(CONFIG.AJAX_URL.submit, function(dd) {
                            //alert(dd.msg);
                            edit.root.pop.events.openSubmitTips();
                            
                            edit.userData.shStatusTxt = '等待审核';
                            ////////不能点击
                            edit.editPlan.isSubmit = false;
                            //更新作品视图
                            modalTpl.remove();
                        });
                    }
                });

                
            }

        }
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log('33');
            /////头像上传
            im.setImg('upheadBtn', CONFIG.AJAX_URL.headimg, 'headimg', {}, function(btn, path) {
                //btn.find('img').attr('src', path).show();

                edit.userData.headimg = path;
                ////////判断状态
                submitState(edit.userData);
            });
            //滚动跟随
            im.scrollFn('.top_bar');
            //时间选择
            $("#calendar").Calendar({toolbar:true});
            $("#calendar2").Calendar({toolbar:true});
            ////城市选择
            $("#kuCity").kuCity();
            //创建上传
            creatUpWork();
        };
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
                //avalon.log('22');
                var root = edit.root = avalon.vmodels.root;
                //监听请求是否结束,请求的速度可能会比监听快
                root.$watch("defaultUserInfo", function() {
                    //avalon.log('666')
                        //保存默认配置
                    edit.defaultOptions = root.defaultOptions;
                    //设置三级联动
                    edit.thirdSele.first = root.defaultOptions.proj_cates;
                    //默认的值
                    edit.events.thirdSele(1, 0);

                    //保存默认作品
                    edit.defaultWorks = im.setArrar(root.defaultUserInfo.work);
                    edit.ubid = root.defaultUserInfo.user.ubid;

                    //////当信息获取后
                    //var df = im.initData(root.defaultUserInfo, root.defaultOptions);
                    var df = root.defaultUserInfo;

                    ///处理用户数据
                    ///昵称
                    edit.userData.nickname = edit.temps.nickname = df.base.nickname;
                    //头像
                    edit.userData.headimg = edit.temps.headimg = df.base.headimg.length < 1 ? (CONFIG.dfPhoto.headimg) : (df.base.headimg);
                    edit.userData.shStatus = df.base.status;
                    edit.userData.shStatusTxt = df.base.status_msg;

                    //城市
                    edit.userData.city = edit.temps.city = df.base.city.length < 1 ? '' : (df.base.city);
                    //业务范围
                    if (df.base.bizscope.length < 1) {
                        edit.userData.bizscope.val = edit.temps.bizscope.val = [];
                    } else {
                        edit.userData.bizscope.key = edit.temps.bizscope.key = df.base.bizscope.split('/');
                        //////获取当前的业务
                        edit.thirdSele.sele = [];
                        for(g in df.base.bizscope_arr){
                            edit.thirdSele.sele.push(df.base.bizscope_arr[g]);
                        };
                        edit.userData.bizscope.val = edit.temps.bizscope.val = edit.thirdSele.sele;
                    };

                    //其他业务补充
                    edit.userData.bizother = edit.temps.bizother = df.base.bizother.length < 1 ? '' : (df.base.bizother);
                    //薪水
                    edit.userData.daywage = edit.temps.daywage = df.base.daywage;
                    //入驻类型
                    edit.userData.utype = edit.temps.utype.val = df.base.utype_v.length < 1 ? false : (df.base.utype_v);
                    edit.temps.utype.key = df.base.utype;
                    //*** 通过入驻类型判断 ***//
                    if (df.base.utype == 3 || df.base.utype == 4) {
                        edit.editState.isTeamState = true;
                    } else {
                        edit.editState.isTeamState = false;
                    };

                    //工作经验
                    edit.userData.expyear = edit.temps.expyear.val = df.base.expyear_v.length < 1 ? false : (df.base.expyear_v);
                    edit.temps.expyear.key = df.base.expyear;
                    //性别
                    //显示性别icon
                    edit.userData.gender = df.base.gender;
                    if (df.base.gender != 1 && df.base.gender != 2) {
                        edit.userData.gender = false;
                    }

                    edit.temps.gender.val = df.base.gender_v.length < 1 ? false : (df.base.gender_v);
                    edit.temps.gender.key = df.base.gender;

                    /////关于我的数据处理
                    edit.temps.aboutme = df.base.aboutme.length < 1 ? '' : (df.base.aboutme);
                    edit.userData.aboutme = df.base.aboutme.length < 1 ? '' : (df.base.aboutme.replace(/\n/g, "<br>"));
                    /////公司信息处理
                    if (!!df.company) {

                        edit.userData.payinfo.accname = edit.userData.company.cname = edit.temps.company.cname = df.company.cname;
                        edit.userData.company.scale = edit.temps.company.scale.val = df.company.scale_v.length < 1 ? false : (df.company.scale_v);
                        edit.temps.company.scale.key = df.company.scale;

                        edit.userData.company.addr = edit.temps.company.addr = df.company.addr;
                        edit.userData.company.zipcode = edit.temps.company.zipcode = df.company.zipcode;
                        edit.userData.company.phonenum = edit.temps.company.phonenum = df.company.phonenum;
                        edit.userData.company.website = edit.temps.company.website = df.company.website;
                        edit.userData.company.contact = edit.temps.company.contact = df.company.contact;
                        edit.userData.company.mobile = edit.temps.company.mobile = df.company.mobile;
                        edit.userData.company.qq = edit.temps.company.qq = df.company.qq;
                        edit.userData.company.email = edit.temps.company.email = df.company.email;
                    };
                    /////个人信息处理
                    if (!!df.personal) {

                        edit.userData.personal.addr = edit.temps.personal.addr = df.personal.addr;
                        edit.userData.personal.zipcode = edit.temps.personal.zipcode = df.personal.zipcode;
                        edit.userData.payinfo.accname = edit.userData.personal.contact = edit.temps.personal.contact = df.personal.contact;
                        edit.userData.personal.mobile = edit.temps.personal.mobile = df.personal.mobile;
                        edit.userData.personal.qq = edit.temps.personal.qq = df.personal.qq;
                        edit.userData.personal.email = edit.temps.personal.email = df.personal.email;
                        edit.userData.personal.idcode = edit.temps.personal.idcode = df.personal.idcode;
                        edit.userData.personal.idpica = edit.temps.personal.idpica = df.personal.idpica;
                        edit.userData.personal.idpicb = edit.temps.personal.idpicb = df.personal.idpicb;
                    };

                    //工商登记
                    if (!!df.bizreg) {

                        edit.userData.payinfo.accname = edit.userData.bizreg.bname = edit.temps.bizreg.bname = df.bizreg.bname;
                        edit.userData.bizreg.regnum = edit.temps.bizreg.regnum = df.bizreg.regnum;
                        edit.userData.bizreg.licdate = edit.temps.bizreg.licdate = df.bizreg.licdate;
                        edit.userData.bizreg.licdate2 = edit.temps.bizreg.licdate2 = df.bizreg.licdate2;
                        edit.userData.bizreg.lperson = edit.temps.bizreg.lperson = df.bizreg.lperson;
                        edit.userData.bizreg.regaddr = edit.temps.bizreg.regaddr = df.bizreg.regaddr;
                        edit.userData.bizreg.regcaptal = edit.temps.bizreg.regcaptal = df.bizreg.regcaptal;
                        edit.userData.bizreg.licpic = edit.temps.bizreg.licpic = df.bizreg.licpic;
                        edit.userData.bizreg.bankpic = edit.temps.bizreg.bankpic = df.bizreg.bankpic;
                    };
                    //付款信息
                    if (!!df.payinfo) {

                        edit.userData.payinfo.accname = edit.temps.payinfo.accname = df.payinfo.accname;
                        edit.userData.payinfo.bank = edit.temps.payinfo.bank = df.payinfo.bank;
                        edit.userData.payinfo.branch = edit.temps.payinfo.branch = df.payinfo.branch;
                        edit.userData.payinfo.accnum = edit.temps.payinfo.accnum = df.payinfo.accnum;
                        edit.userData.payinfo.city = edit.temps.payinfo.city = df.payinfo.city;
                    };
                    ///判断提交的状态
                    submitState(edit.userData);
                });


                //城市设置三级联动
                edit.AreaThirdSele.first = LAreaData;
                //默认的值
                edit.events.AreaThirdSele(1, 0);
            }
            // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
            // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [edit]
    });
    ////判断整体编辑的状态,对应的是二次处理后的数据
    function submitState(df) {
        edit.editPlan.headImg = (df.headimg==CONFIG.dfPhoto.headimg) ? false : true;
        edit.editPlan.forme = df.aboutme.length < 1 ? false : true;
        edit.editPlan.base = df.utype ? true : false;
        edit.editPlan.works = edit.defaultWorks.length < 2 ? false : true;

        edit.editPlan.comp = df.company.cname.length < 1 ? false : true;
        edit.editPlan.myf = df.personal.addr.length < 1 ? false : true;
        var ist = edit.editPlan.biz = df.bizreg.bname.length < 1 ? false : true;
        /////如果当前不是团队，biz是没有的
        if(!edit.editState.isTeamState){
            var ist =  true;
        }

        edit.editPlan.pay = df.payinfo.bank.length < 1 ? false : true;
        //////通过判断前端的值
        /*if (edit.editPlan.headImg && edit.editPlan.forme && edit.editPlan.base && edit.editPlan.works && (edit.editPlan.comp || edit.editPlan.myf) && ist && edit.editPlan.pay) {
            edit.editPlan.isSubmit = true;
        }*/
        //通过获取状态来判断
        //$.getJSON(CONFIG.AJAX_URL.state, function(data){
        im.ajaxget(this, CONFIG.AJAX_URL.state, 'GET', 'json', {}, function(data) {
            if(data.submit == 1){
                edit.editPlan.isSubmit = true;
            }
        });
    };
    ////作品的图片上传
    function creatUpWork() {
        if (!workflg) return false;
        workflg = false;
        ////作品的图片上传
        var upworkCallback = function(btn, path) {
            edit.temps.wpic = path;
            btn.find('img').attr('src', path).show();
            //btn.find('.tps').hide();
        };
        ////创建作品图片上传提交
        im.setImg('upWorksBtn', CONFIG.AJAX_URL.uploadimg, 'image', {}, upworkCallback);
        //循环创建
        var len = $('.works_show .work_box').length;
        for (var i = 0; i < len; i++) {
            im.setImg('upWorksBtn' + i, CONFIG.AJAX_URL.uploadimg, 'image', {}, upworkCallback);
        };
        ////个人身份证上传
        im.setImg('idpica', CONFIG.AJAX_URL.uploadimg, 'image', {}, function(btn, path) {
            edit.temps.personal.idpica = path;
            btn.find('.tps').hide();
        });
        im.setImg('idpicb', CONFIG.AJAX_URL.uploadimg, 'image', {}, function(btn, path) {
            edit.temps.personal.idpicb = path;
            btn.find('.tps').hide();
        });
        ////营业执照复印件
        im.setImg('licpic', CONFIG.AJAX_URL.uploadimg, 'image', {}, function(btn, path) {
            edit.temps.bizreg.licpic = path;
            btn.find('.tps').hide();
        });
        /////银行账户开户许可证
        im.setImg('bankpic', CONFIG.AJAX_URL.uploadimg, 'image', {}, function(btn, path) {
            edit.temps.bizreg.bankpic = path;
            btn.find('.tps').hide();
        });
    };
})
