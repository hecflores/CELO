<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/9/2017
 * Time: 3:22 AM
 */

namespace Application\Model;


use Application\QuestionManager;

class AnswerableQuestion
{
    protected $AnswerableID=null;
    protected $AnswerableGroupID=null;
    protected $QuestionID=null;
    protected $AnsweredHTML=null;
    protected $AnsweredBy=null;
    protected $AllowedAttempts=null;
    protected $Attempts=null;
    protected $PointsWorth=null;
    protected $CorrectAnswer=null;
    protected $ChosenAnswer=null;
    protected $IsCorrect=null;
    protected $data=null;


    protected $AnswerableQuestionGroup=null;
    protected $Question=null;
    protected $AnsweredByUser=null;
    function exchangeArray($data)
    {
        $this->AnswerableID=(isset($data["AnswerableID"]))?$data["AnswerableID"]:null;
        $this->AnswerableGroupID=(isset($data["AnswerableGroupID"]))?$data["AnswerableGroupID"]:null;
        $this->QuestionID=(isset($data["QuestionID"]))?$data["QuestionID"]:null;
        $this->AnsweredHTML=(isset($data["AnsweredHTML"]))?$data["AnsweredHTML"]:null;
        $this->AnsweredBy=(isset($data["AnsweredBy"]))?$data["AnsweredBy"]:null;
        $this->AllowedAttempts=(isset($data["AllowedAttempts"]))?$data["AllowedAttempts"]:null;
        $this->Attempts=(isset($data["Attempts"]))?$data["Attempts"]:null;
        $this->PointsWorth=(isset($data["PointsWorth"]))?$data["PointsWorth"]:null;
        $this->CorrectAnswer=(isset($data["CorrectAnswer"]))?$data["CorrectAnswer"]:null;
        $this->ChosenAnswer=(isset($data["ChosenAnswer"]))?$data["ChosenAnswer"]:null;
        $this->IsCorrect=(isset($data["IsCorrect"]))?$data["IsCorrect"]:null;

        $this->AnswerableQuestionGroup=(new AnswerableQuestionsGroup())->exchangeArray($data);
        $this->Question=(new Question())->exchangeArray($data);
        $this->AnsweredByUser=(new User())->exchangeArray($data);
        $this->data=$data;


        return $this;
    }



    /**
     * @return array
     */
    public function getData()
    {
        $array=array();
        $array["AnswerableID"]=(isset($this->data["AnswerableID"]))?$this->data["AnswerableID"]:null;
        $array["AnswerableQuestionGroup"]=$this->AnswerableQuestionGroup?$this->AnswerableQuestionGroup->getData():null;
        $array["Question"]=$this->Question?$this->Question->getData():null;
        $array["AnsweredByUser"]=$this->AnsweredByUser?$this->AnsweredByUser->getData():null;
        $array["AnsweredHTML"]=(isset($this->data["AnsweredHTML"]))?$this->data["AnsweredHTML"]:null;
        $array["AllowedAttempts"]=(isset($this->data["AllowedAttempts"]))?$this->data["AllowedAttempts"]:null;
        $array["Attempts"]=(isset($this->data["Attempts"]))?$this->data["Attempts"]:null;
        $array["PointsWorth"]=(isset($this->data["PointsWorth"]))?$this->data["PointsWorth"]:null;
        $array["CorrectAnswer"]=(isset($this->data["CorrectAnswer"]))?$this->data["CorrectAnswer"]:null;
        $array["ChosenAnswer"]=(isset($this->data["ChosenAnswer"]))?$this->data["ChosenAnswer"]:null;
        $array["IsCorrect"]=(isset($this->data["IsCorrect"]))?$this->data["IsCorrect"]:null;
        $array["RemainingAnswersAllowed"]= $this->data["AllowedAttempts"]-$this->data["Attempts"]; //  (isset($this->data["IsCorrect"]))?$this->data["IsCorrect"]:null;


        return $array;
        
        
    }

    /**
     * @return null
     */
    public function getAnswerableID()
    {
        return $this->AnswerableID;
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
    public function getQuestionID()
    {
        return $this->QuestionID;
    }

    /**
     * @return null
     */
    public function getAnsweredHTML()
    {
        return $this->AnsweredHTML;
    }

    /**
     * @return null
     */
    public function getAnsweredBy()
    {
        return $this->AnsweredBy;
    }

    /**
     * @return null
     */
    public function getAllowedAttempts()
    {
        return $this->AllowedAttempts;
    }

    /**
     * @return null
     */
    public function getAttempts()
    {
        return $this->Attempts;
    }

    /**
     * @return null
     */
    public function getPointsWorth()
    {
        return $this->PointsWorth;
    }

    /**
     * @return null
     */
    public function getCorrectAnswer()
    {
        return $this->CorrectAnswer;
    }

    /**
     * @return null
     */
    public function getChosenAnswer()
    {
        return $this->ChosenAnswer;
    }

    /**
     * @return null
     */
    public function getIsCorrect()
    {
        return $this->IsCorrect;
    }

    /**
     * @return null
     */
    public function getAnswerableQuestionGroup()
    {
        return $this->AnswerableQuestionGroup;
    }

    /**
     * @return null
     */
    public function getQuestion()
    {
        return $this->Question;
    }

    /**
     * @return null
     */
    public function getAnsweredByUser()
    {
        return $this->AnsweredByUser;
    }


    public static function getColumns(){
        return array(
            "AnswerableID"=>true,
            "AnswerableGroupID"=>true,
            "QuestionID"=>true,
            "AllowedAttempts"=>true,
            "PointsWorth"=>true,
            "CorrectAnswer"=>true,
        );
    }

}