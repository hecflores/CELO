<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/9/2017
 * Time: 3:14 AM
 */

namespace Application\Model;


use Application\Controller\RepositoryController;
use Application\Info;

class Assessment
{
    protected $AssessmentID=null;
    protected $Name=null;
    protected $URL=null;
    protected $Description=null;
    protected $Type=null;
    protected $Properties=null;
    protected $AssociatedCourseContentID=null;
    protected $CreatedBy=null;
    protected $Timelimit=null;
    protected $data;
    protected $AnswerableGroupID;

    function exchangeArray($data)
    {
        $this->AssessmentID=(isset($data["AssessmentID"]))?$data["AssessmentID"]:null;
        $this->Name=(isset($data["Name"]))?$data["Name"]:null;
        $this->URL=(isset($data["URL"]))?$data["URL"]:null;
        $this->Description=(isset($data["Description"]))?$data["Description"]:null;
        $this->Type=(isset($data["Type"]))?$data["Type"]:null;
        $this->Properties=(isset($data["Properties"]))?$data["Properties"]:null;
        $this->AssociatedCourseContentID=(isset($data["AssociatedCourseContentID"]))?$data["AssociatedCourseContentID"]:null;
        $this->CreatedBy=(isset($data["CreatedBy"]))?$data["CreatedBy"]:null;
        $this->Timelimit=(isset($data["Timelimit"]))?$data["Timelimit"]:null;
        $this->AnswerableGroupID=(isset($data["AnswerableGroupID"]))?$data["AnswerableGroupID"]:null;

        if(is_string($this->Properties)){
           $json=json_decode($this->Properties,true);
           $this->Properties=$json;
        }


        $this->data=$data;
    }

    /**
     * @return mixed
     */
    public function getAnswerableGroupID()
    {
        return $this->AnswerableGroupID;
    }

    /**
     * @param mixed $AnswerableGroupID
     */
    public function setAnswerableGroupID($AnswerableGroupID)
    {
        $this->AnswerableGroupID = $AnswerableGroupID;
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
    public function getName()
    {
        return $this->Name;
    }

    /**
     * @return null
     */
    public function getURL()
    {
        return $this->URL;
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
    public function getType()
    {
        return $this->Type;
    }

    /**
     * @return null
     */
    public function getProperties()
    {
        return $this->Properties;
    }

    /**
     * @return null
     */
    public function getAssociatedCourseContentID()
    {
        return $this->AssociatedCourseContentID;
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
    public function getTimelimit()
    {
        return $this->Timelimit;
    }


    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["AssessmentID"]=(isset($this->data["AssessmentID"]))?$this->data["AssessmentID"]:null;
        $array["Name"]=(isset($this->data["Name"]))?$this->data["Name"]:null;
        $array["URL"]=(isset($this->data["URL"]))?$this->data["URL"]:null;
        $array["Description"]=(isset($this->data["Description"]))?$this->data["Description"]:null;
        $array["Type"]=(isset($this->data["Type"]))?$this->data["Type"]:null;
        $array["Properties"]=(isset($this->data["Properties"]))?$this->data["Properties"]:null;
        $array["AssociatedCourseContentID"]=(isset($this->data["AssociatedCourseContentID"]))?$this->data["AssociatedCourseContentID"]:null;
        $array["CreatedBy"]=(isset($this->data["CreatedBy"]))?$this->data["CreatedBy"]:null;
        $array["Timelimit"]=(isset($this->data["Timelimit"]))?$this->data["Timelimit"]:null;
        $array["AnswerableGroupID"]=(isset($this->data["AnswerableGroupID"]))?$this->data["AnswerableGroupID"]:null;
        return $array;

    }
    public static function getColumns()
    {
        return array_map(function() {
            return true;
        },(new self())->getData());
    }
    public static function getActions(){
        return array(
            "create"=>function($controller) {
                /** @param RepositoryController $controller */

            }

        );
    }
//    public static function getActions(){
//        return array(
//            "constraints"=>array(
//                "REQUIRED"=>function($data,$column,$parameters,&$value,&$message){
//                    if(!isset($data[$column])){
//                        $message="$column was required. Didnt find in input";
//                        return false;
//                    }
//                    $value=$data[$column];
//                    return true;
//                },
//                "OPTIONAL"=>function($data,$column,$parameters,&$value,&$message){
//                    if(!isset($data[$column])){
//                        if(isset($parameters["default"])){
//                            $value=$parameters["default"];
//                            return true;
//                        }
//                        $value=null;
//                        return true;
//                    }
//                    $value=$data[$column];
//                    return true;
//                },
//                "NOT_NULL"=>function($data,$column,$parameters,&$value,&$message){
//                    if(!isset($data[$column])){
//                        return false;
//                    }
//                    if($data[$column]==null){
//                        $message="$column was null, expected to be a non-null variable";
//                        return false;
//                    }
//                    $value=$data[$column];
//                    return true;
//                },
//                "USERNAME"=>function(){
//                    return Info::getCurrentUser()->getUserID();
//                },
//            ),
//            "actions"=>array(
//                "create"=>array(
//                    "columns"=>array(
//                        "Name"=>array(
//                            "insert"=>"REQUIRED",
//                            "update"=>"NOT_NULL"
//                        ),
//                        "Description"=>array(
//                            "insert"=>"REQUIRED",
//                            "update"=>"OPTIONAL"
//                        ),
//                        "Type"=>"REQUIRED",
//                        "Properties"=>function($data,$column,$parameters,&$value,&$message){
//                            json_decode()
//                        },
//                        "AssociatedCourseContentID",
//
//                    )
//                )
//            )
//        )
//    }


}