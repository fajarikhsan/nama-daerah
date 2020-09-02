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
        // echo json_encode($this->model('Home_model')->getAllHeatmap());
        // var_dump($this->model('Home_model')->getAllHeatmap());
        $fp = fopen('heatmap-coordinate.json', 'w');
        fwrite($fp, json_encode($this->model('Home_model')->getAllHeatmap()));
        fclose($fp);
    }

    public function getAllDatatablesData() {
        $fetch_data = $this->model("Home_model")->getAllPeople();
        $data = [];
        foreach ( $fetch_data as $row ) {
            $sub_array = [];
            $sub_array[] = $row['id'];
            $sub_array[] = $row['case_number'];
            $sub_array[] = $row['case_order'];
            $sub_array[] = $row['province_id'];
            $sub_array[] = $row['regency_id'];
            $sub_array[] = $row['district_id'];
            $sub_array[] = $row['village_id'];
            $sub_array[] = $row['lat'];
            $sub_array[] = $row['lng'];
            $sub_array[] = $row['created_at'];
            $data[] = $sub_array;
        }

        $output = [
            "draw" => intval($_POST["draw"]),
            "recordsTotal" => $this->model("Home_model")->getAllPeopleCountAllData()['id'],
            "recordsFiltered" => $this->model("Home_model")->getAllPeopleFilteredData()['id'],
            "data" => $data
        ];

        echo json_encode($output);
    }

    public function getDatatablesData() {
        $record = $_POST['record'];
        $id = $_POST['id'];
        $fetch_data = $this->model("Home_model")->getPeopleById($id, $record);
        $data = [];
        foreach ( $fetch_data as $row ) {
            $sub_array = [];
            $sub_array[] = $row['id'];
            $sub_array[] = $row['case_number'];
            $sub_array[] = $row['case_order'];
            $sub_array[] = $row['province_id'];
            $sub_array[] = $row['regency_id'];
            $sub_array[] = $row['district_id'];
            $sub_array[] = $row['village_id'];
            $sub_array[] = $row['lat'];
            $sub_array[] = $row['lng'];
            $sub_array[] = $row['created_at'];
            $data[] = $sub_array;
        }

        $output = [
            "draw" => intval($_POST["draw"]),
            "recordsTotal" => $this->model("Home_model")->getPeopleCountAllData( $id, $record ),
            "recordsFiltered" => $this->model("Home_model")->getPeopleFilteredData( $id, $record ),
            "data" => $data
        ];

        echo json_encode($output);
    }

    // GET GRAPH DATA
    public function getGraphData() {
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
                echo json_encode($this->model("Home_model")->getGraphDataById( $id, $record, $start, $end ));
            } else {
                echo json_encode($this->model("Home_model")->getAllGraphData( $start, $end ));
            }
        } else {
            echo json_encode($this->model("Home_model")->getAllGraphData( $start, $end ));
        }
    }

    // GET MARKERS BY VILLAGE ID
    public function getAllMarkers() {
        $village_id = $_POST['id'];
        echo json_encode($this->model('Home_model')->getAllMarkersByVillage($village_id));
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
        $search = 'Indonesia';
        $get_data = $this->model('Home_model')->callApi('GET', 'https://api.mapbox.com/geocoding/v5/mapbox.places/' . $search . '.json?access_token=pk.eyJ1IjoicmFqYWZpa2hzYW4iLCJhIjoiY2tkbnh0cjZlMDJ4djJ5bzJuazM5YWs0MSJ9.s6_zk3KF7oTtuga9eXtLDQ', false);
        $response = json_decode($get_data, true);
        echo $response["features"]["0"]["center"]["0"];
    }

    public function inputCoor() {
        $this->model('Home_model')->addLatLong('regencies');
    }
}