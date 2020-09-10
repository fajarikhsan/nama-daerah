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

   // GET MARKERS BY VILLAGE ID
   public function getAllMarkersByVillage( $id ) {
      $query = "SELECT *
      FROM people
      WHERE village_id = '$id'";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   // GET HEATMAP DATA
   public function getAllHeatmap() {
      $query = "SELECT regencies.`lat`, regencies.`lng`, COUNT(people.`id`) AS 'people_in_city'
      FROM people INNER JOIN regencies ON people.`regency_id` = regencies.`id`
      GROUP BY regency_id
      having people_in_city > 0";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   public function getPeopleById ( $id, $record, $condition ) {
      $query = "SELECT $condition, $record, case_status, COUNT(case_status) total
      FROM people
      GROUP BY $record, case_status
      HAVING $condition = '$id'";

      // if ( isset($_POST['search']['value']) ) {
      //    $query .= " AND case_status like \"" . $_POST["search"]["value"] . "%\"";
      // }

      if ( isset($_POST['order']) ) {
         $query .= " ORDER BY " . $record . " " . $_POST['order']['0']['dir'];
      } else {
         $query .= " ORDER BY $record DESC";
      }

      if ( $_POST['length'] != -1 ) {
         $start = (int) $_POST["start"];
         $length = (int) $_POST["length"];
         if ( $start > 0 ) {
            $query .= " LIMIT " . ($length + 30) . " OFFSET " . ($start * 4);
         } else {
            $query .= " LIMIT " . ($length + 30) . " OFFSET " . $_POST["start"];
         }
      }

      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   public function getPeopleFilteredData ( $id, $record, $condition ) {
      $query = "SELECT $condition, $record, case_status, COUNT(case_status) total
      FROM people
      GROUP BY $record, case_status
      HAVING $condition = '$id'";

      // if ( isset($_POST['search']['value']) ) {
      //    $query .= " AND case_status like \"" . $_POST["search"]["value"] . "%\"";
      // }

      if ( isset($_POST['order']) ) {
         $query .= " ORDER BY " . $record . " " . $_POST['order']['0']['dir'];
      } else {
         $query .= " ORDER BY $record DESC";
      }

      $this->db->query($query);
      $this->db->execute();
      return $this->db->rowCount() / 4;
   }

   public function getPeopleCountAllData ( $id, $record, $condition ) {
      $query = "SELECT $condition, $record, case_status, COUNT(case_status) total
      FROM people
      GROUP BY $record, case_status
      HAVING $condition = '$id'";

      $this->db->query($query);
      $this->db->execute();
      return $this->db->rowCount() / 4;
   }

   public function getTablesName($table) {
      $query = "SELECT $table.`name`, id
               FROM $table";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   public function getAllPeople ( $record ) {
      $query = "SELECT $record, case_status, COUNT(case_status) total
      FROM people
      GROUP BY $record, case_status";

      // if ( isset($_POST['search']['value']) ) {
      //    $query .= " HAVING case_status like \"" . $_POST["search"]["value"] . "%\"";
      // }

      if ( isset($_POST['order']) ) {
         $query .= " ORDER BY " . $record . " " . $_POST['order']['0']['dir'];
      } else {
         $query .= " ORDER BY $record DESC";
      }

      if ( $_POST['length'] != -1 ) {
         $start = (int) $_POST["start"];
         $length = (int) $_POST["length"];
         if ( $start > 0 ) {
            $query .= " LIMIT " . ($length + 30) . " OFFSET " . ($start * 4);
         } else {
            $query .= " LIMIT " . ($length + 30) . " OFFSET " . $_POST["start"];
         }
      }

      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   public function getAllPeopleFilteredData ( $record ) {
      $query = "SELECT $record, case_status, COUNT(case_status) total
      FROM people
      GROUP BY $record, case_status";

      // if ( isset($_POST['search']['value']) ) {
      //    $query .= " HAVING case_status like \"" . $_POST["search"]["value"] . "%\"";
      // }

      if ( isset($_POST['order']) ) {
         $query .= " ORDER BY " . $record . " " . $_POST['order']['0']['dir'];
      } else {
         $query .= " ORDER BY $record DESC";
      }

      $this->db->query($query);
      $this->db->execute();
      return $this->db->rowCount() / 4;
   }

   public function getAllPeopleCountAllData ( $record ) {
      $query = "SELECT COUNT(province_id)
      FROM people
      GROUP BY province_id";

      $this->db->query($query);
      $this->db->execute();
      return $this->db->rowCount();
   }

   // GET DATE NOW
   public function getDate() {
      return date('Y-m-d');
   }

   // GET ALL GRAPH DATA
   public function getAllGraphData( $start = null, $end = null ) {
      if ( ($start == null && $end == null) || ($start == "" && $end == "") ) {
         $end = $this->getDate();
         $start = date('Y-m-d', strtotime($end . ' - 10 day'));
      }
      $query = "SELECT CAST(created_at AS DATE) AS date_created, case_status, COUNT(case_status) total
      FROM people
      GROUP BY date_created, case_status
      HAVING date_created BETWEEN '$start' AND '$end'";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   // GET GRAPH DATA BY ID
   public function getGraphDataById( $id, $record, $start = null, $end = null ) {
      if ( ($start == null && $end == null) || ($start == "" && $end == "") ) {
         $end = $this->getDate();
         $start = date('Y-m-d', strtotime($end . ' - 10 day'));
      }
      $query = "SELECT CAST(created_at AS DATE) AS date_created, case_status, COUNT(case_status) total,
      $record
      FROM people
      GROUP BY date_created, case_status, $record
      HAVING date_created BETWEEN '$start' AND '$end' AND $record = '$id'";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   public function getAllDataVillages() {
      $query = "SELECT *
      FROM villages";
      $this->db->query($query);
      $this->db->execute();
      return $this->db->resultSet();
   }

   // INSERT RANDOM COORDINATE
   public function insertRandomCoordinate() {
      $status = [
         'SUSPEK',
         'PROBABLE',
         'KONFIRMASI',
         'KONTAK_ERAT'
      ];

      $location = $this->getAllDataVillages();

      $data = [];

      for ($i = 1; $i <= 1000000; $i++) {

         $cur_location = $location[rand(0, count($location)-1)];
            
         // ID
         $province = substr($cur_location['id'], 0, 2);
         $regency = substr($cur_location['id'], 0, 4);
         $district = substr($cur_location['id'], 0, 7);
         $village = substr($cur_location['id'], 0, 10);

         // DATETIME
         $start = strtotime('2020-05-01');
         $end = strtotime('2020-08-31');
         $randDate = rand($start, $end);
         $datetime = date('Y-m-d H:i:s', $randDate);
         
      
         $person_status = $status[rand(0,3)];
         $case_order = sprintf('%05d', rand(1, 65535));
         $case_number = $person_status.'-'.$regency.'-'.$case_order;
         $coordinate = $this->generate_random_point([$cur_location['lat'], $cur_location['lng']], 2);

         // SINGLE QUERY
         // $query = "INSERT INTO people (case_status, case_number, case_order, province_id, regency_id, district_id, village_id, lat, lng, created_at) VALUES (:case_status, :case_number, :case_order, :province_id, :regency_id, :district_id, :village_id, :lat, :lng, :created_at)";
         // $this->db->query($query);
         // $this->db->bind('case_status', $person_status);
         // $this->db->bind('case_number', $case_number);
         // $this->db->bind('case_order', $case_order);
         // $this->db->bind('province_id', $province);
         // $this->db->bind('regency_id', $regency);
         // $this->db->bind('district_id', $district);
         // $this->db->bind('village_id', $village);
         // $this->db->bind('lat', $coordinate['0']);
         // $this->db->bind('lng', $coordinate['1']);
         // $this->db->bind('created_at', $datetime);
         // $this->db->execute();
         
         
         // BATCH QUERY
         $data[$i] = [
            'case_status' => $person_status,
            'case_number' => $case_number,
            'case_order' => $case_order,
            'province_id' => $province,
            'regency_id' => $regency,
            'district_id' => $district,
            'village_id' => $village,
            'lat' => $coordinate['0'],
            'lng' => $coordinate['1'],
            'created_at' => $datetime
         ];

         if ( $i % 1000 == 0 ) {
            $query = "INSERT INTO people (case_status, case_number, case_order, province_id, regency_id, district_id, village_id, lat, lng, created_at) VALUES ";
            //Insert Database
            for ( $a = $i - 999; $a <= $i; $a++ ) {
               $input = $data[$a];
               if ( $a != $i ) {
                  $query .= "('{$input['case_status']}', '{$input['case_number']}', {$input['case_order']}, {$input['province_id']}, {$input['regency_id']}, {$input['district_id']}, {$input['village_id']}, {$input['lat']}, {$input['lng']}, '{$input['created_at']}'),";
               } else {
                  $query .= "('{$input['case_status']}', '{$input['case_number']}', {$input['case_order']}, {$input['province_id']}, {$input['regency_id']}, {$input['district_id']}, {$input['village_id']}, {$input['lat']}, {$input['lng']}, '{$input['created_at']}')";
               }
            }
            $this->db->query($query);
            $this->db->execute();
            // reset array
            $data = [];
         }
      }
   }

   // random point
   /**
    * Given a $centre (latitude, longitude) co-ordinates and a
    * distance $radius (miles), returns a random point (latitude,longtitude)
    * which is within $radius miles of $centre.
    *
    * @param  array $centre Numeric array of floats. First element is 
    *                       latitude, second is longitude.
    * @param  float $radius The radius (in miles).
    * @return array         Numeric array of floats (lat/lng). First 
    *                       element is latitude, second is longitude.
    */
   function generate_random_point( $centre, $radius ){
      $radius_earth = 3959; //miles
      //Pick random distance within $distance;
      $distance = lcg_value()*$radius;
      //Convert degrees to radians.
      $centre_rads = array_map( 'deg2rad', $centre );
      //First suppose our point is the north pole.
      //Find a random point $distance miles away
      $lat_rads = (pi()/2) -  $distance/$radius_earth;
      $lng_rads = lcg_value()*2*pi();
      //($lat_rads,$lng_rads) is a point on the circle which is
      //$distance miles from the north pole. Convert to Cartesian
      $x1 = cos( $lat_rads ) * sin( $lng_rads );
      $y1 = cos( $lat_rads ) * cos( $lng_rads );
      $z1 = sin( $lat_rads );
      //Rotate that sphere so that the north pole is now at $centre.
      //Rotate in x axis by $rot = (pi()/2) - $centre_rads[0];
      $rot = (pi()/2) - $centre_rads[0];
      $x2 = $x1;
      $y2 = $y1 * cos( $rot ) + $z1 * sin( $rot );
      $z2 = -$y1 * sin( $rot ) + $z1 * cos( $rot );
      //Rotate in z axis by $rot = $centre_rads[1]
      $rot = $centre_rads[1];
      $x3 = $x2 * cos( $rot ) + $y2 * sin( $rot );
      $y3 = -$x2 * sin( $rot ) + $y2 * cos( $rot );
      $z3 = $z2;
      //Finally convert this point to polar co-ords
      $lng_rads = atan2( $x3, $y3 );
      $lat_rads = asin( $z3 );
      return array_map( 'rad2deg', array( $lat_rads, $lng_rads ) );
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