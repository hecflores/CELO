<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 5/5/2017
 * Time: 2:38 PM
 */

namespace Application\Model;


use Application\Info;
use Zend\Db\TableGateway\TableGateway;

class AnsweringQuestionsGroupTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * @param $AnsweringID
     * @return AnsweringQuestionsGroup
     */
    public function getById($AnsweringID){
        $results=$this->tableGateway->select(array(
            "AnsweringGroupID"=>$AnsweringID
        ));


        return $results->current();
    }
}