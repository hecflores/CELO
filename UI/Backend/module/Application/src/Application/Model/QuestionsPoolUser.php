<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 5/11/2017
 * Time: 8:00 PM
 */

namespace Application\Model;


class QuestionsPoolUser
{
    public static function getColumns(){
        return array(
            "QuestionsPoolID"=>true,
            "UserID"=>true,
            "AddedOn"=>true,
            "Privilege"=>true,
        );
    }
    public static function Privilege_StrToObj($Privilege){
        $privileges=explode('|',$Privilege);
        $privileges=array_fill_keys($privileges,true);
        $privileges=array_intersect_key($privileges,self::getPrivileges());
        return $privileges;

    }
    public static function Privilege_ObjToStr($Privilege){
        $Privilege=array_intersect_key(self::getPrivileges(),$Privilege);
        $privileges=implode('|',array_keys($Privilege));
        return $privileges;
    }
    public static function getPrivileges(){
        return array(
            "owner"=>true,
            "admin"=>true,
            "worker"=>true,
            "guest"=>true,
        );
    }
}