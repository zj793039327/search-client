/**
 * 定义这个变量
 * 该方法是用于选择是否发短信和邮件
 */
var checkbox_is_checked;
/**
 * 基本service
 * save()保存方法
 * update()更新方法，不需要确认直接更新
 * updatewithconfirm()更新方法，需要确认
 * get()获取数据方法
 * delete()删除方法
 * 参数均为url,param,回调fn前两个参数必须有,最后一个可以没有
 */
function getBaseServiceInstance($q,$http,ngDialog){
    var service =
    {
        get: function (url,param,fn,fnFalse) {
        // var orderList = $q.defer();
        $http({
            method : 'GET',
            url : url,
            params : param
        })
            .success(function (data, status, headers, config) {
                if(fn!=undefined&&status==200){
                    fn(data);
                }
                if(status!=200){
                    if(typeof fnFalse == 'function'){
                        fnFalse(data);
                    }
                    /*ngDialog.open({
                     template: '<center><h3>'+data.message+'</h3></center>',
                     plain: true,
                     closeByEscape: false
                     });*/
                }
            })
            .error(function (data, status, headers, config) {
                ngDialog.open({
                    template: data,
                    plain: true,
                    closeByEscape: false,
                    disableAnimation: true
                });
            });
    },
	getCache: function (url,param,fn,fnFalse) {
               // var companyList = $q.defer();
                $http({
                    method : 'GET',
                    url : url,
                    cache:true,
                    params : param
                })
                .success(function (data, status, headers, config) {
                    if(fn!=undefined&&data.success){
                        fn(data);
                    }
                    if(status!=200){
                        if(typeof fnFalse == 'function'){
                            fnFalse(data);
                        }
                        /*ngDialog.open({
                            template: '<center><h3>'+data.message+'</h3></center>',
                            plain: true,
                            closeByEscape: false
                        });*/
                    }
                })
                .error(function (data, status, headers, config) {
                    ngDialog.open({
                        template: data,
                        plain: true,
                        closeByEscape: false,
						disableAnimation: true
                    });
                });
            },
        delete: function (url,param,fn) {
        ngDialog.openConfirm({
            template: '<h3>确定要删除吗?</h3>' + '<div class="ngdialog-buttons">'
            + '<button type="button" class="ngdialog-button btn btn-default" ng-click="closeThisDialog()">否'
            + '<button type="button" class="ngdialog-button btn btn-primary" ng-click="confirm()">是'
            + '</button></div>',
            plain: true,
            disableAnimation: true
        }).then(function(){
            $http({
                method : 'DELETE',
                params:param,
                url : url
            })
                .success(function (data, status, headers, config) {
                    if(data.success){
                        ngDialog.open({
                            template: '<center><h3>操作成功！</h3></center>',
                            plain: true,
                            closeByEscape: false,
                            disableAnimation: true
                        });
                        if(fn!=undefined){
                            fn(data);
                        }
                    }else{
                        ngDialog.open({
                            template: '<center><h3>'+data.message+'</h3></center>',
                            plain: true,
                            closeByEscape: false,
                            disableAnimation: true
                        });
                    }
                })
                .error(function (data, status, headers, config) {
                    ngDialog.open({
                        template: data,
                        plain: true,
                        closeByEscape: false,
                        disableAnimation: true
                    });
                });
        })
    },
        updatewithconfirmRemind: function (url,param,fn) {
            ngDialog.openConfirm({

                template:'<h3>确定执行此操作吗?</h3>'
                + '<input type="checkbox" id="chk" checked="true" onchange="changeValue()"/> <label for="chk">是否发送邮件和短信提醒</label>'
                + '<div class="ngdialog-buttons">'
                + '<button type="button" class="ngdialog-button btn btn-default" ng-click="closeThisDialog()">否'
                + '<button type="button" class="ngdialog-button btn btn-primary" ng-click="confirm()">是'
                + '</button></div>'
                + '<script>'
                +' checkbox_is_checked=true;/* 默认发送提醒信息*/'
                + 'function changeValue(){checkbox_is_checked = document.getElementById("chk").checked;}'
                + '</script>',
                closeByDocument: false,
                plain: true,
                disableAnimation: true
            }).then(function(){

                if(checkbox_is_checked){
                    //默认是发送提醒
                }else {
                    //用户手动忽略提醒
                    param['ignorenotice']=1;
                }
                $http({
                    method : 'PUT',
                    url : url,
                    data : jQuery.param(param),
                    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
                })
                    .success(function (data, status, headers, config) {
                        if(data.success){
                            ngDialog.open({
                                template: '<center><h3>操作成功！</h3></center>',
                                plain: true,
                                closeByEscape: false,
                                disableAnimation: true
                            });

                            if(fn!=undefined){
                                fn(data);
                            }
                        }else{
                            ngDialog.open({
                                template: '<center><h3>'+data.message+'</h3></center>',
                                plain: true,
                                closeByEscape: false,
                                disableAnimation: true
                            });
                        }
                    })
                    .error(function (data, status, headers, config) {
                        ngDialog.open({
                            template: data,
                            plain: true,
                            closeByEscape: false,
                            disableAnimation: true
                        });
                    })
            });
        },
        updatewithconfirm: function (url,param,fn) {
            ngDialog.openConfirm({
                template: '<h3>确定执行此操作吗?</h3>' + '<div class="ngdialog-buttons">'
                + '<button type="button" class="ngdialog-button btn btn-default" ng-click="closeThisDialog()">否'
                + '<button type="button" class="ngdialog-button btn btn-primary" ng-click="confirm()">是'
                + '</button></div>',
                plain: true,
                disableAnimation: true
            }).then(function(){
                $http({
                    method : 'PUT',
                    url : url,
                    data : jQuery.param(param),
                    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
                })
                    .success(function (data, status, headers, config) {
                        if(data.success){
                            ngDialog.open({
                                template: '<center><h3>操作成功！</h3></center>',
                                plain: true,
                                closeByEscape: false,
                                disableAnimation: true
                            });

                            if(fn!=undefined){
                                fn(data);
                            }
                        }else{
                            ngDialog.open({
                                template: '<center><h3>'+data.message+'</h3></center>',
                                plain: true,
                                closeByEscape: false,
                                disableAnimation: true
                            });
                        }
                    })
                    .error(function (data, status, headers, config) {
                        ngDialog.open({
                            template: data,
                            plain: true,
                            closeByEscape: false,
                            disableAnimation: true
                        });
                    })
            });
        },
        update: function (url,param,fn) {
            $http({
                method : 'PUT',
                url : url,
                data : jQuery.param(param),
                headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    if(data.success){
                        ngDialog.open({
                            template: '<center><h3>操作成功！</h3></center>',
                            plain: true,
                            closeByEscape: false,
                            disableAnimation: true
                        });
                        if(fn!=undefined){
                            fn(data);
                        }
                    }else{
                        ngDialog.open({
                            template: '<center><h3>'+data.message+'</h3></center>',
                            plain: true,
                            closeByEscape: false,
                            disableAnimation: true
                        });
                    }
                })
                .error(function (data, status, headers, config) {
                    ngDialog.open({
                        template: data,
                        plain: true,
                        closeByEscape: false,
                        disableAnimation: true
                    });
                });
        },
        save: function (url,param,fn) {
            $http({
                method : 'POST',
                url : url,
                data : jQuery.param(param),
                headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    if(data.success){
                        ngDialog.open({
                            template: '<center><h3>保存成功！</h3></center>',
                            plain: true,
                            closeByEscape: false,
                            disableAnimation: true
                        });
                        if(fn!=undefined){
                            fn(data);
                        }
                    }else{
                        ngDialog.open({
                            template: '<center><h3>'+data.message+'</h3></center>',
                            plain: true,
                            closeByEscape: false,
                            disableAnimation: true
                        });
                    }
                })
                .error(function (data, status, headers, config) {
                    ngDialog.open({
                        template: data,
                        plain: true,
                        closeByEscape: false,
                        disableAnimation: true
                    });
                });
        }
    };
    return service;
}