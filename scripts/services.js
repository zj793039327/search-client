/**
 * 订单管理应用services
 * @type {*|module}
 * Created by KevinWang on 2015/7/30.
 */
var seachServices = angular.module('seachServices',['ngResource']);

seachServices.factory('baseService',['$q','$http','ngDialog',
    function ($q,$http,ngDialog) {
        return getBaseServiceInstance($q,$http,ngDialog);
    }
]);