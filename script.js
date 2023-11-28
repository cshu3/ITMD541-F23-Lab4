document.getElementById('geolocationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var location = 'Current location'; 
            document.getElementById('location').textContent = 'Location: ' + location;
            document.getElementById('coordinates').textContent = 'Latitude: '+lat+', Longitude: '+lon;
            updateDashboard(lat, lon, new Date());
            updateDashboardTomorrow(lat, lon, new Date());
        }, function(error) {
            handleGeolocationError(error);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});

document.getElementById('searchBtn').addEventListener('click', function() {
    var location = document.getElementById('locationSearch').value;
    fetch('https://geocode.maps.co/search?q=' + location)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) { // Check if data array has elements
            var lat = data[0].lat;
            var lon = data[0].lon;
            document.getElementById('location').textContent = 'Location: ' + location;
            document.getElementById('coordinates').textContent = 'Latitude: '+lat+', Longitude: '+lon;
            updateDashboard(lat, lon, new Date());
            updateDashboardTomorrow(lat, lon, new Date());
        } else {
            console.log("Location not found");
			showAlert("Location not found. Please enter a valid location.");
        }
    })
    .catch(error => {
        console.error(error);
        showAlert("An error occurred while fetching location information.");
    });
});

function updateDashboard(lat, lon, date) {
    var dateStr = date.toISOString().split('T')[0];

    fetch('https://api.sunrisesunset.io/json?lat=' + lat + '&lng=' + lon + '&date=' + dateStr)
    .then(response => response.json())
    .then(data => {
        var results = data.results;

        document.getElementById('sunriseToday').textContent = results.sunrise;
        document.getElementById('sunsetToday').textContent = results.sunset;
        document.getElementById('dawnToday').textContent = 'Dawn: ' + results.dawn;
        document.getElementById('duskToday').textContent = 'Dusk: ' + results.dusk;
        document.getElementById('dayLengthToday').textContent = 'Day Length: ' + results.day_length;
        document.getElementById('solarNoonToday').textContent = 'Solar Noon: ' + results.solar_noon;
        document.getElementById('timezone').textContent = 'Timezone: ' + results.timezone;

    })
    .catch(error => {
        console.error(error);
        showAlert("An error occurred while updating the dashboard.");
    });
}

function updateDashboardTomorrow(lat, lon, date) {
    var tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var dateStr = tomorrow.toISOString().split('T')[0];

    fetch('https://api.sunrisesunset.io/json?lat=' + lat + '&lng=' + lon + '&date=' + dateStr)
    .then(response => response.json())
    .then(data => {
        var results = data.results;

        document.getElementById('sunriseTomorrow').textContent = results.sunrise;
        document.getElementById('sunsetTomorrow').textContent = results.sunset;
        document.getElementById('dawnTomorrow').textContent = 'Dawn: ' + results.dawn;
        document.getElementById('duskTomorrow').textContent = 'Dusk: ' + results.dusk;
        document.getElementById('dayLengthTomorrow').textContent = 'Day Length: ' + results.day_length;
        document.getElementById('solarNoonTomorrow').textContent = 'Solar Noon: ' + results.solar_noon;

    })
    .catch(error => {
        console.error(error);
        showAlert("An error occurred while updating tomorrow's dashboard.");
    });
}

function handleGeolocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            showAlert("Geolocation permission denied. Please enable geolocation in your browser settings.");
            break;
        case error.POSITION_UNAVAILABLE:
            showAlert("Geolocation information is unavailable. Please try again later.");
            break;
        case error.TIMEOUT:
            showAlert("Geolocation request timed out. Please try again.");
            break;
        default:
            showAlert("An unknown error occurred while getting your location.");
    }
}

function showAlert(message) {
    alert(message);
}





