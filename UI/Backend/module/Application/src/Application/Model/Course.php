<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 2:54 PM
 */

namespace Application\Model;


use Application\Info;

class Course
{
    protected $CourseUniqueID=null;
    protected $CourseName=null;
    protected $CourseCategory=null;
    protected $Setup=null;
    protected $CourseID=null;
    protected $Description=null;
    protected $CourseStatus=null;
    protected $CreatedBy=null;
    protected $data;

    function exchangeArray($data)
    {

        $this->CourseUniqueID=(isset($data["CourseUniqueID"]))?$data["CourseUniqueID"]:null;
        $this->CourseName=(isset($data["CourseName"]))?$data["CourseName"]:null;
        $this->CourseCategory=(isset($data["CourseCategory"]))?$data["CourseCategory"]:null;
        $this->Setup=(isset($data["Setup"]))?$data["Setup"]:null;
        $this->CourseID=(isset($data["CourseID"]))?$data["CourseID"]:null;
        $this->Description=(isset($data["Description"]))?$data["Description"]:null;
        $this->CourseStatus=(isset($data["CourseStatus"]))?$data["CourseStatus"]:null;
        $this->CreatedBy=(isset($data["CreatedBy"]))?$data["CreatedBy"]:null;

        $this->CourseCategory=(isset($data["CourseCategory"])) ? $data["CourseCategory"]:"";
        $this->CourseID=(isset($data["CourseID"])) ? $data["CourseID"]:"";
        $this->Description=(isset($data["Description"])) ? $data["Description"]:"";
        $this->CourseStatus=(isset($data["CourseStatus"])) ? $data["CourseStatus"]:"";
        $this->CreatedBy=(isset($data["CreatedBy"])) ? $data["CreatedBy"]:"";
        $this->CourseName=(isset($data["CourseName"])) ? $data["CourseName"]:"";
        $this->data=$data;
    }

    /**
     * @return null
     */
    public function getCourseUniqueID()
    {
        return $this->CourseUniqueID;
    }

    /**
     * @return null
     */
    public function getCourseName()
    {
        return $this->CourseName;
    }

    /**
     * @return null
     */
    public function getCourseCategory()
    {
        return $this->CourseCategory;
    }

    /**
     * @return null
     */
    public function getSetup()
    {
        return $this->Setup;
    }

    /**
     * @return null
     */
    public function getCourseID()
    {
        return $this->CourseID;
    }

    /**
     * @return null
     */
    public function getDescription()
    {
        return $this->Description;
    }

    /**
     * @return null
     */
    public function getCourseStatus()
    {
        return $this->CourseStatus;
    }

    /**
     * @return null
     */
    public function getCreatedBy()
    {
        return $this->CreatedBy;
    }





    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["CourseUniqueID"]=(isset($this->data["CourseUniqueID"]))?$this->data["CourseUniqueID"]:null;
        $array["CourseName"]=(isset($this->data["CourseName"]))?$this->data["CourseName"]:null;
        $array["CourseCategory"]=(isset($this->data["CourseCategory"]))?$this->data["CourseCategory"]:null;
        $array["Setup"]=(isset($this->data["Setup"]))?$this->data["Setup"]:null;
        $array["CourseID"]=(isset($this->data["CourseID"]))?$this->data["CourseID"]:null;
        $array["Description"]=(isset($this->data["Description"]))?$this->data["Description"]:null;
        $array["CourseStatus"]=(isset($this->data["CourseStatus"]))?$this->data["CourseStatus"]:null;
        $array["CreatedBy"]=(isset($this->data["CreatedBy"]))?$this->data["CreatedBy"]:null;
        return $array;
    }
    public static function getColumns()
    {
        return array(
            "CourseUniqueID"=>true,
            "CourseName"=>true,
            "CourseCategory"=>true,
            "Setup"=>true,
            "CourseID"=>true,
            "Description"=>true,
            "CourseStatus"=>true,
            "CreatedBy"=>true,
        );
    }
    public static function getPrimaryKey(){
        return array(
            "CourseUniqueID"=>true);
    }

}