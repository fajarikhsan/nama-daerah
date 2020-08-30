$(document).ready(function() {

    var lat = -2.352;
    var long = 116.348;
    var url = 'http://localhost/testmap/public/';
    var marker = [];
    
    // var mymap = L.map('mapid').setView([lat, long], 5);

    var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'sk.eyJ1IjoicmFqYWZpa2hzYW4iLCJhIjoiY2tlMG9jdjkwM3h1cjJxdHZ3M2M0OTBrNCJ9.4yO3Sdz8fzR-lhE9EhjMqQ'
    });

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": 2,
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
    
        var id = $('#provinces').val();
        if ( id == 'pilih-provinsi') {
            // disable select regency
            $('#regencies').prop('disabled', true);
            // disable select district
            $('#districts').prop('disabled', true);
            // disable select village
            $('#villages').prop('disabled', true);
            mymap.setView([lat, long], 5);
        } else {
            $.ajax({
                url: url + 'home/getProvince',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 9);
                }
            });

            $.ajax({
                url: url + 'home/getRegency',
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
        
        var id = $('#regencies').val();
        if ( id == 'pilih-kokab' ) {
            // disable select district
            $('#districts').prop('disabled', true);
            // disable select village
            $('#villages').prop('disabled', true);
        } else {
            $.ajax({
                url: url + 'home/getRegencyCoordinate',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 11);
                }
            });
        
            $.ajax({
                url: url + 'home/getDistrict',
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
        
            $.ajax({
                url: url + 'home/getHeatmapData',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                }
            });
        }
    });
    
    // GANTI KECAMATAN / KELURAHAN
    $('#districts').on('change', function () {
        $('option', '#villages').not(':eq(0)').remove();
        var id = $('#districts').val();
    
        // REMOVE OLD MARKERS
        if ( marker != undefined ) {
            $.each(marker, function (i) {
                mymap.removeLayer(marker[i]);
            });
        }
    
        if ( id == 'pilih-kecamatan' ) {
            // disable select village
            $('#villages').prop('disabled', true);
        } else {
            $.ajax({
                url: url + 'home/getDistrictCoordinate',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 13);
                }
            });
        
            $.ajax({
                url: url + 'home/getVillage',
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
        // REMOVE OLD MARKERS
        if ( marker != undefined ) {
            $.each(marker, function (i) {
                mymap.removeLayer(marker[i]);
            });
        }
    
        // SET MARKERS
        $.ajax({
            url: url + 'home/getAllMarkers',
            data: {id: id},
            method: 'post',
            dataType: 'json',
            success: function(data) {
                $.each(data, function (i, val) {
                    marker[i] = L.marker([val.lat, val.lng]).addTo(mymap);
                });
            }
        });
    
        $.ajax({
            url: url + 'home/getVillageCoordinate',
            data: {id: id},
            method: 'post',
            dataType: 'json',
            success: function(data) {
                mymap.setView([data.lat, data.lng], 14);
            }
        });
    });

});