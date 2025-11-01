// using skypack CDN import the marker clusterer library to group markers together when zoomed out. Create an instance of this, then put the markers inside of it. They have to be objects of marker type.
import {MarkerClusterer} from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1";
// Request needed libraries.
// Map is kind of obvious
// info window is the windows that pop up when you click the pins
// Geometry is for the shapes we'll hopefully draw
// Advanced Markers is so we can use Pins on the map and style them if we want (maybe later).
// PinElement is just a default template we can use for the style of the pins.
const {Map, InfoWindow, Geometry} = await google.maps.importLibrary(
    "maps"
);
import {PolygonShape, IndividualMarker} from './object_classes.js'
import {saveField, getField, getFields, saveFieldDivision, getFieldDivisions} from "./api_interface.js";
import {startTracking, stopTracking, moveToCurrentLocation} from "./gps.js";

const {encoding, spherical, poly} = await google.maps.importLibrary("geometry");
const {AdvancedMarkerElement, PinElement} =
    await google.maps.importLibrary("marker");

// initialize some global variables that we'll use
let editState = false
let tempMarkers = [];
let fieldMarkers = [];
let markerClustererObj;
let visibleMarkers = [];
let map;
let shapes = [];
let infoWindow;
let maxZoomShapesVisible = 14;
let fillColors = [
    "#FF0000",
    "#FFFF00",
    "#FFFFFF",
    "#008B8B",
    "#E9967A",
    "#DAA520",
];

//start up sequence for the app. The function call is actually at the bottom of this script.
async function startApp() {
    // create some starting markers on the map
    initData(); //commented out to have a clean map at the start.
    await initMap();
    initOverlay();
    finalizeReady();
}

async function finalizeReady() {

    // move map to current location
    const initialCoordinates = JSON.parse(document.getElementById('initialCoords').textContent);

    console.log("Initial Coordinates", initialCoordinates);
    if (initialCoordinates !== "") {
        map.setCenter(initialCoordinates);
    } else {
        moveToCurrentLocation(map)
    }
}


// initializes the user interface
function initOverlay() {
    document
        .getElementById("add")
        .addEventListener("click", saveLastShape);

    document.getElementById("addField").addEventListener("click", () => {
        addFieldHandler();
    });

    document
        .getElementById("createShape")
        .addEventListener("click", manualCreateShapeHandler);

    document.getElementById('trackGPS').addEventListener(
        'click',
        (event) => {
            //start GPS tracking and add markers to the map on each gps update
            startTracking(addMarker, map)
        });
    document.getElementById('stopGPS').addEventListener(
        'click',
        (event) => {
            let gpsReturnedPath = stopTracking();
            createShape(gpsReturnedPath);
        });

    document.getElementById("toggleEdit").addEventListener(
        'click',
        () => {
            let editButtons = document.getElementsByClassName("editButton");
            editState = !editState;
            for (let editBtn of editButtons) {
                if (editState) {
                    editBtn.style.display = 'inline';

                } else {
                    editBtn.style.display = 'none';
                }

            }

        })

    document.getElementById("showFields").addEventListener('click', (event) => {
        toggleFieldsDisplay(event.target.checked)
    })

    document.getElementById("showShapes").addEventListener('click', (event) => {
        toggleFieldDivisionsDisplay(event.target.checked)
    })
}


async function initData() {
    let initialFields = await getFields();
    console.log("initfield data: ", initialFields);
    initialFields.results.map(async (initialField, i) => {
        await addMarker({lat: initialField.latitude, lng: initialField.longitude}, initialField.name, fieldMarkers);

    })
    toggleFieldsDisplay(true);
    let initialFieldId = document.getElementById("field_id_select").value
    console.log("initial fieldId: ", initialFieldId);
    let initialFieldDivisions = await getFieldDivisions(initialFieldId);
    console.log("Initial Divisions: ", initialFieldDivisions);
    initialFieldDivisions.results.map(async (fd, i) => {
        createShape(fd.geo_path, fd.name, fd.id, fd.field);
    })
    toggleFieldDivisionsDisplay(true);


}

