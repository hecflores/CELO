<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 10:09 AM
 */

namespace Application\Model;



use Zend\Db\TableGateway\TableGateway;

class UserSessionTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }
    public function deleteUserSession($id)
    {

        $this->tableGateway->delete(array('SessionID' => $id));


    }

    /**
     * @param $id
     * @return UserSession
     */
    public function getUserBySessionID($id)
    {

        $row1 = $this->tableGateway->select(array('SessionID' => $id));
        $row2 = $row1->current();
        if (!$row2) {
            return null;
        }
        return $row2;
    }
    public function saveNewUserSession($user)
    {
        $data = array(
            'SessionID' => uniqid(),
            'UserID' => $user->getUserID(),
            'TimeLastAccessed'  => date("y-m-d h:m:s"),
            'MAC_Address' => isset($_SERVER['SERVER_ADDR'])?$_SERVER['SERVER_ADDR']:"Unkown",
            'Role' => $user->getRole(),
        );

        /*******************************************************************/
        $max=5;
        while($this->getUserBySessionID($data["SessionID"])!=null){
            $data["SessionID"]=uniqid();
            $max--;
            if($max<0){
                return null;
            }
        }

        /*******************************************************************/
        $this->tableGateway->insert($data);

        /*******************************************************************/
        return $this->getUserBySessionID($data["SessionID"]);


    }




}