<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 10:57 AM
 */

namespace Application\Model;


use Application\Info;

class Files
{
    protected $FileID=null;
    protected $Path=null;
    protected $ContentType=null;
    protected $Name=null;
    protected $CreatedBy=null;
    protected $data=null;
    function exchangeArray($data)
    {
        $this->data=$data;
        $this->FileID=(isset($data["FileID"]))?$data["FileID"]:null;
        $this->Path=(isset($data["Path"]))?$data["Path"]:null;
        $this->ContentType=(isset($data["ContentType"]))?$data["ContentType"]:null;
        $this->Name=(isset($data["Name"]))?$data["Name"]:null;
        $this->CreatedBy=(isset($data["CreatedBy"]))?$data["CreatedBy"]:null;
    }

    function getData(){
        $data=array();
        $array["FileID"]=(isset($this->data["FileID"]))?$this->data["FileID"]:null;
        $array["Path"]=(isset($this->data["Path"]))?$this->data["Path"]:null;
        $array["ContentType"]=(isset($this->data["ContentType"]))?$this->data["ContentType"]:null;
        $array["Name"]=(isset($this->data["Name"]))?$this->data["Name"]:null;
        $array["CreatedBy"]=(isset($this->data["CreatedBy"]))?$this->data["CreatedBy"]:null;
        return $data;
    }

    /**
     * @return null
     */
    public function getFileID()
    {
        return $this->FileID;
    }

    /**
     * @return null
     */
    public function getPath()
    {
        return $this->Path;
    }

    /**
     * @return null
     */
    public function getContentType()
    {
        return $this->ContentType;
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
    public function getCreatedBy()
    {
        return $this->CreatedBy;
    }

    public static function getColumns(){
        return array(
            "FileID"=>true,
            "Path"=>true,
            "ContentType"=>true,
            "Name"=>true,
            "CreatedBy"=>true,
        );
    }


}