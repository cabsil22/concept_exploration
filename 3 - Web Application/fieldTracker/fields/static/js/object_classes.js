class PolygonShape {

    constructor(name, geoCoords, object, fieldId = null) {
        this.name = name;
        this.geoCoords = geoCoords;
        this.object = object;
        this.fieldId = fieldId;

    }

}

class IndividualMarker {
    constructor(name, geoCoords, object) {
        this.name = name;
        this.geoCoords = geoCoords;
        this.object = object;
    }
}

export { PolygonShape, IndividualMarker };