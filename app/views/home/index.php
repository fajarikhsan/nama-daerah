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

   <link rel="stylesheet" href="<?php echo BASEURL; ?>/css/style.css">

</head>
<body>

<select id="provinces" name="provinces">
    <option value="pilih-provinsi">Pilih Provinsi ...</option>
    <?php foreach ( $data['provinces'] as $p ) : ?>
    <option value="<?php echo $p['id'] ?>"><?php echo $p['name'] ?></option>
    <?php endforeach; ?>
</select>

<select id="regencies" name="regencies" disabled>
    <option value="pilih-kokab">Pilih Kota/Kabupaten ...</option>
</select>

<select id="districts" name="districts" disabled>
    <option value="pilih-kecamatan">Pilih Kecamatan ...</option>
</select>

<select id="villages" name="villages" disabled>
    <option value="pilih-desa">Pilih Desa ...</option>
</select>

    <div id="mapid"></div>


    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
   <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   crossorigin=""></script>  
   <script src="<?php echo BASEURL; ?>/js/script.js"></script>
</body>
</html>