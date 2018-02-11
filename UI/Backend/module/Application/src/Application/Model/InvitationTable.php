<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 11:04 AM
 */

namespace Application\Model;


use Application\Info;
use Zend\Db\TableGateway\TableGateway;

class InvitationTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }


    /**
     * @param $id
     * @return Invitation
     */
    public function getFromById($id){
        $row = $this->tableGateway->select(array('InvitationID' => $id));
        $row = $row->current();
        if (!$row) {
            return null;
        }
        return $row;
    }


    /**
     * @return array|\ArrayObject|null|\Zend\Db\ResultSet\ResultSet|Invitation
     */
    public function getUsersIncomingInvites(){
        $user=Info::getCurrentUser();
        $row = $this->tableGateway->select(array('Inviting' => $user->getUserID()));

        return $row;
    }

    /**
     * @return array|\ArrayObject|null|\Zend\Db\ResultSet\ResultSet|Invitation
     */
    public function getUsersOutgoingInvites(){
        $user=Info::getCurrentUser();
        $row = $this->tableGateway->select(array('InvitedBy' => $user->getUserID()));

        return $row;
    }

    public function makeUniqueID()
    {
        $id=uniqid();
        while($this->getFromById($id)!=null){
            $id=uniqid();
        }
        return $id;
    }

    /**
     * @param $email
     * @return Invitation|array|\ArrayObject|null|\Zend\Db\ResultSet\ResultSet
     */
    public function makeJoinInstructorCeloInvitation($email){

        $user=Info::getCurrentUser();

        $newUserID=Info::UserTable()->createNewUser(array("Email"=>$email,"Role"=>"Instructor"));

        $invitationInfo=array(
            "InvitationID"=>$this->makeUniqueID(),
            "InvitedBy"=>$user->getUserID(),
            "Inviting"=>$newUserID,
            "ReasonID"=>"Ins_Reg"
        );
        $this->tableGateway->insert($invitationInfo);

        return $this->getFromById($invitationInfo["InvitationID"]);

    }

    public function acceptInvitation($invitationID){
        if($this->getFromById($invitationID)==null){
            return null;
        }

        $invitationInfo=array(
            "Accepted"=>true
        );
        $this->tableGateway->update($invitationInfo,array("InvitationID"=>$invitationID));

        return $this->getFromById($invitationID);

    }



}