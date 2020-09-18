<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map</title>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />

   <!-- Datatables CSS -->
   <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">

    <!-- daterangepicker CSS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />

    <!-- DevExtreme themes -->
    <link rel="stylesheet" href="https://cdn3.devexpress.com/jslib/20.1.7/css/dx.common.css">
    <link rel="stylesheet" href="https://cdn3.devexpress.com/jslib/20.1.7/css/dx.light.css">

   <link rel="stylesheet" href="<?php echo BASEURL; ?>/css/style.css">

</head>
<body>
    <div class="container">
        <select id="provinces" name="provinces">
            <option value="0">Semua</option>
            <?php foreach ( $data['provinces'] as $p ) : ?>
            <option value="<?php echo $p['id'] ?>"><?php echo $p['name'] ?></option>
            <?php endforeach; ?>
        </select>
    
        <select id="regencies" name="regencies" disabled>
            <option value="0">Pilih Kota/Kabupaten ...</option>
        </select>
    
        <select id="districts" name="districts" disabled>
            <option value="0">Pilih Kecamatan ...</option>
        </select>
    
        <select id="villages" name="villages" disabled>
            <option value="0">Pilih Desa ...</option>
        </select>
        <div id="mapid"></div>
    
        <div>
            <table>
                <tr>
                    <td>Periode</td>
                    <td><input type="text" name="dates" id="inputCalendar" autocomplete="off" value="<?php echo date('d/m/Y', strtotime(date('Y-m-d') . ' - 10 day')) . " - " . date('d/m/Y'); ?>" readonly></td>
                    <td><img src="img/calendar.png" id="calendar"></td>
                </tr>
            </table>
        </div>
    
        
        <div id="modal"></div>
        <div id="null"> <span> Data Kosong </span> </div>
        <div id="chartContainer" style="height: 370px; width: 100%;">
        </div>
        
        <div class="table">
            <table id="information" class="display" style="width:100%">
                    
            </table>
        </div>
    
    </div>



    <script type="text/javascript">
        window.base_url = '<?php echo BASEURL; ?>';
    </script>         

    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
   <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   crossorigin=""></script>
   <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
   <!-- CANVAS JS -->
   <script src="https://canvasjs.com/assets/script/jquery.canvasjs.min.js"></script>
   <!-- DevExtreme library -->
   <script type="text/javascript" src="https://cdn3.devexpress.com/jslib/20.1.7/js/dx.all.js"></script>
   <!-- Datatables JS -->
   <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js"></script>
   <!-- rangepicker JS -->
   <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
   <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>

   <script src="<?php echo BASEURL; ?>/js/heatmap.js"></script>
   <script src="<?php echo BASEURL; ?>/js/leaflet-heatmap.js"></script>
   <script src="<?php echo BASEURL; ?>/js/script.js"></script>
   <script src="<?php echo BASEURL; ?>/js/testgraph.js"></script>
   <script src="<?php echo BASEURL; ?>/js/datatables.js"></script>
</body>
</html>