angular.module('myApp').controller('specificController', function($http, $location,$log, $scope) {


  $scope.serverUrl = "http://localhost:3030/";

  var new111 = $location.url();
  var res = new111.split("/");
  var poiName = res[res.length-1].replace("%20"," ");
  while (poiName.includes("%20")){
    poiName = poiName.replace("%20"," ");}
  $scope.CurrPoi = "";
  $scope.review1 = "";
  $scope.review2 = "";

  window.init = function(){

    window.gps = [];
    window.gps.push({name:"Chinese Market","Lat":47.488250,"Long":19.098380});
    window.gps.push({name:"Danube Palace","Lat":47.500234,"Long":19.049094});
    window.gps.push({name:"Feny Utca Market","Lat":47.509098,"Long":19.025322});
    window.gps.push({name:"Danube Palace","Lat":47.500234,"Long":19.049094});
    window.gps.push({name:"Franz Liszt Academy","Lat":47.506956,"Long":19.066624});
    window.gps.push({name:"House of Terror Museum","Lat":47.506893,"Long":19.065126});
    window.gps.push({name:"Hungarian Jewish Museum and Archives","Lat":47.496948,"Long":19.061183});
    window.gps.push({name:"Hungarian National Museum","Lat":47.491198,"Long":19.062477});
    window.gps.push({name:"Hungarian State Opera House","Lat":47.502717,"Long":19.058308});
    window.gps.push({name:"Jardin Bar","Lat":47.497764,"Long":19.060545});
    window.gps.push({name:"Keleti Railway Station","Lat":47.500312,"Long":19.084027});
    window.gps.push({name:"Lehel Market Hall","Lat":47.518418,"Long":19.061075});
    window.gps.push({name:"Margaret Island","Lat":47.526641,"Long":19.046394});
    window.gps.push({name:"Ohegy Park","Lat":47.479807,"Long":19.144651});
    window.gps.push({name:"Parliament","Lat":47.507121,"Long":19.045669});
    window.gps.push({name:"Petofi Csarnok (PeCsa) Flea Market","Lat":47.514472,"Long":19.088159});
    window.gps.push({name:"Pointer Pub","Lat":47.490035,"Long":19.060765});
    window.gps.push({name:"Retox Bar","Lat":47.505196,"Long":19.059731});
    window.gps.push({name:"Romai Kalandpark","Lat":47.574240,"Long":19.049020});
    window.gps.push({name:"Shoah Cellar","Lat":47.496784,"Long":19.061402});
    window.gps.push({name:"Szent Istvan Park","Lat":47.500729,"Long":19.053141});
    window.gps.push({name:"Szimpla Sunday Farmers Market","Lat":47.496956,"Long":19.063284});
    window.gps.push({name:"Tasting Table Budapest","Lat":47.492449,"Long":19.065123});
    window.gps.push({name:"Tuk Tuk Bar","Lat":47.497588,"Long":19.054321});
    window.gps.push({name:"Victor Vasarely Museum","Lat":47.540263,"Long":19.046573});

  };






  $http.get($scope.serverUrl + 'poi/' + poiName )
    .then(function (response) {

      $scope.CurrPoi  = response.data[0];
      $log.log($scope.CurrPoi);
    });

  $http.get($scope.serverUrl + 'poi/poiReviews/' + poiName )
    .then(function (response) {

      $scope.review1  = response.data[response.data.length-1];
      $scope.review2 = response.data[response.data.length-2];
      $log.log($scope.review1);
      $log.log($scope.review2);
    });


  var counter=0;
  $scope.PoiPosition = function(a,b)
  {
    if (counter ==0)
    {
      L.mapbox.accessToken = 'pk.eyJ1IjoiaW5iYXJybyIsImEiOiJjamp5dnJmZHQ4ZHM0M3dvM2FnZjBnaHE2In0.-5t8OgIde6ebw7leh4yuig';
      var mapLeaflet = L.mapbox.map('map-leaflet', 'mapbox.streets')
        .setView([a,b], 15);

      L.marker([a,b]).addTo(mapLeaflet);

      counter++;
    }

  }

  window.init();
  var i  = 0;
  for (i=0;i<window.gps.length;i++) {
    if (window.gps[i].name === poiName) {
      $scope.Lat = window.gps[i].Lat;
      $scope.Long = window.gps[i].Long;

    }

  }

  //$scope.Long = window.gps[poiName].Long;


});


angular.module('myApp').directive("poimain1", function () {
  return {
    restrict: 'AECM',
    template: `
   
<div class="container">
     
    <div class=" box-shadow" >
     
     <span>
         <img ng-show="showFullHeart(poi.poiName)" ng-click="addToUserList(poi)" ng-src="./components/poi/poiImages/filledHeart.jpg" align="right" height="35" width="35" style="margin-top: 77px">
          <img ng-hide="showFullHeart(poi.poiName)" ng-click="addToUserList(poi)" ng-src="./components/poi/poiImages/emptyHeart.png" align="right" height="35" width="35" style="margin-top: 77px">

     </span>
      <span class="thumbnail" style="height: 200px; width: 93%">

        <img ng-src="{{poi.poiImage}" style="max-height: 250px; max-width: 250px" align="right" >
        
          <div class="caption">
          
              <p style="font-size: 15px">{{poi.poiName}</p>
              <p style="font-size: 15px; color: grey">Views:{{poi.poiViews}</p>
              <p style="font-size: 15px"> Rank: {{poi.poiRank}</p>

               <br>
              <p style="font-size: 13px; color: grey">category:{{poi.categoryNameFk}</p>
              
          </div>
          
      </span> 
       
           
    </div>  
      
</div>
 

        `,
    replace: true
  }
});
