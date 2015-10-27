var Main = function () {
    var _app = angular.module("app", ["ui.router", "ngSanitize"]),
        _connection = new Connection();
    this.app = function () {
        return _app;
    }();
    this.connection = function () {
        return _connection;
    }();

    this.init = function () {
        /*        _app.run(function ($rootScope, $state) {
                    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {

                    });
                });

                _app.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
                    $stateProvider
                        .state("auth", {
                            url: "/auth",
                            templateUrl: "templates/auth.html"
                        });
                    $urlRouterProvider.otherwise("auth");

                });*/
        _connection.connect();
    }
    this.init();
}
var application = new Main();