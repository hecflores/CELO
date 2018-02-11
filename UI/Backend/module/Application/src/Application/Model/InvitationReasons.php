<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 10:57 AM
 */

namespace Application\Model;


class InvitationReasons
{
    protected $ReasonID;
    protected $ReasonString;
    protected $RolesExcepted;
    protected $data;

    function exchangeArray($data)
    {
        $this->ReasonID=($data["ReasonID"])?$data["ReasonID"]:"";
        $this->ReasonString=($data["ReasonString"])?$data["ReasonString"]:"";
        $this->RolesExcepted=($data["RolesExcepted"])?$data["RolesExcepted"]:"";
        $this->data=$data;
    }

    /**
     * @return mixed
     */
    public function getReasonID()
    {
        return $this->ReasonID;
    }

    /**
     * @return mixed
     */
    public function getReasonString()
    {
        return $this->ReasonString;
    }

    /**
     * @return mixed
     */
    public function getRolesExcepted()
    {
        return $this->RolesExcepted;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }
    public static function getColumns()
    {
        return array_map(function() {
            return true;
        },(new self())->getData());
    }
}