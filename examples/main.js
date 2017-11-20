require.config({
    baseUrl: '/modules',
    paths: {},
    shim: {}
});

var app = angular.module('app', ['ui.router', 'async.module.loader']);

app.config(['$stateProvider', '$urlRouterProvider' ,'$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/');
    $stateProvider.state("index", {
        url: '/',
        views: {
            "header": {
                template: '<div><h1>this is index header</h1><a ui-sref="home">goto home</a></div>',
            },
            "footer": {
                template: "<h1>this is index foot</h1>"
            },
        }
    }).state("home", {
        url: '/home',
        views: {
            "header": {
                template: '<div><h1>this is home header</h1><a ui-sref="index">goto index</a></div>',
            },
            "footer": {
                template: "<h1>this is home foot</h1><div async-tmpl scope-level='3' loading-start='log(\"router-start\")' loading-end='log(\"router-end\")' url='\"/modules/asyncDemo/async-demo-index-page.html\"'></div>"
            },
        }
    }).state("notFound", {
        url: '/404',
        views: {
            "header": {
                template: '<div><h1>this is 404 error header</h1><a ui-sref="index">goto index</a></div>',
            },
            "footer": {
                template: "<h1>404</h1>"
            },
        }
    })
}])

app.directive('myApp', [function() {
    return {
        restrict: 'A',
        transclude: {
            'header': '?appHeader',
            'footer': '?appFooter'
        },
        scope: {
        },
        template:   '<div>' +
                        '<h1>myApp</h1>' +
                        '<div ng-transclude="header"></div>' +
                        '<h3>my-app-content start</h3>' +
                        '<div ng-if="tmplUrl" async-tmpl loading-start="log(\'my-app-async-tmpl-start\')" loading-end="log(\'my-app-async-tmpl-end\')" url="tmplUrl"></div>' +
                        '<h3>my-app-content end</h3>' +
                        '<br />' +
                        '<div ng-transclude="footer"></div>' +
                    '</div>',
        replace: true,
        controller: function($scope) {
            $scope.log = console.log;
        },
        link: function($scope, $element, attrs, ctrls) {
            $scope.tmplUrl = '/modules/asyncDemo/async-demo-index-page.html';
        },
    }
}]);

window.onload = function(){
    angular.bootstrap(document.body, [app.name]);
}
