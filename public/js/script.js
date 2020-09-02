$(document).ready(function() {

    var lat = -2.352;
    var long = 116.348;
    var url = 'http://localhost/testmap/public/';
    var marker = [];

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

    // GRAPH
    var dataPoints = [];
    var options = {
        animationEnabled: true,
        theme: "light2",
        zoomEnabled: true,
        title: {
            text: "Indonesia"
        },
        axisY: {
            title: "Banyak Orang",
            titleFontSize: 24,
        },
        data: [{
            type: "line",
            dataPoints: dataPoints
        }]
    };

    // FUNCTIONS
    // FUNCTION AJAX FOR GRAPH
    function changeGraph( id, record, start, end, name ) {
        $.ajax({
            url: url + 'home/getGraphData',
            data: {
                id: id,
                record: record,
                start: start,
                end: end
            },
            method: 'post',
            dataType: 'json',
            success: function (data) {
                if ( !$.trim(data) ) {}
                // var chart = new CanvasJS.Chart("chartContainer", options);
                options.data[0].dataPoints = [];
                options.title.text = name;

                $.each(data, function(i, val) {
                    var date = val.date_created;
                    var year = parseInt(date.substr(0, 4));
                    var month = parseInt(date.substr(5, 2)) - 1;
                    var day = parseInt(date.substr(8, 2));
                    options.data[0].dataPoints.push({
                        x: new Date(year, month, day),
                        y: parseInt(val.total)
                    });
                });

                (new CanvasJS.Chart("chartContainer", options).render());
                
                // chart.render();
            }
        });
    }

    // Graph First Initialize
    changeGraph ( null, null, null, null, 'Indonesia');

    // Rangepicker
    var startDate;
    var endDate;
    $('input[name="dates"]').daterangepicker({
       showDropdowns: true,
       opens: 'left',
       autoUpdateInput: false,
       locale: {
           cancelLabel: 'Clear'
       }
    }, function(start, end, label) {
       console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      });

    $('input[name="dates"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
        startDate = picker.startDate.format('YYYY-MM-DD');
        endDate = picker.endDate.format('YYYY-MM-DD');
        if ( $('#villages').val() == 'pilih-desa' ) {
            if ( $('#districts').val() == 'pilih-kecamatan' ) {
                if ( $('#regencies').val() == 'pilih-kokab' ) {
                    if ( $('#provinces').val() == 'pilih-provinsi' ) {
                        var id = null;
                        var record = null;
                        var name = 'Indonesia';
                    } else {
                        var id = $('#provinces').val();
                        var record = 'province_id';
                    }
                } else {
                    var id = $('#regencies').val();
                    var record = 'regency_id';
                }
            } else {
                var id = $('#districts').val();
                var record = 'district_id';
            }
        } else {
            var id = $('#villages').val();
            var record = 'village_id';
        }

        changeGraph( id, record, startDate, endDate, name );
       
    });
  
    $('input[name="dates"]').on('cancel.daterangepicker', function(ev, picker) {
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

        // check date
        var checkDate = $('input[name="dates"]').val();
        if ( checkDate == '' || checkDate == null ) {
            var start = null;
            var end = null;
        } else {
            var start = checkDate.substr(0, 10);
            var end = checkDate.substr(13, 10);
        }
    
        var id = $('#provinces').val();
        var record = 'province_id';
        if ( id == 'pilih-provinsi') {
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
        } else {
            $.ajax({
                url: url + 'home/getProvince',
                data: {id: id},
                method: 'post',
                dataType: 'json',
                success: function(data) {
                    mymap.setView([data.lat, data.lng], 9);
                    changeGraph( id, record, start, end, data.name );
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

        // check date
        var checkDate = $('input[name="dates"]').val();
        if ( checkDate == '' || checkDate == null ) {
            var start = null;
            var end = null;
        } else {
            var start = checkDate.substr(0, 10);
            var end = checkDate.substr(13, 10);
        }
        
        var id = $('#regencies').val();
        var record = 'regency_id';
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
                    // Change Graph
                    changeGraph( id, record, start, end, data.name );
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
        var record = 'district_id';
    
        // REMOVE OLD MARKERS
        if ( marker != undefined ) {
            $.each(marker, function (i) {
                mymap.removeLayer(marker[i]);
            });
        }

        // check date
        var checkDate = $('input[name="dates"]').val();
        if ( checkDate == '' || checkDate == null ) {
            var start = null;
            var end = null;
        } else {
            var start = checkDate.substr(0, 10);
            var end = checkDate.substr(13, 10);
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
                    // Change Graph
                    changeGraph (id, record, start, end, data.name);
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
        var record = 'village_id';
        // REMOVE OLD MARKERS
        if ( marker != undefined ) {
            $.each(marker, function (i) {
                mymap.removeLayer(marker[i]);
            });
        }

        // check date
        var checkDate = $('input[name="dates"]').val();
        if ( checkDate == '' || checkDate == null ) {
            var start = null;
            var end = null;
        } else {
            var start = checkDate.substr(0, 10);
            var end = checkDate.substr(13, 10);
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
                // Change Graph
                changeGraph (id, record, start, end, data.name);
            }
        });
    });

});