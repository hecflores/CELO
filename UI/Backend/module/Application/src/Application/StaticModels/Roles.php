<?php

namespace Application;

use Zend\Math\Rand;

class Roles {

    public static $GlobalRole=null;
    public static $Override=null;
    /***********************************************************************/
    public static $ADMIN="Administrator";
    public static $INSTRUCTOR="Instructor";
    public static $STUDENT="Student";
    public static $TA="TA";
    public static $GUEST="Guest";
    public static $STAFF=array("Administrator","Instructor","TA");
    /***********************************************************************/

    public static function SetRole($role) {
        if(self::$GlobalRole!=null){
            return;
        }
        self::$GlobalRole=$role;

    }
    public static function ResetRole($role) {
        self::$GlobalRole=$role;

    }
    public static function All(){
        return array("Administrator","TA","Student","Instructor");
    }
    public static function GetRole() {
        return self::$GlobalRole;
    }

    public static function GetRoleUrl($url=null){
        $prefix=strtolower(self::GetRole());
        if(self::GetRole()==Roles::$GUEST){
            $prefix='/';
        }
        if($url==null){
            return '/'.strtolower(self::GetRole());
        }
        return '/'.strtolower(self::GetRole())."/$url";
    }

    public static function Override($role)
    {
        self::$Override=$role;
    }
    public static function RemoveOverride()
    {
        self::$Override=null;
    }
    public static function IsOverride($roles)
    {
        if(self::$Override==null){
            return false;
        }

        if(is_array($roles)){
            foreach($roles as $role){
                if($role==self::$Override){
                    return true;
                }
            }
        }
        else if($roles==self::$Override){
            return true;
        }
    }


}