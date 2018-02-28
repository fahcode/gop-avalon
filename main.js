require.config({ //第一块，配置
    baseUrl: './src/assets',
    urlArgs: ('' + new Date().getTime()).substr(-4, 4),
    //urlArgs: '123',
    paths: {
        avalon: ["./avalon/avalon.shim"], //必须修改源码，禁用自带加载器，或直接删提AMD加载器模块
        mmPromise: './avalon/mmPromise',
        mmHistory: './avalon/mmHistory',
        mmRouter: './avalon/mmRouter',
        ///使用最新的路由
        mmState: './avalon/mmState',
        //animation: './animation/avalon.animation',
        //validation: './oniui/validation/avalon.validation',
        ajaxupload: './ajaxupload',
        calendar: './calendar.min',
        kuCity: './kuCity',
        kuCity: './kuCity',
        timexiala: './timexiala'
    },
    shim: {
        mmState: ['avalon', 'mmPromise', 'mmHistory', 'mmRouter']
    }
});