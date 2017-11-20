(function (define, angular) {
    'use strict';
    define([
        'asyncDemo/asyncDemoDirective',
    ], function (asyncDemoDirective) {
        var modName = 'App.asyncDemoMod';
        angular.module(modName, [])
            .directive('myAsyncView', asyncDemoDirective.myAsyncView)
        return modName;
    });
})(define, angular);