<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 3:05 PM
 */

namespace Application\Model;


use Application\Info;
use Zend\Db\TableGateway\TableGateway;

class CourseTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }
    public function filterInput($data)
    {
        $listOfValidContent=array(
            "Description" => "true",
            "CourseStatus" => "true",
            "CourseName" => "true",
            "CreatedBy" => "true");

        /*******************************************************************/
        $returnData=array();
        $returnData["id"]=array();
        $returnData["content"]=array();
        $returnData["rejected"]=array();

        /*******************************************************************/
        if(!(isset($data["CourseCategory"]) && isset($data["CourseID"]))){
            $returnData["id"]["found"]=false;
        }
        else{
            $returnData["id"]["found"]=true;
            $returnData["id"]["content"]=array(
                "CourseCategory" => $data["CourseCategory"],
                "CourseID" => $data["CourseID"]
            );
        }
        /*******************************************************************/
        foreach($data as $key => $value)
        {
            if(!isset($listOfValidContent[$key])){
                $returnData["rejected"][$key]=$value;
                continue;
            }

            $returnData["content"][$key]=$value;
        }

        return $returnData;
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
    public function find($courseCatalog, $courseID)
    {
        $results=$this->tableGateway->select(array("CourseID" => $courseID, "CourseCategory" => $courseCatalog));
        if($results->count()==0)
        {
            return null;
        }
        return $results->current();
    }
    public function save($data)
    {
        $data["CreatedBy"]=Info::getCurrentUser()->getUserID();

        $data=$this->filterInput($data);
        /*******************************************************************/
        if(!$data["id"]["found"]) //We dont want to do anything if no id
        {
            return false;
        }

        /*******************************************************************/
        if($this->tableGateway->select($data["id"]["content"])->count()==0)
        {
            $this->tableGateway->insert(array_merge($data["id"]["content"], $data["content"]));
        }
        else
        {
            $this->tableGateway->update($data["content"],$data["id"]["content"]);
        }

        return true;

    }
}