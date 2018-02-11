<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 5:52 PM
 */

namespace Application\Model;


use Application\Info;
use ReflectionClass;

class Section
{

    protected $SectionID=null;
    protected $SectionNumber=null;
    protected $StartDate=null;
    protected $EndDate=null;
    protected $Location=null;
    protected $TextBookInformation=null;
    protected $CourseUniqueID=null;
    protected $CreatedBy=null;
    protected $MainCourseContentID=null;


    public function exchangeArray($data)
    {


        $this->SectionID=(isset($data["SectionID"]))?$data["SectionID"]:null;
        $this->SectionNumber=(isset($data["SectionNumber"]))?$data["SectionNumber"]:null;
        $this->StartDate=(isset($data["StartDate"]))?$data["StartDate"]:null;
        $this->EndDate=(isset($data["EndDate"]))?$data["EndDate"]:null;
        $this->Location=(isset($data["Location"]))?$data["Location"]:null;
        $this->TextBookInformation=(isset($data["TextBookInformation"]))?$data["TextBookInformation"]:null;
        $this->CourseUniqueID=(isset($data["CourseUniqueID"]))?$data["CourseUniqueID"]:null;
        $this->CreatedBy=(isset($data["CreatedBy"]))?$data["CreatedBy"]:null;
        $this->MainCourseContentID=(isset($data["MainCourseContentID"]))?$data["MainCourseContentID"]:null;

        $this->data=$data;
    }




    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["SectionID"]=(isset($this->data["SectionID"]))?$this->data["SectionID"]:null;
        $array["SectionNumber"]=(isset($this->data["SectionNumber"]))?$this->data["SectionNumber"]:null;
        $array["StartDate"]=(isset($this->data["StartDate"]))?$this->data["StartDate"]:null;
        $array["EndDate"]=(isset($this->data["EndDate"]))?$this->data["EndDate"]:null;
        $array["Location"]=(isset($this->data["Location"]))?$this->data["Location"]:null;
        $array["TextBookInformation"]=(isset($this->data["TextBookInformation"]))?$this->data["TextBookInformation"]:null;
        $array["CourseUniqueID"]=(isset($this->data["CourseUniqueID"]))?$this->data["CourseUniqueID"]:null;
        $array["CreatedBy"]=(isset($this->data["CreatedBy"]))?$this->data["CreatedBy"]:null;
        $array["MainCourseContentID"]=(isset($this->data["MainCourseContentID"]))?$this->data["MainCourseContentID"]:null;
        return $array;
    }

    /**
     * @return null
     */
    public function getSectionID()
    {
        return $this->SectionID;
    }

    /**
     * @return null
     */
    public function getSectionNumber()
    {
        return $this->SectionNumber;
    }

    /**
     * @return null
     */
    public function getStartDate()
    {
        return $this->StartDate;
    }

    /**
     * @return null
     */
    public function getEndDate()
    {
        return $this->EndDate;
    }

    /**
     * @return null
     */
    public function getLocation()
    {
        return $this->Location;
    }

    /**
     * @return null
     */
    public function getTextBookInformation()
    {
        return $this->TextBookInformation;
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
    public function getCourseID()
    {
        return $this->CourseID;
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
    public function getMainCourseContentID()
    {
        return $this->MainCourseContentID;
    }




    public static function getColumns()
    {
        return array(
            "SectionID"=>true,
            "SectionNumber"=>true,
            "StartDate"=>true,
            "EndDate"=>true,
            "Location"=>true,
            "TextBookInformation"=>true,
            "CourseUniqueID"=>true,
            "CreatedBy"=>true,
            "MainCourseContentID"=>true,
        );
    }
    public static function getPrimaryKey(){
        return array(
            "SectionID"=>true
        );
    }
}