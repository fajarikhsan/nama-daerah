$(document).ready(function() {

    var lat = -2.352;
    var long = 116.348;
    var url = window.base_url;
    var marker = [];
    var markers = L.markerClusterGroup();
    var oldRequest, markerRequest;

    var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 5,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'sk.eyJ1IjoicmFqYWZpa2hzYW4iLCJhIjoiY2tlMG9jdjkwM3h1cjJxdHZ3M2M0OTBrNCJ9.4yO3Sdz8fzR-lhE9EhjMqQ'
    });

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": .5,
        "maxOpacity": .8,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'people_in_city'
      };

    var heatmapLayer = new HeatmapOverlay(cfg);

    var mymap = new L.Map('mapid', {
    center: new L.LatLng(lat, long),
    zoom: 5,
    layers: [baseLayer, heatmapLayer]
    });

    $.getJSON("json/heatmap-coordinate.json", function(data){
        var testData = {
            max: 22936,
            data : data
          };
    
        heatmapLayer.setData(testData);
    });

    // FUNCTIONS
    // FUNCTION AJAX FOR GRAPH
    function changeGraph( id, record, start, end, name ) {
        oldRequest = $.ajax({
            url: url + '/home/getGraphData',
            data: {
                id: id,
                record: record,
                start: start,
                end: end
            },
            beforeSend: function(){
                // Show image container
                $('#null').fadeOut();
                $("#modal").fadeIn();
                // abort ajax
                if( oldRequest != undefined ){ 
                    oldRequest.abort(); 
                    $('#null').fadeOut();
                    $("#modal").fadeIn();
                }  
            },
            method: 'post',
            dataType: 'json',
            success: function (data) {
                if ( !$.trim(data) ) {
                    $('#null').css('display', 'flex');
                    $('#null').css('align-items', 'center');
                    $('#null').css('justify-content', 'center');
                }
                var chartCheck = $("#chartContainer").data("dxChart");
                if ( chartCheck != undefined ) {
                    $("#chartContainer").empty();  
                    $("#chartContainer").removeData();  
                }

                $("#chartContainer").dxChart({
                    title: name,
                    dataSource: data,
                    commonSeriesSettings: {
                        type: "splineArea",
                        argumentField: "created_at",
                        opacity: 0.5
                    },
                    argumentAxis:{
                        valueMarginsEnabled: false
                    },
                    series: [
                        { valueField: "SUSPEK", name: "SUSPEK", point: { visible: true } },
                        { valueField: "PROBABLE", name: "PROBABLE", point: { visible: true } },
                        { valueField: "KONFIRMASI", name: "KONFIRMASI", point: { visible: true } },
                        { valueField: "KONTAK_ERAT", name: "KONTAK_ERAT", point: { visible: true } }
                    ],
                    tooltip: {
                        enabled: true,
                        shared: true,
                        format: {
                            type: "largeNumber",
                            precision: 1
                        },
                        customizeTooltip: function (arg) {
                            var items = arg.valueText.split("\n"),
                                color = arg.point.getColor();
                            $.each(items, function(index, item) {
                                if(item.indexOf(arg.seriesName) === 0) {
                                    items[index] = $("<span>")
                                                    .text(item)
                                                    .addClass("active")
                                                    .css("color", color)
                                                    .prop("outerHTML");
                                }
                            });
                            return { text: items.join("\n") };
                        }
                    },
                    legend: {
                        verticalAlignment: "bottom",
                        horizontalAlignment: "center"
                    },
                    valueAxis: [{
                        valueType: 'numeric'
                    }]
                });
            },
            complete:function(data){
                // Hide image container
                $("#modal").fadeOut();
            }
        });
    }

    // Graph First Initialize
    changeGraph ( null, null, null, null, 'Indonesia');

    // Rangepicker
    var startDate;
    var endDate;
    $('#calendar').daterangepicker({
       showDropdowns: true,
       opens: 'left',
       autoUpdateInput: false,
       locale: {
           cancelLabel: 'Clear',
           format: 'DD/MM/YYYY'
       }
    }, function(start, end, label) {
       console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      });

    $('#calendar').on('apply.daterangepicker', function(ev, picker) {
        $('#inputCalendar').val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        startDate = picker.startDate.format('YYYY-MM-DD');
        endDate = picker.endDate.format('YYYY-MM-DD');
        if ( $('#villages').val() == '0' ) {
            if ( $('#districts').val() == '0' ) {
                if ( $('#regencies').val() == '0' ) {
                    if ( $('#provinces').val() == '0' ) {
                        var id = null;
                        var record = null;
                        var name = 'Indonesia';
                    } else {
                        var id = $('#provinces').val();
                        var record = 'province_id';
                        var name = $('#provinces option:selected').text();
                    }
                } else {
                    var id = $('#regencies').val();
                    var record = 'regency_id';
                    var name = $('#regencies option:selected').text();
                }
            } else {
                var id = $('#districts').val();
                var record = 'district_id';
                var name = $('#districts option:selected').text();
            }
        } else {
            var id = $('#villages').val();
            var record = 'village_id';
            var name = $('#villages option:selected').text();
        }

        changeGraph( id, record, startDate, endDate, name );
       
    });

    
    // GANTI PROVINSI
    $('#provinces').on('change', function() {
        // hapus isi select regency
        $('option', '#regencies').not(':eq(0)').remove();
        // hapus isi select district
        $('option', '#districts').not(':eq(0)').remove();
        // hapus isi select village
        $('option', '#villages').not(':eq(0)').remove();
        // disable select district
        $('#districts').prop('disabled', true);
        // disable select village
        $('#villages').prop('disabled', true);
    
        // REMOVE OLD MARKERS
        if ( marker != undefined ) {
            $.each(marker, function (i) {
                mymap.removeLayer(marker[i]);
            });
        }

        // REMOVE OLD MARKERS
        if ( mymap.hasLayer(markers) == true ) {
            mymap.removeLayer(markers);
        }

        // check date
        var checkDate = $('input[name="dates"]').val();
        var start = checkDate.substr(6,4) + '-' + checkDate.substr(3,2) + '-' + checkDate.substr(0,2);
        var end = checkDate.substr(19,4) + '-' + checkDate.substr(16,2) + '-' + checkDate.substr(13,2);

        console.log(start + ' ' + end);
    
        var id = $('#provinces').val();
        var record = 'province_id';
        if ( id == '0') {
            id = null;
            record = null;
            // disable select regency
            $('#regencies').prop('disabled', true);
            // disable select district
            $('#districts').prop('disabled', true);
            // disable select village
            $('#villages').prop('disabled', true);
            mymap.setView([lat, long], 5);

            // Change Graph
            changeGraph( id, record, start, end, 'Indonesia');

            // Change Heatmap to Global
            if ( mymap.hasLayer(heatmapLayer) == true ) {
                mymap.removeLayer(heatmapLayer);
            }
            var cfg = {
                // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                // if scaleRadius is false it will be the constant radius used in pixels
                "radius": .5,
                "maxOpacity": .8,
                // scales the radius based on map zoom
                "scaleRadius": true,
                // if set to false the heatmap uses the global maximum for colorization
                // if activated: uses the data maximum within the current map boundaries
                //   (there will always be a red spot with useLocalExtremas true)
                "useLocalExtrema": true,
                // which field name in your data represents the latitude - default "lat"
                latField: 'lat',
                // which field name in your data represents the longitude - default "lng"
                lngField: 'lng',
                // which field name in your data represents the data value - default "value"
                valueField: 'people_in_city'
                };
        
            heatmapLayer = new HeatmapOverlay(cfg);

            mymap.addLayer(heatmapLayer);

            $.getJSON("json/heatmap-coordinate.json", function(data){
                var testData = {
                    max: 22936,
                    data : data
                    };
            
                heatmapLayer.setData(testData);
            });
        } else {
            // Remove Old Heatmap Layer
            if ( mymap.hasLayer(heatmapLayer) == true ) {
                mymap.removeLayer(heatmapLayer);
            }

            var config = {
                // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                // if scaleRadius is false it will be the constant radius used in pixels
                "radius": .2,
                "maxOpacity": .8,
                // scales the radius based on map zoom
                "scaleRadius": true,
                // if set to false the heatmap uses the global maximum for colorization
                // if activated: uses the data maximum within the current map boundaries
                //   (there will always be a red spot with useLocalExtremas true)
                "useLocalExtrema": true,
                // which field name in your data represents the latitude - default "lat"
                latField: 'lat',
                // which field name in your data represents the longitude - default "lng"
                lngField: 'lng',
                // which field name in your data represents the data value - default "value"
                valueField: 'people_in_city'
              };
    
            heatmapLayer = new HeatmapOverlay(config);

            mymap.addLayer(heatmapLayer);
            
            $.getJSON("json/heatmap-coordinate.json", function(data){
                var heatmapData = [];
                $.each(data, function(i, val) {
                    if ( val.province_id == id ) {
                        heatmapData.push({
                            lat: val.lat,
                            lng: val.lng,
                            people_in_city: val.people_in_city
                        });
                    }
                });
                var testData = {
                    max: 12000,
                    data : heatmapData
                  };
            
                  heatmapLayer.setData(testData);
            });

            $.ajax({
                url: url + '/home/getProvince',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 9);
                    changeGraph( id, record, start, end, data.name );
                }
            });

            $.ajax({
                url: url + '/home/getRegency',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    $.each(data, function (i, val) {
                        $('#regencies').append('<option value=' + val.id + '>' + val.name + '</option>');
                        $('#regencies').prop('disabled', false);
                    });
                }
            });
        }
    
    });
    
    // GANTI KOTA / KABUPATEN
    $('#regencies').on('change', function () {
        // hapus isi select district
        $('option', '#districts').not(':eq(0)').remove();
        // hapus isi select village
        $('option', '#villages').not(':eq(0)').remove();
        // disable select village
        $('#villages').prop('disabled', true);
    
        // REMOVE OLD MARKERS
        if ( marker != undefined ) {
            $.each(marker, function (i) {
                mymap.removeLayer(marker[i]);
            });
        }

        // REMOVE OLD MARKERS
        if ( mymap.hasLayer(markers) == true ) {
            mymap.removeLayer(markers);
        }

        // REMOVE HEATMAP LAYERS
        // Remove Old Heatmap Layer
        if ( mymap.hasLayer(heatmapLayer) == true ) {
            mymap.removeLayer(heatmapLayer);
        }

        // check date
        var checkDate = $('input[name="dates"]').val();
        var start = checkDate.substr(6,4) + '-' + checkDate.substr(3,2) + '-' + checkDate.substr(0,2);
        var end = checkDate.substr(19,4) + '-' + checkDate.substr(16,2) + '-' + checkDate.substr(13,2);
        
        var id = $('#regencies').val();
        var record = 'regency_id';
        if ( id == '0' ) {
            // disable select district
            $('#districts').prop('disabled', true);
            // disable select village
            $('#villages').prop('disabled', true);

            $.ajax({
                url: url + '/home/getProvince',
                data: {id: $('#provinces').val()},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 9);
                    changeGraph( $('#provinces').val(), 'province_id', start, end, data.name );
                }
            });
        } else {
            // SET MARKERS
            markerRequest = $.ajax({
                url: url + '/home/getAllMarkers',
                data: {id: id, record: record},
                method: 'post',
                dataType: 'json',
                beforeSend: function() {
                    if( markerRequest != undefined ){ 
                        markerRequest.abort();
                    } 
                },
                success: function(data) {
                    $.each(data, function (i, val) {
                        markers.addLayer(L.marker(new L.LatLng(val.lat, val.lng), {title: val.case_number}));
                        // marker[i] = L.marker([val.lat, val.lng]).addTo(mymap);
                    });
                    mymap.addLayer(markers);
                }
            });

            $.ajax({
                url: url + '/home/getRegencyCoordinate',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 11);
                    // Change Graph
                    changeGraph( id, record, start, end, data.name );
                }
            });
        
            $.ajax({
                url: url + '/home/getDistrict',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    $.each(data, function (i, val) {
                        $('#districts').append('<option value=' + val.id + '>' + val.name + '</option>');
                        $('#districts').prop('disabled', false);
                    });
                }
            });
        }
    });
    
    // GANTI KECAMATAN / KELURAHAN
    $('#districts').on('change', function () {
        $('option', '#villages').not(':eq(0)').remove();
        var id = $('#districts').val();
        var record = 'district_id';
    
        // REMOVE OLD MARKERS
        if ( marker != undefined ) {
            $.each(marker, function (i) {
                mymap.removeLayer(marker[i]);
            });
        }

        // REMOVE OLD MARKERS
        if ( mymap.hasLayer(markers) == true ) {
            mymap.removeLayer(markers);
        }

        // REMOVE HEATMAP LAYERS
        // Remove Old Heatmap Layer
        if ( mymap.hasLayer(heatmapLayer) == true ) {
            mymap.removeLayer(heatmapLayer);
        }

        // check date
        var checkDate = $('input[name="dates"]').val();
        var start = checkDate.substr(6,4) + '-' + checkDate.substr(3,2) + '-' + checkDate.substr(0,2);
        var end = checkDate.substr(19,4) + '-' + checkDate.substr(16,2) + '-' + checkDate.substr(13,2);
    
        if ( id == '0' ) {
            // disable select village
            $('#villages').prop('disabled', true);

            $.ajax({
                url: url + '/home/getRegencyCoordinate',
                data: {id: $('#regencies').val()},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 11);
                    // Change Graph
                    changeGraph( $('#regencies').val(), 'regency_id', start, end, data.name );
                }
            });
        } else {
            // SET MARKERS
            markerRequest = $.ajax({
                url: url + '/home/getAllMarkers',
                data: {id: id, record: 'district_id'},
                method: 'post',
                dataType: 'json',
                beforeSend: function() {
                    if( markerRequest != undefined ){ 
                        markerRequest.abort();
                    } 
                },
                success: function(data) {
                    $.each(data, function (i, val) {
                        markers.addLayer(L.marker(new L.LatLng(val.lat, val.lng), {title: val.case_number}));
                        // marker[i] = L.marker([val.lat, val.lng]).addTo(mymap);
                    });
                    mymap.addLayer(markers);
                }
            });

            $.ajax({
                url: url + '/home/getDistrictCoordinate',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 13);
                    // Change Graph
                    changeGraph (id, record, start, end, data.name);
                }
            });
        
            $.ajax({
                url: url + '/home/getVillage',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    $.each(data, function (i, val) {
                        $('#villages').append('<option value=' + val.id + '>' + val.name + '</option>');
                        $('#villages').prop('disabled', false);
                    });
                }
            });
        }
    });
    
    $('#villages').on('change', function () {
        var id = $('#villages').val();
        var record = 'village_id';
        // REMOVE OLD MARKERS
        if ( marker != undefined ) {
            $.each(marker, function (i) {
                mymap.removeLayer(marker[i]);
            });
        }

        // REMOVE OLD MARKERS
        if ( mymap.hasLayer(markers) == true ) {
            mymap.removeLayer(markers);
        }

        // REMOVE HEATMAP LAYERS
        // Remove Old Heatmap Layer
        if ( mymap.hasLayer(heatmapLayer) == true ) {
            mymap.removeLayer(heatmapLayer);
        }

        // check date
        var checkDate = $('input[name="dates"]').val();
        var start = checkDate.substr(6,4) + '-' + checkDate.substr(3,2) + '-' + checkDate.substr(0,2);
        var end = checkDate.substr(19,4) + '-' + checkDate.substr(16,2) + '-' + checkDate.substr(13,2);

        if ( id == '0') {
            $.ajax({
                url: url + '/home/getDistrictCoordinate',
                data: {id: $('#districts').val()},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 13);
                    // Change Graph
                    changeGraph ($('#districts').val(), 'district_id', start, end, data.name);
                }
            });
        } else {
            // SET MARKERS
            markerRequest = $.ajax({
                url: url + '/home/getAllMarkers',
                data: {id: id, record: 'village_id'},
                method: 'post',
                dataType: 'json',
                beforeSend: function() {
                    if( markerRequest != undefined ){ 
                        markerRequest.abort();
                    } 
                },
                success: function(data) {
                    $.each(data, function (i, val) {
                        marker[i] = L.marker([val.lat, val.lng], {title: val.case_number}).addTo(mymap);
                    });
                }
            });
        
            $.ajax({
                url: url + '/home/getVillageCoordinate',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 14);
                    // Change Graph
                    changeGraph (id, record, start, end, data.name);
                }
            });
        }
    
    });

});
