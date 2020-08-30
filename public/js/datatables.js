$(document).ready(function() {

    var url = 'http://localhost/testmap/public/';

    $('#information').DataTable( {
        "processing": true,
        "serverSide": true,
        "order": [],
        "ajax": {
            url: url + 'home/getAllDatatablesData',
            type: "POST"
        },
        "columnDefs": [
            {
                "targets": [0, 3, 4],
                "orderable": false
            }
        ],
        "columns": [
            { "data": "id" },
            { "data": "case_number" },
            { "data": "case_order" },
            { "data": "province_id" },
            { "data": "regency_id" },
            { "data": "district_id" },
            { "data": "village_id" },
            { "data": "lat" },
            { "data": "lng" },
            { "data": "created_at" }
         ]
    });

    // GANTI PROVINSI
    $('#provinces').on('change', function() {
        var id = $('#provinces').val();
        var record = 'province_id';
    });
});