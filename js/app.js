var portal = angular.module('portal', ['ngRoute', 'toastr'])

.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	
	$locationProvider.html5Mode(true);

	$routeProvider
    .when("/home", {
        templateUrl : "./view/home.html",
        controller: 'homeCtrl'
    })

    .otherwise({ redirectTo: '/home' });
    
}])
