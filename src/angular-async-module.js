(function(angular) {
    'use strict';
    var _module = angular.module('async.module.loader', [])
    var matchScriptReg = /<!--\s*script\s*:\s*(\S+)\s*-->/ig;
    var _loadedModules = {};
    var _templateLoadingState = {};
    var TemplateLoadingState = {
        Loading: 'Loading',
        Complete: 'Complete',
    };
    _module.directive('asyncTmpl', [
        '$templateRequest', '$templateCache',
        function($templateRequest, $templateCache) {
            return {
                restrict: 'A',
                scope: {
                    url: '=',
                    loadingStart: '@?',
                    loadingEnd: '@?',
                    scopeLevel: '@?',
                },
                replace: false,
                template: '<div ng-include="url" ng-if="!loading"></div>',
                controller: function($scope) {
                    if (!$scope.url) {
                        throw 'asyncTmpl need "url" attr';
                    }
                    $scope.scopeLevel = $scope.scopeLevel || 1;
                    var $parent = $scope;
                    while ($scope.scopeLevel-- > 0) {
                        $parent = $parent.$parent;
                    }
                    $scope.loading = true;
                    $scope.loadingStart && $parent.$eval($scope.loadingStart);
                    if ($templateCache.get($scope.url) && _templateLoadingState[$scope.url].state == TemplateLoadingState.Complete) {
                        $scope.loadingEnd && $parent.$eval($scope.loadingEnd);
                        $scope.loading = false;
                    } else if ($templateCache.get($scope.url) && _templateLoadingState[$scope.url].state == TemplateLoadingState.Loading) {
                        _templateLoadingState[$scope.url].waitCompleteList.push(function() {
                            $scope.loadingEnd && $parent.$eval($scope.loadingEnd);
                            $scope.loading = false;
                        });
                    } else if (!$templateCache.get($scope.url)) {
                        _templateLoadingState[$scope.url] = {
                            state: TemplateLoadingState.Loading,
                            waitCompleteList: [],
                        }
                        $templateRequest($scope.url).then(function(result) {
                            var files = [];
                            var match = null;
                            while (match = matchScriptReg.exec(result)) {
                                files.push(match[1]);
                            }
                            require(files, function(r) {
                                for(var i = 0; i < arguments.length;i++){
                                    _module.requires.push(arguments[i]);
                                    loadAsync(arguments[i]);
                                }
                                $scope.$apply(function() {
                                    _templateLoadingState[$scope.url].state = TemplateLoadingState.Complete;
                                    angular.forEach(_templateLoadingState[$scope.url].waitCompleteList, function(fun) {
                                        fun();
                                    })
                                    $scope.loadingEnd && $parent.$eval($scope.loadingEnd);
                                    $scope.loading = false;
                                });
                            })
                        })
                    }
                },
                link: function($scope, $element, attrs, ctrls) {},
            }
        }
    ]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function($controllerProvider, $compileProvider, $filterProvider, $provide) {
            _module.providers = {
                $controllerProvider: $controllerProvider,
                $compileProvider: $compileProvider,
                $filterProvider: $filterProvider,
                $provide: $provide,
            }
        }
    ]);

    function loadAsync(moduleName) {
        var runBlocks = loadModules([moduleName]);
        var instanceInjector = angular.element(document.body).injector().get('$injector');
        instanceInjector.strictDi = false;
        angular.forEach(runBlocks, function(fn) { if (fn) instanceInjector.invoke(fn); });
    }

    function loadModules(modulesToLoad) {
        var runBlocks = [],
            moduleFn;
        var providerInjector = angular.element(document.body).injector();
        var providers = _module.providers;
        angular.forEach(modulesToLoad, function(module) {
            if (_loadedModules[module]) return;
            _loadedModules[module] = true;

            function runInvokeQueue(queue) {
                var i, ii;
                for (i = 0, ii = queue.length; i < ii; i++) {
                    var invokeArgs = queue[i];
                    var provider = providers[invokeArgs[0]];
                    provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
                }
            }
            try {
                if (angular.isString(module)) {
                    moduleFn = angular.module(module);
                    runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
                    runInvokeQueue(moduleFn._invokeQueue);
                    runInvokeQueue(moduleFn._configBlocks);
                } else if (angular.isFunction(module)) {
                    runBlocks.push(providerInjector.invoke(module));
                } else if (angular.isArray(module)) {
                    runBlocks.push(providerInjector.invoke(module));
                }
            } catch (e) {
                throw "modulerr Failed to instantiate async module " + module;
            }
        });
        return runBlocks;
    }
})(angular);