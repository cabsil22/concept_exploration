// using skypack CDN import the marker clusterer library to group markers together when zoomed out. Create an instance of this, then put the markers inside of it. They have to be objects of marker type.
      import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1";
      // Request needed libraries.
      // Map is kind of obvious
      // info window is the windows that pop up when you click the pins
      // Geometry is for the shapes we'll hopefully draw
      // Advanced Markers is so we can use Pins on the map and style them if we want (maybe later).
      // PinElement is just a default template we can use for the style of the pins.
      const { Map, InfoWindow, Geometry } = await google.maps.importLibrary(
        "maps"
      );

      const { encoding, spherical, poly } = await google.maps.importLibrary("geometry");
      const { AdvancedMarkerElement, PinElement } =
        await google.maps.importLibrary("marker");

      // initialize some global variables that we'll use
      let markers = [];
      let markerClustererObj;
      let map;
      let shapes = [];
      let infoWindow;
      let fillColors = [
        "#FF0000",
        "#FFFF00",
        "#FFFFFF",
        "#008B8B",
        "#E9967A",
        "#DAA520",
      ];

      //start up sequence for the app. The function call is actually at the bottom of this script.
      function startApp() {
        // create some starting markers on the map
        // initData(); //commented out to have a clean map at the start.
        initMap();
        initOverlay();
      }

      // initializes the user interface
      function initOverlay() {
        document
          .getElementById("clear")
          .addEventListener("click", clearMarkers);
        document.getElementById("add").addEventListener("click", () => {
          markerClustererObj.addMarkers(markers);
        });

        document
          .getElementById("createShape")
          .addEventListener("click", createShape);
      }

      function initData() {
        const locations = [
          { customer: "Tom", name: "A", geo: { lat: 37.2794, lng: -106.0249 } },
          {
            customer: "Beth",
            name: "B",
            geo: { lat: 37.2754, lng: -106.0369 },
          },
          {
            customer: "Aaron",
            name: "C",
            geo: { lat: 37.2819, lng: -106.0085 },
          },
          {
            customer: "William",
            name: "D",
            geo: { lat: 37.2809, lng: -106.0345 },
          },
          { customer: "Lee", name: "E", geo: { lat: 37.2799, lng: -106.0149 } },
        ];

        locations.map((position_obj, i) => {
          const position = position_obj.geo;

          const label = position_obj.name.slice(0, 3);
          addMarker(position, label);
        });
      }

      async function initMap() {
        // create a map object and set up the starting parameters, also tie it to the DOM element we want it to render in.
        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 14,
          center: { lat: 37.2799, lng: -106.0201 },
          mapId: "MAP_ID_IS_REQUIRED_BUT_I_AM_NOT_USING_ONE",
          mapTypeId: "hybrid",
          disableDefaultUI: true,
          draggableCursor: "default",
        });

        // define the info window that we'll use for all the popup messages
        infoWindow = new google.maps.InfoWindow({
          content: "",
          disableAutoPan: true,
        });

        // listen for clicks on map and add them to locations
        map.addListener("click", (mapsEvent) => {
          //log it so we can see the coords when click happens
          console.log(mapsEvent.latLng.toJSON());
          // add the marker to the markers array
          addMarker(mapsEvent.latLng.toJSON(), (markers.length + 1).toString());

          //show the markers array on the map
          markerClustererObj.addMarkers(markersArray());
        });

        // Add a marker clusterer to manage the markers.
        markerClustererObj = new MarkerClusterer({ markers, map });
      }

      const clearMarkers = () => {
        markerClustererObj.clearMarkers();
      };

      // method to add marker to the marker array
      // this does not show the marker on the map, you have to trigger the markerClustererObj.addMarkers() to add the markers to the map
      const addMarker = (position, text) => {
        const pinGlyph = new google.maps.marker.PinElement({
          glyph: text,
          glyphColor: "White",
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position,
          content: pinGlyph.element,
        });

        // markers can only be keyboard focusable when they have click listeners
        // open info window when marker is clicked
        const infoText =
          "Shape: " +
          text +
          " body text for the popup. This is an html element that we can create with script.<br />" +
          position.lat +
          ", " +
          position.lng +
          "";

        const infoContent = document.createElement("div");
        const infoContentBody = document.createElement("div");
        
        infoContentBody.innerHTML = infoText;
        infoContent.appendChild(infoContentBody);

        // add click event to the marker to show the info window and set its content
        marker.addListener("click", () => {
          infoWindow.setHeaderContent("Shape: " + text);
          infoWindow.setContent(infoContent);
          infoWindow.open(map, marker);
        });

        let markerItem = { marker: marker, geo: position };
        markers.push(markerItem);
      };

      // returns array of marker objects
      const markersArray = () => {
        return markers.map((marker, i) => {
          return marker.marker;
        });
      };

      //returns an array of geo coords
      const markersGeoArray = () => {
        return markers.map((marker, i) => {
          return marker.geo;
        });
      };

      //create a shape and store it in the shapes array for later.
      const createShape = () => {
        const newShape = new google.maps.Polygon({
          paths: markersGeoArray(),
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: fillColors[shapes.length % 6],
          fillOpacity: 0.35,
        });

        // EVENTS FOR POLYGONS //
        // ********************* //
        //set event to show info window about the shape
        google.maps.event.addListener(newShape, "click", (e) => {
          const area = spherical.computeArea(
            newShape.getPath()
          );
          const acres = (area / 4046.86).toFixed(2);
          infoWindow.setContent(`Area: ${acres} acres`);
          infoWindow.setHeaderContent(
            "Shape: " + (shapes.indexOf(newShape) + 1)
          );
          var latLng = e.latLng;
          infoWindow.setPosition(latLng);
          infoWindow.open(map);
        });

        //set event to toggle edit of shapes
        google.maps.event.addListener(newShape, "contextmenu", (e) => {
          newShape.setEditable(!newShape.getEditable());
        });

        //set event to toggle highlight
        google.maps.event.addListener(newShape, "mouseover", (e) => {
          newShape.setOptions({ strokeColor: "#FFFFFF" });
        });

        //set event to toggle highlight
        google.maps.event.addListener(newShape, "mouseout", (e) => {
          newShape.setOptions({ strokeColor: "#FF0000" });
        });

        newShape.setMap(null);

        shapes.push(newShape);
        markers = [];
        markerClustererObj.clearMarkers();
        displayShapes();
      };

      //show the shapes
      const displayShapes = () => {
        let shapesList = document.getElementById("shapeList");
        shapes.map((shape, i) => {
          if (!shape.getMap()) {
            shape.setMap(map);

            // add shapes to shape list and trigger mouse over on the shape if the list item is hovered
            let shapeListItem = document.createElement("li");
            const area = spherical.computeArea(
              shape.getPath()
            );
            const acres = (area / 4046.86).toFixed(2);
            shapeListItem.textContent = "Shape: " + (shapes.indexOf(shape) + 1) + " Acres: " + acres;
            shapeListItem.addEventListener("mouseover", (event) => {
              try {
                google.maps.event.trigger(shape, "mouseover");
              } catch (error) {}
            });
            shapeListItem.addEventListener("mouseout", (event) => {
              try {
                google.maps.event.trigger(shape, "mouseout");
              } catch (error) {}
            });
            shapeListItem.addEventListener("contextmenu", (event) => {
              event.preventDefault()
              try {
                google.maps.event.trigger(shape, "contextmenu");
              } catch (error) {
                console.log(error);
              }
            });
            shapesList.appendChild(shapeListItem);
          }
        });
      };

      // hide the shapes
      const hideShapes = () => {
        shapes.map((shape, i) => {
          shape.setMap(null);
        });
      };