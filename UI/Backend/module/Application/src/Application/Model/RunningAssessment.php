<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/9/2017
 * Time: 3:19 AM
 */

namespace Application\Model;


class RunningAssessment
{
    protected $AnsweredID=null;
    protected $AssessmentID=null;
    protected $StartTime=null;
    protected $EndTime=null;
    protected $TotalPoints=null;
    protected $EarnedPoints=null;
    protected $AnsweringBy=null;
    protected $GradedBy=null;
    protected $AnsweringGroupID=null;

    function exchangeArray($data)
    {
        $this->AnsweredID=(isset($data["AnsweredID"]))?$data["AnsweredID"]:null;
        $this->AssessmentID=(isset($data["AssessmentID"]))?$data["AssessmentID"]:null;
        $this->StartTime=(isset($data["StartTime"]))?$data["StartTime"]:null;
        $this->EndTime=(isset($data["EndTime"]))?$data["EndTime"]:null;
        $this->TotalPoints=(isset($data["TotalPoints"]))?$data["TotalPoints"]:null;
        $this->EarnedPoints=(isset($data["EarnedPoints"]))?$data["EarnedPoints"]:null;
        $this->AnsweringBy=(isset($data["AnsweringBy"]))?$data["AnsweringBy"]:null;
        $this->GradedBy=(isset($data["GradedBy"]))?$data["GradedBy"]:null;
        $this->AnsweringGroupID=(isset($data["AnsweringGroupID"]))?$data["AnsweringGroupID"]:null;




        $this->data=$data;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["AnsweredID"]=(isset($this->data["AnsweredID"]))?$this->data["AnsweredID"]:null;
        $array["AssessmentID"]=(isset($this->data["AssessmentID"]))?$this->data["AssessmentID"]:null;
        $array["StartTime"]=(isset($this->data["StartTime"]))?$this->data["StartTime"]:null;
        $array["EndTime"]=(isset($this->data["EndTime"]))?$this->data["EndTime"]:null;
        $array["TotalPoints"]=(isset($this->data["TotalPoints"]))?$this->data["TotalPoints"]:null;
        $array["EarnedPoints"]=(isset($this->data["EarnedPoints"]))?$this->data["EarnedPoints"]:null;
        $array["AnsweringBy"]=(isset($this->data["AnsweringBy"]))?$this->data["AnsweringBy"]:null;
        $array["GradedBy"]=(isset($this->data["GradedBy"]))?$this->data["GradedBy"]:null;
        $array["AnsweringGroupID"]=(isset($this->data["AnsweringGroupID"]))?$this->data["AnsweringGroupID"]:null;


        $final=$this->data;
        
        return $final;
    }

    /**
     * @return mixed
     */
    public function getGrade()
    {
        return ($this->getEarnedPoints()/$this->getTotalPoints())*100.0;
    }

    /**
     * @return null
     */
    public function getAnsweredID()
    {
        return $this->AnsweredID;
    }

    /**
     * @return null
     */
    public function getAssessmentID()
    {
        return $this->AssessmentID;
    }

    /**
     * @return null
     */
    public function getStartTime()
    {
        return $this->StartTime;
    }

    /**
     * @return null
     */
    public function getEndTime()
    {
        return $this->EndTime;
    }

    /**
     * @return null
     */
    public function getTotalPoints()
    {
        return $this->TotalPoints;
    }

    /**
     * @return null
     */
    public function getEarnedPoints()
    {
        return $this->EarnedPoints;
    }

    /**
     * @return null
     */
    public function getAnsweringBy()
    {
        return $this->AnsweringBy;
    }

    /**
     * @return null
     */
    public function getGradedBy()
    {
        return $this->GradedBy;
    }

    /**
     * @return null
     */
    public function getAnsweringGroupID()
    {
        return $this->AnsweringGroupID;
    }



    public static function getColumns()
    {
        return array(
            "AnsweredID"=>true,
            "AssessmentID"=>true,
            "StartTime"=>true,
            "EndTime"=>true,
            "TotalPoints"=>true,
            "EarnedPoints"=>true,
            "Answered"=>true,
            "TotalQuestions"=>true,
            "Grade"=>true,
            "RelativeGrade"=>true,
            "Finished"=>true,
            "AnsweringBy"=>true,
            "GradedBy"=>true,
            "AnswerableGroupID"=>true,
            "Name"=>true,
            "URL"=>true,
            "Description"=>true,
            "Type"=>true,
            "Properties"=>true,
            "AssociatedCourseContentID"=>true,
            "Timelimit"=>true
        );
    }
}