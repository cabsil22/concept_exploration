const getCSRF = () => {
    return document.getElementById('csrf_token').value
}

const defaultHeaders = () => {
    return {
        'Content-Type': 'application/json', // Indicate that the body is JSON
        'X-CSRFToken': getCSRF(),
    }
}

const sendRequest = async (method, url, bodyData, headers) => {
    let requestOptions = {}
    if (method === 'GET') {
        requestOptions = {
            method: method, // Specify the HTTP method as POST
            headers: headers,
        }
    } else {
        requestOptions = {
            method: method, // Specify the HTTP method as POST
            headers: headers,
            body: JSON.stringify(bodyData) // Convert the JavaScript object to a JSON string
        }
    }
    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response body
        })
        .then(data => {
            console.log('Success:', data); // Process the successful response data
            return data
        })
        .catch(error => {
            console.error('Error:', error); // Handle network errors or errors thrown in .then()
        });
}

const saveField = async (data) => {
    const url = 'api/fields/'; // Replace with your API endpoint
    const dataToSend = {
        name: data.name,
        latitude: data.geo.lat,
        longitude: data.geo.lng,
    };
    await sendRequest("POST", url, dataToSend, defaultHeaders());
}

const saveFieldDivision = async (data) => {
    const url = 'api/field_divisions/'; // Replace with your API endpoint
    const dataToSend = {
        name: data.name,
        geo_path: data.geoCoords,
        field: data.fieldId
    };
    await sendRequest("POST", url, dataToSend, defaultHeaders());
}


const getField = async (id) => {
    const url = 'api/field_divisions/' + id; // Replace with your API endpoint
    return await sendRequest("GET", url, null, defaultHeaders());
}

const getFields = async () => {
    const url = 'api/fields/'; // Replace with your API endpoint
    return await sendRequest("GET", url, null, defaultHeaders());
}

const getFieldDivisions = async (fieldId = null) => {
    let fieldIdString = ""
    if (fieldId != null) {
        fieldIdString = `field_id=${fieldId}`
    }
    const url = `api/field_divisions/?${fieldIdString}`; // Replace with your API endpoint
    return await sendRequest("GET", url, null, defaultHeaders());
}

export {saveField, getField, getFields, saveFieldDivision, getFieldDivisions};