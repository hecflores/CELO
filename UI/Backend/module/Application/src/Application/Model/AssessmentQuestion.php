<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/9/2017
 * Time: 3:17 AM
 */

namespace Application\Model;


class AssessmentQuestion
{
    protected $AssessmentQuestionID;
    protected $AssessmentID;
    protected $QuestionID;
    protected $Weight;
    protected $AddedBy;
    protected $data;

    function exchangeArray($data)
    {
        $this->AssessmentQuestionID=(isset($data["AssessmentQuestionID"])) ? $data["AssessmentQuestionID"]:"";
        $this->AssessmentID=(isset($data["AssessmentID"])) ? $data["AssessmentID"]:"";
        $this->QuestionID=(isset($data["QuestionID"])) ? $data["QuestionID"]:"";
        $this->Weight=(isset($data["Weight"])) ? $data["Weight"]:"";
        $this->AddedBy=(isset($data["AddedBy"])) ? $data["AddedBy"]:"";


        $this->data=$data;
    }

    /**
     * @return mixed
     */
    public function getAssessmentQuestionID()
    {
        return $this->AssessmentQuestionID;
    }

    /**
     * @return mixed
     */
    public function getAssessmentID()
    {
        return $this->AssessmentID;
    }

    /**
     * @return mixed
     */
    public function getQuestionID()
    {
        return $this->QuestionID;
    }

    /**
     * @return mixed
     */
    public function getWeight()
    {
        return $this->Weight;
    }

    /**
     * @return mixed
     */
    public function getAddedBy()
    {
        return $this->AddedBy;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["AssessmentQuestionID"]=(isset($this->data["AssessmentQuestionID"]))?$this->data["AssessmentQuestionID"]:null;
        $array["AssessmentID"]=(isset($this->data["AssessmentID"]))?$this->data["AssessmentID"]:null;
        $array["QuestionID"]=(isset($this->data["QuestionID"]))?$this->data["QuestionID"]:null;
        $array["Weight"]=(isset($this->data["Weight"]))?$this->data["Weight"]:null;
        $array["AddedBy"]=(isset($this->data["AddedBy"]))?$this->data["AddedBy"]:null;
        return $array;
    }

}