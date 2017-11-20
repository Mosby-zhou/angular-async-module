# angular-async-module
===============================================================
for angularjs 1.x load async module

## Start
import `angular`, `require`and`angular-async-module`(`angular-ui-router` is not necessary). config you app like `angular.module('app', ['async.module.loader', ...])` and config require `require.config({baseUrl: '/modules'})`, then use `async-tmpl` directive and set attr : `url` to async-load modules.

## How to run the demo
* Install node.js
* Run `npm install` from within the root project directory to install relevant dependencies
* Run `npm start` from within the root project directory to start the app
* Open `http://localhost:8888/` in the browser

## Help
you can set attrs `loading-start` and `loading-end` to do you need to do when loading, there is an attr `scope-level` you can set whene you use `async-tmpl` in deep scope, and you `start-end` function in out scope. **Be careful** ng-transclude and ui-view will create a new scope.
