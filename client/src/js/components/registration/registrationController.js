angular.module('myApp')
    .controller('registrationController',['$location', '$http','$log','$scope', function( $location,$http, $log,$scope) {

  $scope.categories = ['Museums', 'Nature & Parks', 'Nightlife', 'Shopping', 'Sights & Landmarks'];    
  $scope.selection = [];
  $scope.countries=[];
  $scope.isLogged=false;
  $scope.questions = ["What is your favorite color ?", "What is your favorite food ?", "What is your favorite song name ?", "What is your pet name ?", "What was your elementry school name ?", "Who is your favorite artist ?", "Who was your favorite school teacher ?"];

  $scope.serverUrl='http://localhost:3030/';


  $scope.toggleSelection = function toggleSelection(catName) {
    var idx = $scope.selection.indexOf(catName);

    // Is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }

    // Is newly selected
    else {
      $scope.selection.push(catName);
    }
  };



  $scope.getcountries = function(){
    var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              myFunction(this);
          }
        };
        xhttp.open("GET", "../countries.xml", true);
        xhttp.send();
        function myFunction(xml) {
          var  xmlDoc,txt, x, i;
          xmlDoc = xml.responseXML;
          txt ="";
          x = xmlDoc.getElementsByTagName("Name");
          for (i = 0; i < x.length; i++) {
            var country = {
              name  : String(x[i].childNodes[0].nodeValue),
          };
              // $log.log(country);
            $scope.countries.push(country);
          }
        };
    }


  $scope.registration = function() {
    $log.log("selection is: "+ $scope.selection);

  $http.post( $scope.serverUrl + "register", {userUsername:$scope.username, userFirstName:$scope.firstName, userLastName:$scope.lastName ,userCity:$scope.city, userCountry:$scope.country ,userMailAddress:$scope.email , userPassword:$scope.password , userCategories:JSON.stringify($scope.selection), question1:$scope.question1, firstAnswer:$scope.firstAnswer, question2:$scope.question2, secondAnswer:$scope.secondAnswer})
  .then(function(response) {

     if(response.data==="User already exists"){
      $log.log("User already exists");
      alert("User already registered")
      }
     else{
     $log.log("registered");
     $scope.isLogged = true;
      $location.url("/home");

      }
})
}

    $scope.getcountries();

}]);


