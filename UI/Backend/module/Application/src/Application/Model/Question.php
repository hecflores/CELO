<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/27/2017
 * Time: 3:25 AM
 */

namespace Application\Model;


use Application\Info;
use Application\QuestionManager;
use Application\QuestionTypeManager;
use Application\Roles;

class Question
{

    protected $QuestionID=null;
    protected $QuestionType=null;
    protected $Question=null;
    protected $ExpectedAnswer=null;
    protected $CreatedBy=null;
    protected $JSONParameters=null;
    protected $FirstName=null;
    protected $LastName=null;
    protected $Email=null;
    protected $PhoneNumber=null;
    protected $QuestionsPoolID=null;
    protected $data;

    function exchangeArray($data)
    {

        $this->QuestionID=(isset($data["QuestionID"]))?$data["QuestionID"]:null;
        $this->QuestionType=(isset($data["QuestionType"]))?$data["QuestionType"]:null;
        $this->Question=(isset($data["Question"]))?$data["Question"]:null;
        $this->ExpectedAnswer=(isset($data["ExpectedAnswer"]))?$data["ExpectedAnswer"]:null;
        $this->CreatedBy=(isset($data["CreatedBy"]))?$data["CreatedBy"]:null;
        $this->JSONParameters=(isset($data["JSONParameters"]))?$data["JSONParameters"]:null;
        $this->QuestionType=(isset($data["QuestionType"]))?$data["QuestionType"]:null;
        $this->QuestionType=new QuestionType();
        $this->QuestionType->exchangeArray($data);
        $this->FirstName=(isset($data["FirstName"]))?$data["FirstName"]:null;
        $this->LastName=(isset($data["LastName"]))?$data["LastName"]:null;
        $this->Email=(isset($data["Email"]))?$data["Email"]:null;
        $this->PhoneNumber=(isset($data["PhoneNumber"]))?$data["PhoneNumber"]:null;
        $this->QuestionsPoolID=(isset($data["QuestionsPoolID"]))?$data["QuestionsPoolID"]:null;
        if(is_string($this->JSONParameters)){
            $json=json_decode($this->JSONParameters,true);
            $this->JSONParameters=$json==null?array():$json;
        }


        $this->data=$data;

        return $this;
    }
    public function toArray()
    {
        $array=array();
        $array["QuestionID"]=(isset($this->data["QuestionID"]))?$this->data["QuestionID"]:null;
        $array["QuestionType"]=(isset($this->data["QuestionType"]))?$this->data["QuestionType"]:null;
        $array["Question"]=(isset($this->data["Question"]))?$this->data["Question"]:null;
        $array["ExpectedAnswer"]=(isset($this->data["ExpectedAnswer"]))?$this->data["ExpectedAnswer"]:null;
        $array["CreatedBy"]=(isset($this->data["CreatedBy"]))?$this->data["CreatedBy"]:null;
        $array["JSONParameters"]=(isset($this->data["JSONParameters"]))?$this->data["JSONParameters"]:null;
        $array["QuestionType"]=(isset($this->data["QuestionType"]))?$this->data["QuestionType"]:null;
        $array["FirstName"]=(isset($this->data["FirstName"]))?$this->data["FirstName"]:null;
        $array["LastName"]=(isset($this->data["LastName"]))?$this->data["LastName"]:null;
        $array["Email"]=(isset($this->data["Email"]))?$this->data["Email"]:null;
        $array["PhoneNumber"]=(isset($this->data["PhoneNumber"]))?$this->data["PhoneNumber"]:null;
        $array["QuestionsPoolID"]=(isset($this->data["QuestionsPoolID"]))?$this->data["QuestionsPoolID"]:null;
        return $array;
    }

    public function getQuestionTypeManager(){
        return new QuestionTypeManager($this->getQuestionTypeID());
    }
    /**
     * @return null
     */
    public function getQuestionID()
    {
        return $this->QuestionID;
    }

    /**
     * @param null $QuestionID
     */
    public function setQuestionID($QuestionID)
    {
        $this->QuestionID = $QuestionID;
    }

    /**
     * @return null
     */
    public function getQuestionType()
    {
        return $this->QuestionType;
    }




    /**
     * @return null
     */
    public function getQuestion()
    {
        return $this->Question;
    }

    /**
     * @param null $Question
     */
    public function setQuestion($Question)
    {
        $this->Question = $Question;
    }

    /**
     * @return null
     */
    public function getExpectedAnswer()
    {
        return $this->ExpectedAnswer;
    }

    /**
     * @param null $ExpectedAnswer
     */
    public function setExpectedAnswer($ExpectedAnswer)
    {
        $this->ExpectedAnswer = $ExpectedAnswer;
    }

