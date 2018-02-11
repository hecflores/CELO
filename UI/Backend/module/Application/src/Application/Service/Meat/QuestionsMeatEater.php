<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 4/1/2017
 * Time: 10:10 PM
 */

namespace Application\Service\Meat;


use Application\Info;
use Application\Model\AssessmentQuestion;
use Application\Model\Question;
use Application\Model\QuestionsPool;
use Application\Model\QuestionsPoolUser;
use Application\Model\QuestionType;
use Application\Model\User;
use Application\Service\APIHelper;
use QuestionUploader\PublisherQuestionUploader;

class QuestionsMeatEater
{

    private static function BuildQuestionPool(&$AllQuestionPools,&$AllQuestions, $QuestionsPoolID,&$QuestionPool,$Children,$QuestionPool_Key,$Questions_Key){
        $QuestionPool["Questions"]=isset($Questions_Key[$QuestionPool["QuestionsPoolID"]])?$Questions_Key[$QuestionPool["QuestionsPoolID"]]:[];

        $MyQuestions=$QuestionPool["Questions"];




        $AllQuestionPools[]=$QuestionPool;

        $QuestionPool["Children"]=array();
        if(isset($Children[$QuestionPool["QuestionsPoolID"]])){
            $QuestionPool["Children"]=$Children[$QuestionPool["QuestionsPoolID"]];
        }


        foreach($QuestionPool["Children"] as $ChildQuestionGroupID=>&$ChildCourseContent){

            self::BuildQuestionPool($AllQuestionPools,$MyQuestions,$ChildQuestionGroupID,$ChildCourseContent,$Children,$QuestionPool_Key,$Questions_Key);
        }
        $QuestionPool["Questions"]=$MyQuestions;

        foreach($QuestionPool["Questions"] as $index=>$question){
            $AllQuestions[]=$question;
        }
    }
    public static function GetQuestionPools($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        $QuestionPools_param=array_intersect_key($parameters,QuestionsPool::getColumns());
        $Questions_param= array_intersect_key($parameters,Question::getColumns());
        $Users_param= array_intersect_key($parameters,User::getColumns());
        $QuestionPoolUsers_param= array_intersect_key($parameters,QuestionsPoolUser::getColumns());
        $ParentQuestionPool=isset($QuestionPools_param["QuestionsPoolID"])?$QuestionPools_param["QuestionsPoolID"]:null;

        /*******************************************************************/
        Info::FancyFetch("QuestionsPoolUsers",$QuestionPoolUsers_param,QuestionsPoolUser::getColumns(),"QuestionsPoolID",$QuestionPoolUsers,$QuestionPoolUsers_WithKey,$QuestionPoolUsers_Ids);
        $UserIDs=array_keys(APIHelper::setNewKey($QuestionPoolUsers,"UserID",true,true));

        /*******************************************************************/
        Info::RemoveProperty($QuestionPools_param,"QuestionsPoolID");
        $QuestionPools_param["ParentQuestionPool"]= array("type"=>"IS_NULL", "value"=>"this");
        Info::FancyFetch("QuestionsPool",$QuestionPools_param,QuestionsPool::getColumns(),"QuestionsPoolID",$QuestionsPool,$QuestionsPool_WithKey,$QuestionsPool_Ids);


        Info::RemoveProperty($QuestionPools_param,"ParentQuestionPool");
        Info::RemoveProperty($QuestionPools_param,"QuestionsPoolID");
        Info::FancyFetch("QuestionsPool",$QuestionPools_param,QuestionsPool::getColumns(),"ParentQuestionPool",$QuestionsPool,$ParentQuestionsPool_WithKey,$ParentQuestionsPool_Ids,false);


        /*******************************************************************/
        Info::RemoveProperty($Questions_param,"QuestionsPoolID");
        Info::FancyFetch("Questions",$Questions_param,Question::getColumns(),"QuestionsPoolID",$Questions,$Questions_WithKey,$Questions_Ids,false);

        /*******************************************************************/
        $Users_param["UserID"]=array("type"=>"IN", "value"=>$UserIDs);
        Info::FancyFetch("Users",$Users_param,User::getColumns(),"UserID",$Users,$Users_WithKey,$Users_Ids);


        $AddTheseQuestionPools=array();
        $AddToTheseQuestionPools=array();


        /***************************************************/
        /* Add the User to the Question                    */
        /***************************************************/
        foreach( $Questions_WithKey as $indexQuestion=>&$Questions)
        {
            foreach( $Questions as $indexQuestion=>&$Question) {
                $json = json_decode($Question["JSONParameters"], true);
                $Question["JSONParameters"] = $json == null ? array() : $json;

                if (isset($Users_WithKey[$Question["CreatedBy"]])) {
                    $Question["CreatedBy"] = $Users_WithKey[$Question["CreatedBy"]];
                    continue;
                }
                $Question["CreatedBy"] = null;
            }
        }
        foreach($ParentQuestionsPool_WithKey as $QuestionsPoolID => &$QuestionPools)
        {
            foreach($QuestionPools as $QuestionPoolID => &$QuestionPool) {
                $QuestionPool["User"] = $Users_WithKey[$QuestionPool["UserID"]];
                Info::RemoveProperty($QuestionPool, "UserID");

                $json = json_decode($QuestionPool["Parameters"], true);
                $QuestionPool["Parameters"] = $json == null ? array() : $json;
            }
        }
        foreach($QuestionsPool_WithKey as $QuestionsPoolID => &$QuestionPool)
        {
                $QuestionPool["User"] = $Users_WithKey[$QuestionPool["UserID"]];
                Info::RemoveProperty($QuestionPool, "UserID");

                $json = json_decode($QuestionPool["Parameters"], true);
                $QuestionPool["Parameters"] = $json == null ? array() : $json;
        }
        $AllQuestionPools=array();
        $AllQuestions=array();
        foreach($QuestionsPool_WithKey as $QuestionsPoolID=>&$QuestionsPool){
            self::BuildQuestionPool($AllCourseContent,$AllQuestions,$QuestionsPoolID,$QuestionsPool,$ParentQuestionsPool_WithKey,$QuestionsPool_WithKey,$Questions_WithKey);
        }



        $output["results"]=array_values($QuestionsPool_WithKey);
        return true;

    }
    public static function CreateQuestionPool($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }


