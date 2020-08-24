var lat = -2.352;
var long = 116.348;

// SHOW MAP
var mymap = L.map('mapid').setView([lat, long], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'sk.eyJ1IjoicmFqYWZpa2hzYW4iLCJhIjoiY2tlMG9jdjkwM3h1cjJxdHZ3M2M0OTBrNCJ9.4yO3Sdz8fzR-lhE9EhjMqQ'
}).addTo(mymap);

// var marker = L.marker([-0.7893, 113.9213]).addTo(mymap);

// SET MARKERS
$.ajax({
    url: 'http://localhost/testmap/public/home/getAllMarkers',
    dataType: 'json',
    success: function(test) {
        $.each(test, function (i, val) {
            L.marker([val.latitude, val.longitude]).addTo(mymap);
        });
    }
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
            url: 'http://localhost/testmap/public/home/getProvince',
            data: {id: id},
            method: 'post',
            dataType: 'json',
            success: function(data) {
                mymap.setView([data.latitude, data.longitude], 9);
            }
        });
    
        $.ajax({
            url: 'http://localhost/testmap/public/home/getRegency',
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
    
    var id = $('#regencies').val();
    if ( id == 'pilih-kokab' ) {
        // disable select district
        $('#districts').prop('disabled', true);
        // disable select village
        $('#villages').prop('disabled', true);
    } else {
        $.ajax({
            url: 'http://localhost/testmap/public/home/getRegencyCoordinate',
            data: {id: id},
            method: 'post',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                mymap.setView([data.latitude, data.longitude], 11);
            }
        });
    
        $.ajax({
            url: 'http://localhost/testmap/public/home/getDistrict',
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
    if ( id == 'pilih-kecamatan' ) {
        // disable select village
        $('#villages').prop('disabled', true);
    } else {
        $.ajax({
            url: 'http://localhost/testmap/public/home/getDistrictCoordinate',
            data: {id: id},
            method: 'post',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                mymap.setView([data.latitude, data.longitude], 13);
            }
        });
    
        $.ajax({
            url: 'http://localhost/testmap/public/home/getVillage',
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
    $.ajax({
        url: 'http://localhost/testmap/public/home/getVillageCoordinate',
        data: {id: id},
        method: 'post',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            mymap.setView([data.latitude, data.longitude], 15);
        }
    });
});