    /**
     * @return null
     */
    public function getCreatedBy()
    {
        return $this->CreatedBy;
    }

    /**
     * @param null $CreatedBy
     */
    public function setCreatedBy($CreatedBy)
    {
        $this->CreatedBy = $CreatedBy;
    }

    /**
     * @return null
     */
    public function getJSONParameters()
    {
        return $this->JSONParameters;
    }

    /**
     * @param null $JSONParameters
     */
    public function setJSONParameters($JSONParameters)
    {
        $this->JSONParameters = $JSONParameters;
    }


    /**
     * @param null $QuestionType
     */
    public function setQuestionType($QuestionType)
    {
        $this->QuestionType = $QuestionType;
    }

    /**
     * @return null
     */
    public function getFirstName()
    {
        return $this->FirstName;
    }

    /**
     * @param null $FirstName
     */
    public function setFirstName($FirstName)
    {
        $this->FirstName = $FirstName;
    }

    /**
     * @return null
     */
    public function getLastName()
    {
        return $this->LastName;
    }

    /**
     * @param null $LastName
     */
    public function setLastName($LastName)
    {
        $this->LastName = $LastName;
    }

    /**
     * @return null
     */
    public function getEmail()
    {
        return $this->Email;
    }

    /**
     * @param null $Email
     */
    public function setEmail($Email)
    {
        $this->Email = $Email;
    }

    /**
     * @return null
     */
    public function getPhoneNumber()
    {
        return $this->PhoneNumber;
    }

    /**
     * @param null $PhoneNumber
     */
    public function setPhoneNumber($PhoneNumber)
    {
        $this->PhoneNumber = $PhoneNumber;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["QuestionID"]=(isset($this->data["QuestionID"]))?$this->data["QuestionID"]:null;
        $array["QuestionType"]=(isset($this->data["QuestionType"]))?$this->data["QuestionType"]:null;
        $array["Question"]=(isset($this->data["Question"]))?$this->data["Question"]:null;
        if(Info::LoginService()->IsAuthorized(array(Roles::$INSTRUCTOR,Roles::$ADMIN))) {
            $array["ExpectedAnswer"] = (isset($this->data["ExpectedAnswer"])) ? $this->data["ExpectedAnswer"] : null;
            $array["CreatedBy"]=(isset($this->data["CreatedBy"]))?$this->data["CreatedBy"]:null;
        }
        $array["JSONParameters"]=$this->getJSONParameters();
        $array["QuestionType"]=(isset($this->data["QuestionType"]))?$this->data["QuestionType"]:null;
        $array["FirstName"]=(isset($this->data["FirstName"]))?$this->data["FirstName"]:null;
        $array["LastName"]=(isset($this->data["LastName"]))?$this->data["LastName"]:null;
        $array["Email"]=(isset($this->data["Email"]))?$this->data["Email"]:null;
        $array["PhoneNumber"]=(isset($this->data["PhoneNumber"]))?$this->data["PhoneNumber"]:null;
        $array["QuestionsPoolID"]=(isset($this->data["QuestionsPoolID"]))?$this->data["QuestionsPoolID"]:null;

        $questionType=new QuestionType();
        $questionType->exchangeArray(array("Name"=>$array["QuestionType"]));
        $array["JavascriptClassName"]=$questionType->getJavascriptClassName();

        return $array;
    }

    /**
     * @return null
     */
    public function getQuestionsPoolID()
    {
        return $this->QuestionsPoolID;
    }

    public function getParameters()
    {
        return $this->JSONParameters;
    }

    public function setParameters($parameters)
    {
        $data=array("JSONParameters"=>json_encode($parameters,JSON_FORCE_OBJECT));
        if(isset($parameters["question"]))
        {
            $data["Question"]=$parameters["question"];
        }

        Info::QuestionsTable()->UpdateInsertData($this->getQuestionID(),$data);
        $this->JSONParameters=$parameters;
    }

    public function setAnswer($answer)
    {
        Info::QuestionsTable()->UpdateInsertData($this->getQuestionID(),array("ExpectedAnswer"=>$answer));
        $this->ExpectedAnswer=$answer;
    }

    public static function getColumns()
    {
        return array(
            "QuestionID"=>true,
            "QuestionType"=>true,
            "Question"=>true,
            "ExpectedAnswer"=>true,
            "CreatedBy"=>true,
            "JSONParameters"=>true,
            "FirstName"=>true,
            "LastName"=>true,
            "Email"=>true,
            "QuestionsPoolID"=>true,
            "PhoneNumber"=>true);
        return array_map(function() {
            return true;
        },(new self())->getData());
    }
}