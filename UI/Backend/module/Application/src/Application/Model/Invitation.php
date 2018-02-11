<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 10:57 AM
 */

namespace Application\Model;


use Application\Info;

class Invitation
{

    protected $InvitationID;
    protected $Accepted;
    protected $Viewed;
    protected $InvitedBy;
    protected $Inviting;
    protected $ReasonID;
    protected $data;

    function exchangeArray($data)
    {
        $this->InvitationID=(isset($data["InvitationID"]))?$data["InvitationID"]:"";
        $this->Accepted=(isset($data["Accepted"]))?$data["Accepted"]:"";
        $this->Viewed=(isset($data["Viewed"]))?$data["Viewed"]:"";
        $this->InvitedBy=(isset($data["InvitedBy"]))?$data["InvitedBy"]:"";
        $this->Inviting=(isset($data["Inviting"]))?$data["Inviting"]:"";
        $this->ReasonID=(isset($data["ReasonID"]))?$data["ReasonID"]:"";
        $this->data=$data;
    }

    /**
     * @return mixed
     */
    public function getInvitationID()
    {
        return $this->InvitationID;
    }

    /**
     * @return mixed
     */
    public function getAccepted()
    {
        return $this->Accepted;
    }

    /**
     * @return mixed
     */
    public function getViewed()
    {
        return $this->Viewed;
    }

    /**
     * @return User
     */
    public function getInvitedBy()
    {
        return Info::UserTable()->getUserById($this->InvitedBy);
    }

    /**
     * @return User
     */
    public function getInviting()
    {
        return Info::UserTable()->getUserById($this->Inviting);
    }

    /**
     * @return mixed
     */
    public function getReasonID()
    {
        return $this->ReasonID;
    }

    /**
     * @return InvitationReasons
     */
    public function getReason()
    {
        return Info::InvitationReasonsTable()->getFromID($this->getReasonID());
    }

    public function getLink()
    {
        return "/invitations/{$this->getInvitationID()}";
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