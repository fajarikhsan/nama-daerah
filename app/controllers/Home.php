<?php 

Class Home extends Controller {
    public function index() {
        $data['provinces'] = $this->model('Home_model')->getAllTableData('provinces');
        $data['regencies'] = $this->model('Home_model')->getAllTableData('regencies');
        $data['districts'] = $this->model('Home_model')->getAllTableData('districts');
        $data['villages'] = $this->model('Home_model')->getAllTableData('villages');
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

    public function generateFaker() {
        $this->model('Home_model')->generateMarkers();
    }

    public function getAllMarkers() {
        echo json_encode($this->model('Home_model')->getAllMarkers());
    }

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