function toggleFieldDivisionsDisplay(value) {
    if (value) {
        displayShapes()
    } else {
        hideShapes()
    }
}

function addFieldHandler() {
    let fieldName = prompt("Type the name of the field");
    let lastMarker = tempMarkers.pop()
    if (lastMarker) {
        lastMarker.name = fieldName;
        console.log("AddFieldHandler - lastMarker: ", lastMarker);
        saveField(lastMarker);
        updateMarkerClusterer();
    }
}

function toggleFieldsDisplay(value) {
    if (value) {
        visibleMarkers.push(fieldMarkers);
    } else {
        visibleMarkers.splice(visibleMarkers.indexOf(fieldMarkers), 1);
    }
    updateMarkerClusterer()
}

function updateMarkerClusterer() {
    markerClustererObj.clearMarkers();
    visibleMarkers.map((markerArray, i) => {
        markerClustererObj.addMarkers(getMarkerObjects(markerArray));
    })

}

let previousZoom = 20;

function mapZoomChanged() {

    let currentZoom = map.getZoom();
    let itemsVisible = false
    if (shapes.length > 0) {
        itemsVisible = shapes[0].object.getVisible();
    }

    if (currentZoom < maxZoomShapesVisible && (previousZoom > maxZoomShapesVisible || itemsVisible)) {
        shapes.map(
            (shape, i) => {
                shape.object.setVisible(false);
            }
        )
    } else if (currentZoom >= maxZoomShapesVisible && previousZoom <= maxZoomShapesVisible) {
        shapes.map((shape, i) => {
            shape.object.setVisible(true);
        })
    }
    previousZoom = currentZoom;
}


async function initMap() {
    // create a map object and set up the starting parameters, also tie it to the DOM element we want it to render in.
    map = await new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: {lat: 37.2799, lng: -106.0201},
        mapId: "MAP_ID_IS_REQUIRED_BUT_I_AM_NOT_USING_ONE",
        mapTypeId: "hybrid",
        disableDefaultUI: true,
        draggableCursor: "default",
    });

    map.addListener('zoom_changed', mapZoomChanged)


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
        if (editState) {
            addMarker(mapsEvent.latLng.toJSON(), (tempMarkers.length + 1).toString());
        }

        //show the tempMarkers array on the map
    });

    // Add a marker clusterer to manage the tempMarkers.
    markerClustererObj = new MarkerClusterer({tempMarkers, map});
}

const saveLastShape = () => {
    console.log("SaveShape shapes data: ", shapes)
    let fieldDivision = shapes[shapes.length - 1];
    console.log("save fieldDivision: ", fieldDivision);
    saveFieldDivision(fieldDivision)


};


const removeMarker = (marker) => {

    console.log(tempMarkers)
    console.log(tempMarkers[tempMarkers.indexOf(marker)])
    tempMarkers.splice(tempMarkers.indexOf(marker), 1);
    // clearMarkers();
    updateMarkerClusterer()
    // markerClustererObj.addMarkers(markersArray());
}

// method to add marker to the marker array
// this does not show the marker on the map, you have to trigger the markerClustererObj.addMarkers() to add the markers to the map
const addMarker = (position, text = null, destinationArray = null) => {
    if (!text) {
        text = (tempMarkers.length + 1).toString()
    }
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
    const removeMarkerButton = document.createElement("button");
    removeMarkerButton.addEventListener('click', () => {
        removeMarker(marker)
    });
    removeMarkerButton.textContent = "remove this marker";


    infoContent.appendChild(infoContentBody);

    // add click event to the marker to show the info window and set its content
    marker.addListener("click", () => {
        infoWindow.setHeaderContent("Marker: " + text);
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
    });

    let markerItem = {marker: marker, geo: position};
    if (destinationArray) {
        destinationArray.push(markerItem);
    } else {
        tempMarkers.push(markerItem);
    }
    markerClustererObj.addMarkers(markersArray());

};

