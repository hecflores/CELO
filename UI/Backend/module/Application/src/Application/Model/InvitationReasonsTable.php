<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 11:04 AM
 */

namespace Application\Model;


use Zend\Db\TableGateway\TableGateway;

class InvitationReasonsTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * @param $id
     * @return InvitationReasons
     */
    public function getFromID($id){
        $row = $this->tableGateway->select(array('ReasonID' => $id));
        $row = $row->current();
        if (!$row) {
            return null;
        }
        return $row;
    }
}