

const config = {
    apiKey: "AIzaSyCGuGpJEWo1_9gWwgSv3JO9s1051wDpY6E",
    authDomain: "alumbradopubliconte.firebaseapp.com",
    databaseURL: "https://alumbradopubliconte-default-rtdb.firebaseio.com",
    projectId: "alumbradopubliconte",
    storageBucket: "alumbradopubliconte.appspot.com",
    messagingSenderId: "842157703635",
    appId: "1:842157703635:web:64db480e6191f6c0326f26",
    measurementId: "G-H4PG2MM8S5"

  // apiKey: "AIzaSyBRVBJuvk-Mbxzv2DTx2a18jPaope7gBPY",
  // authDomain: "usrsmty.firebaseapp.com",
  // databaseURL: "https://usrsmty.firebaseio.com",
  // projectId: "usrsmty",
  // storageBucket: "usrsmty.appspot.com",
  // messagingSenderId: "840900135873",
  // appId: "1:840900135873:web:cbcc627858630c625ebd40",
  // measurementId: "G-47LEFJRJCX"


};

firebase.initializeApp(config);




// counter for online cars...
var cars_count = 0;
var pedidos_count = 0;
var colorConductor = "#00023";
// markers array to store all the markers, so that we could remove marker when any car goes offline and its data will be remove from realtime database...
var markers = [];
var conductoresArray = [];

var markersPedidos = [];
var map;

var numDeltas = 100;
var delay = 10; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;
var position = [25.70430847, -100.51732815]; //lat lon CEID

var datos;

function initMap() { // Google Map Initialization... 
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: new google.maps.LatLng(27.48413098, -99.55785475),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    
    
    
    );

    

/////////
// Load the GeoJSON file
map.data.loadGeoJson('https://dgncfe21.github.io/testGeoJsonv1/LP_NUL04520.geojson', null, function () {
  // Set the style for the loaded GeoJSON features
  map.data.setStyle({
    fillColor: 'red',
    strokeColor: 'red',
    strokeWeight: 2
  });
});

// Create the location button control
var locationButton = document.createElement('button');
locationButton.textContent = 'My Location';
locationButton.classList.add('custom-map-control-button');

// Register a click event listener on the location button
locationButton.addEventListener('click', function () {
  // Try to get the user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center the map on the user's location
      map.setCenter(userLocation);

      // Create a marker at the user's location
      var marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'GPS'
      });
    });
  }
});

// Add the location button control to the map
map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);
}
//var infowindow = new google.maps.InfoWindow();
			
			//map.data.addListener('click', function(event) {
			//  let ciclo = event.feature.getProperty("CICLO");
			//  let html = 'CICLO: ' + ciclo; // combine state name with a label
			//  infowindow.setContent(html); // show the html variable in the infowindow
			//  infowindow.setPosition(event.latLng); // anchor the infowindow at the marker
			//  infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)}); // move the infowindow up slightly to the top of the marker icon
			//  infowindow.open(map);
			//});




//} //end of map




function transition(result, data) {
    datos = data.val();
    console.log("data Mombre: " + datos);
    i = 0;
    deltaLat = (result[0] - position[0]) / numDeltas;
    deltaLng = (result[1] - position[1]) / numDeltas;
    moveMarker();
}

function moveMarker() {
    console.log("Move Markerr Mombre: " + datos.nombre);
    position[0] += deltaLat;
    position[1] += deltaLng;


    //var latlng = new google.maps.LatLng(position[0], position[1]);

    var longlat = [position[1], position[0]];
    //marker.setTitle("Latitude:"+position[0]+" | Longitude:"+position[1]);
    //marker.setPosition(latlng);

    // marker.setLngLat(longlat)
    // marker.addTo(map);


    if (i != numDeltas) {
        i++;
        setTimeout(moveMarker, delay);
    }
}


// This Function will create a car icon with angle and add/display that marker on the map
function AddMarkerConductor(data) {
    let conductor = data;


    let urlIcon = (conductor.situacion == "Disponible") ? 'electricmeter.png' : 'electricmeter.png';
    var result = [parseFloat(conductor.latitude), parseFloat(conductor.longitude)];
    //transition(result,data)

    //#region marker e icono

    var icon = { // car icon

        url: urlIcon,
        //path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
        // scale: 0.6,
        scaledSize: new google.maps.Size(30, 30),
        fillColor: colorConductor, //<-- Car Color, you can change it 
        fillOpacity: 1,
        strokeWeight: 1,
        anchor: new google.maps.Point(0, 5),
        rotation: 44 //<-- Car angle
    };

    //path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',

    // Esta es la información del marker que se va a mostrar, el contenido acepta HTML
    var infowindow = new google.maps.InfoWindow({
        content: `<strong>Medidor: ${conductor.meds}
                    <p>Lectura: ${conductor.lectura}</p>
                    <p>Ilicitos: ${conductor.ilicitos}</p>
                    </strong>`
    });
    var uluru = { lat: parseFloat(conductor.latitude), lng: parseFloat(conductor.longitude) };

    var marker = new google.maps.Marker({
        position: uluru,
        icon: icon,
        map: map,
        title: conductor.meds
    });

    // Al hacer click sobre el marker mostraremos su información en una ventana
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    markers[conductor.key] = marker; // add marker in the markers array...
    document.getElementById("cars").innerHTML = cars_count;
    //#endregion

}


