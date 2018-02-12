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

class FilesTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * @param $id
     * @return Files
     */
    public function getFromID($id)
    {
        $row = $this->tableGateway->select(array('FileID' => $id));
        $row = $row->current();
        if (!$row) {
            return null;
        }
        return $row;
    }

    /**
     * @param null $userID
     * @return Files[]
     */
    public function getUploaded($userID=null){
        if($userID==null){
            $userID=Info::getCurrentUser()->getUserID();
        }

        $rows = $this->tableGateway->select(array('CreatedBy' => $userID));

        return iterator_to_array($rows);

    }

    public function Insert($data){
        return Info::PerformInsert("Files",$data);
    }
}