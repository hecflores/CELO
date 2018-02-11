<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 11:04 AM
 */

namespace Application\Model;


use Application\Info;
use Application\QuestionManager;
use Application\Service\APIHelper;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\TableGateway\Feature\MetadataFeature;
use Zend\Db\TableGateway\TableGateway;

class QuestionsTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }


    /**
     * @param $id
     * @return Question
     */
    public function getFromById($id){
        $row = $this->tableGateway->select(array('QuestionID' => $id));
        $row = $row->current();
        if (!$row) {
            return null;
        }
        return $row;
    }

    /**
     * @param int|string|Question $Question_or_ID
     */
    public function DeleteQuestion($Question_or_ID){

        /********************************************************************/
        if($Question_or_ID instanceof Question){
            $Question_or_ID=$Question_or_ID->getQuestionID();
        }

        /********************************************************************/
        $this->tableGateway->delete(array('QuestionID' => $Question_or_ID));

    }


    /**
     * @param int|string|Question $Question_or_ID
     * @param $data
     * @return Question
     */
    public function UpdateInsertData($Question_or_ID,$data)
    {
        /********************************************************************/
        /* Fix Variables                                                    */
        /********************************************************************/
        if($Question_or_ID instanceof Question){
            $Question_or_ID=$Question_or_ID->getQuestionID();
        }



        /********************************************************************/
        /* For Updating                                                     */
        /********************************************************************/
        if($Question_or_ID!=null){

            $this->tableGateway->update($data,array("QuestionID" => $Question_or_ID));
            return $this->getFromById($Question_or_ID);
        }

        /********************************************************************/
        if(isset($data["QuestionID"])){
            unset($data["QuestionID"]);
        }

        /********************************************************************/
        /* For Inserting                                                    */
        /********************************************************************/
        $data["CreatedBy"]=Info::getCurrentUser()->getUserID();
        $data["JSONParameters"]=isset($data["JSONParameters"])?$data["JSONParameters"]:"{\"question\":\"{$data["Question"]}\"}";
        $this->tableGateway->insert($data);

        /********************************************************************/
        $id=$this->tableGateway->getLastInsertValue();
        return $this->getFromById($id);

    }

    /**
     * @return array|\ArrayObject|null|\Zend\Db\ResultSet\ResultSet|Question
     */
    public function searchByName(){
        $user=Info::getCurrentUser();
        $row = $this->tableGateway->select(array('Name' => $user->getUserID()));

        return $row;
    }

    /**
     * @param $AnswerableID
     * @return AnswerableQuestion
     */
    public function getAnswerableQuestion($AnswerableID)
    {
        $sql=Info::SQL();
        $select=$sql->select("AnswerableQuestions")
            ->where(array(
                "AnswerableID"=>$AnswerableID
            ));
        $query=$sql->prepareStatementForSqlObject($select);
        $result=$query->execute();
        $resultSet = new ResultSet(); // Zend\Db\ResultSet\ResultSet
        $resultSet->setArrayObjectPrototype(new AnswerableQuestion()); // <-- HERE you set your entity object
        $resultSet->initialize($result);
        return $resultSet->current();
    }

    /**
     * @param int|string|Question $Question_or_ID
     * @param $PointsWorth
     * @param $SessionID
     * @param $questionInSessionID
     * @param $SessionType
     * @param $Answer
     * @param $Html
     */
    public function AnswerQuestion($Question_or_ID, $PointsWorth, $SessionID, $questionInSessionID,$SessionType, $Answer,$Html)
    {
        /********************************************************************/
        /* Fix Variables                                                    */
        /********************************************************************/
        if($Question_or_ID instanceof Question){
            $Question_or_ID=$Question_or_ID->getQuestionID();
        }


        $QuestionKey=$this->getFromById($Question_or_ID);
        $QuestionKey->getExpectedAnswer();

        /*******************************************************************/
        if(Info::IsTableEmpty("AnswerableQuestions",array("SessionID"=>$SessionID, "AnswerableID"=>$questionInSessionID))){
            $data=array(
                "QuestionID"=>$Question_or_ID,
                "AnswerableID"=>$questionInSessionID,
                "SessionType"=>$SessionType,
                "SessionID"=>$SessionID,
                "CorrectAnswer"=>$QuestionKey->getExpectedAnswer(),
                "ChosenAnswer"=>$Answer,
                "AnsweredHTML"=>addslashes($Html),
                "PointsWorth"=>$PointsWorth,
                "AnsweredBy"=>Info::getCurrentUser()->getUserID()
            );
            Info::PerformInsert("AnswerableQuestions",$data);
        }
        else{
            //Updating Answer...Can we do this...
        }


    }



    /***********************************************************************/
    /**
     * @param array $parameters
     * @return array|ResultSet
     * @internal param array $where
     * @internal param bool $toObject
     */
    public function get($parameters=array())
    {
        $columns=array_map(function() {
            return true;
        },(new Question())->toArray());

        return APIHelper::PerformAPIFetch($parameters,$columns,$this->tableGateway);
    }


}