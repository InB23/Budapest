angular.module('myApp')
    .controller('forgotPasswordController',['$location', '$http','$log','$scope', function( $location,$http, $log,$scope) {

  $scope.serverUrl='http://localhost:3030/';
  $scope.continueClicked=false;
  $scope.isUserExsist=false;
  $scope.UserNotExsist=false;
  $scope.answerMistake=false;
  $scope.correctAnswer=false;	

  $scope.firstQ=" ";
  $scope.second=" ";


  $scope.getQuestions = function() {
  $scope.continueClicked=true;

  $http.post( $scope.serverUrl + "getUserQuestion", {username:$scope.username})
  .then(function(response) {
		$log.log("response.data");
  	 	if(response.data==="User not exist"){
  	 		$scope.UserNotExsist=true;	
			$log.log("User not exist");
	 	}
	 	else{
		$scope.UserNotExsist=false;		
	 	$scope.isUserExsist=true;	
		$log.log("ok");		
		$scope.firstQ= response.data[0].userQuestionFk;
		$scope.secondQ= response.data[1].userQuestionFk;	
	}
 }
 )}

  $scope.checkAnswers = function() {
	$http.post( $scope.serverUrl + "getUserCurrentPassword", {username:$scope.username, Question1:$scope.firstQ, answer1:$scope.userAns1,  Question2:$scope.secondQ, answer2:$scope.userAns2 })
  	.then(function(response) {

  		if(response.data==="answers not correct, try again"){
  	 		$scope.answerMistake=true;	
			$log.log("answers not correct, try again");
	 	}
	 	else{
			$log.log("correct answers");		
		    $scope.answerMistake=false;	
		    $scope.correctAnswer=true;	
		    $scope.answer=response.data[0].userPassword;
		}

	})}

}]);	

