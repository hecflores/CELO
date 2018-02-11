<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 5:56 PM
 */

namespace Application\Model;


use Application\Info;
use Zend\Db\Sql\Insert;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGateway;

class SectionTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * @return Section[]
     */
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

    /**
     * @param Course $course
     * @return Section[]
     */
    public function getForCourse($course){
        return $this->tableGateway->select(array("CourseCategory"=>$course->getCourseCategory(),"CourseID"=>$course->getCourseID()));
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getFromID($id){
        $results=$this->tableGateway->select(array("SectionID"=>$id));
        return $results->current();
    }
    /**
     * @param $course
     * @param $sectionNumber
     * @return Section|null
     */
    public function find($course, $sectionNumber)
    {
        $row1=$this->tableGateway->select(array("CourseCategory"=>$course->getCourseCategory(),"CourseID"=>$course->getCourseID(),"SectionNumber"=>$sectionNumber));
        $row2 = $row1->current();
        if (!$row2) {
            return null;
        }
        return $row2;
    }
    /**
     * @param $course
     * @param $sectionNumber
     * @return Section|null
     */
    public function look($courseCat,$courseID, $sectionNumber){
        $row1=$this->tableGateway->select(array("CourseCategory"=>$courseCat,"CourseID"=>$courseID,"SectionNumber"=>$sectionNumber));
        $row2 = $row1->current();
        if (!$row2) {
            return null;
        }
        return $row2;
    }

    /**
     * @param Course $course
     * @param int $sectionNumber
     * @param array $data
     * @return Section|null
     */
    public function save($course, $sectionNumber, $data){

        /*******************************************************************/
        /* Updating a Section                                              */
        /*******************************************************************/
        $found=$this->find($course,$sectionNumber);
        if($found!=null){
            $this->tableGateway->update($data);
            return $found;
        }



        /*******************************************************************/
        /* Creating a Section                                              */
        /*******************************************************************/
        $insertValue=array(
            "CourseCategory"=>$course->getCourseCategory(),
            "CourseID" => $course->getCourseID(),
            "SectionNumber"=>$sectionNumber
        );

        /*******************************************************************/
        $insertValue=array_merge($insertValue,$data);
        $this->tableGateway->insert($insertValue);
        $id=$this->tableGateway->getLastInsertValue();

        /*******************************************************************/
        /* Creating Course Content For Section                             */
        /*******************************************************************/
        $courseContentID=Info::CourseContentTable()->Insert(array(
                "SectionID"=>$id,
                "Name"=>$course->getCourseCategory()." ".$course->getCourseID()."(".$sectionNumber.")",
                "Description"=>$course->getDescription(),
                "Type"=>"course",
                "Properties"=>"{'SectionID':'$id'}",
                "Gradable"=>true,
                "CreatedBy"=>Info::getCurrentUser()->getUserID()
            ));

        /*******************************************************************/
        $this->save($course,$sectionNumber,array("MainCourseContentID"=>$courseContentID));

        return $this->find($course,$sectionNumber);
    }

    /**
     * @param User
     * @return Section[]
     */
    public function getFromUnderUser($user)
    {
        $select=new Select("SELECT S1.* FROM Sections AS S1 JOIN SectionUsers  
                            AS S2 ON S1.SectionNumber=S2.CourseID AND 
                                     S1.CourseCategory=S2.CourseCategory AND 
                                     S1.CourseID=S2.CourseID AND 
                                     S2.UserID='{$user->getUserID()}'");

        return $this->tableGateway->select($select);
    }

    /**
     * @param $course Course
     * @param Section $section
     * @param User $user
     * @return \Zend\Db\ResultSet\ResultSet
     */
    public function addInstructor($course,$section, $user)
    {
        $currentUser=Info::getCurrentUser();
        $insert=new Insert("INSERT INTO SectionUsers (SectionNumber, CourseCategory, CourseID, AssignedBy, UserID) 
                            VALUES (
                              {$section->getSectionNumber()},
                              '{$course->getCourseCategory()}',
                              {$course->getCourseID()},
                              '{$currentUser->getUserID()}',
                              '{$user->getUserID()}')");
        $this->tableGateway->insertWith($insert);




    }

    /**
     * @return TableGateway
     */
    public function getTableGateway()
    {
        return $this->tableGateway;
    }

}