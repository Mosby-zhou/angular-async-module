/**
 * Created by AutoCode on 2017/03/29.
 */
(function (define, angular) {
    'use strict';
    define([], function () {
        var myAsyncView = function () {
            return {
                restrict: 'A',
                scope: {
                },
                templateUrl: '/modules/asyncDemo/tpls/my-async-view.html',
                replace: true,
                controller: function ($scope) {
                },
                link: function ($scope, $element, attrs, ctrls) {
                    $scope.hello = 'world!';
                }
            }
        }

        return {
            myAsyncView: [myAsyncView],
        };
    });
})(define, angular);