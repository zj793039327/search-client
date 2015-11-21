/**
 * 搜索app
 * @type {*|module}
 * Created by KevinWang on 2015/7/29.
 */
var searchApp = angular.module('searchApp', [
    'ui.router'
    ,'ngDialog'
    ,'seachControllers'
    ,'seachServices'
]);

searchApp.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        preCloseCallback: function () {
            //console.log('default pre-close callback');
        }
    });
}]);

/**
 * 配置路由
 */
searchApp.config([
    '$stateProvider','$urlRouterProvider',
    function ($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise('/search');
        $stateProvider
            //搜索首页
            .state('list',{
                url : '/search?q=:keyword',
                templateUrl : 'view/list.html',
                controller : 'listController'
            });
    }
]);