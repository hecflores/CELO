<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/10/2017
 * Time: 2:35 PM
 */

namespace Application\Model;


class Tag
{
    protected $TagID=null;
    protected $ObjectID=null;
    protected $Category=null;
    protected $Rank=null;
    protected $data;

    public function exchangeArray($data)
    {
        $this->TagID=(isset($data["TagID"]))?$data["TagID"]:null;
        $this->ObjectID=(isset($data["ObjectID"]))?$data["ObjectID"]:null;
        $this->Category=(isset($data["Category"]))?$data["Category"]:null;
        $this->Rank=(isset($data["Rank"]))?$data["Rank"]:null;
        $this->data=$data;
    }

    /**
     * @return null
     */
    public function getTagID()
    {
        return $this->TagID;
    }

    /**
     * @return null
     */
    public function getObjectID()
    {
        return $this->ObjectID;
    }

    /**
     * @return null
     */
    public function getCategory()
    {
        return $this->Category;
    }

    /**
     * @return null
     */
    public function getRank()
    {
        return $this->Rank;
    }



    /**
     * @return mixed
     */
    public function getData()
    {
        $array=array();
        $array["TagID"]=(isset($this->data["TagID"]))?$this->data["TagID"]:null;
        $array["ObjectID"]=(isset($this->data["ObjectID"]))?$this->data["ObjectID"]:null;
        $array["Category"]=(isset($this->data["Category"]))?$this->data["Category"]:null;
        $array["Rank"]=(isset($this->data["Rank"]))?$this->data["Rank"]:null;
        return $array;
    }

    public static function getColumns()
    {
        return array_map(function() {
            return true;
        },(new self())->getData());
    }
}