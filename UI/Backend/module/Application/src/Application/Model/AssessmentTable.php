<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/9/2017
 * Time: 3:31 AM
 */

namespace Application\Model;


use Application\Info;
use Application\QuestionManager;
use Application\Service\APIHelper;
use Exception;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Where;
use Zend\Db\TableGateway\TableGateway;

class AssessmentTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * @param int $AssessmentID
     * @return Assessment|null
     */
    public function GetAssessmentFromID($AssessmentID){

        return $this->tableGateway->select(array("AssessmentID"=>$AssessmentID))->current();
    }

    /**
     * @param CourseContent $CourseContent_or_ID
     * @return Assessment|null
     */
    public function GetAssessmentForCourseContent($CourseContent_or_ID){
        /********************************************************************/
        if($CourseContent_or_ID instanceof CourseContent){
            $CourseContent_or_ID=$CourseContent_or_ID->getContentID();
        }

        return $this->tableGateway->select(array("AssociatedCourseContentID"=>$CourseContent_or_ID))->current();
    }

    /** Creates a new Assessment with that corresponds to a course gradable content
     * @param $data
     * @param $AssociatedCourseContentID
     * @return int
     */
    public function CreateNewAssessment($data,$AssociatedCourseContentID){
        $data["AssociatedCourseContentID"]=$AssociatedCourseContentID;
        $data["CreatedBy"]=Info::getCurrentUser()->getUserID();

        $this->tableGateway->insert($data);
        $id=$this->tableGateway->getLastInsertValue();

        return $id;
    }

    /**
     * @description Addes a Question to the Assessment. This question will later be converted into
     *              active questions when the assessment is added as a RunningAssessment
     * @param int|string|Assessment $Assessment_or_ID
     * @param int|string|QuestionManager|Question $Question_or_ID
     * @param int|string $Weight
     * @return int
     */
    public function AddQuestion($Assessment_or_ID, $Question_or_ID,$Weight){

        /********************************************************************/
        /* Fixing Variables                                                 */
        /********************************************************************/
        if($Assessment_or_ID instanceof Assessment){
            $Assessment_or_ID=$Assessment_or_ID->getAssessmentID();
        }

        /********************************************************************/
        if($Question_or_ID instanceof Question){
            $Question_or_ID=$Question_or_ID->getQuestionID();
        }

        $data=array(
            "AssessmentID"=>$Assessment_or_ID,
            "QuestionID"=>$Question_or_ID,
            "Weight"=>$Weight,
            "AddedBy"=>Info::getCurrentUser()->getUserID());

        $id=Info::PerformInsert("AssessmentQuestions",$data);
        return $id;
    }

    /**
     * @description Will create a 'Runnable' Version of the Assessment. This is a instance of an assessment
     *              which allows a Student to take the Assessment or a Instructor to see the grade for it
     * @param array $Assessment
     * @return int
     */
    public function StartAssessment($Assessment)
    {
        /********************************************************************/
        /* First we need to add a gradable "group" of answers               */
        /********************************************************************/
        $AnsweringGroupID=Info::PerformInsert("AnsweringQuestionsGroup",array(
            "AnswerableGroupID"=>$Assessment["AnswerableGroupID"],
            "StartOn"=>date('Y-m-d H:i:s'),
            "StartedBy"=>Info::getCurrentUser()->getUserID()
        ));


        /********************************************************************/
        /* Add the Questions to the Grading Group. Which makes them gradable*/
        /********************************************************************/
        //By Moving to AnsweringQuestionsGroup, all the questions are already saved.
//        $totalPoints=0;
//        foreach($Assessment["questions"] as $question){
//            Info::PerformInsert("AnswerableQuestions",array(
//                "AnswerableID"=>"",
//                "AnswerableGroupID"=>$AnswerableGroupID,
//                "QuestionID"=>$question["QuestionID"],
//                "AllowedAttempts"=>1,
//                "PointsWorth"=>$question["Weight"],
//                "CorrectAnswer"=>$question["ExpectedAnswer"]));
//            $totalPoints+=$question["Weight"];
//
//        }
        $totalPoints=0;
        foreach($Assessment["questions"] as $question){
            $totalPoints+=$question["Weight"];
        }

        /********************************************************************/
        /* Add it to the Running Assessments                                */
        /********************************************************************/
        return Info::PerformInsert("RunningAssessments",array(
            "AssessmentID"=>$Assessment["AssessmentID"],
            "StartTime"=>date('Y-m-d H:i:s'),
            "AnsweringBy"=>Info::getCurrentUser()->getUserID(),
            "AnsweringGroupID"=>$AnsweringGroupID,
            "TotalPoints"=>$totalPoints

        ));


    }


    /**
     * @param int|string $SessionID
     * @return AssessmentQuestion[];
     */
    public function getAssessmentSessionQuestions($SessionID){
        $sql=Info::SQL();
        $select=$sql->select()->from(array("RA"=>"RunningAssessments"))
            ->join(array("RsQ"=>"AssessmentQuestions"),"RsQ.AssessmentID=RA.AssessmentID",Select::SQL_STAR)
            ->join(array("AnQ"=>"AnswerableQuestions"),"AnQ.SessionID=RA.SessionID",Select::SQL_STAR,Select::JOIN_LEFT)
            ->where(array(
                "RA.SessionID"=>$SessionID
            ));

        $query=$sql->prepareStatementForSqlObject($select);

        $result=$query->execute();
        $resultSet = new ResultSet(); // Zend\Db\ResultSet\ResultSet
        $resultSet->setArrayObjectPrototype(new AssessmentQuestion()); // <-- HERE you set your entity object
        $resultSet->initialize($result);
        return $resultSet;


    }


    /**
     * @param int|string|Assessment $Assessment_or_ID
     * @return AssessmentQuestion[]
     */
    public function getAssessmentIssuedQuestions($Assessment_or_ID)
    {
        /********************************************************************/
        /* Fixing Variables                                                 */
        /********************************************************************/
        if($Assessment_or_ID instanceof Assessment){
            $Assessment_or_ID=$Assessment_or_ID->getAssessmentID();
        }

        $sql=Info::SQL();
        $select=$sql->select("AssessmentQuestions")
            ->columns(array("AssessmentQuestionID","QuestionID","Weight","AddedBy"))
            ->where(array(
                "AssessmentID"=>$Assessment_or_ID
            ));
        $query=$sql->prepareStatementForSqlObject($select);
        $result=$query->execute();
        $resultSet = new ResultSet(); // Zend\Db\ResultSet\ResultSet
        $resultSet->setArrayObjectPrototype(new AssessmentQuestion()); // <-- HERE you set your entity object
        $resultSet->initialize($result);
        return $resultSet;
    }

    /**
     * @param $SessionID
     * @return AnswerableQuestion[]
     */
    public function getAnswerableQuestions($SessionID){
        $sql=Info::SQL();
        $select=$sql->select("AnswerableQuestions")
            ->where(array(
                "SessionID"=>$SessionID
            ));
        $query=$sql->prepareStatementForSqlObject($select);
        $result=$query->execute();
        $resultSet = new ResultSet(); // Zend\Db\ResultSet\ResultSet
        $resultSet->setArrayObjectPrototype(new AnswerableQuestion()); // <-- HERE you set your entity object
        $resultSet->initialize($result);
        return $resultSet;
    }

    /**
     * @param int|string|Assessment $Assessment_or_ID
     * @param int|string|User $User_or_UserID
     * @return RunningAssessment|null
     * @throws Exception
     */
    public function getRunningInstance($Assessment_or_ID,$User_or_UserID){
        /********************************************************************/
        /* Fixing Variables                                                 */
        /********************************************************************/
        if($Assessment_or_ID instanceof Assessment){
            $Assessment_or_ID=$Assessment_or_ID->getAssessmentID();
        }
        if($User_or_UserID instanceof User){
            $User_or_UserID=$User_or_UserID->getUserID();
        }
        if(is_array($Assessment_or_ID)){
            if(!isset($Assessment_or_ID["AssessmentID"])){
                throw new Exception($Assessment_or_ID." was not able to be determined");
            }

            $Assessment_or_ID=$Assessment_or_ID["AssessmentID"];

        }

        /********************************************************************/
        $sql=Info::SQL();
        $select=$sql->select("RunningAssessments")
            ->where((new Where())->
                    equalTo("AssessmentID",$Assessment_or_ID)->
                    equalTo("AnsweringBy",$User_or_UserID)->
                    isNull("EndTime"));

        $query=$sql->prepareStatementForSqlObject($select);

        $result=$query->execute();
        $resultSet = new ResultSet(); // Zend\Db\ResultSet\ResultSet
        $resultSet->setArrayObjectPrototype(new RunningAssessment()); // <-- HERE you set your entity object
        $resultSet->initialize($result);
        return $resultSet->current();
    }
    /**
     * @param int|string|Assessment $Assessment_or_ID
     * @param int|string|User $User_or_UserID
     * @return RunningAssessment[]|null
     */
    public function getFinishedAssessments($User_or_UserID=null){
        /********************************************************************/
        /* Fixing Variables                                                 */
        /********************************************************************/
        if($User_or_UserID==null){
            $User_or_UserID=Info::getCurrentUser()->getUserID();
        }
        if($User_or_UserID instanceof User){
            $User_or_UserID=$User_or_UserID->getUserID();
        }

        /********************************************************************/
        if($User_or_UserID !=null){
            $sql=Info::SQL();
            $select=$sql->select("RunningAssessments")
                ->where((new Where())->
                equalTo("AnsweringBy",$User_or_UserID)->
                isNotNull("EndTime"));
            $query=$sql->prepareStatementForSqlObject($select);
            $result=$query->execute();
            $resultSet = new ResultSet(); // Zend\Db\ResultSet\ResultSet
            $resultSet->setArrayObjectPrototype(new RunningAssessment()); // <-- HERE you set your entity object
            $resultSet->initialize($result);
            return $resultSet;
        }
        return null;

    }
    /**
     * @param int $RunningAssessmentID
     * @return RunningAssessment|null
     */
    public function getRunningAssessmentFromID($RunningAssessmentID){

        /********************************************************************/
        $sql=Info::SQL();
        $select=$sql->select("RunningAssessmentsReport")
            ->where(array(
                "AnsweredID"=>$RunningAssessmentID,
            ));
        $query=$sql->prepareStatementForSqlObject($select);
        $result=$query->execute();
        $resultSet = new ResultSet(); // Zend\Db\ResultSet\ResultSet
        $resultSet->setArrayObjectPrototype(new RunningAssessment()); // <-- HERE you set your entity object
        $resultSet->initialize($result);
        return $resultSet->current();
    }

    /**
     * @param $Assessment_or_ID
     * @return RunningAssessment|null
     */
    public function FinishAssessmentAndGrade($Assessment_or_ID){
        /********************************************************************/
        /* Fixing Variables                                                 */
        /********************************************************************/
        if($Assessment_or_ID instanceof Assessment){
            $Assessment_or_ID=$Assessment_or_ID->getAssessmentID();
        }

        /********************************************************************/
        /* Get the Assessment that we are finishing                         */
        /********************************************************************/
        $RunningAssignment=$this->getRunningInstance($Assessment_or_ID,Info::getCurrentUser());
        $AnswerableQuestions=$this->getAnswerableQuestions($RunningAssignment->getSessionID());

        /************************************************************************/
        $totalPoints=0;
        $earnedPoints=0;
        foreach($AnswerableQuestions as $item){
            $totalPoints+=$item->getPointsWorth();
            $earnedPoints+=($item->getCorrectAnswer()==$item->getChosenAnswer())?$item->getPointsWorth():0;
        }

        $sql=Info::SQL();
        $update=$sql->update("RunningAssessments")->set(
            array(
                "TotalPoints"=>$totalPoints,
                "EarnedPoints"=>$earnedPoints,
                "EndTime"=>date('Y-m-d H:i:s')))
            ->where(array(
                "AnsweredID"=>$RunningAssignment->getAnsweredID(),
            ));
        $query=$sql->prepareStatementForSqlObject($update);
        $query->execute();

        return $RunningAssignment;
    }

    public function get($parameters)
    {
        $columns=array_map(function() {
            return true;
        },(new Assessment())->getData());

        return APIHelper::PerformAPIFetch($parameters,$columns,$this->tableGateway);

    }


}