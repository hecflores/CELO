<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/15/2017
 * Time: 3:58 PM
 */

namespace Application\Model;


use Application\Info;
use Application\Service\APIHelper;
use Zend\Db\TableGateway\TableGateway;

class ActiveQuestionsTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }
    public function get($parameters)
    {
        $columns=array_map(function() {
            return true;
        },(new AnswerableQuestion())->getData());

        return APIHelper::PerformAPIFetch($parameters,$columns,$this->tableGateway);

    }

    /**
     * @param int|string|Question $Question_or_ID
     * @param $SessionID
     * @param $questionInSessionID
     * @param $SessionType
     * @param $extraInfo
     * @return AnswerableQuestion
     */
    public function AddQuestion($Question_or_ID, $SessionID, $questionInSessionID,$SessionType,$extraInfo=array())
    {
        /********************************************************************/
        /* Fix Variables                                                    */
        /********************************************************************/
        if($Question_or_ID instanceof Question){
            $Question_or_ID=$Question_or_ID->getQuestionID();
        }

        $QuestionKey=Info::QuestionsTable()->getFromById($Question_or_ID);
        $QuestionKey->getExpectedAnswer();

        $data=array(
            "QuestionID"=>$Question_or_ID,
            "SessionSubID"=>$questionInSessionID,
            "SessionType"=>$SessionType,
            "SessionID"=>$SessionID,
            "CorrectAnswer"=>$QuestionKey->getExpectedAnswer(),
        );

        /*******************************************************************/
        $data=array_merge($data,$extraInfo);
        $AnswerableQuestionFound=$this->get(array("SessionID"=>$SessionID, "SessionSubID"=>$questionInSessionID));

        /*******************************************************************/
        if($AnswerableQuestionFound->count()==0){
            $this->tableGateway->insert($data);
            $id=$this->tableGateway->getLastInsertValue();
            return $this->get(array("AnswerableID"=>$id))->current();
        }

        return $AnswerableQuestionFound->current();

    }

    /**
     * @param int|string|AnswerableQuestion $AnswerQuestion_or_ID
     * @param $Answer
     * @param $AnsweredHTML
     * @throws \Exception
     * @internal param $SessionID
     * @internal param $questionInSessionID
     * @internal param $SessionType
     * @internal param $extraInfo
     */
    public function AnswerQuestion($AnswerQuestion_or_ID,$Answer,$AnsweredHTML)
    {
        /********************************************************************/
        /* Fix Variables                                                    */
        /********************************************************************/
        if($AnswerQuestion_or_ID instanceof AnswerableQuestion){
            $AnswerQuestion_or_ID=$AnswerQuestion_or_ID->getAnswerableID();
        }

        /********************************************************************/
        $AnsweredObject=$this->get(array("AnswerableID"=>$AnswerQuestion_or_ID))["results"];
        if(count($AnsweredObject)==0){
            throw new \Exception("Unable to find Answered Question $AnswerQuestion_or_ID");
        }
        $AnsweredObject=$AnsweredObject[0];
        /** @var AnswerableQuestion $AnsweredObject */
        if($AnsweredObject["Attempts"]>=$AnsweredObject["AllowedAttempts"]){
            return;
        }

        $data=array(
            "AnsweredHTML"=>$AnsweredHTML,
            "ChosenAnswer"=>$Answer,
            "Attempts"=>intval($AnsweredObject["Attempts"])+1,
            "AnsweredBy"=>Info::getCurrentUser()->getUserID(),
        );

        $this->tableGateway->update($data,array("AnswerableID"=>$AnswerQuestion_or_ID));




    }
}