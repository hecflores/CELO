<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 8:37 PM
 */

namespace Application\Model;


use Zend\Db\TableGateway\TableGateway;

class CourseStatusTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function get($where=array(),$toObject=false)
    {
        $results=$this->tableGateway->select($where);
        if(!$toObject){
            return $results;
        }

        /*******************************************************************/
        return array_map(function($item){
            return $item->getData();
        },iterator_to_array($results));

    }
}