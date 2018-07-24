angular.module('myApp').controller('loggedUserController', function($http, $location,$log, $scope, $window) {

  $scope.serverUrl = 'http://localhost:3030/';
  $scope.userPoiByCat=[];
  $scope.userLastSavedt=[];


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

  $scope.allPois = function () {
    $http.get($scope.serverUrl + 'poi/getPoiNameImageViewsRankCat').then(function (response) {
      $scope.allpois = response.data;
      $scope.pois = response.data;
      var i=0;
      for (i=0;i<$scope.allpois.length;i++)
        if (window.userPois.includes($scope.allpois[i].poiName))
          window.userPois2.push($scope.allpois[i]);
    });
  };

  $scope.allPois();


  $http.defaults.headers.common["x-access-token"]= localStorage.getItem('token');


  $scope.user2PopularPoiByHisCat = function() {
    $log.log(localStorage.getItem("token"));

    $http.post($scope.serverUrl + 'user/getUser2PopularPoiByCat' + "/?token=" + localStorage.getItem("token"), {userUsername: window.usernm})
      .then(function (response) {
        $scope.userPoiByCat = response.data;

      })
  };

  $scope.user2PopularPoiByHisCat();




  $scope.user2LastSavedPoi = function() {
    $log.log(localStorage.getItem("token"));

    $http.post($scope.serverUrl + 'user/getLastTwoSavedPoi' + "/?token=" + localStorage.getItem("token"), {userUsername: window.usernm})
      .then(function (response) {
        $scope.userLastSavedt = response.data;

      })
  };

  $scope.user2LastSavedPoi();


  $scope.init = function(){

    window.gps = [];
    var point = {name:"Chinese Market", Lat:47.488250, Long:19.098380}
    window.gps.push(point);

    var result = gps.find(obj => {
      return obj.name === "Chinese Market"
    })
    $log.log("result: "+result);


    window.gps.push({"Chinese Market":{"Lat":47.488250,"Long":19.098380}});
    window.gps.push({"Danube Palace":{"Lat":47.500234,"Long":19.049094}});
    window.gps.push({"Feny Utca Market":{"Lat":47.509098,"Long":19.025322}});
    window.gps.push({"Danube Palace":{"Lat":47.500234,"Long":19.049094}});
    window.gps.push({"Franz Liszt Academy":{"Lat":47.506956,"Long":19.066624}});
    window.gps.push({"House of Terror Museum":{"Lat":47.506893,"Long":19.065126}});
    window.gps.push({"Hungarian Jewish Museum and Archives":{"Lat":47.496948,"Long":19.061183}});
    window.gps.push({"Hungarian National Museum":{"Lat":47.491198,"Long":19.062477}});
    window.gps.push({"Hungarian State Opera House":{"Lat":47.502717,"Long":19.058308}});
    window.gps.push({"Jardin Bar":{"Lat":47.497764,"Long":19.060545}});
    window.gps.push({"Keleti Railway Station":{"Lat":47.500312,"Long":19.084027}});
    window.gps.push({"Lehel Market Hall":{"Lat":47.518418,"Long":19.061075}});
    window.gps.push({"Margaret Island":{"Lat":47.526641,"Long":19.046394}});
  window.gps.push({"Ohegy Park":{"Lat":47.479807,"Long":19.144651}});
    window.gps.push({"Parliament":{"Lat":47.507121,"Long":19.045669}});
    window.gps.push({"Petofi Csarnok (PeCsa) Flea Market":{"Lat":47.514472,"Long":19.088159}});
    window.gps.push({"Pointer Pub":{"Lat":47.490035,"Long":19.060765}});
    window.gps.push({"Retox Bar":{"Lat":47.505196,"Long":19.059731}});
    window.gps.push({"Romai Kalandpark":{"Lat":47.574240,"Long":19.049020}});
    window.gps.push({"Shoah Cellar":{"Lat":47.496784,"Long":19.061402}});
    window.gps.push({"Szent Istvan Park":{"Lat":47.500729,"Long":19.053141}});
    window.gps.push({"Szimpla Sunday Farmers Market":{"Lat":47.496956,"Long":19.063284}});
    window.gps.push({"Tasting Table Budapest":{"Lat":47.492449,"Long":19.065123}});
    window.gps.push({"Tuk Tuk Bar":{"Lat":47.497588,"Long":19.054321}});
    window.gps.push({"Victor Vasarely Museum":{"Lat":47.540263,"Long":19.046573}});

  }


});



angular.module('myApp').directive("poiloggeduser", function () {
  return {
    restrict: 'AECM',
    template: `
   
<div class="container">
     
    <div class=" box-shadow" >
     
      <span class="thumbnail" style="height: 200px; width: 93%">

        <img ng-src="{{poi.poiImage}}" style="max-height: 250px; max-width: 250px" align="right" >
        
          <div class="caption">
          
              <p style="font-size: 15px">{{poi.poiName}}</p>
              <p style="font-size: 15px; color: grey">Views:{{poi.poiViews}}</p>
              <p style="font-size: 15px">rank: {{poi.poiRank}}</p>

               <br>
              <p style="font-size: 13px; color: grey">category:{{poi.categoryNameFk}}</p>
              
          </div>
          
      </span> 
       
           
    </div>  
      
</div>
 

        `,
    replace: true
  }
});

















