$(document).ready(function() {

    var url = window.base_url;
    var xhr;

    // FUNCTIONS
    // RE-INITIALIZE DATATABLES
    function tables( name, table, record, condition, id ) {
        xhr.settings()[0].jqXHR.abort();
        // RE-INITIALIZE DATATABLES
        $('#information').DataTable().clear();
        $('#information').DataTable().destroy();
        // INITIALIZE DATATABLES
        xhr = $('#information').DataTable({
            "processing": true,
            "serverSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "order": [[ 1, "asc" ]],
            "ajax": {
                'type': 'POST',
                'url': url + '/home/getDatatablesData',
                'data': {
                    table: table, 
                    record: record,
                    condition: condition,
                    id: id
                }
            },
            "columnDefs": [
                {
                    "targets": [0,1,2,3,4],
                    "orderable": false
                },
                {
                    "targets": [1,2,3,4],
                    "className": 'dt-body-center'
                },
                {"title": name, "targets": 0},
                {"title": "Suspek", "targets": 1},
                {"title": "Probable", "targets": 2},
                {"title": "Konfirmasi", "targets": 3},
                {"title": "Kontak Erat", "targets": 4}
            ]
        });
    }

    // GLOBAL
    // INITIALIZE DATATABLES
    xhr = $('#information').DataTable({
        "processing": true,
        "serverSide": true,
        "order": [[ 1, "asc" ]],
        "bFilter": false,
        "bLengthChange": false,
        "ajax": {
            'type': 'POST',
            'url': url + '/home/getAllDatatablesData',
            'data': {
                table: 'provinces',
                record: 'province_id'
            }
        },
        "columnDefs": [
            {
                "targets": [0,1,2,3,4],
                "orderable": false
            },
            {
                "targets": [1,2,3,4],
                "className": 'dt-body-center'
            },
            {"title": "Provinsi", "targets": 0},
            {"title": "Suspek", "targets": 1},
            {"title": "Probable", "targets": 2},
            {"title": "Konfirmasi", "targets": 3},
            {"title": "Kontak Erat", "targets": 4}
        ]
    });

    // GANTI PROVINSI
    $('#provinces').on('change', function() {
        id = $('#provinces').val();
        if ( id == 'pilih-provinsi') {
            $('#information').DataTable().clear();
            $('#information').DataTable().destroy();
            // GLOBAL
            // INITIALIZE DATATABLES
            xhr = $('#information').DataTable({
                "processing": true,
                "serverSide": true,
                "order": [[ 1, "asc" ]],
                "bFilter": false,
                "bLengthChange": false,
                "ajax": {
                    'type': 'POST',
                    'url': url + '/home/getAllDatatablesData',
                    'data': {
                        table: 'provinces',
                        record: 'province_id'
                    }
                },
                "columnDefs": [
                    {
                        "targets": [0,1,2,3,4],
                        "orderable": false
                    },
                    {
                        "targets": [1,2,3,4],
                        "className": 'dt-body-center'
                    },
                    {"title": "Provinsi", "targets": 0},
                    {"title": "Suspek", "targets": 1},
                    {"title": "Probable", "targets": 2},
                    {"title": "Konfirmasi", "targets": 3},
                    {"title": "Kontak Erat", "targets": 4}
                ]
            });
        } else {
            tables( 'Kota / Kabupaten', 'regencies', 'regency_id', 'province_id', id );
        }
    });

    // GANTI KOTA / KABUPATEN
    $('#regencies').on('change', function() {
        id = $('#regencies').val();
        if ( id == 'pilih-kokab' ) {
            tables( 'Kota / Kabupaten', 'regencies', 'regency_id', 'province_id', $('#provinces').val() );
        } else {
            tables( 'Kecamatan', 'districts', 'district_id', 'regency_id', id );
        }
    });

    // GANTI KECAMATAN
    $('#districts').on('change', function() {
        id = $('#districts').val();
        if ( id == 'pilih-kecamatan' ) {
            tables( 'Kecamatan', 'districts', 'district_id', 'regency_id', $('#regencies').val() );
        } else {
            tables( 'Desa', 'villages', 'village_id', 'district_id', id );
        }
    });

    // GANTI DESA
    $('#villages').on('change', function() {
        var id = $('#villages').val();

        // tables( 'Desa', 'villages', 'village_id', 'village_id', id );
    });
});