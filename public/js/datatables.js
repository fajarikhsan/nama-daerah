$(document).ready(function() {

    var url = 'http://localhost/testmap/public/';

    // $('#information').DataTable( {
    //     "processing": true,
    //     "ajax": {
    //         "url": url + 'home/getAllDatatablesData'
    //     }
    // });

    // GLOBAL
    // INITIALIZE DATATABLES
    $('#information').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            'type': 'POST',
            'url': url + 'home/getAllDatatablesData'
        },
        "columnDefs": [
            {
                "targets": [1, 7, 8, 9],
                "orderable": false
            },
            {
                "targets": [0,1,2,3,4,5,6,7,8,9],
                "className": 'dt-body-center'
            }
        ]
    });

    // GANTI PROVINSI
    $('#provinces').on('change', function() {
        var id = $('#provinces').val();
        var record = 'province_id';
        // RE-INITIALIZE DATATABLES
        $('#information').DataTable().clear();
        $('#information').DataTable().destroy();
        // INITIALIZE DATATABLES
        $('#information').dataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                'type': 'POST',
                'url': url + 'home/getDatatablesData',
                'data': {id: id, record: record}
            },
            "columnDefs": [
                {
                    "targets": [1, 7, 8, 9],
                    "orderable": false
                },
                {
                    "targets": [0,1,2,3,4,5,6,7,8,9],
                    "className": 'dt-body-center'
                }
            ]
        });
    });

    // GANTI KOTA / KABUPATEN
    $('#regencies').on('change', function() {
        var id = $('#regencies').val();
        var record = 'regency_id';
        // RE-INITIALIZE DATATABLES
        $('#information').DataTable().clear();
        $('#information').DataTable().destroy();
        // INITIALIZE DATATABLES
        $('#information').dataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                'type': 'POST',
                'url': url + 'home/getDatatablesData',
                'data': {id: id, record: record}
            },
            "columnDefs": [
                {
                    "targets": [1, 7, 8, 9],
                    "orderable": false
                },
                {
                    "targets": [0,1,2,3,4,5,6,7,8,9],
                    "className": 'dt-body-center'
                }
            ]
        });
    });

    // GANTI KECAMATAN
    $('#districts').on('change', function() {
        var id = $('#districts').val();
        var record = 'district_id';
        // RE-INITIALIZE DATATABLES
        $('#information').DataTable().clear();
        $('#information').DataTable().destroy();
        // INITIALIZE DATATABLES
        $('#information').dataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                'type': 'POST',
                'url': url + 'home/getDatatablesData',
                'data': {id: id, record: record}
            },
            "columnDefs": [
                {
                    "targets": [1, 7, 8, 9],
                    "orderable": false
                },
                {
                    "targets": [0,1,2,3,4,5,6,7,8,9],
                    "className": 'dt-body-center'
                }
            ]
        });
    });

    // GANTI DESA
    $('#villages').on('change', function() {
        var id = $('#villages').val();
        var record = 'village_id';
        // RE-INITIALIZE DATATABLES
        $('#information').DataTable().clear();
        $('#information').DataTable().destroy();
        // INITIALIZE DATATABLES
        $('#information').dataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                'type': 'POST',
                'url': url + 'home/getDatatablesData',
                'data': {id: id, record: record}
            },
            "columnDefs": [
                {
                    "targets": [1, 7, 8, 9],
                    "orderable": false
                },
                {
                    "targets": [0,1,2,3,4,5,6,7,8,9],
                    "className": 'dt-body-center'
                }
            ]
        });
    });
});