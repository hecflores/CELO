<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 10:28 AM
 */

namespace Application\Model;


class UserSession
{
    protected $SessionID;
    protected $UserID;
    protected $TimeLastAccessed;
    protected $MAC_Address;
    protected $Role;
    protected $data;


    public function exchangeArray($data)
    {
        $this->SessionID = (!empty($data["SessionID"])) ? $data["SessionID"] : null;
        $this->UserID = (!empty($data["UserID"])) ? $data["UserID"] : null;
        $this->TimeLastAccessed = (!empty($data["TimeLastAccessed"])) ? $data["TimeLastAccessed"] : null;
        $this->MAC_Address = (!empty($data["MAC_Address"])) ? $data["MAC_Address"] : null;
        $this->Role = (!empty($data["Role"])) ? $data["Role"] : null;
        $this->data=$data;
    }

    /**
     * @return mixed
     */
    public function getSessionID()
    {
        return $this->SessionID;
    }

    /**
     * @return mixed
     */
    public function getUserID()
    {
        return $this->UserID;
    }

    /**
     * @return mixed
     */
    public function getTimeLastAccessed()
    {
        return $this->TimeLastAccessed;
    }

    /**
     * @return mixed
     */
    public function getMACAddress()
    {
        return $this->MAC_Address;
    }

    /**
     * @return mixed
     */
    public function getRole()
    {
        return $this->Role;
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