<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 11:04 AM
 */

namespace Application\Model;


use Application\Info;
use Application\Service\APIHelper;
use Zend\Db\TableGateway\TableGateway;

class QuestionTypesTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }


    /**
     * @param $id
     * @return QuestionType
     */
    public function getFromById($id){

        $row = $this->tableGateway->select(array('QuestionTypeID' => $id));
        $row = $row->current();
        if (!$row) {
            return null;
        }
        return $row;
    }
    public function deleteFromID($id){

        $this->tableGateway->delete(array('QuestionTypeID' => $id));

    }
    public function get($parameters=array())
    {
        $columns=array_map(function() {
            return true;
        },(new QuestionType())->getData());

        return APIHelper::PerformAPIFetch($parameters,$columns,$this->tableGateway);

    }
    /**
     * @param $data
     * @return QuestionType
     */
    public function saveData($data){

        /*******************************************************************/
        /* Save Question Type Data                                         */
        /*******************************************************************/
        if(isset($data["QuestionTypeID"]) && $this->getFromById($data["QuestionTypeID"])!=null){
            $this->tableGateway->update($data,array("QuestionTypeID" => $data["QuestionTypeID"]));
            return $this->getFromById($data["QuestionTypeID"]);
        }


        unset($data["QuestionTypeID"]);
        $data["CreatedBy"]=Info::getCurrentUser()->getUserID();
        $id=$this->tableGateway->insert($data);
        $id=$this->tableGateway->getLastInsertValue();

        return $this->getFromById($id);

    }

    /**
     * @return array|\ArrayObject|null|\Zend\Db\ResultSet\ResultSet|QuestionType
     */
    public function searchByName(){
        $user=Info::getCurrentUser();
        $row = $this->tableGateway->select(array('Name' => $user->getUserID()));

        return $row;
    }

    public function fetch()
    {
        return $this->get()["results"];
    }


}