function buildLococationConductoresList(data) {
    let array = data;
    let arraySize = array.length;
    let color;
    var listings = document.getElementById('poimapbox-listings');
    listings.innerHTML = "";
    for (let i = 0; i < arraySize; i++) {
        let element = array[i];
        let conductor = element;

        AddMarkerConductor(element);

        color = (conductor.situacion == "Disponible") ? '#8bc34ba3' : '#ff572287';


        var listing = listings.appendChild(document.createElement('div'));
        listing.innerHTML
        listing.className = 'amenity-poi';


        listing.style.backgroundColor = color;

        listing.id = "listing-" + i;

        var link = listing.appendChild(document.createElement('a'));
        link.innerHTML = "";
        link.href = '#';
        link.className = 'name';
        link.dataPosition = i;

        link.innerHTML =
            // '<img src=' + conductor.properties.imagetmb + '>' +
            '<img width="50" height="50" src="https://img.icons8.com/external-others-pike-picture/50/external-Electric-Meter-electricity-others-pike-picture.png" alt="external-Electric-Meter-electricity-others-pike-picture"/>' +
            '<h3>Med:' + conductor.meds+ '</h3>' +
            '<p>Lect:' + conductor.lectura+ '</p>' +
            '<p>Ilicito:' + conductor.ilicitos + '</p>' +
            '<p>FecHr: ' + conductor.timestamp + '</p>'

        link.addEventListener('click', function (e) {
            // Update the conductor to the Park associated with the clicked link
            var clickedListing = data[this.dataPosition];
            console.log(clickedListing);
            // // 1. Fly to the point
            flyToStore(clickedListing);

            // // 2. Close all other popups and display popup for clicked Park
            // createPopUp(clickedListing);

            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('amenity-poi active');

            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');

        });

    }
}

function flyToStore(currentFeature) {
    let latitud = parseFloat(currentFeature.latitude);
    let longitud = parseFloat(currentFeature.longitude);
    // map.flyTo({
    //     center: currentFeature,
    //     zoom: 15
    // });

    map.setZoom(17);
    map.panTo({ lat: latitud, lng: longitud });
}

// get firebase database reference...
var cars_Ref = firebase.database().ref('/PIK5140');


var dataConductores = firebase.database().ref('/PIK5140');
dataConductores.on('value', function (snapshot) {
    //updateStarCount(postElement, snapshot.val());

    let conductores = snapshot.val();
    conductoresArray = [];
    for (const key in conductores) {
        if (conductores.hasOwnProperty(key)) {
            const element = conductores[key];
            //console.log(element);
            conductoresArray.push(element);


        }
    }

    buildLococationConductoresList(conductoresArray);
});

// this event will be triggered when a new object will be added in the database...
cars_Ref.on('child_added', function (data) {
    //console.log(data.val());
    cars_count++;
    //AddMarkerConductor(data);
    let conductor = data.val();

});

// this event will be triggered on location change of any car...
cars_Ref.on('child_changed', function (data) {
    markers[data.key].setMap(null);
    //AddMarkerConductor(data);
    let conductor = data.val();

});

// If any car goes offline then this event will get triggered and we'll remove the marker of that car...  
cars_Ref.on('child_removed', function (data) {
    markers[data.key].setMap(null);
    cars_count--;
    document.getElementById("cars").innerHTML = cars_count;
});


function AddPedido(data) {
    var color = "";
 

    if (data.val().suministro != "BAJABAJA") {

        color = "#09ebcd";
        colorConductor = "#09ebcd";

    } else if (data.val().suministro != "ALTABAJA") {
        color = "#32a856";
        colorConductor = "#32a856";
    } else {
        color = "#151582";
    }

    var icon = { // car icon
      path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
         scale: 0.5,
       
        fillColor: color,
        // strokeWeight: 1,
        // anchor: new google.maps.Point(0, 5),
        // rotation: 44 //<-- Car angle
        fillOpacity: 1,
        strokeWeight: 2,
        anchor: new google.maps.Point(0, 5),
        rotation: data.val().angle //<-- Car angle
    };

    // Esta es la información del marker que se va a mostrar, el contenido acepta HTML
    var infowindow = new google.maps.InfoWindow({
        content: `<strong>Medidor: ${data.val().medidor}
                <p>Facturado: ${data.val().facturado}</p>
                <p>Suministro: ${data.val().suministro}</p>
                </strong>`
    });
    var uluru = { lat: parseFloat(data.val().latitud), lng: parseFloat(data.val().longitud) };

    var marker = new google.maps.Marker({
        position: uluru,
        icon: icon,
        map: map,
        title: data.val().nombre
    });

    // Al hacer click sobre el marker mostraremos su información en una ventana
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    markersPedidos[data.key] = marker; // add marker in the markers array...
    document.getElementById("pedidos").innerHTML = pedidos_count;
}




var pedidos_Ref = firebase.database().ref('/RPUMEDIDOR_E3');

// this event will be triggered when a new object will be added in the database...
pedidos_Ref.on('child_added', function (data) {
    pedidos_count++;
    AddPedido(data);
});

// this event will be triggered on location change of any car...
pedidos_Ref.on('child_changed', function (data) {
    markersPedidos[data.key].setMap(null);
    AddPedido(data);
});

// If any car goes offline then this event will get triggered and we'll remove the marker of that car...  
pedidos_Ref.on('child_removed', function (data) {
    markersPedidos[data.key].setMap(null);
    pedidos_count--;
    document.getElementById("pedidos").innerHTML = pedidos_count;
});





