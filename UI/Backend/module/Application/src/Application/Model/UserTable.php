<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 10:09 AM
 */

namespace Application\Model;



use Application\Info;
use Application\Service\APIHelper;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Zend\Db\TableGateway\TableGateway;

class UserTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function updateUserProfile($info)
    {
        $this->tableGateway->update($info,array( "UserID" => Info::LoginService()->GetUserID()));
    }
    public function createNewUser($info)
    {
        if(self::getUserByNameAndRole($info["UserName"] || "",$info["Role"])!=null){
            return null;
        }

        $info["UserID"]=uniqid();

        while($this->getUserById($info["UserID"])!=null){
            $info["UserID"]=uniqid();
        }



        $this->tableGateway->insert($info);
        return $info["UserID"];
    }
    public function fetchAll()
    {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }

    /**
     * @param $id
     * @return array|\ArrayObject|null|\Zend\Db\ResultSet\ResultSet|User
     */
    public function getUserById($id)
    {
        $row = $this->tableGateway->select(array('UserID' => $id));
        $row = $row->current();
        if (!$row) {
            return null;
        }
        return $row;
    }
    public function getUserByNameAndRole($name, $role)
    {
        $row = $this->tableGateway->select(array('UserName' => $name,"Role"=>$role));
        $row = $row->current();
        if (!$row) {
            return null;
        }
        return $row;
    }
    public function validateUser($name,$password,$role=null)
    {
        /*******************************************************************/
        /* If Role is not known                                            */
        /*******************************************************************/
        if($role==null){
            $row = $this->tableGateway->select(array('UserName' => $name,"Password"=>$password));
            if($row->count()>1){
                return null;
            }
            $row = $row->current();
            if (!$row) {
                return null;
            }
            return $row;
        }

        /*******************************************************************/
        /* If Role is known                                                */
        /*******************************************************************/
        $row = $this->tableGateway->select(array('UserName' => $name,"Role"=>$role,"Password"=>$password));
        $row = $row->current();
        if (!$row) {
            return null;
        }
        return $row;
    }

    /**
     * @return TableGateway
     */
    public function getTableGateway()
    {
        return $this->tableGateway;
    }

    /**
     * @param array $fromPost
     * @return User[]
     */
    public function get($parameters)
    {
        $columns=array_map(function() {
            return true;
        },(new User())->getData());

        return APIHelper::PerformAPIFetch($parameters,$columns,$this->tableGateway);

    }
    public function delete($where=array(),$toObject=false)
    {
        if(count($where)==0){
            throwException(new \Exception("Im pretty sure you dont want to delete everyone"));
        }
        $results=$this->tableGateway->select($where);
        if(!$toObject){
            return $results;
        }

        /*******************************************************************/
        return array_map(function($item){
            return $item->getData();
        },iterator_to_array($results));
    }

    public function search($fromQuery, $toObject=false)
    {
        $select=new Select();

        /*******************************************************************/
        $select->from("Users");
        if(isset($fromQuery["Role"])){
            $select->where("Role ='{$fromQuery["Role"]}'");
            unset($fromQuery["Role"]);
        }
        $newWhere=[];

        foreach($fromQuery as $column => $content){
            $newWhere[]="$column LIKE '%".$content."%'";
        }
        if(count($newWhere)>0) {
            //var_dump(implode(" OR ",$newWhere));
            $select->where("(" . implode(" OR ", $newWhere) . ")");
        }
        //echo $select->getSqlString();
        //exit();
        /*******************************************************************/
        $results=$this->tableGateway->selectWith($select);
        if(!$toObject){
            return $results;
        }

        /*******************************************************************/
        return array_map(function($item){
            return $item->getData();
        },iterator_to_array($results));
    }


}