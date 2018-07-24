angular.module('myApp').controller('poiController', function($http, $location,$log, $scope) {


  $scope.serverUrl = 'http://localhost:3030/';
  $scope.categories = ['Museums', 'Nature & Parks', 'Nightlife', 'Shopping', 'Sights & Landmarks'];
  $scope.selection = [];
  $scope.myOrderBy = 'categoryNameFk';


  if ((window.usernm!='guest')) {
    $log.log("localStorage:");
    $log.log(localStorage.getItem(window.usernm));
    if (!(localStorage.getItem(window.usernm)=="" || localStorage.getItem(window.usernm)==null))
       window.userPois = JSON.parse(localStorage.getItem(window.usernm));
    $log.log("using localstorage");
    $log.log(window.userPois);
  }
  else{
    // $log.log("guest");

  }

  // if (window.userPois == null || window.userPois == undefined || window.userPois == "[]" || !(window.userPois.length != 0))
  if (window.userPois == null || window.userPois == undefined || window.userPois == "[]" ||window.userPois.length==0 ) {
    window.userPois = [];
    $log.log("window.userPois empty");
  }
  if (window.userPois2 == null || window.userPois2 == undefined || window.userPois2 == "[]" ||window.userPois2.length==0 ) {
    window.userPois2 = [];
    $log.log("window.userPois2 empty");
  }


  var isOrderedByRank = false;


  $scope.allPois = function () {
    $http.get($scope.serverUrl + 'poi/getPoiNameImageViewsRankCat').then(function (response) {
      $scope.allpois = response.data;
      $scope.pois = response.data;
    });
  };

  $scope.allPois();


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
      $scope.pois = $scope.allpois;
    }
    else {
      $scope.pois = [];
      for (var i = 0; i < $scope.selection.length; i++) {

        $http.get($scope.serverUrl + 'poi/getPoiArrByCat/' + $scope.selection[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            $scope.pois.push(response.data[j]);
          }
        });
      }
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

    if (window.usernm == "guest") {
      return false;

    }
    else {
      return true;
    }
  };


  $scope.checkHeart = function (poi) {
    if(window.userPois.includes(poi.poiName)) {
      return true;
    }
    else{
      return false;
    }
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
    //return window.userPois.includes(poi);
  }
});


angular.module('myApp').directive("poimain", function () {
  return {
    restrict: 'AECM',
    template: `
   
<div class="container">
     
    <div class=" box-shadow" >
     
     <span>
         <img ng-show="showFullHeart(poi)" ng-click="addToUserList(poi)" ng-src="./components/poi/poiImages/filledHeart.jpg" align="right" height="35" width="35" style="margin-top: 77px">
          <img ng-show="showEmptyHeart(poi)" ng-click="addToUserList(poi)" ng-src="./components/poi/poiImages/emptyHeart.png" align="right" height="35" width="35" style="margin-top: 77px">

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


