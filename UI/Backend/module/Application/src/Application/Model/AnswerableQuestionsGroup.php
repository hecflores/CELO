<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/26/2017
 * Time: 2:17 AM
 */

namespace Application\Model;


class AnswerableQuestionsGroup
{

    protected $AnswerableGroupID=null;
    protected $CreatedOn=null;
    protected $CreatedBy=null;
    protected $Description=null;
    protected $CourseContentID=null;
    protected $data;

    /**
     * @param $data
     * @return $this
     */
    function exchangeArray($data)
    {
        $this->AnswerableGroupID=(isset($data["AnswerableGroupID"]))?$data["AnswerableGroupID"]:null;
        $this->CreatedOn=(isset($data["CreatedOn"]))?$data["CreatedOn"]:null;
        $this->CreatedBy=(isset($data["CreatedBy"]))?$data["CreatedBy"]:null;
        $this->Description=(isset($data["Description"]))?$data["Description"]:null;
        $this->CourseContentID=(isset($data["CourseContentID"]))?$data["CourseContentID"]:null;
        $this->data=$data;
        return $this;
    }

    /**
     * @return array
     */
    public function getData(){
        $array=array();
        $array["AnswerableGroupID"]=(isset($this->data["AnswerableGroupID"]))?$this->data["AnswerableGroupID"]:null;
        $array["CreatedOn"]=(isset($this->data["CreatedOn"]))?$this->data["CreatedOn"]:null;
        $array["CreatedBy"]=(isset($this->data["CreatedBy"]))?$this->data["CreatedBy"]:null;
        $array["Description"]=(isset($this->data["Description"]))?$this->data["Description"]:null;
        $array["CourseContentID"]=(isset($this->data["CourseContentID"]))?$this->data["CourseContentID"]:null;
        return $array;
    }

    /**
     * @return null
     */
    public function getAnswerableGroupID()
    {
        return $this->AnswerableGroupID;
    }

    /**
     * @return null
     */
    public function getCreatedOn()
    {
        return $this->CreatedOn;
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
    public function getDescription()
    {
        return $this->Description;
    }


    public static function getColumns(){
        return array(
            "AnswerableGroupID"=>true,
            "CreatedOn"=>true,
            "CreatedBy"=>true,
            "Category"=>true,
            "CourseContentID"=>true,
            "SetGrade"=>true,
            "Modified"=>true
        );
    }


}