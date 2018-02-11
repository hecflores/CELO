<?php
namespace Application\Service\Meat;
use Application\Info;
use Application\Model\AssessmentQuestion;
use Application\Model\Question;
use Application\Service\APIHelper;

/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/26/2017
 * Time: 10:17 PM
 */
class AssessmentsMeatEater
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

    public static function GetAllURLSForAssessment($AssessmentID){
        return array(
            "edit"=>"/assessments/$AssessmentID/edit",
            "run"=>"/assessments/$AssessmentID/run",
            "start"=>"/assessments/$AssessmentID/start",
            "submit"=>"/assessments/$AssessmentID/submit",
            "view"=>"/assessments/$AssessmentID/view",
            "add-questions"=>"/assessments/$AssessmentID/add-questions"
        );
    }
    /**
     * Will create a new assessment that is attached to some course content(CourseContentID)
     * @param array $parameters
     * @param array $output
     * * @return bool
     */
    public static function CreateNewAssessment($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("CourseContentID"),$output)){
            return false;
        }

        /*******************************************************************/
        $CourseContentID=$parameters["CourseContentID"]; //Checked for existence above


        /*******************************************************************/
        /* Get the Course Content                                          */
        /*******************************************************************/
        $CourseContent=Info::CourseContentTable()->getByID($CourseContentID);
        if($CourseContent==null)
        {
            $output["errors"][]="$CourseContentID was not found in the Course Content Table";
            return false;
        }

        /*******************************************************************/
        /* Make sure there isnt already an assessment                      */
        /*******************************************************************/
        $AssessmentFound=Info::AssessmentTable()->GetAssessmentForCourseContent($CourseContent);
        if($AssessmentFound!=null)
        {
            $output["errors"][]="Assessment as already been established for Course Content $CourseContentID";
            return false;
        }



        $AssessmentID=Info::AssessmentTable()->CreateNewAssessment(array(),$CourseContent->getContentID());

        /********************************************************************/
        if(!self::getAssessment($AssessmentID,$output))
        {
            $output["errors"][]="Somthing Faild Adding the New Assessment";
            return false;
        }
        $Assessment=$output["results"];

        /********************************************************************/
        /* First we need to add a gradable "group" of answers               */
        /********************************************************************/
        $AnswerableGroupID=Info::PerformInsert("AnswerableQuestionsGroups",array(
            "CourseContentID"=>$CourseContent->getContentID(),
            "CreatedOn"=>date('Y-m-d H:i:s'),
            "CreatedBy"=>Info::getCurrentUser()->getUserID()
        ));

        Info::PerformUpdate(
            "Assessments",
            array("AssessmentID"=>$AssessmentID),
            array("AnswerableGroupID"=>$AnswerableGroupID));




        // TODO, Need to give the Assessments table the colmn AnswerableQuestionGroup.
        // TODO Then here, update the newly created assessment with that id

        return self::getAssessment($AssessmentID,$output);
    }

    /**
 * Adds a Question to an Assessment for later grading
 * @param $parameters
 * @param $output
 * @return bool
 */
    public static function AddQuestion($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("QuestionID","AssessmentID"),$output)){
            return false;
        }

        /*******************************************************************/
        $QuestionID=$parameters["QuestionID"];
        $AssessmentID=$parameters["AssessmentID"];
        $Weight=isset($parameters["Weight"])?$parameters["Weight"]:2;

        /*******************************************************************/

        if(!self::getAssessment($AssessmentID,$temp)){
            $output["errors"][]="Assessment Not Found";
            return false;
        }
        $Assessment=$temp["results"]["Assessment"];

        if(!QuestionsMeatEater::getQuestion($QuestionID,array(),$temp)){
            $output["errors"][]="Question Not Found";
            return false;
        }
        $Question=$temp["results"];

        $answerableGroupID=$Assessment["AnswerableGroupID"];
        if(!AnswerableQuestionsMeatEater::AddAnswerableQuestion(
            array(
                "AnswerableGroupID"=>$answerableGroupID,
                "QuestionID"=>$QuestionID,
                "CorrectAnswer"=>$Question["ExpectedAnswer"],
                "PointsWorth"=>$Weight
            ),$output)) {
            $output["errors"][] = "Adding The Question Failed";
            return false;
        }
        Info::AssessmentTable()->AddQuestion($AssessmentID,$QuestionID,$Weight);

        return self::getAssessment($AssessmentID,$output);
    }
    /**
     * Will get all the assessments information for a specific course content. This information is final, everybody goes here
     * @param int $contentId
     * @param array $output
     * @return bool
     */
    public static function getAssessmentFromCourseContent($contentId, &$output)
    {
        $Assessment=Info::AssessmentTable()->GetAssessmentForCourseContent($contentId);
        if($Assessment==null){
            $output["errors"][]="Assessment Not Found";
            return false;
        }
        $id=$Assessment->getAssessmentID();

        $finalAssessment=$Assessment->getData();
        $finalAssessment["urls"]=self::GetAllURLSForAssessment($id);

        $finalAssessment["questions"]=
            APIHelper::QuickFetch(
                "AssessmentQuestionsReport",
                array( "AssessmentID"=>$id ),
                array( "AssessmentID"=>true),
                function($item){
                    $question=new Question();
                    $assessmentQuestion=new AssessmentQuestion();

                    $question->exchangeArray($item);
                    $assessmentQuestion->exchangeArray($item);

                    return array_merge($question->getData(),$assessmentQuestion->getData());

                })["results"];



        /*******************************************************************/
        $output["results"]=array("Assessment"=>$finalAssessment);

        return true;
    }

    /**
     * Will get all the assessments information. This information is final, everybody goes here
     * @param int $id
     * @param array $output
     * @return bool
     */
    public static function getAssessment($id, &$output)
    {
        $Assessment=Info::AssessmentTable()->GetAssessmentFromID($id);
        if($Assessment==null){
            $output["errors"][]="Assessment Not Found";
            return false;
        }

        $finalAssessment=$Assessment->getData();
        $finalAssessment["urls"]=self::GetAllURLSForAssessment($id);

        $finalAssessment["questions"]=
            APIHelper::QuickFetch(
                "AssessmentQuestionsReport",
                array( "AssessmentID"=>$id ),
                array( "AssessmentID"=>true),
                function($item){
                    $question=new Question();
                    $assessmentQuestion=new AssessmentQuestion();

                    $question->exchangeArray($item);
                    $assessmentQuestion->exchangeArray($item);

                    return array_merge($question->getData(),$assessmentQuestion->getData());

                })["results"];



        /*******************************************************************/
        $output["results"]=array("Assessment"=>$finalAssessment);

        return true;
    }

}