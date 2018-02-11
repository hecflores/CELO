<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/27/2017
 * Time: 6:37 AM
 */

namespace Application\Service\Meat;


use Application\Info;
use Application\Model\AnswerableQuestion;
use Application\Model\AnswerableQuestionsGroup;
use Application\Model\AnsweredQuestion;
use Application\Model\AnsweringQuestionsGroup;
use Application\Model\Course;
use Application\Model\CourseContent;
use Application\Model\Question;
use Application\Model\Section;
use Application\Model\SectionUsers;
use Application\Model\User;
use Application\Roles;
use Application\Service\APIHelper;
use Application\Service\LoginService;
use ArrayObject;
use Prophecy\Exception\Exception;

class AnswerableQuestionsMeatEater
{
    public static function AddAnswerableQuestion($parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(
            "PointsWorth",
            "CorrectAnswer",
            "QuestionID",
            "AnswerableGroupID"),$output,null,array("AllowedAttempts"=>2,"PointsWorth"=>2))){
            return false;
        }

        $parameters=array_intersect_key($parameters,array(
            "AnswerableGroupID"=>true,
            "QuestionID"=>true,
            "AllowedAttempts"=>true,
            "PointsWorth"=>true,
            "CorrectAnswer"=>true
        ));

        //final-fix Need to ensure that AllowedAttempts is being added...
        //final-fix Need to ensure that PointsWorth is being added...
        //final-fix Need to ensure that CorrectAnswer is being added...
        /*******************************************************************/
        $id=Info::PerformInsert("AnswerableQuestions",
            $parameters);

        /*******************************************************************/
        /* Grab the info we just inserted                                  */
        /*******************************************************************/
        $answer=APIHelper::QuickFetch(
            "AnswerableQuestions",
            array( "AnswerableID"=>$id ),
            array( "AnswerableID"=>true ),
            function($item){
                return $item;
            })["results"];

        /*******************************************************************/
        if(count($answer)==0){
            $output["errors"][]="Insert into the Answered Question failed.";
            return false;
        }

        /*******************************************************************/
        $output["results"]=$answer;
        return true;
    }

    public static function UpdateAnswerableQuestionGroup($id, $parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        /*******************************************************************/
        $parameters=array_intersect_key($parameters,array_merge(AnswerableQuestionsGroup::getColumns(),
            array("Questions"=>true)));

        /*******************************************************************/
        $parameters["AnswerableGroupID"] = $id;
        $parametersForAnswerableGroup=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());
        $parametersForAnswerableQuestions=array_intersect_key($parameters,AnswerableQuestion::getColumns());
        $parametersForAnsweredQuestion=array_intersect_key($parameters,AnsweredQuestion::getColumns());



        /*******************************************************************/
        /* Update Essentials                                               */
        /*******************************************************************/
        Info::PerformUpdate("AnswerableQuestionsGroups",array("AnswerableGroupID"=>$id),$parametersForAnswerableGroup);

        if(isset($parameters["Questions"])){
            /***************************************************************/
            /* Get The Current Answerable Questions                        */
            /***************************************************************/
            Info::FancyFetch("AnswerableQuestions",$parametersForAnswerableQuestions,AnswerableQuestion::getColumns(),"QuestionID",$AnswerableQuestions,$AnswerableQuestions_WithKey,$AnswerableQuestionsIDs,true);

            /***************************************************************/
            /* Prep                                                        */
            /***************************************************************/
            $OldQuestions_WithKeys=$AnswerableQuestions_WithKey;
            $NewQuestions_WithKeys=APIHelper::setNewKey($parameters["Questions"],"QuestionID",true,true);


            $QuestionsToDelete = array_values(array_diff_key($OldQuestions_WithKeys,$NewQuestions_WithKeys)); // Gives the Items Old has but New Doesn't
            $QuestionsToAdd    = array_values(array_diff_key($NewQuestions_WithKeys,$OldQuestions_WithKeys)); // Gives the Items New has but Old Doesn't

            $QuestionsToDelete_WithKey = APIHelper::setNewKey($QuestionsToDelete,"AnswerableID",true,true);
            $QuestionsToAdd_WithKey    = APIHelper::setNewKey($QuestionsToAdd,"QuestionID",true,true);

            $QuestionsToDeleteIds=array_keys($QuestionsToDelete_WithKey);
            $QuestionsToAddIds=array_keys($QuestionsToAdd_WithKey);

            if(count($QuestionsToDeleteIds)>0) {
                /***********************************************************/
                /* Get Answered Questions About to Delete                  */
                /***********************************************************/
                $parametersForAnsweredQuestion["AnswerableID"] = array("type" => "IN", "value" => $QuestionsToDeleteIds);
                Info::FancyFetch("AnswerableQuestions", $parametersForAnsweredQuestion, AnsweredQuestion::getColumns(), "AnswerableID", $AnswerableQuestions, $AnswerableQuestions_WithKey, $AnswerableQuestionsIDs, true);

                /***********************************************************/
                /* Delete Answered Questions                               */
                /***********************************************************/
                $DeletedAnsweredQuestions = false;
                if (count($AnswerableQuestions) != 0) {
                    Info::PerformDelete("AnsweredQuestions", $parametersForAnsweredQuestion, AnsweredQuestion::getColumns());
                    $DeletedAnsweredQuestions = true;
                }

                /***********************************************************/
                /* Delete Answerable Questions                             */
                /***********************************************************/
                $parametersForAnswerableQuestions["AnswerableID"] = array("type" => "IN", "value" => $QuestionsToDeleteIds);
                Info::PerformDelete("AnswerableQuestions", $parametersForAnswerableQuestions, AnswerableQuestion::getColumns());



            }
            $QuestionIds=array_keys($QuestionsToAdd_WithKey);

            /*******************************************************************/
            /* Questions Questions                                            */
            /*******************************************************************/
            $Questions_params["QuestionID"]=array( "type"=>"IN", "value"=>$QuestionIds );
            Info::FancyFetch("Questions",$Questions_params,Question::getColumns(),array("QuestionID"),$Questions,$Questions_WithKey,$QuestionsIDs);

            $QuestionsToAdd=array_map(function($input) use($Questions_WithKey,$id){
                $Question=$Questions_WithKey[$input["QuestionID"]];

                return array("PointsWorth"=>2,
                             "CorrectAnswer"=>$Question["ExpectedAnswer"],
                             "QuestionID"=>$input["QuestionID"],
                             "AnswerableGroupID"=>$id);

            },$QuestionsToAdd);
            /***********************************************************/
            /* Add Answerable Questions                                */
            /***********************************************************/
            foreach($QuestionsToAdd as $id=>$value){


                AnswerableQuestionsMeatEater::AddAnswerableQuestion($value,$output);
            }


        }

        $output["results"]=array("status"=>"true");
        return true;




    }

    public static function GetCurrentAnsweringGroupForAnswerableGroup($id, $parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }
        $parameters["AnswerableGroupID"]=$id;
        $parameters["FinishedOn"]=array("type"=>"IS_NULL", "value"=>"FinishedOn");

        /*******************************************************************/
        if(!self::GetAllAnswerableQuestionGroupsWithAnsweringSubmissions($parameters,$output)){
            $output["errors"][]="Couldnt get the Answering Group";
            return false;
        }

        /*******************************************************************/
        if(count($output["results"])!=1){
            $output["errors"][]="Couldnt find any of the Answering Groups";
            return false;
        }

        /*******************************************************************/
        if(count($output["results"][0]["Submissions"])==0){
            $output["results"]=null;
            return true;
        }
        $Final=$output["results"][0]["Submissions"][0];

        $answerStatus=array();
        foreach($Final["Questions"] as $index=>$Question){


//            if($Question["Attempts"] $Question["Locked"])
//            {
//                $answerStatus[]="LOCKED";
//
//                continue;
//            }


            if($Question["Attempts"]==0)
            {

                $answerStatus[]="UNSEEN";
                continue;
            }
            $answerStatus[]="SEEN";
        }
        $Final["QuestionStatus"]=$answerStatus;
        $output["results"]=$Final;
        return true;

    }
    public static function FinishAnsweringGroup($id, $parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        /*******************************************************************/
        $parameters["FinishedOn"]=date('Y-m-d H:i:s');
        $parametersForAnswerableItems=array(  "FinishedOn"=>date('Y-m-d H:i:s'),"AnsweringGroupID"=>$id );
        $key=array_intersect_key($parametersForAnswerableItems,array("AnsweringGroupID"=>true));

        /*******************************************************************/
        if(Info::IsTableEmpty("AnsweringQuestionsGroup",$key)){
            $output["errors"][]="Answering Question Group {$key["AnsweringGroupID"]} doesnt exists";
            return false;
        }

        /*******************************************************************/
        Info::PerformUpdate("AnsweringQuestionsGroup",$key,$parametersForAnswerableItems);

        /*******************************************************************/
        $output["results"]=array("status"=>"success");
        return true;
    }
    public static function CreateNewAnsweringQuestionGroup($id, $parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        $parameters["AnswerableGroupID"]=$id;
        $parameters["StartOn"]=date('Y-m-d H:i:s');
        $parameters["StartedBy"]=Info::getCurrentUser()->getUserID();
        $parametersForAnswerableItems=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());
        $parametersForAnsweringItems=array_intersect_key($parameters,AnsweringQuestionsGroup::getColumns());



        /*******************************************************************/
        /* Get the Answerable Item                                         */
        /*******************************************************************/
        Info::FancyFetch("AnswerableQuestionsGroups",$parametersForAnswerableItems,AnswerableQuestionsGroup::getColumns(),"AnswerableGroupID",$AnswerableQuestionsGroups,$AnswerableQuestionsGroups_WithKey,$AnswerableQuestionsGroupsIDs);

        /*******************************************************************/
        if(count($AnswerableQuestionsGroups)==0){
            throw new \Exception("Expecting The Answerable {$parametersForAnswerableItems['AnswerableID']} to exists. Not the case...");
        }

        /*******************************************************************/
        $AnsweringItemID=Info::PerformInsert("AnsweringQuestionsGroup",$parametersForAnsweringItems);

        $output["results"]=array("status"=>"success", "AnsweringGroupID"=>$AnsweringItemID);
        return true;


    }
    public static function CreateNewAnswerableQuestionGroup($parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("CourseContentID"),$output)){
            return false;
        }
        $parameters["CreatedBy"]=Info::getCurrentUser()->getUserID();
        $parameters["CreatedOn"]=date('Y-m-d H:i:s');

        $answerableQuestionGroupParameters=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());

        /*******************************************************************/
        $AnswerableGroupID=Info::PerformInsert("AnswerableQuestionsGroups",$answerableQuestionGroupParameters);

        /*******************************************************************/
        return self::GetAnswerableQuestionsGroup($AnswerableGroupID,array(),$output);
    }

    public static function GetAllAnswerableQuestionGroupsWithAnsweringSubmissions($parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        if(Info::LoginService()->IsAuthorized(Roles::$STUDENT)){
            $parameters["UHID"]=Info::getCurrentUser()->getUHID();
        }

        $SectionUsers_params= array_intersect_key($parameters,SectionUsers::getColumns());
        $User_params = array_intersect_key($parameters,User::getColumns());
        $Section_params=array_intersect_key($parameters,Section::getColumns());
        $Course_params=array_intersect_key($parameters,Course::getColumns());
        $CourseContent_params=array_intersect_key($parameters,CourseContent::getColumns());
        $AnsweringQuestionGroups_params=array_intersect_key($parameters,AnsweringQuestionsGroup::getColumns());
        $AnswerableQuestionGroups_params=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());
        $AnsweredQuestions_params=array_intersect_key($parameters,AnsweredQuestion::getColumns());
        $AnswerableQuestions_params=array_intersect_key($parameters,AnswerableQuestion::getColumns());
        $Questions_params=array_intersect_key($parameters,Question::getColumns());




        /*******************************************************************/
        /* Users                                                           */
        /*******************************************************************/
        Info::FancyFetch("Users",$User_params,Course::getColumns(),"UserID",$Users,$Users_WithKey,$UsersIDs);

        /*******************************************************************/
        /* Users                                                           */
        /*******************************************************************/
        /* $SectionUsers_params["UserID"]=array( "type"=>"IN",  "value"=>$UsersIDs ); */
        Info::FancyFetch("SectionUsers",$SectionUsers_params,SectionUsers::getColumns(),array("SectionID","UHID"),$SectionUsers,$SectionUsers_WithKey,$SectionUsersIDs);
        $SectionUsers_Users_WithKey=$SectionUsers_WithKey["UHID"];

        $SectionUsers_WithKey=$SectionUsers_WithKey["SectionID"];
        $SectionUsersIDs=$SectionUsersIDs["SectionID"];




        /*******************************************************************/
        /* Sections                                                        */
        /*******************************************************************/
        $Section_params["SectionID"]=array( "type"=>"IN",  "value"=>$SectionUsersIDs );
        Info::FancyFetch("Sections",$Section_params,Section::getColumns(),array("SectionID", "CourseUniqueID"),$Sections,$Sections_WithKey,$SectionIDs);
        $CourseUniqueIDs=$SectionIDs["CourseUniqueID"];

        $Sections_WithKey=$Sections_WithKey["SectionID"];
        $SectionIDs=$SectionIDs["SectionID"];

        /*******************************************************************/
        /* Courses                                                         */
        /*******************************************************************/
        $Course_params["CourseUniqueID"]=array( "type"=>"IN",  "value"=>$CourseUniqueIDs );
        Info::FancyFetch("Courses",$Course_params,Course::getColumns(),"CourseUniqueID",$Courses,$Courses_WithKey,$CourseIDs);

        /*******************************************************************/
        /* Course Content                                                  */
        /*******************************************************************/
        $CourseContent_params["SectionID"]=array( "type"=>"IN", "value"=>$SectionIDs );
        Info::FancyFetch("CourseContent",$CourseContent_params,CourseContent::getColumns(),array("ContentID","ParentFolderID"),$CourseContents,$CourseContents_WithKey,$CourseContentIDs);

        $CourseContentParents_WithKey=$CourseContents_WithKey["ParentFolderID"];
        $CourseContentParentsIDs=$CourseContentIDs["ParentFolderID"];

        $CourseContents_WithKey=$CourseContents_WithKey["ContentID"];
        $CourseContentIDs=$CourseContentIDs["ContentID"];

        /*******************************************************************/
        /* Parent Course Content                                           */
        /*******************************************************************/
        $CourseContent_params["ContentID"]=array( "type"=>"IN", "value"=>$CourseContentParentsIDs );
        Info::FancyFetch("CourseContent",$CourseContent_params,CourseContent::getColumns(),"ContentID",$ParentCourseContents,$ParentCourseContents_WithKey,$ParentCourseContentIDs);

        /*******************************************************************/
        /* Answerable Question Groups                                      */
        /*******************************************************************/
        $AnswerableQuestionGroups_params["CourseContentID"]=array( "type"=>"IN", "value"=>$CourseContentIDs );
        Info::FancyFetch("AnswerableQuestionsGroups",$AnswerableQuestionGroups_params,AnswerableQuestionsGroup::getColumns(),"AnswerableGroupID",$AnswerableQuestionGroups,$AnswerableQuestionGroups_WithKey,$AnswerableQuestionGroupsIDs);

        /*******************************************************************/
        /* Answering Question Groups                                       */
        /*******************************************************************/
        $AnsweringQuestionGroups_params["AnswerableGroupID"]=array( "type"=>"IN", "value"=>$AnswerableQuestionGroupsIDs );
        Info::FancyFetch("AnsweringQuestionsGroup",$AnsweringQuestionGroups_params,AnsweringQuestionsGroup::getColumns(),"AnsweringGroupID",$AnsweringQuestionGroups,$AnsweringQuestionGroups_WithKey,$AnsweringQuestionGroupsIDs);


        /*******************************************************************/
        /* Answerable Questions                                            */
        /*******************************************************************/
        $AnswerableQuestions_params["AnswerableGroupID"]=$AnswerableQuestionGroupsIDs;
        Info::FancyFetch("AnswerableQuestions",$AnswerableQuestions_params,AnswerableQuestion::getColumns(),array("AnswerableGroupID","AnswerableID"),$AnswerableQuestions,$AnswerableQuestions_WithKey,$AnswerableQuestionsIDs,false,true);
        $AnswerableQuestionsWithQuestionsAsKey=APIHelper::setNewKey($AnswerableQuestions,"QuestionID",true);
        $AnswerableQuestionsWithQuestionsAsKeyIDs=array_keys($AnswerableQuestionsWithQuestionsAsKey);

        /*******************************************************************/
        /* Questions Questions                                            */
        /*******************************************************************/
        $Questions_params["QuestionID"]=array( "type"=>"IN", "value"=>$AnswerableQuestionsWithQuestionsAsKeyIDs );
        Info::FancyFetch("Questions",$Questions_params,AnswerableQuestion::getColumns(),array("QuestionID"),$Questions,$Questions_WithKey,$QuestionsIDs);

        /*******************************************************************/
        /* Answered Questions                                              */
        /*******************************************************************/
        $AnsweredQuestions_params["AnswerableID"]=$AnswerableQuestionsIDs;
        $AnsweredQuestions_params["AnsweringGroupID"]=$AnsweringQuestionGroupsIDs;
        Info::FancyFetch("AnsweredQuestions",$AnsweredQuestions_params,AnsweredQuestion::getColumns(),array("AnsweringGroupID","AnswerableID"),$AnsweredQuestions,$AnsweredQuestions_WithKey,$AnsweredQuestionsIDs,false,true);

        $_=function($data,$key,$defaultData=null){

            if(!is_array($data)){
                return $defaultData;
            }


            if(!isset($data[$key])){
                return $defaultData;
            }
            return $data[$key];
        };

        /*******************************************************************/
        /* Calculate the Grades                                            */
        /*******************************************************************/
        foreach($AnsweringQuestionGroups_WithKey as $AnsweringGroupID => $AnsweringQuestionGroup)
        {
            $TotalQuestions=0;
            $FinishedQuestions=0;
            $EarnedPoints=0;
            $TotalPoints=0;

            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["Questions"]=array();
            /***************************************************************/
            foreach($_($AnswerableQuestions_WithKey,$AnsweringQuestionGroup["AnswerableGroupID"],array()) as $AnswerableID=>$AnswerableQuestion)
            {
                $AnswerableQuestion=$AnswerableQuestion[0];
                $Question=$_($Questions_WithKey,$_($AnswerableQuestion,"QuestionID"));

                /***********************************************************/
                $AnsweredQuestion=$_($_($_($AnsweredQuestions_WithKey,$AnsweringGroupID),$AnswerableID),0);

                /***********************************************************/
                $CorrectAnswer=$_($Question,"ExpectedAnswer");
                $ChosenAnswer=$_($AnsweredQuestion,"ChosenAnswer");

                /***********************************************************/
                $IsCorrect=$ChosenAnswer==$CorrectAnswer;

                /***********************************************************/
                $TotalPoints+=$_($AnswerableQuestion,"PointsWorth",null);
                $EarnedPoints+=$IsCorrect?$_($AnswerableQuestion,"PointsWorth",null):0;
                $TotalQuestions++;
                $FinishedQuestions+=$AnsweredQuestion==null?0:1;

                /***********************************************************/
                /* Fix The Question                                        */
                /***********************************************************/
                $Question=array_merge($AnswerableQuestion,$Question);
                $Question["AnsweringGroupID"]=$AnsweringGroupID;
                /***********************************************************/
                unset($Question["SrcDirectory"]);

                /***********************************************************/
                $Question["Attempts"]=0;
                $Question["HasAnswer"]=false;
                if($AnsweredQuestion!=null){
                    $Question["HasAnswer"]=true;
                    $Question=array_merge($Question,$AnsweredQuestion);
                }

                /***********************************************************/
                unset($Question["ExpectedAnswer"]);
                if(!Info::LoginService()->IsAuthorized(Roles::$STAFF)){
                    unset($Question["CorrectAnswer"]);
                }

                /***********************************************************/
                try{
                    $Question["JSONParameters"]=json_decode($Question["JSONParameters"],JSON_FORCE_OBJECT);
                }
                catch(\Exception $e){
                    $Question["JSONParameters"]=array();
                }

                /***********************************************************/
                $Question["Locked"]=false;
                if($Question["Attempts"]>=$Question["AllowedAttempts"]){
                    $Question["Locked"]=true;
                }

                $Question["IsCorrect"]=$IsCorrect;



                $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["Questions"][]=$Question;
            }
            $PercentDone=$TotalQuestions==0?0:($FinishedQuestions/$TotalQuestions)*100.0;
            $Grade      =$TotalPoints==0?0:($EarnedPoints/$TotalPoints)*100.0;

            /***************************************************************/
            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["TotalQuestions"]=$TotalQuestions;
            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["FinishedQuestions"]=$FinishedQuestions;
            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["EarnedPoints"]=$EarnedPoints;
            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["TotalPoints"]=$TotalPoints;
            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["PercentDone"]=$PercentDone;
            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["Finished"]=$PercentDone;

            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["Grade"]=$Grade;
            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["StartedBy"]=$_($Users_WithKey,$AnsweringQuestionGroup["StartedBy"]);
            $AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["UserID"]=$AnsweringQuestionGroup["StartedBy"];

            /***************************************************************/
            /* Remove Unauthorized Entries                                 */
            /***************************************************************/
            if($AnsweringQuestionGroups_WithKey[$AnsweringGroupID]["StartedBy"]==null){
                unset($AnsweringQuestionGroups_WithKey[$AnsweringGroupID]);
            }

        }

        // Do this when finished...
        $AnsweringQuestions_AnswerableGroupIDAsKey=APIHelper::setNewKey(array_values($AnsweringQuestionGroups_WithKey),"AnswerableGroupID",true,false);


        $Final=[];

        //Loop Through AnswerableQuestionsGroups
        foreach($AnswerableQuestionGroups_WithKey as $AnswerableGroupID => $AnswerableQuestionGroup)
        {
            $CourseContent=false;
            $Section = false;
            $Course = false;
            if(isset($CourseContents_WithKey[$AnswerableQuestionGroup["CourseContentID"]])){
                $CourseContent=$CourseContents_WithKey[$AnswerableQuestionGroup["CourseContentID"]];
            }

            if($CourseContent && isset($Sections_WithKey[$CourseContent["SectionID"]])){
                $Section=$Sections_WithKey[$CourseContent["SectionID"]];
            }

            if($Section && isset($Courses_WithKey[$Section["CourseUniqueID"]])){
                $Course=$Courses_WithKey[$Section["CourseUniqueID"]];
            }

            $GradesRelativeToGradeID=$_($AnsweringQuestions_AnswerableGroupIDAsKey,$AnswerableGroupID,array());
            $AnswerableQuestionGroup["Grade"]=0;
            foreach($GradesRelativeToGradeID as $key => $submission){
                $AnswerableQuestionGroup["Grade"]=max($submission["Grade"],$AnswerableQuestionGroup["Grade"]);
                $GradesRelativeToGradeID[$key]["CourseContent"]=$CourseContent;
            }

            /***************************************************************/

            $GradesRelativeToUser=APIHelper::setNewKey($GradesRelativeToGradeID,"UserID",false);
            foreach($GradesRelativeToUser as $userID => $items){

                $finalItem=array(
                    "User"=>$Users_WithKey[$userID],
                    "Submissions"=>$items
                );
                $finalItem["Grade"]=0;
                foreach($items as $key => $item){
                    $finalItem["Grade"]=max($item["Grade"],$finalItem["Grade"]);
                }
                $GradesRelativeToUser[$userID]=$finalItem;
            }


            foreach($Users_WithKey as $UserID => $User){

                if(($_($Sections_WithKey,$_($_($SectionUsers_Users_WithKey,$_($User,"UHID")),"SectionID")))==null){
                    continue;
                }
                if($User["Role"]!="Student"){
                    continue;
                }
                if(!isset($GradesRelativeToUser[$UserID])){
                    $GradesRelativeToUser[$UserID]=array(
                        "User"=>$User,
                        "Submissions"=>array()
                    );
                }
            }

            $CourseContent["HasSubmission"]=count($GradesRelativeToGradeID);


            $Object=$AnswerableQuestionGroup;
            $Object["CourseContent"]=$CourseContent;
            $Object["Section"]=$Section;
            $Object["Course"]=$Course;
            $Object["Submissions"]=$GradesRelativeToGradeID;
            if(Info::LoginService()->IsAuthorized(Roles::$STAFF)){
                $Object["UserSubmissions"]=$GradesRelativeToUser;
            }


            $Final[]=$Object;
        }

        $output["results"]=$Final;
        return true;

        /*******************************************************************/
        /* Course Content                                                  */
        /*******************************************************************/
        $CourseContent_params["SectionID"]=array(
            "type"=>"IN",
            "value"=>$SectionIDs
        );
        $CourseContents=APIHelper::QuickFetch(
            "CourseContent",
            $CourseContent_params,
            CourseContent::getColumns(),
            function($data){
                return $data->getArrayCopy();
            }
        )["results"];
        $CourseContents_WithKey=APIHelper::setNewKey($CourseContents,"ContentID",true,true);
        $CourseContents=array_keys($CourseContents_WithKey);






        $final=
            array(
                "AnswerableGroupID"=>true,
                "CreatedOn"=>true,
                "CreatedBy"=>true,
                "SectionID"=>true,
                "UserID"=>true,
                "Category"=>true,
                "CourseContentID"=>true,
                "Description"=>true,
                "SetGrade"=>true,
                "Grade"=>true,
                "PointsEarned"=>true,
                "PointsWort"=>true,
                "Course_CourseUniqueID"=>true,
                "Course_CourseName"=>true,
                "Course_CourseCategory"=>true,
                "Course_Setup"=>true,
                "Course_CourseID"=>true,
                "Course_Description"=>true,
                "Course_CourseStatus"=>true,
                "Section_SectionID"=>true,
                "Section_SectionNumber"=>true,
                "Section_StartDate"=>true,
                "Section_EndDate"=>true,
                "Section_Location"=>true,
                "Section_TextBookInformation"=>true,
                "Section_MainCourseContentID"=>true,
                "Section_CreatedBy"=>true,
                "SectionUsers_AssignedBy"=>true,
                "User_UserID"=>true,
                "User_FirstName"=>true,
                "User_LastName"=>true,
                "User_Email"=>true,
                "User_PhoneNumber"=>true,
                "User_UserName"=>true,
                "CUser_Role"=>true,
                "User_UHID"=>true,
                "User_isActive"=>true,
                "CourseContent_ContentID"=>true,
                "CourseContent_CourseContentNumber"=>true,
                "CourseContent_SectionID"=>true,
                "CourseContent_Name"=>true,
                "CourseContent_URL"=>true,
                "CourseContent_Description"=>true,
                "CourseContent_ParentFolderID"=>true,
                "CourseContent_RootContentID"=>true,
                "CourseContent_Depth"=>true,
                "CourseContent_Type"=>true,
                "CourseContent_Properties"=>true,
                "CourseContent_Gradable"=>true,
                "CourseContent_CreatedBy"=>true,
                "CourseContent_RolesVisible"=>true);





        return true;



    }
    public static function GetAnsweringQuestionGroup($id, $parameters, &$output)
    {
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        if(!self::GetAllAnswerableQuestionGroupsWithAnsweringSubmissions(array("AnsweringGroupID"=>$id),$output)){
            $output["errors"][]="Getting the Answerable Questions Group Failed";
            return false;
        }

        /*******************************************************************/
        /* Build the status question                                       */
        /*******************************************************************/
        $ifAnsweredAllRight=0;
        $numFinished=0;
        $numNotFinished=0;
        $totalPoints=0;
        $earnedPoints=0;
        foreach($newAnswers as $index=>$newAnswer){
            $totalPoints+=($newAnswer["PointsWorth"]);

            if($newAnswer["Locked"])
            {
                $answerStatus[]="LOCKED";
                $numFinished++;
                if($newAnswer["IsCorrect"]) {
                    $earnedPoints += ($newAnswer["PointsWorth"]);
                }
                continue;
            }


            if($newAnswer["Attempts"]==0)
            {
                $numNotFinished++;
                $answerStatus[]="UNSEEN";
                $ifAnsweredAllRight+=$newAnswer["PointsWorth"];
                continue;
            }
            $numFinished++;
            $answerStatus[]="SEEN";
        }

        if($numFinished+$numNotFinished==0){
            $gradableGroup["Finished"]=0;
            $gradableGroup["RelativeGrade"]=0;
            $gradableGroup["MaxPossibleScore"]=0;
            $gradableGroup["AveragePossibleScore"]=0;
            $gradableGroup["MinPossibleScore"]=0;
        }
        else {
            $gradableGroup["Finished"] = ($numFinished / ($numFinished + $numNotFinished)) * 100;
            $gradableGroup["RelativeGrade"] = ((($earnedPoints) + $ifAnsweredAllRight) / ($totalPoints)) * 100;

            $gradableGroup["MaxPossibleScore"] = ((($earnedPoints) + $ifAnsweredAllRight) / ($totalPoints)) * 100;
            $gradableGroup["AveragePossibleScore"] = ((($earnedPoints) + ($ifAnsweredAllRight * .5)) / ($totalPoints)) * 100;
            $gradableGroup["MinPossibleScore"] = ((($earnedPoints) + ($ifAnsweredAllRight * 0)) / ($totalPoints)) * 100;
        }


        /*******************************************************************/
        $gradableGroup["TotalQuestions"]=count($newAnswers);
        $gradableGroup["QuestionStatus"]=$answerStatus;
        $gradableGroup["Questions"]=$newAnswers;

        /*******************************************************************/
        $output["results"]=$gradableGroup;
        return true;

    }

    public static function GetAnswerableQuestionsGroup($id, $parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        /*******************************************************************/
        $parameters["AnswerableGroupID"]=$id;
        $AnswerableQuestionsGroups_params=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());

        /*******************************************************************/
        /* Answerable Questions Groups                                     */
        /*******************************************************************/
        Info::FancyFetch("AnswerableQuestionsGroups",$AnswerableQuestionsGroups_params,AnswerableQuestionsGroup::getColumns(),"AnswerableGroupID",$AnswerableQuestionsGroups,$AnswerableQuestionsGroups_WithKey,$AnswerableQuestionsGroupsIDs,true);



        /*******************************************************************/
        if(count($AnswerableQuestionsGroups)!=1){
            $output["results"]=null;
            return true;
        }

        /*******************************************************************/
        if(!self::getAnswerableQuestions($AnswerableQuestionsGroups_params,$output)){
            $output["errors"][]="Unable to get the Answerable Questions";
            return false;
        }

        /*******************************************************************/
        $AnswerableQuestionsGroup=$AnswerableQuestionsGroups[0];
        $AnswerableQuestionsGroup["Questions"]=$output["results"];
        $output["results"]=$AnswerableQuestionsGroup;
        return true;


    }
    public static function GetGradableItem($id, $parameters, &$output)
    {

        $answerableGroupID=Info::PerformGet("AnsweringQuestionsGroup",array(
            "AnsweringGroupID"=>$id
        ),null,function($data){
            return $data["AnswerableGroupID"];
        });

        if(count($answerableGroupID)==0){
            return null;
        }
        $parameters["AnsweringGroupID"]=$id;
        return self::GetGradableItem($answerableGroupID[0],$parameters ,$output);
    }



    /**
     * @param $id
     * @param $parameters
     * @param $output
     * @return bool
     */
        public static function AnswerAQuestion($id,$parameters, &$output){
            /*******************************************************************/
            /* Check Variables                                                 */
            /*******************************************************************/
            MeatEater::InitializeOutput($output);
            if(!MeatEater::CheckParameters($parameters,array("html","answer","AnswerableGroupID"),$output)){
                return false;
            }

            /*******************************************************************/
            $AnsweredHTML=$parameters["html"];
            $Answer=$parameters["answer"];
            $AnswerableID=$id;

            /*******************************************************************/
            $parameters["AnswerableID"]=$id;


            $AnsweringQuestionGroup_param=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());

            /*******************************************************************/
            /* Check for Running Answering Group                               */
            /*******************************************************************/
            $AnsweringQuestionGroup_param["FinishedOn"]=array("type"=>"IS_NULL","value"=>"FinishedOn");
            $AnsweringQuestionGroup_param["StartedBy"]=Info::getCurrentUser()->getUserID();
            Info::FancyFetch("AnsweringQuestionsGroup",$AnsweringQuestionGroup_param,AnswerableQuestionsGroup::getColumns(),"AnsweringGroupID",$AnsweringQuestionsGroup,$AnsweringQuestionsGroup_Key,$AnsweringQuestionsGroupIDs);
            if(count($AnsweringQuestionsGroupIDs)==0){
                if(!self::CreateNewAnsweringQuestionGroup($parameters['AnswerableGroupID'],array(),$output)){
                    $output["errors"][]="Unkown Reason for this...";
                    return false;
                }

                $AnsweringQuestionsGroupIDs=array($output["results"]["AnsweringGroupID"]);
            }
            $parameters["AnsweringGroupID"]=$AnsweringQuestionsGroupIDs[0];




            $AnsweredQuestions_param=array_intersect_key($parameters,AnsweredQuestion::getColumns());
            $AnsweredQuestions_key=array_intersect_key($parameters,array("AnswerableID"=>true,"AnsweringGroupID"=>true));
            $AnswerableQuestion_param=array_intersect_key($parameters,AnswerableQuestion::getColumns());
            $AnsweringQuestionGroup_param=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());

            $AnsweredQuestions_key["AnsweringGroupID"]=$parameters["AnsweringGroupID"];
            Info::FancyFetch("AnsweredQuestions",$AnsweredQuestions_key,AnsweredQuestion::getColumns(),"AnswerableID",$AnsweredQuestions,$AnsweredQuestions_Key,$AnsweredQuestionsIDs);
            Info::FancyFetch("AnswerableQuestions",$AnswerableQuestion_param,AnsweredQuestion::getColumns(),"AnswerableID",$AnswerableQuestions,$AnswerableQuestions_Key,$AnswerableQuestionsIDs);


            if(count($AnsweredQuestionsIDs)==0){
                Info::PerformInsert("AnsweredQuestions",array_merge($AnsweredQuestions_param,
                    array(
                        "AnsweredHTML"=>$AnsweredHTML,
                        "ChosenAnswer"=>$Answer,
                        "Attempts"=>1
                    )));
            }
            else{
                Info::PerformUpdate("AnsweredQuestions",$AnsweredQuestions_key,array_merge($AnsweredQuestions_param,
                    array(
                        "AnsweredHTML"=>$AnsweredHTML,
                        "ChosenAnswer"=>$Answer,
                        "Attempts"=>intval($AnsweredQuestions[0]["Attempts"])+1
                    )));
            }

            Info::FancyFetch("AnsweredQuestions",$AnsweredQuestions_key,AnsweredQuestion::getColumns(),"AnswerableID",$AnsweredQuestions,$AnsweredQuestions_Key,$AnsweredQuestionsIDs);
            if(count($AnswerableQuestions)==0){
                $output["results"][]="Unable to update the question";
                return false;
            }

            /*******************************************************************/
            $output["results"]=$AnswerableQuestions[0];
            return true;
        }

    public static function getAnswerableQuestions($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("AnswerableGroupID"),$output)){
            return false;
        }
        $parameters=array_intersect_key($parameters,AnswerableQuestion::getColumns());
        $AnswerableQuestions_param=array_intersect_key($parameters,AnswerableQuestion::getColumns());
        $Question_params=array_intersect_key($parameters,Question::getColumns());

        /*******************************************************************/
        Info::FancyFetch("AnswerableQuestions",$AnswerableQuestions_param,AnswerableQuestion::getColumns(),"AnswerableID",$AnswerableQuestions,$AnswerableQuestions_Key,$AnswerableQuestionsIDs,false);
        $Questions_Key=APIHelper::setNewKey($AnswerableQuestions,"QuestionID");
        $QuestionIDs=array_keys($Questions_Key);

        /*******************************************************************/
        /* Questions                                                       */
        /*******************************************************************/
        $Question_params["QuestionID"]=array("type"=>"IN","value"=>$QuestionIDs);
        Info::FancyFetch("Questions",$Question_params,Question::getColumns(),"QuestionID",$Questions,$Questions_Key,$QuestionIDs,true);

        $AnswerableQuestions=array_map(function($AnswerableQuestion) use ($Questions_Key){

            $Question=$Questions_Key[$AnswerableQuestion["QuestionID"]];

            /***********************************************************/
            /* Fix The Question                                        */
            /***********************************************************/
            $Question=array_merge($AnswerableQuestion,$Question);

            /***********************************************************/
            unset($Question["SrcDirectory"]);

            /***********************************************************/
            $Question["Attempts"]=0;


            /***********************************************************/
            unset($Question["ExpectedAnswer"]);
            if(!Info::LoginService()->IsAuthorized(Roles::$STAFF)){
                unset($Question["CorrectAnswer"]);
            }

            /***********************************************************/
            try{
                $Question["JSONParameters"]=json_decode($Question["JSONParameters"],JSON_FORCE_OBJECT);
            }
            catch(\Exception $e){
                $Question["JSONParameters"]=array();
            }

            /***********************************************************/
            $Question["Locked"]=false;
            if($Question["Attempts"]>=$Question["AllowedAttempts"]){
                $Question["Locked"]=true;
            }

            $Question["IsCorrect"]=false;
            $Question["HasAnswer"]=false;



            return $Question;
        },$AnswerableQuestions);
        /*******************************************************************/
        $output["results"]=$AnswerableQuestions;
        return true;

    }
    public static function getAnsweredQuestion($id,$parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        /*******************************************************************/
        $parameters["AnswerableID"]=$id;
        if(!self::GetAnsweringQuestionsGroupQuestions($parameters,$output)){
            $output["errors"][]="Unable to get the Answered Question $id";
            return false;
        }

        /*******************************************************************/
        if(count($output["results"])==0){
            $output["errors"][]="No Answered Question with id $id";
            return false;
        }

        /*******************************************************************/
        $output["results"]=$output["results"][0];
        return true;

    }
    public static function GetAnsweringQuestionsGroupQuestions($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("AnsweringGroupID"),$output, AnsweringQuestionsGroup::getColumns())){
            return false;
        }

        $parameters["UserID"]=Info::getCurrentUser()->getUserID();

        /*******************************************************************/
        /* Get Answered Questions                                          */
        /*******************************************************************/
        $AnsweredQuestions_params=array_intersect_key($parameters,AnsweredQuestion::getColumns());
        $AnswerableQuestions_params=array_intersect_key($parameters,AnswerableQuestion::getColumns());
        $AnsweringQuestionsGroup_params=array_intersect_key($parameters,AnsweringQuestionsGroup::getColumns());
        $AnswerableQuestionsGroups_params=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());
        $Questions_params=array_intersect_key($parameters,Question::getColumns());
        $Users_params=array_intersect_key($parameters,User::getColumns());


        /*******************************************************************/
        /* Get Answering Group                                             */
        /*******************************************************************/

        Info::FancyFetch("AnsweringQuestionsGroup",$AnsweringQuestionsGroup_params,AnsweringQuestionsGroup::getColumns(),array("AnswerableGroupID","StartedBy","AnswerableID"),$AnsweringQuestionGroup,$AnsweringQuestionGroups_WithKey,$AnsweringQuestionGroupsIDs,true);
        $UserIDs=$AnsweringQuestionGroupsIDs["StartedBy"];
        $AnswerableQuestionGroupIDs=$AnsweringQuestionGroupsIDs["AnswerableGroupID"];
        $AnsweringQuestionGroups_WithKey=$AnsweringQuestionGroups_WithKey["AnswerableID"];
        $AnsweringGroupID=$AnsweringQuestionsGroup_params["AnsweringGroupID"];

        /*******************************************************************/
        if(count($AnswerableQuestionGroupIDs)==0){
            $output["errors"][]="Unable to find the Answerable Question group fore this answering instance";
            return false;
        }
        $AnswerableID=$AnswerableQuestionGroupIDs[0];

        /*******************************************************************/
        /* Get Answerable Questions Group                                  */
        /*******************************************************************/
        $AnswerableQuestionsGroups_params["AnswerableGroupID"]=$AnswerableID;
        Info::FancyFetch("AnswerableQuestionsGroups",$AnswerableQuestionsGroups_params,AnswerableQuestionsGroup::getColumns(),"AnswerableGroupID",$AnswerableQuestionGroups,$AnswerableQuestionGroups_WithKey,$AnswerableQuestionGroupsIDs,true);

        /*******************************************************************/
        /* Get Answerable Questions                                        */
        /*******************************************************************/
        $AnswerableQuestions_params["AnswerableGroupID"] = $AnswerableID;
        Info::FancyFetch("AnswerableQuestions",$AnswerableQuestions_params,AnswerableQuestion::getColumns(),array("QuestionID","AnswerableID"),$AnswerableQuestions,$AnswerableQuestions_WithKey,$AnswerableQuestionsIDs);
        $QuestionIDs=$AnswerableQuestionsIDs["QuestionID"];
        $AnswerableQuestions_WithKey=$AnswerableQuestions_WithKey["AnswerableID"];

        /*******************************************************************/
        /* Get Answered Questions                                          */
        /*******************************************************************/
        $AnsweredQuestions_params["AnswerableGroupID"] = $AnswerableID;
        Info::FancyFetch("AnsweredQuestions",$AnsweredQuestions_params,AnsweredQuestion::getColumns(),"AnswerableID",$AnsweredQuestions,$AnsweredQuestions_WithKey,$AnsweredQuestionsIDs);

        /*******************************************************************/
        /* Questions                                                       */
        /*******************************************************************/
        $Questions_params["QuestionID"]=array( "type"=>"IN", "value"=>$QuestionIDs );
        Info::FancyFetch("Questions",$Questions_params,Question::getColumns(),"QuestionID",$Questions,$Questions_WithKey,$QuestionsIDs);

        /*******************************************************************/
        /* Users                                                           */
        /*******************************************************************/
        $Questions_params["UserID"]=array( "type"=>"IN", "value"=>$UserIDs );
        Info::FancyFetch("Users",$Users_params,User::getColumns(),"QuestionID",$Users,$Users_WithKey,$UsersIDs);



        /*******************************************************************/
        /*******************************************************************/
        /*******************************************************************/
        /*******************************************************************/
        $_=function($data,$key){
            if(!$data){
                return null;
            }
            if($data==null){
                return null;
            }
            return isset($data[$key])?$data[$key]:null;
        };


        /*******************************************************************/
        $Final=array();
        $CanSeeAnswer=Info::LoginService()->IsAuthorized(array(Roles::$INSTRUCTOR,Roles::$ADMIN,Roles::$TA));

        /*******************************************************************/
        foreach($AnswerableQuestions_WithKey as $AnswerableID => $_AnswerableQuestion){
            $AnswerableID=$_AnswerableQuestion["AnswerableID"];
            $AnswerableGroupID=$_AnswerableQuestion["AnswerableGroupID"];

            /***************************************************************/
            $AnsweredQuestion=$_($AnsweredQuestions_WithKey,$AnswerableID);
            $HasAnswer=$AnsweredQuestion!=null;

            $AnswerableQuestionGroup=$_($AnswerableQuestionGroups_WithKey,$AnswerableGroupID);
            $AnsweringQuestionGroup=$HasAnswer && $_($AnsweringQuestionGroups_WithKey,$AnswerableGroupID);
            if(isset($AnsweringGroupID)){
                $AnsweringQuestionGroup=$AnsweringQuestionGroups_WithKey[$AnsweringGroupID];
            }

            $Question=$_($Questions_WithKey,$_AnswerableQuestion["QuestionID"]);
            $User=$_($Users_WithKey,$AnsweringQuestionGroup["StartedBy"]);



            $AnsweringGroupID=isset($AnsweringGroupID)?$AnsweringGroupID:$_($AnsweringQuestionGroup,"AnsweringGroupID");
            /***************************************************************/
            $HasUser=$User!=null;
            $RemainingAttempts=$HasAnswer?$AnsweredQuestion["Attempts"]-$_AnswerableQuestion["AllowedAttempts"]:$_AnswerableQuestion["AllowedAttempts"];
            if($RemainingAttempts==null){
                $RemainingAttempts=1;
            }

            /***************************************************************/
            $test=array(
                "AnswerableID"=>$_($_AnswerableQuestion,"AnswerableID"),
                "AnsweringGroupID"=>$AnsweringGroupID,
                "AnswerableGroupID"=>$_($_AnswerableQuestion,"AnswerableGroupID"),
                "AnsweredHTML"=>$_($AnsweredQuestion,"AnsweredHTML"),
                "AnsweredBy"=>$_($AnsweredQuestion,"AnsweredHTML"),
                "AllowedAttempts"=>$_($_AnswerableQuestion,"AllowedAttempts"),
                "Attempts"=>$_($AnsweredQuestion,"Attempts"),
                "StartedOn"=>$_($AnsweringQuestionGroup,"StartOn"),
                "StartedBy"=>$_($AnsweringQuestionGroup,"StartedBy"),
                "PointsWorth"=>$_($_AnswerableQuestion,"PointsWorth"),
                "CorrectAnswer"=>$_($_AnswerableQuestion,"CorrectAnswer"),
                "HasCorrectAnswer"=>isset($_AnswerableQuestion["CorrectAnswer"]),
                "HasAnswer"=>$HasAnswer,
                "IsCorrect"=>$HasAnswer && ($AnsweredQuestion["ChosenAnswer"]==$_AnswerableQuestion["CorrectAnswer"]),
                "RemainingAttempts"=>$RemainingAttempts,
                "Answerable"=>$RemainingAttempts>0,
                "Locked"=>$RemainingAttempts==0,
                "CreatedOn"=>$_($AnswerableQuestionGroup,"CreatedOn"),
                "CreatedBy"=>$_($AnswerableQuestionGroup,"CreatedBy"),

                "Question"=>array(
                    "QuestionID"=>$_($_AnswerableQuestion,"QuestionID"),
                    "QuestionTypeID"=>$_($Question,"QuestionTypeID"),
                    "Question"=>$_($Question,"Question"),
                    "ExpectedAnswer"=>$CanSeeAnswer && $_($Question,"ExpectedAnswer"),
                    "ChosenAnswer"=>$_($AnsweredQuestion,"ChosenAnswer"),
                    "JSONParameters"=>$_($Question,"JSONParameters")
                ),
                "User"=>array(
                    "FirstName"=>$_($User,"FirstName"),
                    "LastName"=>$_($User,"LastName"),
                    "Email"=>$_($User,"Email"),
                    "PhoneNumber"=>$_($User,"PhoneNumber"),
                    "UserName"=>$_($User,"UserName"),
                    "Role"=>$_($User,"Role"),
                    "UHID"=>$_($User,"UHID")
                )
            );

            $Final[]=$test;

        }

        $output["results"]=$Final;
        return true;



    }
    public static function getAnswerableQuestion($id,$parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);

        /*******************************************************************/
        $columns=array_map(function() {
            return true;
        },(new AnswerableQuestion())->getData());

        /*******************************************************************/
        $data=APIHelper::QuickFetch(
            "AnswerableQuestions",
            array( "AnswerableID"=>$id ),
            $columns,
            function($item){
                return $item;
            })["results"];


        /*******************************************************************/
        $output["results"]=$data;
        return true;

    }
}