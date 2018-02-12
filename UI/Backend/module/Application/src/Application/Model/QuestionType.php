<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/27/2017
 * Time: 3:25 AM
 */

namespace Application\Model;


use Application\Info;

class QuestionType
{
    protected $QuestionTypeID=null;
    protected $SrcDirectory=null;
    protected $Name=null;
    protected $CreatedBy=null;
    protected $UserID=null;
    protected $FirstName=null;
    protected $LastName=null;
    protected $Email=null;
    protected $PhoneNumber=null;
    protected $UserName=null;
    protected $Password=null;
    protected $Role=null;
    protected $data;
    protected $CreatedByUser=null;
    function exchangeArray($data)
    {
        $this->QuestionTypeID=(isset($data["QuestionTypeID"]))?$data["QuestionTypeID"]:null;
        $this->SrcDirectory=(isset($data["SrcDirectory"]))?$data["SrcDirectory"]:null;
        $this->Name=(isset($data["Name"]))?$data["Name"]:null;
        $this->CreatedBy=(isset($data["CreatedBy"]))?$data["CreatedBy"]:null;
        $this->UserID=(isset($data["UserID"]))?$data["UserID"]:null;
        $this->FirstName=(isset($data["FirstName"]))?$data["FirstName"]:null;
        $this->LastName=(isset($data["LastName"]))?$data["LastName"]:null;
        $this->Email=(isset($data["Email"]))?$data["Email"]:null;
        $this->PhoneNumber=(isset($data["PhoneNumber"]))?$data["PhoneNumber"]:null;
        $this->UserName=(isset($data["UserName"]))?$data["UserName"]:null;
        $this->Password=(isset($data["Password"]))?$data["Password"]:null;
        $this->Role=(isset($data["Role"]))?$data["Role"]:null;
        $this->CreatedByUser=new User();
        $this->CreatedByUser->exchangeArray($data);

        $this->data=$data;
        return $this;
    }



    /**
     * @return User
     */
    public function getCreatedByUser(){
        return $this->CreatedByUser;
    }
    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["QuestionTypeID"]=(isset($this->data["QuestionTypeID"]))?$this->data["QuestionTypeID"]:null;
        $array["JavascriptClassName"]=$this->getJavascriptClassName();
        /* $array["SrcDirectory"]=(isset($this->data["SrcDirectory"]))?$this->data["SrcDirectory"]:null;*/
        $array["Name"]=(isset($this->data["Name"]))?$this->data["Name"]:null;
        $array["CreatedByUser"]=$this->getCreatedByUser()!=null?$this->getCreatedByUser()->getData():null;



        return $array;
    }

    public function getJavascriptClassName(){
        return preg_replace('/[^\w\d_]/','',$this->getName());
    }

    /**
     * @return null
     */
    public function getQuestionTypeID()
    {
        return $this->QuestionTypeID;
    }

    /**
     * @return null
     */
    public function getSrcDirectory()
    {
        return $this->SrcDirectory;
    }

    /**
     * @return null
     */
    public function getName()
    {
        return $this->Name;
    }

    /**
     * @return null
     */
    public function getCreatedBy()
    {
        return $this->CreatedBy;
    }

    /**
     * @return null
     */
    public function getUserID()
    {
        return $this->UserID;
    }

    /**
     * @return null
     */
    public function getFirstName()
    {
        return $this->FirstName;
    }

    /**
     * @return null
     */
    public function getLastName()
    {
        return $this->LastName;
    }

    /**
     * @return null
     */
    public function getEmail()
    {
        return $this->Email;
    }

    /**
     * @return null
     */
    public function getPhoneNumber()
    {
        return $this->PhoneNumber;
    }

    /**
     * @return null
     */
    public function getUserName()
    {
        return $this->UserName;
    }

    /**
     * @return null
     */
    public function getPassword()
    {
        return $this->Password;
    }

    /**
     * @return null
     */
    public function getRole()
    {
        return $this->Role;
    }
    public static function getColumns()
    {
        return array_map(function() {
            return true;
        },(new self())->getData());
    }
}