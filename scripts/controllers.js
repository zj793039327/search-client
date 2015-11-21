/**
 * 搜索应用Controllers
 * @type {*|module}
 * Created by KevinWang on 2015/7/28.
 */
var seachControllers = angular.module('seachControllers', []);

/**
 * 列表conroller
 */
seachControllers.controller('listController', ['$scope', 'baseService',
    function($scope, baseService) {
        $scope.search_rs={};
        $scope.search_rs.took=0;
        $scope.search_rs.total=0;
        $scope.pageInfo={
            size:10,
            curr_page_num:1,
            page_counts:1
        };


        var search_url="http://localhost/es/_search"
        $scope.search=function(target_page){
            var search_param = {
                size:0,
                q:''
            }

            search_param['q']=$scope.keyword;
            search_param['size']=$scope.pageInfo.size;
            if(target_page){
                search_param['from']=(target_page*$scope.pageInfo.size)+1;//计算从第几条获取
                $scope.pageInfo.curr_page_num = target_page;
            }

            baseService.get(search_url,search_param,function(res){
                $scope.search_rs.total=res.hits.total;
                $scope.search_rs.took=res.took;
                $scope.search_rs.data=res.hits.hits;
                $scope.pageInfo.page_counts = (int)(res.hits.total % $scope.pageInfo.size==0 ? res.hits.total / $scope.pageInfo.size: res.hits.total / $scope.pageInfo.size + 1);

                refreshPage();
            });
        }
        function refreshPage(){
            //构建页码数组
            $scope.pageArray = [];

            //如果总页数没有超过13页，则全部显示
            if ($scope.pageInfo.page_counts < 13) {

                for (var i = 1; i <= $scope.pageInfo.page_counts; i++) {
                    $scope.pageArray.push(i);
                }
            } else if ($scope.pageInfo.page_counts > 13 && $scope.pageInfo.curr_page_num < 10) {

                //如果总页数超过13页，并且当前页码小于10，显示1~10，其他省略(除最后一页)
                for (var i = 1; i <= 10; i++) {
                    $scope.pageArray.push(i);
                }
                $scope.pageArray.push('...');
                $scope.pageArray.push($scope.pageInfo.page_counts);
            } else if ($scope.pageInfo.page_counts > 13 && $scope.pageInfo.curr_page_num >= 10) {

                //如果总页数超过13页，并且当前页码大于10，显示第一页
                $scope.pageArray.push(1);
                $scope.pageArray.push('...');

                if ($scope.pageInfo.curr_page_num > $scope.pageInfo.page_counts - 10) {

                    //如果当前页码靠近总页数(条件为大于总页数-10),则显示后十页
                    for (var i = 9; i >= 0; i--) {
                        $scope.pageArray.push($scope.pageInfo.page_counts - i);
                    }
                } else {
                    //如果当前页码处于中间，则显示当前页码前2页、后4页
                    for (var i = 2; i > 0; i--) {
                        $scope.pageArray.push($scope.pageInfo.curr_page_num - i);
                    }
                    for (var i = 0; i < 5; i++) {
                        $scope.pageArray.push($scope.pageInfo.curr_page_num + i);
                    }
                    $scope.pageArray.push('...');
                    $scope.pageArray.push($scope.pageInfo.page_counts);
                }
            }
        }

        //构建订单列表查询参数对象

        $scope.loadOrderList = function(param) {

            var url = "/mws/orders?token=" ;

            baseService.get(url,param,function(data) {
                $scope.orderList = data;


            });
        };

        $scope.serachOrdersByPage = function(param, num) {

            if (num == '...' || num < 1) {
                return;
            }

            param.page = num;
            $scope.loadOrderList(param);
        };
    }
]);

//首页 controller
seachControllers.controller('indexController', ['$scope', '$stateParams', 'ngDialog', 'baseService',
    function($scope, $stateParams, ngDialog, baseService) {

        $scope.getOrderStatus = function () {
            baseService.get(orderStatusUrl,{},function(res){
                if (res.success) {

                    $scope.orderStatuses = {
                        list: [],
                        status: ''
                    };
                    $scope.orderStatuses.list = res.data;
                    $scope.orderStatuses.status = 0;
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].date != '' && res.data[i].date != null) {
                            $scope.orderStatuses.status += 1;
                        } else {
                            break;
                        }
                    }
                }
            });
        };

        $scope.confirmReceived=function(){baseService.updatewithconfirm(confirmReceivedUrl,{},
            function () {
                $scope.getOrderStatus();
            }
        )};
        $scope.cancelOrder=function(){baseService.updatewithconfirm(cancleOrderUrl,{})};
        $scope.confirmOrder=function(){baseService.updatewithconfirmRemind(confirmOrderUrl,"",function(res){
            if(res.success){			
			$("#iforderConfirmShow").show();
			}
			
		})};
		$scope.processedOrder=function(){baseService.updatewithconfirm(processedOrderUrl,"",function(res){
            if(res.success){			
			$("#iforderProcessed").show();
			}
			
		})};
        $scope.cancelConfirm=function(){baseService.updatewithconfirm(cancelConfirmUrl,"",function(res){
            if(res.success){            
            $("#iforderConfirmShow").hide();
            }
            
        })};
    }
]);