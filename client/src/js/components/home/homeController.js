angular.module('myApp').controller('homeController', function($http, $location,$log, $scope, $window) {
// let self = this;
  $scope.serverUrl = 'http://localhost:3030/';
  $scope.iswrongPassword=false;
  $scope.usernm=window.usernm;
  $scope.$watch(
    function() {
      return window.usernm;
    },
    function(newValue, oldValue) {
      $scope.usernm = newValue;

    });

  $scope.login = function() {
	$log.log("user that sent to server is "+$scope.user.username);
	$log.log("pass that was sent to server is "+$scope.user.pass);
	$http.post( $scope.serverUrl + 'login', {user:$scope.user.username, pass:$scope.user.pass})
	.then(function(response) {
			//	$log.log(response);

	 if(response.data==="Wrong Password"){
			//$log.log("Wrong Password");
			alert("Worng Password")
	 }
	else if(response.data==="Wrong Username"){
	$log.log("Wrong Username");
	alert("Worng Username")
	}
	else{
		$log.log("ok");
     //$window.localStorage.setItem('token',response.data.token)
     //$log.log($window.localStorage.getItem('token'));
		 localStorage.setItem('token', response.data.token)
     //angular.module('myApp')token =response.data.token;
     	window.usernm = $scope.user.username;
        //window.token = response.data.token;
        $location.url('/user');
	}
})}

$scope.RandPoi = function() {
    $http.get( $scope.serverUrl + 'poi/get3RandomPoPularPOI').then(function (response) {
      $scope.img1Name = response.data[0].poiName;
      $scope.img2Name = response.data[1].poiName;
      $scope.img3Name = response.data[2].poiName;

      $http.get( $scope.serverUrl + 'poi/getPoiImage/'+$scope.img1Name).then(function (response) {
        $scope.img1Img = response.data[0].poiImage;
      })
      $http.get( $scope.serverUrl + 'poi/getPoiImage/'+$scope.img2Name).then(function (response) {
        $scope.img2Img = response.data[0].poiImage;
      })
      $http.get( $scope.serverUrl + 'poi/getPoiImage/'+$scope.img3Name).then(function (response) {
        $scope.img3Img = response.data[0].poiImage;
      })
    })

  }
  $scope.RandPoi();

});

