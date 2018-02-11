<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/31/2017
 * Time: 2:38 AM
 */

namespace Application\Service\Meat;


class MeatEater
{
    /**
     * Helps when a parameter is used for different reasons in an object
     * @param $object
     * @param $key
     * @return null
     */
    public static function GetAndRemoveField(&$object,$key){


        if(!isset($object[$key])){
            return null;
        }
        $value=$object[$key];
        unset($object[$key]);

        return $value;

    }

    /**
     * @param array $parameters
     * @param array $expected
     * @param array $output
     * @return bool
     */
    public static function CheckParameters(&$parameters, $expected, &$output, $noMoreThenThese=null, $default=array()){
        self::InitializeOutput($output);
        foreach($expected as $expectName){
            if(!isset($parameters[$expectName])){
                $e = new \Exception;

                $output["errors"][]=array(
                    "errorMessage"=>"$expectName Was not found(Was expected)",
                    "stack"=>preg_split('/\n/', $e->getTraceAsString())
                );
            }
        }
        if($noMoreThenThese!=null){
            foreach($parameters as $expectName=>$expectedValue){
                if(!isset($noMoreThenThese[$expectName])){
                    $e = new \Exception;
                    $output["errors"][]=array(
                        "errorMessage"=>"$expectName Was found(Was not expected)",
                        "stack"=>preg_split('/\n/', $e->getTraceAsString())
                    );
                }
            }
        }
        foreach($default as $key => $value){
            if(!isset($parameters[$key])){
                $parameters[$key]=$value;
            }
        }

        return count($output["errors"])==0;
    }

    public static function InitializeOutput(&$output){
        $output["errors"]=isset($output["errors"])?$output["errors"]:array();
    }
}