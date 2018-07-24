angular.module('myApp').controller('myZoneController', function($http, $location,$log, $scope) {


  $scope.serverUrl = 'http://localhost:3030/';
  $scope.categories = ['Museums', 'Nature & Parks', 'Nightlife', 'Shopping', 'Sights & Landmarks'];
  $scope.selection = [];
  $scope.myOrderBy = 'categoryNameFk';
  $scope.allpois =window.userPois2;
  $scope.pois = window.userPois2;

  $log.log(" window.userPois inside myZoneController is: "+window.userPois2);

  var isOrderedByRank = false;


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


    if ($scope.selection.length == 0) {
      $scope.pois = window.userPois2;
    }
    else {
      $scope.pois = [];
      for (var i = 0; i < $scope.allpois.length; i++) {

        for (var j = 0; j < $scope.selection.length; j++) {

          $log.log("$scope.allpois[i].categoryNameFk: "+$scope.allpois[i].categoryNameFk);
          $log.log("$scope.selection[j]: "+$scope.selection[j]);
          if ($scope.allpois[i].categoryNameFk == $scope.selection[j]){
            $scope.pois.push($scope.allpois[i]);
          }
        }
      }


      // $scope.pois = [];
      // for (var i = 0; i < $scope.selection.length; i++) {
      //   $http.get($scope.serverUrl + 'poi/getPoiArrByCat/' + $scope.selection[i]).then(function (response) {
      //     $log.log("response.data is: "+response.data);
      //     var resp = JSON.stringify(data.response.data);
      //     for (var j = 0; j < resp.length; j++) {
      //       //$log.log("response.data[j].poiName: "+response.data[j].poiName);
      //
      //       // if ($scope.allpois.includes(response.data[j])){
      //       //   $log.log("includes");
      //       //   $scope.pois.push(response.data[j]);
      //       // }
      //
      //       for(var k=0; k<$scope.allpois.length; k++){
      //         if($scope.allpois[k].includes(resp[j])){
      //
      //           $log.log("includes");
      //           $scope.pois.push(resp[j]);
      //
      //         }
      //       }
      //
      //     }
      //   });
      // }
    }
  };


  $scope.orderByMe = function () {
    isOrderedByRank = !(isOrderedByRank);
    if (isOrderedByRank) {
      $scope.myOrderBy = 'poiRank';
      document.getElementById('btn').innerHTML = 'unorder By site\'s Rank'

    }
    else {
      document.getElementById('btn').innerHTML = 'order By site\'s Rank'
      $scope.myOrderBy = 'categoryNameFk';

    }
  };


  $scope.addToUserList = function (poi) {

    if (window.userPois.includes(poi.poiName)){

      remove(window.userPois,poi.poiName);
      remove(window.userPois2,poi);

      // $log.log("remove"+poi);
      // $log.log("window.userPois"+window.userPois);


    }
    else{
      window.userPois.push(poi.poiName);
      window.userPois2.push(poi);

      //$log.log("push"+poi);
      //  $log.log("window.userPois"+window.userPois);


    }

    localStorage.setItem(window.usernm, JSON.stringify(window.userPois));
  };


  function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }


  $scope.checkIfLogged = function(){
    //$log.log("window.usernm:");
    //$log.log(window.usernm);

    if (window.usernm == "guest") {
      //$log.log("false");
      return false;

    }
    else {
      // $log.log("true");
      return true;


    }

  };


  $scope.checkHeart = function (poi) {

    return (window.userPois.includes(poi));
  };

  $scope.showEmptyHeart = function (poi) {
    if (!($scope.checkIfLogged()))
      return false;
    else{
      if ($scope.checkHeart(poi))
        return false;
      else
        return true;
    }
  };

  $scope.showFullHeart = function (poi) {
    if (!($scope.checkIfLogged()))
      return false;
    else{
      if ($scope.checkHeart(poi))
        return true;
      else
        return false;
    }
  }



});



angular.module('myApp').directive("poimyzone", function () {
  return {
    restrict: 'AECM',
    template: `
   
<div class="container">
     
    <div class=" box-shadow" >
     
     <span>
         <img ng-hide="showFullHeart(poi)" ng-click="addToUserList(poi)" ng-src="./components/myZone/myZoneImages/x.png" align="right" height="35" width="35" style="margin-top: 77px">

     </span>
      <span class="thumbnail" style="height: 200px; width: 93%">

        <img ng-src="{{poi.poiImage}}" style="max-height: 250px; max-width: 250px" align="right" >
        
          <div class="caption">
          
              <p style="font-size: 15px">{{poi.poiName}}</p>
              <p style="font-size: 15px; color: grey">Views:{{poi.poiViews}}</p>
              <p style="font-size: 15px"> Rank: {{poi.poiRank}}</p>
              
               <br>
              <p style="font-size: 13px; color: grey">category:{{poi.categoryNameFk}}</p>
              <a  ng-href="#!specific/{{poi.poiName}}" class="btn btn-danger">More Info</a>

              
          </div>
          
      </span> 
       
           
    </div>  
      
</div>
 

        `,
    replace: true
  }
});