// returns array of marker objects
const markersArray = () => {
    return tempMarkers.map((marker, i) => {
        return marker.marker;
    });
};

const getMarkerObjects = (sourceMarkersArray) => {
    return sourceMarkersArray.map((marker, i) => {
        return marker.marker;
    });
};


//returns an array of geo coords
const markersGeoArray = () => {
    return tempMarkers.map((marker, i) => {
        return marker.geo;
    });
};


const getMarkerGeoArray = (sourceMarkersArray) => {
    return sourceMarkersArray.map((marker, i) => {
        return marker.geo;
    });
};

//create a shape and store it in the shapes array for later.
const manualCreateShapeHandler = () => {
    createShape(markersGeoArray(), 'Shape ' + (shapes.length + 1).toString())
    displayShapes()
}

const createShape = async (path = null, name = null, id = null, fieldId = null) => {
    console.log("Path var: ", path)
    console.log("Create Shape - shapes length: ", shapes.length, shapes)
    if (!path) {
        path = markersGeoArray()
    }

    if (!fieldId) {
        fieldId = document.getElementById("field_id_select").value
    }
    const newShape = new google.maps.Polygon({
        paths: path,
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
        const infoBodyContent = document.createElement("div");
        const infoBodyText = document.createElement("p");
        const acres = (area / 4046.86).toFixed(2);
        infoBodyText.textContent = `Area: ${acres} acres`
        infoBodyContent.appendChild(infoBodyText);

        if (id) {
            const editShapeLink = document.createElement("a");
            editShapeLink.href = `/admin/fields/fielddivision/${id}/change/`;
            editShapeLink.textContent = "Edit"
            infoBodyContent.appendChild(editShapeLink);
        }
        infoWindow.setContent(infoBodyContent);
        let headerContent = "Shape: " + (shapes.indexOf(newShape) + 1)
        if (name) {
            headerContent = name;
        }
        infoWindow.setHeaderContent(headerContent);
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
        newShape.setOptions({strokeColor: "#FFFFFF"});
    });

    //set event to toggle highlight
    google.maps.event.addListener(newShape, "mouseout", (e) => {
        newShape.setOptions({strokeColor: "#FF0000"});
    });

    newShape.setMap(null);

    let newPolygon = new PolygonShape(name, path, newShape, fieldId);
    console.log("Create Shape - New Polygon object: ", newPolygon);
    shapes.push(newPolygon);
    tempMarkers = [];
    // markerClustererObj.clearMarkers()
    updateMarkerClusterer();

};

//show the shapes
const displayShapes = () => {
    let shapesList = document.getElementById("shapeList");

    shapes.map((polygonObject, i) => {
        let shape = polygonObject.object;
        console.log(shape);
        console.log(polygonObject)
        if (!shape.getMap()) {
            shape.setMap(map);

            // add shapes to shape list and trigger mouse over on the shape if the list item is hovered
            let shapeListItem = document.createElement("li");
            const area = spherical.computeArea(
                shape.getPath()
            );
            const acres = (area / 4046.86).toFixed(2);
            shapeListItem.textContent = "Shape: " + polygonObject.name + " Acres: " + acres;
            shapeListItem.addEventListener("mouseover", (event) => {
                try {
                    google.maps.event.trigger(shape, "mouseover");
                } catch (error) {
                }
            });
            shapeListItem.addEventListener("mouseout", (event) => {
                try {
                    google.maps.event.trigger(shape, "mouseout");
                } catch (error) {
                }
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
    shapes.map((polygonObject, i) => {
        let shape = polygonObject.object;
        shape.setMap(null);
    });
    let shapesList = document.getElementById("shapeList");
    shapesList.innerHTML = "";
};


startApp();