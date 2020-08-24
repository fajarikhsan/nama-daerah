<?php 

Class Home_model {
    private $db;

    public function __construct()
    {
        $this->db = new Database;
    }

    public function getAllTableData($table) {
         $query = "SELECT * FROM $table";
         $this->db->query($query);
         $this->db->execute();
         return $this->db->resultSet();
    }

    public function getAllProvince($id) {
      $query = "SELECT *
      FROM provinces
      WHERE id = '$id'";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->single();
    }

    public function getAllRegency($id) {
         $query = "SELECT *
         FROM regencies
         WHERE province_id = '$id'";
         $this->db->query($query);
         $this->db->execute();
         return $this->db->resultSet();
    }

    public function getRegencyById($id) {
       $query = "SELECT *
       FROM regencies
       WHERE id = '$id'";
       $this->db->query($query);
       $this->db->execute();
       return $this->db->single();
    }

    public function getAllDistrict($id) {
       $query = "SELECT *
       FROM districts
       WHERE regency_id = '$id'";
       $this->db->query($query);
       $this->db->execute();
       return $this->db->resultSet();
    }

    public function getDistrictById($id) {
       $query = "SELECT *
       FROM districts
       WHERE id = '$id'";
       $this->db->query($query);
       $this->db->execute();
       return $this->db->single();
    }

    public function getAllVillage($id) {
      $query = "SELECT *
      FROM villages
      WHERE district_id = '$id'";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   public function getVillageById($id) {
      $query = "SELECT *
      FROM villages
      WHERE id = '$id'";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->single();
   }

   //  FAKER
    public function generateMarkers() {
        $faker = Faker\Factory::create();

        $query = "INSERT INTO indo (latitude, longitude) VALUES (:latitude, :longitude)";

        for ( $i = 0; $i <= 100; $i++ ) {
            $this->db->query($query);
            $this->db->bind('latitude', $faker->latitude($min = -10.1718, $max = 5.88969));
            $this->db->bind('longitude', $faker->longitude($min = 95.31644, $max = 140.71813));
            $this->db->execute();
        }
    }

    public function getAllMarkers() {
        $query = "SELECT * FROM indo";
        $this->db->query($query);
        $this->db->execute();
        return $this->db->resultSet();
    }

   //  INPUT COORDINATE IN EACH TABLES
    public function callAPI($method, $url, $data){
        $curl = curl_init();
        switch ($method){
           case "POST":
              curl_setopt($curl, CURLOPT_POST, 1);
              if ($data)
                 curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
              break;
           case "PUT":
              curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
              if ($data)
                 curl_setopt($curl, CURLOPT_POSTFIELDS, $data);			 					
              break;
           default:
              if ($data)
                 $url = sprintf("%s?%s", $url, http_build_query($data));
        }
        // OPTIONS:
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
           'APIKEY: 111111111111111111111',
           'Content-Type: application/json',
        ));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        // EXECUTE:
        $result = curl_exec($curl);
        if(!$result){die("Connection Failure");}
        curl_close($curl);
        return $result;
     }

     public function getAllNames($table, $offset) {
         $query = "SELECT *
         FROM regencies
         WHERE latitude < -11 OR latitude > 5.89
         LIMIT 600 OFFSET :offset";
         $this->db->query($query);
         $this->db->bind('offset', $offset);
         $this->db->execute();
         return $this->db->resultSet();
     }

     public function addLatLong($table) {
         $data = $this->getAllNames('villages, districts', 0);
         
         foreach ( $data as $d ) {
            $shell = $d['name'] . ' indonesia';
            $name = rawurlencode($shell);
            $get_data = $this->callApi('GET', 'https://api.mapbox.com/geocoding/v5/mapbox.places/' . $name . '.json?access_token=pk.eyJ1IjoicmFqYWZpa2hzYW4iLCJhIjoiY2tkbnh0cjZlMDJ4djJ5bzJuazM5YWs0MSJ9.s6_zk3KF7oTtuga9eXtLDQ', false);
            $response = json_decode($get_data, true);
            $long = $response["features"]["0"]["center"]["0"];
            $lat = $response["features"]["0"]["center"]["1"];
            $query = "UPDATE " . $table . " SET latitude = :latitude, longitude = :longitude WHERE id = :id";
            $this->db->query($query);
            $this->db->bind('latitude', $lat);
            $this->db->bind('longitude', $long);
            $this->db->bind('id', $d['id']);
            $this->db->execute();
         }
     }
}