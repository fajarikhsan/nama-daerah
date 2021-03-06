<?php 

Class Home extends Controller {
    public function index() {
        $data['provinces'] = $this->model('Home_model')->getAllTableData('provinces');
        $this->view('home/index', $data);
    }

    public function getProvince() {
        $id = $_POST['id'];
        echo json_encode($this->model('Home_model')->getAllProvince($id));
    }

    public function getRegency() {
        $id = $_POST['id'];
        echo json_encode($this->model('Home_model')->getAllRegency($id));
    }

    public function getRegencyCoordinate() {
        $id = $_POST['id'];
        echo json_encode($this->model('Home_model')->getRegencyById($id));
    }

    public function getDistrict() {
        $id = $_POST['id'];
        echo json_encode($this->model('Home_model')->getAllDistrict($id));
    }

    public function getDistrictCoordinate() {
        $id = $_POST['id'];
        echo json_encode($this->model('Home_model')->getDistrictById($id));
    }

    public function getVillage() {
        $id = $_POST['id'];
        echo json_encode($this->model('Home_model')->getAllVillage($id));
    }

    public function getVillageCoordinate() {
        $id = $_POST['id'];
        echo json_encode($this->model('Home_model')->getVillageById($id));
    }

    // GET HEATMAP DATA
    public function getHeatmapData() {
        // $id = $_POST['id'];
        // echo json_encode($this->model('Home_model')->getAllHeatmap( $id ));
        // var_dump($this->model('Home_model')->getAllHeatmap());
        $fp = fopen('heatmap-coordinate.json', 'w');
        fwrite($fp, json_encode($this->model('Home_model')->getAllHeatmap()));
        fclose($fp);
    }

    public function getAllDatatablesData() {
        $record = $_POST['record'];
        $table = $_POST['table'];
        $fetch_data = $this->model("Home_model")->getAllPeople( $record );
        // Province Name Array
        $province_data = $this->model('Home_model')->getTablesName($table);
        foreach ( $province_data as $p ) {
            $province[] = [
                'id' => $p['id'],
                'name' => $p['name']
            ];
        }
        $names = array_column($province, 'name', 'id');

        foreach ( $fetch_data as $row ) {
            $province_name = $names[$row[$record]];
            $all[$province_name][$row['case_status']] = $row['total'];
        }

        $data = [];

        foreach ( $all as $header => $row ) {
            $sub_array = [];
            $sub_array[] = $header;
            $sub_array[] = $row['SUSPEK'];
            $sub_array[] = $row['PROBABLE'];
            $sub_array[] = $row['KONFIRMASI'];
            $sub_array[] = $row['KONTAK_ERAT'];
            $data[] = $sub_array;
        }

        $output = [
            "draw" => intval($_POST["draw"]),
            "recordsTotal" => $this->model("Home_model")->getAllPeopleCountAllData( $record ),
            "recordsFiltered" => $this->model("Home_model")->getAllPeopleFilteredData( $record ),
            "data" => $data
        ];

        echo json_encode($output);
    }

    public function getDatatablesData() {
        $record = $_POST['record'];
        $id = $_POST['id'];
        $table = $_POST['table'];
        $condition = $_POST['condition'];
        $fetch_data = $this->model("Home_model")->getPeopleById ( $id, $record, $condition );
        // Province Name Array
        $each_data = $this->model('Home_model')->getTablesName($table);
        foreach ( $each_data as $p ) {
            $each[] = [
                'id' => $p['id'],
                'name' => $p['name']
            ];
        }
        $names = array_column($each, 'name', 'id');

        foreach ( $fetch_data as $row ) {
            $province_name = $names[$row[$record]];
            $all[$province_name][$row['case_status']] = $row['total'];
        }

        $data = [];

        foreach ( $all as $header => $row ) {
            ( isset($row['SUSPEK']) ) ? : $row['SUSPEK'] = '0';
            ( isset($row['PROBABLE']) ) ? : $row['PROBABLE'] = '0';
            ( isset($row['KONFIRMASI']) ) ? : $row['KONFIRMASI'] = '0';
            ( isset($row['KONTAK_ERAT']) ) ? : $row['KONTAK_ERAT'] = '0';
            $sub_array = [];
            $sub_array[] = $header;
            $sub_array[] = $row['SUSPEK'];
            $sub_array[] = $row['PROBABLE'];
            $sub_array[] = $row['KONFIRMASI'];
            $sub_array[] = $row['KONTAK_ERAT'];
            $data[] = $sub_array;
        }

        $output = [
            "draw" => intval($_POST["draw"]),
            "recordsTotal" => $this->model("Home_model")->getPeopleCountAllData ( $id, $record, $condition ),
            "recordsFiltered" => $this->model("Home_model")->getPeopleFilteredData ( $id, $record, $condition ),
            "data" => $data
        ];

        echo json_encode($output);
    }

    // get villages aggregate
    public function getVillagesAgg() {
        $fetch_data = $this->model('Home_model')->getAllVIllagesAgg();
        foreach ( $fetch_data as $row ) {
            $data[$row['village_id']][$row['case_status']] = $row['total'];
        }
        $fp = fopen('villages_agg.json', 'w');
        fwrite($fp, json_encode($data));
        fclose($fp);
    }

    // GET GRAPH DATA
    public function getGraphData() {
        $data = [];

        if ( $_POST['start'] != null && $_POST['end'] != null ) {
            $start = $_POST['start'];
            $end = $_POST['end'];
        } else {
            $start = null;
            $end = null;
        }

        if ( isset($_POST['id']) && isset($_POST['record']) ) {
            if ( ($_POST['id'] != null) && ($_POST['record'] != null) ) {
                $id = $_POST['id'];
                $record = $_POST['record'];
                $fetch_data = $this->model("Home_model")->getGraphDataById( $id, $record, $start, $end );
            } else {
                $fetch_data = $this->model("Home_model")->getAllGraphData( $start, $end );
            }
        }

        foreach ( $fetch_data as $row ) {
            ( isset($row['case_status']) ) ? : $row['case_status'] = '0';
            $data[$row['date_created']][$row['case_status']] = $row['total'];
        }

        $all = [];

        foreach ( $data as $key => $row ) {
            ( isset($row['SUSPEK']) ) ? : $row['SUSPEK'] = '0';
            ( isset($row['PROBABLE']) ) ? : $row['PROBABLE'] = '0';
            ( isset($row['KONFIRMASI']) ) ? : $row['KONFIRMASI'] = '0';
            ( isset($row['KONTAK_ERAT']) ) ? : $row['KONTAK_ERAT'] = '0';
            $created_at = date("d M", strtotime($key));
            $sub_array = [
                'created_at' => $created_at,
                'SUSPEK' => $row['SUSPEK'],
                'PROBABLE' => $row['PROBABLE'],
                'KONFIRMASI' => $row['KONFIRMASI'],
                'KONTAK_ERAT' => $row['KONTAK_ERAT']
            ];
            $all[] = $sub_array;
        }

        echo json_encode($all);
    }

    // GET MARKERS BY VILLAGE ID
    public function getAllMarkers() {
        $id = $_POST['id'];
        $record = $_POST['record'];
        echo json_encode($this->model('Home_model')->getAllMarkersById( $id, $record ));
    }

    // INPUT TABLE PEOPLE
    public function firstTry() {
        $start = microtime(true);
        // echo $this->model('Home_model')->insertRandomCoordinate();
        $this->model('Home_model')->insertRandomCoordinate();
        // printf('%05d', rand(1, 65535));
        $time_elapsed_secs = microtime(true) - $start;
        echo 'Execution Time : ' . $time_elapsed_secs . ' seconds';
    }

    // INPUT COOR TO EACH TABLES
    public function getCoor() {
        $search = 'Jawa Barat';
        $name = rawurlencode($search);
        // $get_data = $this->model('Home_model')->callApi('GET', 'https://api.mapbox.com/geocoding/v5/mapbox.places/' . $name . '.json?access_token=pk.eyJ1IjoicmFqYWZpa2hzYW4iLCJhIjoiY2tkbnh0cjZlMDJ4djJ5bzJuazM5YWs0MSJ9.s6_zk3KF7oTtuga9eXtLDQ', false);
        // $get_data = $this->model('Home_model')->callApi('GET', 'https://nominatim.openstreetmap.org/search?q=aceh&format=json&limit=1', false);
        $json = "https://nominatim.openstreetmap.org/search?q=aceh&format=json&limit=1";
        $ch = curl_init($json);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0");
        $jsonfile = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($jsonfile, true);
        // var_dump($response);
        echo $response[0]['lon'];
    }

    public function inputCoor() {
        $this->model('Home_model')->addLatLong('villages');
        date_default_timezone_set("Asia/Bangkok");
        echo "Refresh again at : " . date("H:i:s", time() + 70);
    }
}