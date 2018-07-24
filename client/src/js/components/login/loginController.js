angular.module('myApp').controller('loginController', function($http, $location,$log, $scope) {
  $scope.serverUrl = 'http://localhost:3030/';
  $scope.iswrongPassword=false;
  //window.username="guest";



  $scope.login = function() {
    $log.log("user that sent to server is "+$scope.user.username);
    $log.log("pass that was sent to server is "+$scope.user.pass);
    $http.post( $scope.serverUrl + 'login', {user:$scope.user.username, pass:$scope.user.pass})
      .then(function(response) {
        //	$log.log(response);

        if(response.data==="Wrong Password"){
          //$log.log("Wrong Password");
          alert("Wrong Password")
        }
        else if(response.data==="Wrong Username"){
          $log.log("Wrong Username");
          alert("Wrong Username")
        }
        else{
          $log.log("ok");
          localStorage.setItem('token', response.data.token)
          //angular.module('myApp')token =response.data.token;
          window.usernm = $scope.user.username;
          //window.token = response.data.token;
          //$location.url('/user');
        }
      })}
});
