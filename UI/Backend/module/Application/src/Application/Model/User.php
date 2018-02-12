<?php
namespace Application\Model;
use Application\Roles;

/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 10:03 AM
 */
class User
{
    public $UserID;
    public $FirstName;
    public $LastName;
    public $Email;
    public $PhoneNumber;
    public $UserName;
    public $Password;
    public $UHID;
    public $Role;
    public $data;
    public function exchangeArray($data)
    {
        $this->UserID = (!empty($data["UserID"])) ? $data["UserID"] : null;
        $this->FirstName = (!empty($data["FirstName"])) ? $data["FirstName"] : null;
        $this->LastName = (!empty($data["LastName"])) ? $data["LastName"] : null;
        $this->Email = (!empty($data["Email"])) ? $data["Email"] : null;
        $this->PhoneNumber = (!empty($data["PhoneNumber"])) ? $data["PhoneNumber"] : null;
        $this->UserName = (!empty($data["UserName"])) ? $data["UserName"] : null;
        $this->Password = (!empty($data["Password"])) ? $data["Password"] : null;
        $this->Role = (!empty($data["Role"])) ? $data["Role"] : null;
        $this->UHID = (!empty($data["UHID"])) ? $data["UHID"] : null;
        $this->data=$data;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getUHID()
    {
        return $this->UHID;
    }

    public function isLoggedOn()
    {
        return $this->Role!=Roles::$GUEST;
    }

    /**
     * @return User
     */
    public static function Guest()
    {
        $user=new User();
        $user->setRole(Roles::$GUEST);
        $user->setFirstName("Guest");
        return $user;
    }
    /**
     * @param mixed $UserID
     */
    public function setUserID($UserID)
    {
        $this->UserID = $UserID;
    }

    /**
     * @param mixed $FirstName
     */
    public function setFirstName($FirstName)
    {
        $this->FirstName = $FirstName;
    }

    /**
     * @param mixed $LastName
     */
    public function setLastName($LastName)
    {
        $this->LastName = $LastName;
    }

    /**
     * @param mixed $Email
     */
    public function setEmail($Email)
    {
        $this->Email = $Email;
    }

    /**
     * @param mixed $PhoneNumber
     */
    public function setPhoneNumber($PhoneNumber)
    {
        $this->PhoneNumber = $PhoneNumber;
    }

    /**
     * @param mixed $UserName
     */
    public function setUserName($UserName)
    {
        $this->UserName = $UserName;
    }

    /**
     * @param mixed $Password
     */
    public function setPassword($Password)
    {
        $this->Password = $Password;
    }

    /**
     * @param mixed $Role
     */
    public function setRole($Role)
    {
        $this->Role = $Role;
    }

    /**
     * @return mixed
     */
    public function getRole()
    {
        return $this->Role;
    }

    /**
     * @return mixed
     */
    public function getUserID()
    {
        return $this->UserID;
    }

    /**
     * @return mixed
     */
    public function getFirstName()
    {
        return $this->FirstName;
    }

    /**
     * @return mixed
     */
    public function getLastName()
    {
        return $this->LastName;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->Email;
    }

    /**
     * @return mixed
     */
    public function getPhoneNumber()
    {
        return $this->PhoneNumber;
    }

    /**
     * @return mixed
     */
    public function getUserName()
    {
        return $this->UserName;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->Password;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["UserID"]=(isset($this->data["UserID"]))?$this->data["UserID"]:null;
        $array["FirstName"]=(isset($this->data["FirstName"]))?$this->data["FirstName"]:null;
        $array["LastName"]=(isset($this->data["LastName"]))?$this->data["LastName"]:null;
        $array["Email"]=(isset($this->data["Email"]))?$this->data["Email"]:null;
        $array["PhoneNumber"]=(isset($this->data["PhoneNumber"]))?$this->data["PhoneNumber"]:null;
        $array["UserName"]=(isset($this->data["UserName"]))?$this->data["UserName"]:null;
        $array["Password"]=(isset($this->data["Password"]))?$this->data["Password"]:null;
        $array["Role"]=(isset($this->data["Role"]))?$this->data["Role"]:null;
        $array["UHID"]=(isset($this->data["UHID"]))?$this->data["UHID"]:null;
        return $array;
    }
    public static function getColumns()
    {
        return array(
            "UserID"=>true,
            "FirstName"=>true,
            "LastName"=>true,
            "Email"=>true,
            "PhoneNumber"=>true,
            "UserName"=>true,
            "Password"=>true,
            "Role"=>true,
            "UHID"=>true
        );
    }

}