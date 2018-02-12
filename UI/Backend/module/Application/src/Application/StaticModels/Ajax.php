<?php
/**
 * Created by PhpStorm.
 * User: paula
 * Date: 4/22/2016
 * Time: 7:09 PM
 */
namespace Application;

use Zend\Http\Client;

class Ajax{
    public static function getChat($path,$header,$data){
        return self::get("http://team3oars.local/".$path,$header,$data);
    }
    public static function postChat($path,$header,$data){
        return self::post("http://team3oars.local/".$path,$header,$data);
    }
    public static function post($url, $header, $data){
        $client = new Client($url, array(
            'maxredirects' => 0,
            'timeout'      => 30
        ));

        $client->setMethod("DELETE");
        $client->setHeaders($header);
        $client->setRawBody(json_encode($data));
        $response = $client->send();
        if($response->isSuccess()){
            return $response->getContent();
        }
        return $response;
    }
    public static function get($url,$header,$data){
        $client = new Client($url, array(
            'maxredirects' => 0,
            'timeout'      => 30
        ));
        $client->setHeaders($header);
        $client->setRawBody(json_encode($data));
        $response = $client->send();
        if($response->isSuccess()){
            return $response->getContent();
        }
        return $response;
    }
}
