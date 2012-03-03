var building_lookup = {};
var currentBldg = 0;

var buildings = [
    {id: 15, padded_id: '0015', label: 'Campus Centre', cls: ".campus"},
    {id: 69, padded_id: '0069', label: 'IOCT', cls: ".ioct"},
    {id: 111, padded_id: '0111', label: 'Kimberlin library', cls: ".kimberlin"},
    {id: 213, padded_id: '0213', label: 'Queens building', cls: ".queens"},
    {id: 490, padded_id: '0490', label: 'Hugh Aston Building', cls: ".hugh"}
];

function loadBuildings() {
    for (var i = 0; i < buildings.length; i++) {
        building_lookup[buildings[i].id] = i;
        buildings[i].chart_data = loadChartData(buildings[i]);
        buildings[i].zone = getZone(buildings[i].chart_data);
        // console.log(buildings[i].label + " is " + buildings[i].zone);
    }
}

function showMap() {
    for (var i = 0; i < buildings.length; i++) {
        var bldg_img = "images/buildings/" + buildings[i].padded_id + "_" + buildings[i].zone + ".png";
        $(buildings[i].cls + " img").attr("src", bldg_img);
    }
}

$(document).ready(function() {
    refresh();
    var interval = 1000 * 60 * 5; //refresh every 5 minutes
    setInterval ( "refresh()", interval );
});

function playVideo(state) {
    if (state===true) {
        document.getElementById("bldvideo").play();
    } else {
        document.getElementById("bldvideo").pause();
    }
}

function refresh() {
    loadBuildings();
    showMap();
    if (localStorage.bldg_id > 0) {
        showBuilding(localStorage.bldg_id);
    }
}

function getZone(data) {
    var upper = data.upper.pop();
    var lower = data.lower.pop();
    var value = data.value.pop();
    if (value > upper) {
        return 'bad';
    } else if (value < lower) {
        return 'good';
    } else {
        return 'neutral';
    }
}

function loadChartData(bldg) {
    // return loadJSON("data/chart_" + bldg.padded_id + ".json");
    return loadJSON("http://greenview.ecoconsulting.co.uk/data/chart_" + bldg.padded_id + ".json");
}

var h1 = document.getElementsByTagName("h1");
function showBuilding(bldg_id) {
    var bldg = buildings[building_lookup[bldg_id]];
    var bldg_state_video = '<video id="bldvideo" src="videos/' + bldg.padded_id + '_' + bldg.zone + '.m4v" poster="images/posters/' + bldg.padded_id + '_' + bldg.zone + '.jpg" webkit-playsinline autoplay controls loop />';
    document.getElementById("video").innerHTML = bldg_state_video;
    for (i=0; i<h1.length; i++) {
        h1[i].innerHTML = bldg.label + ' - state: ' + bldg.zone;
    }
    var trumps = document.getElementById("trumpsbox");
    trumps.innerHTML = '<img src="images/trumps/' + bldg.padded_id + '_' + bldg.zone +  '.png" width="100%" style="max-width: 768px" />';
    
    update_chart(bldg);
    
    if (!localStorage.bldg_id) {
        localStorage.bldg_id = bldg_id;
    }
    playVideo(true);
}

var ajax = new XMLHttpRequest();
function loadJSON(sURL) {
    ajax.open( "GET", sURL, false );
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.send(null);
    if (ajax.readyState===4 && (ajax.status===200||ajax.status===0)) {
        return JSON.parse(ajax.responseText);
    }
    else {
        alert("Could not retrieve data! [url: " + sURL + ", status: " + ajax.status + "]");
    }
}

function update_chart(bldg) {
    var options = {
        chart: {
            renderTo: 'graph',
            zoomType: 'x',
            defaultSeriesType: 'areaspline',
            borderWidth: 0,
            borderRadius: 0,
            // height: 393,
            spacingTop: 2,
            spacingLeft: 2,
            spacingRight: 16,
            backgroundColor: '#fff'
        },
        title: {
            text: bldg.label + ' electricity consumption'
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
//            x: 80,
            y: -60,
            floating: true,
            borderWidth: 1,
            backgroundColor: Highcharts.theme.legendBackgroundColor || 'rgba(255,255,255,0.4)'
        },
        xAxis: {
            type: 'datetime',
            maxZoom: 24 * 3600000, // one day
            title: {
                text: 'time'
            },
            labels: {
                rotation: -72,
                align: 'right'
            }
        },
        yAxis: {
            title: {
                text: 'Consumption (kWh)'
            }
        },
        tooltip: {
            formatter: function() {
                d = new Date(this.x);
                return ''+
                d +': '+ this.y +' Kwh';
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 1.0,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 10
                        }
                    }
                }
            },
            line: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 10
                        }
                    }
                }
            }
        }
    };
    var startd = new Date(bldg.chart_data.datetime[0]);
    var start = startd.getTime();
    options.series = [
        {
            name: 'More than average',
            pointInterval: 60 * 30 * 1000,
            pointStart: start,
            data: bldg.chart_data.upper,
            color: 'rgba(213, 68, 68, .5)',
            threshold: 149,
            fillColor: 'rgba(213, 68, 68, .1)',
            lineColor: 'rgba(193, 48, 48, .2)'
        },
        {
            name: 'Actual energy use',
            pointInterval: 60 * 30 * 1000,
            pointStart: start,
            type: 'line',
            data: bldg.chart_data.value,
            color: 'rgba(33, 33, 33, .9)',
            borderWidth: 0,
            borderRadius: 4,
            pointPadding: 0,
            groupPadding: 0.1
        },
        {
            name: 'Less than average',
            pointInterval: 60 * 30 * 1000,
            pointStart: start,
            data: bldg.chart_data.lower,
            color: 'rgba(68, 213, 68, .9)',
            fillColor: 'rgba(68, 213, 68, .1)',
            lineColor: 'rgba(68, 213, 68, .2)'
        }
    ];
    var chart = new Highcharts.Chart(options);
}
// reload graph after loading page to force resize
// function update() {
//     if (window.location.href.indexOf("#screen") >= 0) {
//         window.setTimeout(function(){window.location.reload()}, 900000); //1000 = 1 sec, 900000 = 15 mins
//     }
// }
