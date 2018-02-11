<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/27/2017
 * Time: 2:26 AM
 */

namespace Application\Service\Meat;


use Application\Info;
use Application\Model\Assessment;
use Application\Model\RunningAssessment;
use Application\Roles;
use Application\Service\APIHelper;

class RunningAssessmentsMeatEater
{
    /**
     * @param array $parameters
     * @param array $expected
     * @param array $output
     * @return bool
     */
    protected static function CheckParameters($parameters, $expected, &$output){
        MeatEater::InitializeOutput($output);
        foreach($expected as $expectName){
            if(!isset($parameters[$expectName])){
                $output["errors"][]="$expectName Was not found(Was expected)";
            }
        }
        return count($output["errors"])==0;
    }

    protected static function InitializeOutput(&$output){
        $output["errors"]=isset($output["errors"])?$output["errors"]:array();
    }

    /**
     * @param $parameters
     * @param $output
     * @return bool
     */
    public static function StartAssessment($parameters, &$output)
    {
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("AssessmentID"),$output)){
            return false;
        }
        $assessmentID=$parameters["AssessmentID"];


        /*******************************************************************/
        Roles::Override(Roles::$ADMIN); // We do this to get all the information that we need from assessment
        if(!AssessmentsMeatEater::getAssessment($assessmentID,$output)){
            $output["errors"][]="Failed to get Assessment($assessmentID)";
            return false;
        }
        Roles::RemoveOverride();
        /*******************************************************************/



        /*******************************************************************/
        $Assessment=$output["results"]["Assessment"];
        $runningAssessment=Info::AssessmentTable()->getRunningInstance($Assessment,Info::getCurrentUser());

        if($runningAssessment!=null) {
            $answerID = $runningAssessment->getAnsweredID();
        }
        else{
            $answerID=Info::AssessmentTable()->StartAssessment($Assessment);
        }


        return self::getAssessment($answerID,array(),$output);
    }

    /**
     * @param $parameters
     * @param $output
     * @return bool
     */
    public static function GetAllAssessments($parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        $parameters["AnsweringBy"]=Info::getCurrentUser()->getUserID();
        $parameters["EndTime"]=array("type"=>"IS_NULL");
        $assessments=APIHelper::QuickFetch(
            "RunningAssessmentsReport",
            $parameters,
            RunningAssessment::getColumns(),
            function($item){
                $Assessment=new Assessment();
                $Assessment->exchangeArray($item);
                $Assessment=$Assessment->getData();

                $RunningAssessment=new RunningAssessment();
                $RunningAssessment->exchangeArray($item);
                $RunningAssessment=$RunningAssessment->getData();

                $data=$RunningAssessment;
                $data["Grade"]=round(($data["EarnedPoints"]/$data["TotalPoints"])*100.0);
                $data["Assessment"]=$Assessment;
                $data["urls"]=array(
                    "view"=>"/active-assessments/{$data["AnsweredID"]}"
                );

                return $data;
            })["results"];



        /*******************************************************************/
        $output["results"]=$assessments;

        return true;


    }

    public static function SubmitAssessment($parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("AnsweredID"),$output)){
            return false;
        }

        /*******************************************************************/
        if(!self::getAssessment($parameters["AnsweredID"],array(),$tempOut)){
            $output["errors"][]="Failed to get Assessment({$parameters["AnsweredID"]})";
            return false;
        }

        /*******************************************************************/
        $Questions=$tempOut["results"]["ActiveAssessment"]["Questions"];
        $totalPoints=0;
        $earnedPoints=0;

        /*******************************************************************/
        foreach($Questions as $question){
            $totalPoints+=$question["PointsWorth"];
            $earnedPoints+=$question["IsCorrect"]?$question["PointsWorth"]:0;
        }

        /*******************************************************************/
        $sql=Info::SQL();
        $update=$sql->update("RunningAssessments")->set(
            array(
                "TotalPoints"=>$totalPoints,
                "EarnedPoints"=>$earnedPoints,
                "EndTime"=>date('Y-m-d H:i:s')))
            ->where(array(
                "AnsweredID"=>$tempOut["results"]["ActiveAssessment"]["AnsweredID"]
            ));
        $query=$sql->prepareStatementForSqlObject($update);
        $query->execute();


        return self::getAssessment($tempOut["results"]["ActiveAssessment"]["AnsweredID"],array(),$output);
    }
    public static function getAssessment($answeredID,$parameters,&$output)
    {
        MeatEater::InitializeOutput($output);

        /********************************************************************/
        /* Get the Running Assessment                                       */
        /********************************************************************/
        $RunningAssessment=Info::AssessmentTable()->getRunningAssessmentFromID($answeredID);
        if($RunningAssessment==null){
            $output["errors"][]="Assessment Not Found";
            return false;
        }

        $finalAssessment=$RunningAssessment->getData();
        $finalAssessment["EarnedPoints"]=intval($finalAssessment["EarnedPoints"]);

        /********************************************************************/
        /* Get the Assessment                                               */
        /********************************************************************/
        if(!AssessmentsMeatEater::getAssessment($RunningAssessment->getAssessmentID(),$tempData)){
            $output["errors"][]="Unable to determine Assessment for Running Assessment";
            return false;
        }


        /********************************************************************/
        $finalAssessment["Assessment"]=$tempData["results"]["Assessment"];
        $finalAssessment["Assessment"]["questions"]=APIHelper::setNewKey(
            $finalAssessment["Assessment"]["questions"],
            "QuestionID",
            true
        );



        /********************************************************************/
        if(!AnswerableQuestionsMeatEater::GetAnsweringQuestionGroup($RunningAssessment->getAnsweringGroupID(),array(),$output)){
            $output["errors"][]="Unable to get gradable item for assessment";
            return false;
        }
        $final=array(
            "AnsweredID"=>$RunningAssessment->getAnsweredID(),
            "AssessmentID"=>$finalAssessment["Assessment"]["AssessmentID"],
            "StartTime"=>true,
            "EndTime"=>true,
            "TotalPoints"=>true,
            "EarnedPoints"=>true,
            "Answered"=>true,
            "TotalQuestions"=>true,
            "Grade"=>true,
            "RelativeGrade"=>true,
            "Finished"=>true,
            "AnsweringBy"=>true,
            "GradedBy"=>true,
            "AnsweringGroupID"=>true,
            "Name"=>true,
            "URL"=>true,
            "Description"=>true,
            "Type"=>true,
            "Properties"=>true,
            "AssociatedCourseContentID"=>true,
            "Timelimit"=>true);
        $finalAssessment=array_merge($finalAssessment,$output["results"]);


//        /********************************************************************/
//        /* Get the Answered Questions                                       */
//        /********************************************************************/
//        $finalAssessment["answers"]=
//            APIHelper::QuickFetch(
//                "AnswerableQuestions",
//                array( "AnswerableGroupID"=>$RunningAssessment->getAnswerableGroupID() ),
//                array( "AnswerableGroupID"=>true ),
//                function($item){
//
//                    return $item;
//                })["results"];
//
//        $newAnswers=array();
//
//        /********************************************************************/
//        /* We will move things around since we have all the data...This make*/
//        /* The front end way easier to deal with.                           */
//        /********************************************************************/
//        foreach($finalAssessment["answers"] as $answer){
//
//            $newAnswer=$answer;
//            $questionID=$answer["QuestionID"];
//
//          //Grab the Question corresponding to this answer(Question)
//            $newAnswer["Question"]=$finalAssessment["Assessment"]["questions"][$questionID][0];
//
//            /***************************************************************/
//            /* Modify the Answer To Allow certain features to work         */
//            /***************************************************************/
//            if($newAnswer["Attempts"]>=$newAnswer["AllowedAttempts"]){
//                //unset($newAnswer["Question"]);//We dont want them to be able to render the question again...
//                                              //To answer it
//                $newAnswer["Locked"]=true;
//            }
//            else{
//                $newAnswer["Locked"]=false;
//            }
//
//            /***************************************************************/
//            $newAnswer["IsCorrect"]=$newAnswer["CorrectAnswer"]==$newAnswer["ChosenAnswer"];
//
//            $newAnswers[]=$newAnswer;
//        }
//        $answerStatus=array();
//
//        /*******************************************************************/
//        /* Build the status question                                       */
//        /*******************************************************************/
//        foreach($newAnswers as $index=>$newAnswer){
//            if($newAnswer["Locked"])
//            {
//                $answerStatus[]="LOCKED";
//                continue;
//            }
//            if($newAnswer["Attempts"]==0)
//            {
//                $answerStatus[]="UNSEEN";
//                continue;
//            }
//            $answerStatus[]="SEEN";
//        }
//
//        /*******************************************************************/
//        unset($finalAssessment["answers"]);//I want this last, visually better
//        unset($finalAssessment["Assessment"]["questions"]); //We dont need that, just needed it for the answers
//        $finalAssessment["TotalQuestions"]=count($newAnswers);
//        $finalAssessment["QuestionStatus"]=$answerStatus;
//        $finalAssessment["Questions"]=$newAnswers;


        /*******************************************************************/
        $output["results"]=array("ActiveAssessment"=>$finalAssessment);

        return true;

    }






}