        $QuestionPools_param=array_intersect_key($parameters,QuestionsPool::getColumns());
        $QuestionPools_param["UserID"]=Info::getCurrentUser()->getUserID();

        $QuestionsPoolID=Info::PerformInsert("QuestionsPool",$QuestionPools_param);

        if(!self::UpdateUserToQuestionPool(array("QuestionsPoolID"=>$QuestionsPoolID,
                                                 "UserID"=>$QuestionPools_param["UserID"],
                                                 "Privilege"=>array("admin"=>true,"owner"=>true)),$output)){
            $output["errors"][]="Unable to add the user";
            return false;
        }

        return self::GetQuestionPools(array("QuestionsPoolID"=>$QuestionsPoolID),$output);
    }
    public static function UpdateUserToQuestionPool($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("QuestionsPoolID","UserID"),$output)){
            return false;
        }

        $QuestionPoolUsers_param=array_intersect_key($parameters,QuestionsPoolUser::getColumns());
        $QuestionPoolUsers_param["AddedOn"]=date('Y-m-d H:i:s');
        $QuestionPoolUsers_param["Privilege"]=isset($parameters["Privilege"])?
            QuestionsPoolUser::Privilege_ObjToStr($parameters["Privilege"]):"guest";


        $QuestionPoolUsersKey_param=array_intersect_key($parameters,array("QuestionsPoolID"=>true,"UserID"=>true));
        if(!Info::IsTableEmpty("QuestionsPoolUsers",$QuestionPoolUsers_param)){
            Info::PerformUpdate("QuestionsPoolUsers",$QuestionPoolUsersKey_param,$QuestionPoolUsers_param);
        }
        else{
            Info::PerformInsert("QuestionsPoolUsers",$QuestionPoolUsers_param);
        }



        return array("status"=>true);
    }
    public static function UpdateQuestionPool($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("QuestionsPoolID"),$output)){
            return false;
        }

        /*******************************************************************/
        $QuestionPools_param=array_intersect_key($parameters,QuestionsPool::getColumns());
        Info::RemoveProperty($QuestionPools_param,"UserID");
        Info::RemoveProperty($QuestionPools_param,"ParentQuestionPool");
        $Key=array_intersect_key($parameters,array("QuestionsPoolID"=>true));

        /*******************************************************************/
        Info::PerformUpdate("QuestionsPool",$Key,$QuestionPools_param);
        return self::GetQuestionPools($Key,$output);
    }

    public static function UploadQuestions($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("File"),$output)){
            return false;
        }

        $fileInfo=$parameters["File"]["tmp_name"];
        $uploader=new PublisherQuestionUploader();
        $uploader->Upload($fileInfo);
        $results=$uploader->getResults();

        $userID=Info::getCurrentUser()->getUserID();
        foreach($results as $question ){
            $saveInfo=array(
                "answers"=>$question["answers"],
                "question"=>$question["display"]
            );

            $saveInfo=array(
                "QuestionsPoolID"=>$parameters["QuestionsPoolID"],
                "QuestionType"=>"Multiple Choice",
                "Question"=>$question["question"],
                "ExpectedAnswer"=>$question["answer"],
                "CreatedBy"=>$userID,
                "JSONParameters"=>json_encode($saveInfo,JSON_FORCE_OBJECT),
                "_quick_"=>true
            );


            QuestionsMeatEater::InsertQuestion($saveInfo,$output);
        }
        return true;
    }


    public static function UpdateQuestion($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("QuestionID"),$output)){
            return false;
        }

        /*******************************************************************/
        $id=$parameters["QuestionID"];
        unset($parameters["QuestionID"]);

        /*******************************************************************/
        if(!self::getQuestion($id,array(),$output)){
            $output["errors"][]="Unable to update $id";
            return false;
        }


        if(isset($parameters["JSONParameters"])){
            if(!is_array($parameters["JSONParameters"])){
                $parameters["JSONParameters"]=json_encode($parameters["JSONParameters"],JSON_FORCE_OBJECT);
            }
        }

        /*******************************************************************/
        if(!Info::PerformUpdate("Questions",array("QuestionID"=>$id),$parameters,$output)){
            $output["errors"][]="Unable to update $id";
            return false;
        }

        /********************************************************************/
        return self::getQuestion($id,array(),$output);
    }
    public static function InsertQuestion($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(
            'QuestionsPoolID',
            'QuestionType',
            'Question',)
        ,$output)){
            return false;
        }
        $quick=isset($parameters["_quick_"])?$parameters["_quick_"]:false;
        $parameters=array_intersect_key($parameters, Question::getColumns());

        /********************************************************************/
        if(isset($parameters["QuestionID"])){
            $parameters["errors"][]="QuestionID is not allowed for adding a question";
            return false;
        }

        /********************************************************************/
        /* For Inserting                                                    */
        /********************************************************************/
        $parameters["CreatedBy"]=Info::getCurrentUser()->getUserID();
        $parameters["JSONParameters"]=isset($parameters["JSONParameters"])?$parameters["JSONParameters"]:"{\"question\":\"{$parameters["Question"]}\"}";
        if(is_array($parameters["JSONParameters"])){
            $parameters["JSONParameters"]=json_encode($parameters["JSONParameters"]);
        }
        $questionID=Info::PerformInsert("Questions",$parameters);


        /********************************************************************/
        if($quick){
            $output["results"]="success";
            return true;
        }
        return self::getQuestion($questionID,array(),$output);
    }

    public static function getQuestion($id,$parameters, &$output)
    {
        /*******************************************************************/
        if(!self::getQuestions(array("QuestionID"=>$id),$output)){
            $output["errors"][]="Unable to get the question $id";
            return false;
        }

        /*******************************************************************/
        if(count($output["results"])==0){
            $output["errors"][]="No Question found with $id";
            return false;
        }

        $output["results"]=$output["results"][0];
        return true;

    }
    public static function getQuestions($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }
        $Questions_param=array_intersect_key($parameters, Question::getColumns());

        $questions=APIHelper::QuickFetch(
            "QuestionsReport",
            $Questions_param,
            Question::getColumns(),
            function($item)
            {
                $question=new Question();
                $assessmentQuestion=new AssessmentQuestion();

                $question->exchangeArray($item);
                $assessmentQuestion->exchangeArray($item);
                $data=array_merge($question->getData(),$assessmentQuestion->getData());
                $data["Edit"]="/questions/questions/".$question->getQuestionID();
                return $data;

            })["results"];

        $output["results"]=$questions;
        return true;
    }
}