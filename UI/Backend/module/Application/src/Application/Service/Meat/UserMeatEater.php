<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 4/8/2017
 * Time: 10:49 PM
 */

namespace Application\Service\Meat;


use Application\Info;
use Application\Model\User;
use Application\Roles;

class UserMeatEater
{
    public static function Register($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array(
            "Role"), $output)) {
            return false;
        }

        /*******************************************************************/
        $parameters=array_intersect_key($parameters,User::getColumns());

        if(($userID=Info::UserTable()->createNewUser($parameters))==null){
            $output["errors"][]="A New User was unable to be created";
            return false;
        }

        return self::Login(array(
            "username"=>$parameters["UserName"],
            "password"=>$parameters["Password"],
            "Role"=>$parameters["Role"])
        ,$output);




    }
    public static function Login($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array("username","password","Role"), $output)) {
            return false;
        }

        /*******************************************************************/
        if(($userSession=Info::LoginService()->SignIn($parameters["username"],$parameters["password"],$parameters["Role"]))!=null){
            $output["results"]=array(
                "UserHome"=>Roles::GetRoleUrl(""));

            return true;
        }

        /*******************************************************************/
        $output["errors"][]="Unable to sign in with the specified credentials";
        return false;
    }
    public static function GetProfile($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array(), $output)) {
            return false;
        }

        /*******************************************************************/
        if(!Info::LoginService()->IsAlreadySignedIn()){
            $output["errors"][]="Not Signed In";
            return false;
        }

        /*******************************************************************/
        $userInfo=Info::getCurrentUser();
        $userInfo=$userInfo->getData();
        if(isset($userInfo["Password"])){
            unset($userInfo["Password"]);
        }

        /*******************************************************************/
        $output["results"]=$userInfo;


        /*******************************************************************/
        return true;
    }

    public static function Logout($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array(), $output)) {
            return false;
        }

        /*******************************************************************/
        if(!Info::LoginService()->IsAlreadySignedIn()){
            $output["errors"][]="Not Signed In";
            return false;
        }
        $output["results"]=array("status"=>true);
        /*******************************************************************/
        Info::LoginService()->SignOut();

        /*******************************************************************/
        return true;

    }
}