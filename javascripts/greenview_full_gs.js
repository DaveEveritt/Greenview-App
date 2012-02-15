// (function(){
//   "use strict";

var buildings = [
    {id: '0015', label: 'Campus Centre'},
    {id: '0069', label: 'IOCT'},
    {id: '0111', label: 'Kimberlin library'},
    {id: '0213', label: 'Queens building'},
    {id: '0490', label: 'Hugh Aston Building'}
];

$(document).ready(function() {
    for (var i = 0; i < buildings.length; i++) {
        var readings = loadData(buildings[i].id);
        var profile = loadProfile(buildings[i].id);

        buildings[i].profile = profile;
        buildings[i].readings = readings;

        var current = getCurrentReading(readings);

        if (current.value > profile[current.time_id].upper) {
            buildings[i].current = "bad";
        } else if (current.value < profile[current.time_id].lower) {
            buildings[i].current = "good";
        } else {
            buildings[i].current = "neutral";
        }
    }
});

function getCurrentReading(readings) {
    return readings.pop();
}

function loadProfile(bldg_id) {
    return loadJSON("http://greenview.ecoconsulting.co.uk/data/profile_" + bldg_id + ".json");
}

function loadData(bldg_id) {
    return loadJSON("http://greenview.ecoconsulting.co.uk/data/data_" + bldg_id + ".json");
}

function loadJSON(sURL) {
    var ajax = new XMLHttpRequest();
    ajax.open( "GET", sURL, false );
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.send(null);
    if (ajax.readyState===4 && (ajax.status===200||ajax.status===0)) {
        return JSON.parse(ajax.responseText);
    }
    else {
        alert("Error executing XMLHttpRequest call!");
    }
}

function update_chart(id) {
    var options = {
        chart: {
            renderTo: 'graph',
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
            text: 'Energy consumption'
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            y: -60,
            floating: true,
            borderWidth: 1,
            backgroundColor: Highcharts.theme.legendBackgroundColor || '#FFFFFF'
        },
        xAxis: {
            labels: {
                rotation: -72, // -6 (horizontal) if inverted: true
                align: 'right'
            }
        },
        yAxis: {
            title: {
                text: 'Kwh'
            }
        },
        tooltip: {
            formatter: function() {
                return ''+
                this.x +': '+ this.y +' Kwh';
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        }
    };

    options.series = [
        {
            name: 'More than average',
            data: [140.5,141.5,141.4,137.2,130.4,121.4,114.2,109.2,106.1,102.3,94.4,89.5,85.4,81.1],
            color: 'rgba(213, 68, 68, .5)',
            threshold: 149,
            fillColor: 'rgba(213, 68, 68, .1)',
            lineColor: 'rgba(213, 68, 68, .6)'
        },
        {
            name: 'Actual energy use',
            type: 'line',
            data: [100.3,97.8,128.3,127.3,129.8,122.7,123.3,115.1,102.3,100.3,93.9,60.0,55.6,40.5],
            color: 'rgba(33, 33, 33, .9)',
            borderWidth: 0,
            borderRadius: 4,
            pointPadding: 0,
            groupPadding: 0.1
        },
        {
            name: 'Less than average',
            data: [104.1,99.9,96.5,93.5,90.6,85.6,82.8,78.4,75.8,70.5,65.6,63.8,61.1,58.9],
            color: 'rgba(68, 213, 68, .9)',
            fillColor: 'rgba(68, 213, 68, .1)',
            lineColor: 'rgba(68, 213, 68, .6)'
        }
    ];
    options.xaxis.categories = ['19:00', '18:30', '18:00', '17:30', '17:00', '16:30', '16:00', '15:30', '15:00', '14:30', '14:00', '13:30', '13:00', '12:30'];

    var chart = new Highcharts.Chart(options);
}

// })();
