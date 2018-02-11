<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 7:34 PM
 */

namespace Application\Model;


use Application\Info;

class SectionUsers
{
    protected $SectionID;
    protected $AssignedBy;
    protected $UserID;
    protected $data;


    public function exchangeArray($data)
    {
        $this->SectionID=(isset($data["SectionID"]))?$data["SectionID"]:"";
        $this->AssignedBy=(isset($data["AssignedBy"]))?$data["AssignedBy"]:"";
        $this->UserID=(isset($data["UserID"]))?$data["UserID"]:"";
        $this->data=$data;


    }


    /**
     * @return string|null
     */
    public function getSectionID()
    {
        return $this->SectionID;
    }

    /**
     * @return mixed
     */
    public function getAssignedBy()
    {
        return $this->AssignedBy;
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
    public function getData()
    {
        $array=array();
        $array["SectionID"]=(isset($this->data["SectionID"]))?$this->data["SectionID"]:null;
        $array["AddedOn"]=(isset($this->data["AddedOn"]))?$this->data["AddedOn"]:null;
        $array["AssignedBy"]=(isset($this->data["AssignedBy"]))?$this->data["AssignedBy"]:null;
        $array["UserID"]=(isset($this->data["UserID"]))?$this->data["UserID"]:null;
        return $array;
    }

    public static function getColumns(){
        return array(
            "SectionUsersID"=>true,
            "SectionID"=>true,
            "AddedOn"=>true,
            "AssignedBy"=>true,
            "UserID"=>true,
            "UHID"=>true,
        );
    }

}