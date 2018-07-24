
var app = angular.module('myApp', ['ui.bootstrap','ngRoute']);



app.service('userDetails', ['$http, $log',function ($http, $log) {
  var userPois=[];
  this.set = function(poiName){
    userPois.push(poiName)
    $log.log("userPois: " +userPois);

  }
  this.get = function () {
    return userPois;
  }
}]);


app.controller('indexController',function ($scope,$log) {

        window.usernm = "guest";
        $scope.nativ = "#!";


  $scope.usernm =  window.usernm;


  $scope.$watch(
    function() {
      return window.usernm;
    },
    function(newValue, oldValue) {
      $scope.usernm = newValue;
      if (newValue!='guest')
          $scope.nativ = "#!user";

      if (newValue==='guest')
        $scope.nativ = "#!";
    });
 });


app.config(function($routeProvider) {


    $routeProvider.when('/', {
            templateUrl: './components/home/home.html',
            controller : 'homeController'
    })
      .when('/user', {
        templateUrl: 'components/loggedUser/loggedUser.html',
        controller : 'loggedUserController'
      })

    //     .when('/about', {
    //         templateUrl: 'components/About/about.html',
    //         controller : 'aboutController'
    //     })
        .when('/poi', {
            templateUrl: 'components/poi/poi.html',
            controller : 'poiController'
        })
        .when('/myZone', {
            templateUrl: 'components/myZone/myZone.html',
            controller : 'myZoneController'
        })
        .when('/registration', {
            templateUrl: 'components/registration/registration.html',
            controller : 'registrationController'
        })
        .when('/login', {
            templateUrl: 'components/login/login.html',
            controller : 'loginController'
        })
        .when('/forgotPassword', {
          templateUrl: 'components/forgotPassword/forgotPassword.html',
          controller : 'forgotPasswordController'
      })
      .when('/specific/:id', {
        templateUrl: 'components/specific/specific.html',
        controller : 'specificController'

      })
        .otherwise({ redirectTo: '/' });


});










