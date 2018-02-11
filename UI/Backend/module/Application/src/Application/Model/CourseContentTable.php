<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/8/2017
 * Time: 2:04 PM
 */

namespace Application\Model;


use Zend\Db\TableGateway\TableGateway;

class CourseContentTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }
    public function Insert($data){
        $data["RolesVisible"]="Instructor|TA"; //This is temporary
        $this->tableGateway->insert($data);
        $id=$this->tableGateway->getLastInsertValue();
        return $id;

    }
    public function Update($id,$data){
        $this->tableGateway->update($data,array("ContentID"=>$id));
    }

    /**
     * @param $id
     * @return CourseContent
     */
    public function getByID($id){
        $query=$this->get(array("ContentID"=>$id),false);
        if(count($query)==0){
            return null;
        }
        return $query->current();
    }
    /**
     * @param array $where
     * @param bool $toObject
     * @return array
     */
    public function get($where=array(), $toObject=false)
    {
        $results=$this->tableGateway->select($where);
        if(!$toObject){
            return $results;
        }

        /*******************************************************************/
        return array_map(function($item){
            return $item;
        },iterator_to_array($results));

    }


}