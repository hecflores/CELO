<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 7:36 PM
 */

namespace Application\Model;


use Application\EmailService;
use Application\Info;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGateway;
use Zend\Mail\Transport\Sendmail;

class SectionUsersTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }


    /**
     * @param $user User
     * @return Section[]|\Zend\Db\ResultSet\ResultSetInterface
     */
    public function getSectionsForUser($user, $where=array()){
        $select=new Select();
        $select->from(array('s'=>"Sections"))
            ->columns(array("CourseCategory","CourseID","SectionNumber","SectionID"))
            ->join(array('u'=>"SectionUsers"),'u.CourseCategory = s.CourseCategory AND u.CourseID=s.CourseID AND u.SectionNumber=s.SectionNumber')
                 ->where(array("UserID"=>$user->getUserID()))
            ->group("s.CourseCategory")->group("s.CourseID")->group("s.SectionNumber");


        //$select->where($where);
        return Info::SectionTable()->getTableGateway()->selectWith($select);

    }

    /**
     * @param $user User
     * @param $section Section
     * @return User[]|\Zend\Db\ResultSet\ResultSetInterface
     */
    public function addUserToSection($user,$section)
    {
        //We will do a join with this table and the table from users to get that list of users

        /*******************************************************************/
        /* Check if already added                                          */
        /*******************************************************************/
        $possibleFind=$this->getUsersForSections($section,array("u.UserID"=>$user->getUserID()));
        if($possibleFind->count()!=0){
            return;
        }

        /*******************************************************************/
        /* Build Insert Array                                              */
        /*******************************************************************/
        $insertArray=array("UserID"=>$user->getUserID());
        $insertArray=array_merge($insertArray,array(
            "CourseCategory"=>$section->getCourseCategory(),
            "CourseID" => $section->getCourseID()
        ));
        $insertArray=array_merge($insertArray,array(
            "SectionNumber"=>$section->getSectionNumber(),
        ));
        $insertArray=array_merge($insertArray,array("AssignedBy" => Info::getCurrentUser()->getUserID()));

        /*******************************************************************/
        /* Insert                                                          */
        /*******************************************************************/
        $this->tableGateway->insert($insertArray);
    }

    public function removeUserFromSection($user,$section)
    {
        /*******************************************************************/
        /* Check if already added                                          */
        /*******************************************************************/
        $possibleFind=$this->getUsersForSections($section,array("UserID"=>$user->getUserID()));
        if($possibleFind->count()==0){
            return;
        }

        if($possibleFind->current()->getAssignedBy()!=$user->getUserID){
            $IDOF_personDeletingRecord=$user->getUserID;
            $IDOF_personCreatedRecord=$possibleFind->current()->getAssignedBy();

            $Deleter=Info::UserTable()->getUserById($IDOF_personDeletingRecord);
            $Creator=Info::UserTable()->getUserById($IDOF_personCreatedRecord);

            EmailService::SendEmail($Creator->getEmail(),"CELO Notification","<h1>Someone Has Attempted to Delete one of the Courses you have created.</h1><H2>I Hope this is correct...</H2>");


        }

        /*******************************************************************/
        /* Build Insert Array                                              */
        /*******************************************************************/
        $insertArray=array("UserID"=>$user->getUserID());
        $insertArray=array_merge($insertArray,array(
            "CourseCategory"=>$section->getCourseCategory(),
            "CourseID" => $section->getCourseID()
        ));

        /*******************************************************************/
        /* Insert                                                          */
        /*******************************************************************/
        $this->tableGateway->delete($insertArray);
    }


    /**
     * @param $section Section
     * @return User[]|\Zend\Db\ResultSet\ResultSetInterface
     */
    public function getUsersForSections($section, $where=array())
    {
        $where=array_merge($where,array("CourseCategory"=>$section->getCourseCategory(),"CourseID"=>$section->getCourseID(),"SectionNumber"=>$section->getSectionNumber()));
        //We will do a join with this table and the table from users to get that list of users
        $select=new Select();
        $select->from(array('u'=>"Users"))->columns(
            array("UserID","FirstName","LastName","Email","PhoneNumber","UserName","Password"))
            ->join(array('s'=>"SectionUsers"),'u.UserID = s.UserID')->where($where);
        //$select->where($where);

        return Info::UserTable()->getTableGateway()->selectWith($select);

    }


}