var buildings = {
    '0015': 'Campus Centre',
    '0069': 'IOCT',
    '0111': 'Kimberlin Library',
    '0213': 'Queens building',
    '0490': 'Hugh Aston Building'
};

var bldg_ids = ["0015", "0069", "0111", "0213", "0490"];
var zones = {};


// the main function
function loadZones() {
    for (var i = 0; i < bldg_ids.length; i++) {
        var readings = loadData(bldg_ids[i]);
        var profile = loadProfile(bldg_ids[i]);
        
//pull in time and reading

        var latest = readings.pop();
        
        if (latest.value > profile[latest.time_id].upper) {
            zones[bldg_ids[i]] = "bad";
        } else if (latest.value < profile[latest.time_id].lower) {
            zones[bldg_ids[i]] = "good";
        } else {
            zones[bldg_ids[i]] = "neutral";
        }
    }
// console.log(zones);
}

function loadProfile(bldg_id) {
    return loadJSON("http://greenview.ecoconsulting.co.uk/data/profile_" + bldg_id + ".json");
    // return loadJSON("data/profile_" + bldg_id + ".json");
}

function loadData(bldg_id) {
    return loadJSON("http://greenview.ecoconsulting.co.uk/data/data_" + bldg_id + ".json");
    // return loadJSON("data/data_" + bldg_id + ".json");
}

function showZone(elem_id,bldg_id) {
    var bldg_state_video = '<video src="videos/' + bldg_id + '_' + zones[bldg_id] + '.m4v" poster="images/' + bldg_id + '_' + zones[bldg_id] + '.jpg" webkit-playsinline autoplay controls loop />';
    document.getElementById(elem_id).innerHTML = bldg_state_video;
}

function showName(tag_name,bldg_id) {
    var x = document.getElementsByTagName(tag_name);
    for (i=0; i<x.length; i++) {
        x[i].innerHTML = buildings[bldg_id];
    }
    trumps(bldg_id); //let the right trump in
}

function trumps(bldg_id) {
    var x = document.getElementById("trumpsbox");
    x.innerHTML = '<img src="trumps/' + bldg_id + '.png" width="100%" style="max-width: 768px" />';
}


function loadJSON(sURL) {
    var ajax = new XMLHttpRequest();
    ajax.open( "GET", sURL, false );
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.send(null);
    
    if (ajax.readyState==4 && (ajax.status==200||ajax.status==0)) {
        return JSON.parse(ajax.responseText);
    }
    else {
        alert("Error executing XMLHttpRequest call!");
    }
}

document.addEventListener("deviceready", loadZones(), false);


/* ------------------- DATA --------------------- */
/* data: */
// var profiles = {};
// 
// /*
// function showData(elem_id,bldg_id) {
// }
// 
// */
// /* ----------- LOAD PROFILE DATA FOR EACH BUILDING ------------- */
// function loadProfiles() {
//     var oRequest = new XMLHttpRequest();
//     for (var i = 0; i < bldg_ids.length; i++) {
//         var sURL = "http://" + self.location.hostname + "/data/profile_" + bldg_ids[i] + ".json";
//         oRequest.open( "GET", sURL, false ) //true: async
//         oRequest.setRequestHeader("Content-type", "application/json");
//         oRequest.send(null);
// 
//         if (oRequest.status==200) {
//           profiles[bldg_ids[i]] = JSON.parse(oRequest.responseText);
//         }
//         else {
//           alert("Error executing XMLHttpRequest call!");
//         }
//     }
// }
// 
// /* ----------- SHOWS LATEST METER READINGS ------------- */
// function XMLHttpRequestData(bldg_id) {
//     var oRequest = new XMLHttpRequest();
//     var sURL = "http://" + self.location.hostname + "/data/data_" + bldg_id + ".json";
//     oRequest.open( "GET", sURL, false ) //true: async
//     oRequest.setRequestHeader("Content-type", "application/json");
//     oRequest.send(null);
// 
//     // passes JSON data and building id to returnData, or alerts with error if data call fails
//     if (oRequest.status==200) {
//       // reverses order of readings to latest first - move to returnData
//       returnData(JSON.parse(oRequest.responseText).reverse(),bldg_id);
//     }
//     else {
//       alert("Error executing XMLHttpRequest call!");
//     }
// }
// 
// function returnData(meterReadings,bldg) {
//     var partText = "";
//     var zone;
//     for (var i = 0; i < meterReadings.length; i++) {
//         zone = goodbad(meterReadings[i],bldg);//zones[bldg_id]
//         partText +=
//             ' <strong>Time:</strong> ' + 
//             " " + meterReadings[i].time_id + 
//             ' <strong class="listing">Energy use:</strong> ' + 
//             meterReadings[i].value.toFixed(6) + ' Kwh ' + 
//             'lower: ' + profiles[bldg][meterReadings[i].time_id]["lower"].toFixed(1) +
//             ' upper: ' + profiles[bldg][meterReadings[i].time_id]["upper"].toFixed(1) + 
//             ' zone: ' + zone + '<br>'
//             ;
//     }
//     // adds data to page
//     document.getElementById('readings').innerHTML = partText;
//     document.getElementById('info').innerHTML = buildings[bldg];
// }
// 
// /* we already have these zones from loadZones */
// function goodbad(reading,bldg_id) {
//     var profile = profiles[bldg_id][reading.time_id];
//     if (reading.value > profile.upper) {
//         return "bad";
//     } else if (reading.value < profile.lower) {
//         return "good";
//     
//     } else {
//         return "neutral";
//     }
// }
