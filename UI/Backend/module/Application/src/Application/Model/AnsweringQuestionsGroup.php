<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 5/3/2017
 * Time: 8:45 PM
 */

namespace Application\Model;


class AnsweringQuestionsGroup
{
    protected $AnswerableGroupID=null;
    protected $StartOn=null;
    protected $StartedBy=null;
    protected $FinishedOn=null;
    protected $ExpiresOn=null;
    protected $AnsweringGroupID;
    protected $data;

    /**
     * @param $data
     * @return $this
     */
    function exchangeArray($data)
    {
        $this->AnsweringGroupID=(isset($data["AnsweringGroupID"]))?$data["AnsweringGroupID"]:null;
        $this->AnswerableGroupID=(isset($data["AnswerableGroupID"]))?$data["AnswerableGroupID"]:null;
        $this->StartOn=(isset($data["StartOn"]))?$data["StartOn"]:null;
        $this->StartedBy=(isset($data["StartedBy"]))?$data["StartedBy"]:null;
        $this->data=$data;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAnsweringGroupID()
    {
        return $this->AnsweringGroupID;
    }

    /**
     * @return mixed
     */
    public function getAnswerableGroupID()
    {
        return $this->AnswerableGroupID;
    }

    /**
     * @return mixed
     */
    public function getStartOn()
    {
        return $this->StartOn;
    }

    /**
     * @return mixed
     */
    public function getStartedBy()
    {
        return $this->StartedBy;
    }

    /**
     * @return null
     */
    public function getFinishedOn()
    {
        return $this->FinishedOn;
    }

    /**
     * @return null
     */
    public function getExpiresOn()
    {
        return $this->ExpiresOn;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        $array["AnswerableGroupID"]=(isset($this->data["AnswerableGroupID"]))?$this->data["AnswerableGroupID"]:null;
        $array["StartOn"]=(isset($this->data["StartOn"]))?$this->data["StartOn"]:null;
        $array["StartedBy"]=(isset($this->data["StartedBy"]))?$this->data["StartedBy"]:null;
        $array["FinishedOn"]=(isset($this->data["FinishedOn"]))?$this->data["FinishedOn"]:null;
        $array["ExpiresOn"]=(isset($this->data["ExpiresOn"]))?$this->data["ExpiresOn"]:null;
    }

    public static function getColumns(){
        return array(
            "AnsweringGroupID"=>true,
            "AnswerableGroupID"=>true,
            "StartOn"=>true,
            "StartedBy"=>true,
            "FinishedOn"=>true,
            "ExpiresOn"=>true,
        );
    }
}