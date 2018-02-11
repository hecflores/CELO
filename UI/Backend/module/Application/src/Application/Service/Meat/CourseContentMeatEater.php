<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/27/2017
 * Time: 10:28 PM
 */

namespace Application\Service\Meat;


use Application\Info;
use Application\Model\AnswerableQuestion;
use Application\Model\AnswerableQuestionsGroup;
use Application\Model\AnsweredQuestion;
use Application\Model\AnsweringQuestionsGroup;
use Application\Model\CourseContent;
use Application\Model\Files;
use Application\Service\APIHelper;
use Application\Service\FileUploader;
use Exception;
use Zend\Db\Adapter\Adapter;

class CourseContentMeatEater
{

    public static function FindAvailableFileName($extension){
        $folder="data/Files";
        $files = glob($folder . "*.$extension");
        $index=count($files);
        while(file_exists("$folder/File$index.$extension")){
            $index++;
        }
        return "$folder/File$index.$extension";
    }
    public static function FindFiles_Copy_Update($data){

        if(isset($data["name"]) &&
            isset($data["type"]) &&
            isset($data["tmp_name"]) &&
            isset($data["error"]) &&
            isset($data["size"]))
        {
            $FileID=FileUploader::UploadFile($data);


            return array(
                "link"=>"/files/$FileID",
                "download"=>"/files/$FileID/download"
            );

        }

        $newData=array();
        foreach($data as $key => $value){
            if(!is_array($value)){
                $newData[$key]=$value;
                continue;
            }
            $newData[$key]=self::FindFiles_Copy_Update($value);
        }
        return $newData;
    }
    public static function ConvertJsonToStringJsonFirstPass($data){

        $newData=array();
        foreach($data as $key => $value){

            /***************************************************************/
            if(!is_array($value)){
                $newData[$key]=$value;
                continue;
            }
            /***************************************************************/
            if($key==='UUID'){

                foreach($data["UUID"] as $key2 => $value2){
                    $newData[$key2]=uniqid();
                }
                continue;
            }
            $newData[$key]=self::ConvertJsonToStringJsonFirstPass($value);
        }
        return $newData;
    }
    public static function ConvertJsonToStringJsonSecondPass($data){

        $newData=array();
        foreach($data as $key => $value){

            /***************************************************************/
            if(!is_array($value)){
                $newData[$key]=$value;
                continue;
            }

            /***************************************************************/
            if($key=='Json'){
                if(!isset($data["Json"])){
                    continue;
                }
                foreach($data["Json"] as $key2 => $value2){
                    $newData[$key2]=json_encode($value2);
                }
                continue;
            }
            $newData[$key]=self::ConvertJsonToStringJsonSecondPass($value);
        }
        return $newData;
    }

    public static function BasicTextReplacing($data, $search, $replace, &$bool){

        $newData=array();
        foreach($data as $key => $value){

            /***************************************************************/
            if(!is_array($value)){
                $newData[$key]=$value;
                $replaced=preg_replace($search,$replace,$newData[$key]);
                if($replaced!=$newData[$key]){
                    $bool=true;
                }
                $newData[$key]=$replaced;
                continue;
            }


            $newData[$key]=self::BasicTextReplacing($value,$search,$replace,$bool);
        }
        return $newData;
    }
    /***********************************************************************/
    public static function CreateNewCourseContent($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(
            "Name",
            "Description",
            "ParentFolderID",
            "Type"
        ),$output)){
            return false;
        }
        $parameters["CreatedBy"]=Info::getCurrentUser()->getUserID();

        /***************************************************************/
        /* Get the Root Content Id. Will Be Really Useful for finding  */
        /* the Beadcrums                                               */
        /***************************************************************/
        if(!CourseContentMeatEater::GetCourseContent($parameters["ParentFolderID"],array(),$temp)){
            $temp["errors"][]="Unable to get the parent folder";
            return false;
        }
        $parameters["SectionID"]=$temp["results"]["SectionID"];
        $parameters["ParentFolderID"]=$temp["results"]["CourseContentNumber"];
        $parameters["RootContentID"]=$temp["results"]["RootContentID"];
        $parameters["Depth"]=intval($temp["results"]["Depth"])+1;

        /***************************************************************/
        /* Change Data Insert Into The Database                        */
        /***************************************************************/
        $data=$parameters;
        $data=self::FindFiles_Copy_Update($data);
        $data=self::ConvertJsonToStringJsonFirstPass($data);
        $data=self::ConvertJsonToStringJsonSecondPass($data);
        $FinalOriginalData=$data;
        $data=array_intersect_key($data,CourseContent::getColumns());

        /***************************************************************/
        /* Insert Into Database                                        */
        /***************************************************************/
        $id=Info::CourseContentTable()->Insert($data);

        /***************************************************************/
        /* If some Attributes Depended on the ID of the item, then fix */
        /* and Update                                                  */
        /***************************************************************/
        $didSomethingChange=false;
        $data=self::BasicTextReplacing($data, '/__ID__/',"".$id,$didSomethingChange);
        if($didSomethingChange){
            Info::CourseContentTable()->Update($id,$data);
        }

        /***************************************************************/
        $courseContent=Info::CourseContentTable()->getByID($id);




        /***************************************************************/
        /* Needed Setups                                               */
        /***************************************************************/
        $courseContentSetups=array(
            "assessment"=>function($data,$courseContent,$contentId,&$output){
                $courseContent=$courseContent->getData();

                if(!AnswerableQuestionsMeatEater::CreateNewAnswerableQuestionGroup(array("CourseContentID"=>$contentId),$output)){
                    $output["errors"][]="Unable To Create the Gradable Item";
                    return false;
                }


//                AssessmentsMeatEater::CreateNewAssessment(array(
//                    'CourseContentID'=>$contentId,
//                    "Name"=>$courseContent["Name"],
//                    "Type"=>"Normal Assessment",
//                    "Properties"=>json_encode($courseContent["Properties"],JSON_FORCE_OBJECT),
//                    "Description"=>$courseContent["Description"]
//                ),$output);
                return true;
            },
            "magic-points"=>function($data,$courseContent,$contentId,&$output){



                $properties=$courseContent->getProperties();
                $rows=intval($properties["GridSize"]["Rows"]);
                $columns=intval($properties["GridSize"]["Columns"]);

                /************************************************************/
                /* Create the gradable item                                 */
                /************************************************************/
                if(!AnswerableQuestionsMeatEater::CreateNewAnswerableQuestionGroup(array(
                    "CourseContentID"=>$contentId),$output)){
                    $output["errors"][]="Unable to create a gradable item";
                    return false;
                }
                $gradableGroup=$output["results"];

                $questions=array();
                for($row=0;$row<$rows;$row++) {
                    for ($column = 0; $column < $columns; $column++) {
                        $cell = $properties["Grid"][$row][$column];
                        if (isset($cell["QuestionID"])) {
                            if(!isset($questions[$cell["QuestionID"]])){
                                $questions[$cell["QuestionID"]]=true;
                            }
                        }
                    }
                }

                /***********************************************************/
                /* For Later Use                                           */
                /***********************************************************/
                $properties["AnswerGroup"]=array(
                    "AnswerGroupID"=>$gradableGroup["AnswerableGroupID"]
                );

                $answers=APIHelper::QuickFetch(
                    "Questions",
                    array(
                        "key"=>"QuestionID",
                        "filters"=>array(
                            "QuestionID"=>array(
                                "type"=>"IN",
                                "value"=>array_keys($questions))
                        )
                    ),
                    array("QuestionID"=>true),
                    function($item){
                        return $item["ExpectedAnswer"];
                    })["results"];

                for($row=0;$row<$rows;$row++){
                    for($column=0;$column<$columns;$column++)
                    {
                        $cell=$properties["Grid"][$row][$column];
                        if(isset($cell["QuestionID"]))
                        {
                            $answer=$answers[$cell["QuestionID"]][0];
                            /***********************************************/
                            if(!AnswerableQuestionsMeatEater::AddAnswerableQuestion
                            (
                                array(
                                    "CorrectAnswer"=>$answer,
                                    "PointsWorth"=>$cell["Weight"],
                                    "Attempts"=>0,
                                    "AllowedAttempts"=>2,
                                    "AnswerableGroupID"=>$gradableGroup["AnswerableGroupID"],
                                    "QuestionID"=>$cell["QuestionID"]
                                ),
                                $output
                            )){
                                $output["errors"][]="Cell($row,$column) was was failed to be added as a gradable item for some reason";
                                continue;
                            }

                            /***********************************************/
                            $answeredInformation=$output["results"][0];

                            /***********************************************/
                            $properties["Grid"][$row][$column]["AnswerableID"]=$answeredInformation['AnswerableID'];

                        }
                    }
                }
                $properties=json_encode($properties,JSON_FORCE_OBJECT);

                Info::CourseContentTable()->Update($courseContent->getContentID(),array("Properties"=>$properties));
                return true;
            }
        );

        /***************************************************************/
        if(isset($courseContentSetups[$data["Type"]]))
        {
            if(!$courseContentSetups[$data["Type"]]($data,$courseContent,$id,$output)){
                $output["errors"][]="Unable to setup the content";
                return false;
            }
        }
        $FinalOriginalData=array_intersect_key($FinalOriginalData,array(
            "Name"=>true,
            "Description"=>true,
            /* "ParentFolderID"=>true, */ //TODO Too Complicated to allow  Right now
            /* "Type"=>true, */           //TODO Too Complicated to allow Right now.
            /* "Gradable"=>true, */       //TODO Unkown right now
            "RolesVisible"=>true,
            "AnswerableQuestionGroup"=>true
        ));


        return self::UpdateCourseContent($id,$FinalOriginalData,$output);

    }
    private static function BuildCourseContent(&$AllCourseContent,$CourseContentID,&$CourseContent,$Children,$CourseContent_Key,$AnswerableQuestionsGroups_Key,$AnswerableQuestions_Key,$CourseContentAnswerableGroups){
        $CourseContent["AnswerableQuestionsGroups"]=isset($CourseContentAnswerableGroups[$CourseContent["ContentID"]])?$CourseContentAnswerableGroups[$CourseContent["ContentID"]]:null;
        $CourseContent["AnswerableQuestions"]=$CourseContent["AnswerableQuestionsGroups"]!=null?
                                    $AnswerableQuestions_Key[$CourseContent["AnswerableQuestionsGroups"]["AnswerableGroupID"]]:array();


        unset($CourseContent["ContentID"]);
        unset($CourseContent["AnswerableQuestionsGroups"]["AnswerableGroupID"]);
        $CourseContent["AnswerableQuestions"]=array_map(function($item){
            return $item;
        },$CourseContent["AnswerableQuestions"]);


        $AllCourseContent[]=$CourseContent;

        $CourseContent["Children"]=array();
        if(isset($Children[$CourseContent["CourseContentNumber"]])){
            $CourseContent["Children"]=$Children[$CourseContent["CourseContentNumber"]];
        }


        foreach($CourseContent["Children"] as $ChildCourseContentID=>&$ChildCourseContent){
            self::BuildCourseContent($AllCourseContent,$ChildCourseContentID,$ChildCourseContent,$Children,$CourseContent_Key,$AnswerableQuestionsGroups_Key,$AnswerableQuestions_Key,$CourseContentAnswerableGroups);
        }
    }


    public static function GetRawRootCourseContentInfo($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("SectionID"),$output,null,array("Name"=>"Unkown","Creator"=>Info::getCurrentUser()->getUserID()))){
            return false;
        }

        $CourseContent_params=array_intersect_key($parameters,array("SectionID"=>$parameters["SectionID"]));
        $AnswerableQuestionsGroups_params=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());
        $AnswerableQuestions_params=array_intersect_key($parameters,AnswerableQuestion::getColumns());


        /*******************************************************************/
        Info::FancyFetch("CourseContent"            ,$CourseContent_params            ,CourseContent::getColumns()           ,"ContentID"            ,$CourseContents           ,$CourseContent_Key            ,$CourseContent_Ids);

        /*******************************************************************/
        $AnswerableQuestionsGroups_params["CourseContentID"]=array("type"=>"IN", "value"=>$CourseContent_Ids);
        Info::FancyFetch("AnswerableQuestionsGroups",$AnswerableQuestionsGroups_params,AnswerableQuestionsGroup::getColumns(),"AnswerableGroupID",$AnswerableQuestionsGroups,$AnswerableQuestionsGroups_Key,$AnswerableQuestionsGroups_Ids);

        /*******************************************************************/
        $AnswerableQuestions_params["AnswerableGroupID"]=array("type"=>"IN", "value"=>$AnswerableQuestionsGroups_Ids);
        Info::FancyFetch("AnswerableQuestions"      ,$AnswerableQuestions_params      ,AnswerableQuestion::getColumns()      ,"AnswerableGroupID"      ,$AnswerableQuestions      ,$AnswerableQuestions_Key      ,$AnswerableQuestions_Ids,false);


        /*******************************************************************/
        $CourseContentAnswerableGroups=APIHelper::setNewKey($AnswerableQuestionsGroups,"CourseContentID",false,true);
        $Children=APIHelper::setNewKey($CourseContents,"ParentFolderID",true);
        $Root=APIHelper::setNewKey($CourseContents,"Depth",true);



        /*******************************************************************/
        /* Builders                                                        */
        /*******************************************************************/
        $AllCourseContent=array();
        foreach($Root[0] as $ChildCourseContentID=>&$ChildCourseContent){
            self::BuildCourseContent($AllCourseContent,$ChildCourseContentID,$ChildCourseContent,$Children,$CourseContent_Key,$AnswerableQuestionsGroups_Key,$AnswerableQuestions_Key,$CourseContentAnswerableGroups);
        }



        $output["results"]=array("Tree"=>$Root[0],"All"=>$AllCourseContent);
        return true;

    }

    public static function LoadCourseContent($parameters,&$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("SectionID","RootCourseContent"),$output,null,array("Name"=>"Unkown","Creator"=>Info::getCurrentUser()->getUserID()))){
            return false;
        }
        $FirstContentID=-1;
        $ContentID=-1;
        foreach($parameters["RootCourseContent"] as $index=>$CourseContent){
            $AnswerableQuestionsGroups=$CourseContent["AnswerableQuestionsGroups"];
            $AnswerableQuestions=$CourseContent["AnswerableQuestions"];
            $CourseContent["SectionID"]=$parameters["SectionID"];

            $CourseContentToInsert=array_intersect_key($CourseContent,CourseContent::getColumns());
            $ContentID=Info::PerformInsert("CourseContent",$CourseContentToInsert);


            $FirstContentID=$FirstContentID==-1?$ContentID:$FirstContentID;


            if($AnswerableQuestionsGroups!=null){
                $AnswerableQuestionsGroups["CourseContentID"]=$ContentID;
                $AnswerableGroupID=Info::PerformInsert("AnswerableQuestionsGroups",$AnswerableQuestionsGroups);
                foreach($AnswerableQuestions as $Key=>$AnswerableQuestion){
                    $AnswerableQuestion["AnswerableGroupID"]=$AnswerableGroupID;
                    Info::PerformInsert("AnswerableQuestions",$AnswerableQuestion);
                }
            }

        }

        return self::GetCourseContent($FirstContentID,array(),$output);



    }
    public static function SaveCourseContent($parameters,&$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("SectionID"),$output,null,array("Name"=>"Unkown","Creator"=>Info::getCurrentUser()->getUserID()))){
            return false;
        }

        if(!self::GetRawRootCourseContentInfo($parameters,$output)){
            $output["errors"][]=["unable to get all the course content"];
            return false;
        }


        $data=json_encode($output["results"],JSON_FORCE_OBJECT);
        $parameters["Creator"]=
        $fileParameters=array_intersect_key($parameters,Files::getColumns());

        $fileID=FileUploader::UploadContent($data,"json");
        $fileParameters["FileID"]=$fileID;
        Info::PerformInsert("CourseContentTemplates",$fileParameters);

        return true;
    }

    public static function UpdateCourseContent($id, $parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        /*******************************************************************/
        $parametersAllowed=array(
            "Name"=>true,
            "Description"=>true,
            /* "ParentFolderID"=>true, */ //TODO Too Complicated to allow  Right now
            /* "Type"=>true, */           //TODO Too Complicated to allow Right now.
            "Properties"=>true,
            /* "Gradable"=>true, */       //TODO Unkown right now
            "RolesVisible"=>true,
            "AnswerableQuestionGroup"=>true
        );

        /*******************************************************************/
        $newParameters=array_intersect_key($parameters,$parametersAllowed);

        /*******************************************************************/
        /* Fix issue of replacing Properties with small changes            */
        /*******************************************************************/
        if(isset($newParameters["Properties"]))
        {
            if(!self::GetCourseContent($id,array(),$temp)){ // final-fix Change to a Simple Table Fetch
                $output["errors"][]="Unable to find the corresponding Course Content ($id)";
                return false;
            }
            $oldCourseContent=$temp["results"];
            $oldProperties=$oldCourseContent["Properties"]==null?array():$oldCourseContent["Properties"];
            $newProperties=json_decode($newParameters["Properties"],true);
            $newProperties=array_merge($oldProperties,$newProperties);

            $newParameters["Properties"]=json_encode($newProperties,JSON_FORCE_OBJECT);

        }

        /*******************************************************************/
        if(count($newParameters)!=count($parameters)){
            $diff=array_diff_key($newParameters,$parameters);
            $diff=array_keys($diff);
            $diff=implode(",",$diff);
            $output["errors"][]="Columns not allowed to be updated. ($diff)";
            return false;
        }

        /*******************************************************************/
        if(isset($parameters["AnswerableQuestionGroup"])) {
            if (!Info::IsTableEmpty("AnswerableQuestionsGroups", array("CourseContentID" => $id), $items)){
                if (!AnswerableQuestionsMeatEater::UpdateAnswerableQuestionGroup($items[0]["AnswerableGroupID"], $parameters["AnswerableQuestionGroup"], $output)) {
                    $output["errors"][] = "Unable to update the Answerable Question Group Associated with this Course Content";
                }
            }
            unset($newParameters["AnswerableQuestionGroup"]);
        }

        $extras=array(
            "assessment"=>function(&$data,$id){

//                /***********************************************************/
//                if(!AssessmentsMeatEater::getAssessmentFromCourseContent($id,$output)){ //final-fix Move insid of the if statment below
//                    $output["errors"][]="Unable to find the assessment for the course content";
//                }
//                $assessment=$output["results"]["Assessment"];
//
//                /***********************************************************/
//                if(!isset($data["Assessment"])){
//                    throw new \Exception("Unexpected Situation with Assessment");
//                }
//
//                /***********************************************************/
//                $newAssessment=$data["Assessment"];
//                $newAssessmentToUpdate=array_intersect_key($newAssessment,array(
//                                    "AssessmentID"=>true,
//                                    "Name"=>true,
//                                    "URL"=>true,
//                                    "Description"=>true,
//                                    "Type"=>true,
//                                    "Properties"=>true,
//                                    "AssociatedCourseContentID"=>true,
//                                    "AnswerableGroupID"=>true,
//                                    "CreatedBy"=>true,
//                                    "Timelimit"=>true,
//                                ));
//
//                /***********************************************************/
//                if(isset($newAssessment["AssessmentID"])) {
//                    if ($newAssessment["AssessmentID"] != $assessment["AssessmentID"]) {
//                        throw new Exception("Not implemented yet... Delete old assessment that was once attached to course content");
//                        //TODO Implement this feature
//                    }
//                }
//
//                /***********************************************************/
//                if(count($newAssessmentToUpdate)>0){
//                    if(!Info::PerformUpdate("Assessments",array("AssessmentID"=>$assessment["AssessmentID"]),$newAssessmentToUpdate)){
//                        throw new Exception("Unable to update the assessments table");
//                    }
//                }
//
//                /***********************************************************/
//                $oldQuestions=$assessment["questions"]=APIHelper::setNewKey(
//                    $assessment["questions"],
//                    "QuestionID",
//                    true
//                );
//
//                /***********************************************************/
//                if(isset($newAssessment["questions"])) {
//                    $newQuestions = $newAssessment["questions"] = APIHelper::setNewKey(
//                        $newAssessment["questions"],
//                        "QuestionID",
//                        true
//                    );
//
//                    /***********************************************************/
//                    $intersection = array_intersect_key($oldQuestions, $newQuestions);
//                    $difference = $newQuestions;
//                    foreach ($intersection as $key => $value) {
//                        unset($difference[$key]);
//                    }
//
//                    //final-fix need a better way to add them. This is really time consuming
//                    foreach ($difference as $questionID => $question) {
//                        AssessmentsMeatEater::AddQuestion(array("QuestionID" => $questionID, "AssessmentID" => $assessment["AssessmentID"]), $temp);
//                    }
//                }

                /***********************************************************/

                return true;
            },
            "magic-points"=>function(&$data) use($newParameters){

//                $properties=$newParameters["Properties"];
//                $rows=intval($properties["GridSize"]["Rows"]);
//                $columns=intval($properties["GridSize"]["Columns"]);
//
//                /************************************************************/
//                /* Create the gradable item                                 */
//                /************************************************************/
//                if(!AnswerableQuestionsMeatEater::CreateNewAnswerableQuestionGroup(array(
//                    "CourseContentID"=>$newParameters["ContentID"]),$output)){
//                    $output["errors"][]="Unable to create a gradable item";
//                    return false;
//                }
//                $gradableGroup=$output["results"];
//
//                $questions=array();
//                for($row=0;$row<$rows;$row++) {
//                    for ($column = 0; $column < $columns; $column++) {
//                        $cell = $properties["Grid"][$row][$column];
//                        if (isset($cell["QuestionID"])) {
//                            if(!isset($questions[$cell["QuestionID"]])){
//                                $questions[$cell["QuestionID"]]=true;
//                            }
//                        }
//                    }
//                }
//
//                /***********************************************************/
//                /* For Later Use                                           */
//                /***********************************************************/
//                $properties["AnswerGroup"]=array(
//                    "AnswerGroupID"=>$gradableGroup["AnswerableGroupID"]
//                );
//
//                $answers=APIHelper::QuickFetch(
//                    "Questions",
//                    array(
//                        "key"=>"QuestionID",
//                        "filters"=>array(
//                            "QuestionID"=>array(
//                                "type"=>"IN",
//                                "value"=>array_keys($questions))
//                        )
//                    ),
//                    array("QuestionID"=>true),
//                    function($item){
//                        return $item["ExpectedAnswer"];
//                    })["results"];
//
//                for($row=0;$row<$rows;$row++){
//                    for($column=0;$column<$columns;$column++)
//                    {
//                        $cell=$properties["Grid"][$row][$column];
//                        if(isset($cell["QuestionID"]))
//                        {
//                            $answer=$answers[$cell["QuestionID"]][0];
//                            /***********************************************/
//                            if(!AnswerableQuestionsMeatEater::AddAnswerableQuestion
//                            (
//                                array(
//                                    "CorrectAnswer"=>$answer,
//                                    "PointsWorth"=>$cell["Weight"],
//                                    "Attempts"=>0,
//                                    "AllowedAttempts"=>2,
//                                    "AnswerableGroupID"=>$gradableGroup["AnswerableGroupID"],
//                                    "QuestionID"=>$cell["QuestionID"]
//                                ),
//                                $output
//                            )){
//                                $output["errors"][]="Cell($row,$column) was was failed to be added as a gradable item for some reason";
//                                continue;
//                            }
//
//                            /***********************************************/
//                            $answeredInformation=$output["results"][0];
//
//                            /***********************************************/
//                            $properties["Grid"][$row][$column]["AnswerableID"]=$answeredInformation['AnswerableID'];
//
//                        }
//                    }
//                }
//                $properties=json_encode($properties,JSON_FORCE_OBJECT);
//
//                Info::CourseContentTable()->Update($newParameters["ContentID"],array("Properties"=>$properties));
                return true;

            }
        );


        if(!CourseContentMeatEater::GetCourseContent($id,array(),$temp)){
            $output["errors"][]="Unable to find course content {$newParameters["ContentID"]} for updating";
            return false;
        }

        /*******************************************************************/
        $courseContent=$temp["results"];
        if(isset($extras[$courseContent["Type"]])){
            $extras[$courseContent["Type"]]($newParameters,$id);
        }

        /*******************************************************************/
        Info::PerformUpdate(
            "CourseContent",
            array("ContentID"=>$id),
            $newParameters
        );

        /*******************************************************************/
        $output["results"]=array("success"=>true);
        return true;
    }
    /**
     * @param $id
     * @param $parameters
     * @param $output
     * @return bool
     * @throws \Exception
     */
    public static function DeleteCourseContent($id, $parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        /*******************************************************************/
        if(Info::IsTableEmpty("CourseContent",array("ContentID"=>$id), $courseContent)){
            $output["errors"][]="Failed at getting the course content";
            return false;
        }
        $courseContent=$courseContent[0];

        /*******************************************************************/
        if($courseContent["ParentFolderID"]!=null){
            $output["errors"][]="Not Allowed to delete the root course content";
        }

        /*******************************************************************/
        /* Delete Answerable Items ..                                      */
        /*******************************************************************/
        //TODO Should have to do this.. Database Cascade not working

        $parametersForAnswerableQuestions=array("CourseContentID"=>$id);
        /*******************************************************************/
        /* Delete the Course Content                                       */
        /*******************************************************************/
        Info::PerformDelete("CourseContent",array("ContentID"=>$id),CourseContent::getColumns());//Course Content

//        Info::PerformDelete("AnsweredQuestions",$parametersForAnswerableQuestions,AnsweredQuestion::getColumns());//Answered Questions
//        Info::PerformDelete("AnswerableQuestions",$parametersForAnswerableQuestions,AnsweredQuestion::getColumns());//Answerable Questions
//        Info::PerformDelete("AnsweringQuestionsGroup",$parametersForAnswerableQuestions,AnsweredQuestion::getColumns());//Answering Question Groups
//        Info::PerformDelete("AnswerableQuestionsGroups",$parametersForAnswerableQuestions,AnsweredQuestion::getColumns());//Answerable Question Groups




        $output["results"]=array("status"=>"success");
        return true;



    }

    public static function GetCourseContentFromAnswerableQuestionGroup($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("AnswerableGroupID"),$output)){
            return false;
        }

        $AnswerableQuestionsGroups_param=array_intersect_key($parameters,AnswerableQuestionsGroup::getColumns());

        /*******************************************************************/
        $data=Info::PerformGet("AnswerableQuestionsGroups",$AnswerableQuestionsGroups_param,null,function($data){
            return $data["CourseContentID"];
        });

        /*******************************************************************/
        if(count($data)!=1){
            $output["errors"][]="Issue with getting the assessment {$parameters["AssessmentID"]}";
            return false;
        }

        /*******************************************************************/
        $courseContentID=$data[0];

        return self::GetCourseContent($courseContentID,$parameters,$output);



    }
    public static function GetCourseContentFromAnsweringQuestionsGroup($parameters, &$output){
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array("AnsweringGroupID"),$output)){
            return false;
        }

        $AnsweringQuestionsGroup_param=array_intersect_key($parameters,AnsweringQuestionsGroup::getColumns());

        /*******************************************************************/
        $data=Info::PerformGet("AnsweringQuestionsGroup",$AnsweringQuestionsGroup_param,null,function($data){
            return $data["AnswerableGroupID"];
        });

        /*******************************************************************/
        if(count($data)!=1){
            $output["errors"][]="Issue with getting the assessment {$parameters["AssessmentID"]}";
            return false;
        }

        /*******************************************************************/
        $AnswerableGroupID=$data[0];

        return self::GetCourseContentFromAnswerableQuestionGroup(array_merge($parameters,array("AnswerableGroupID"=>$AnswerableGroupID)),$output);



    }



    /**
     * @param $id
     * @param $parameters
     * @param $output
     * @return bool
     */
    public static function GetCourseContent($id, $parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }


        /*******************************************************************/
        if(!self::GetCourseContents(array("ContentID"=>$id),$output)){
            $output["errors"][]="Failed at getting the course content";
            return false;
        }

        /*******************************************************************/
        $courseContent=$output["results"];
        if(count($courseContent)==0){
            $output["errors"][]="Course Content With ID $id does not exists";
            return false;
        }
        $courseContent=$courseContent[0];
        $courseContent["AnswerableQuestionGroup"]=null;
        $courseContent["AnsweringQuestionGroup"]=null;
        $courseContent["LastedSubmissions"]=null;





        /*******************************************************************/
        if(!Info::IsTableEmpty("AnswerableQuestionsGroups",array("CourseContentID"=>$id), $items))
        {
            if(isset($parameters["Details"])){


                if(!AnswerableQuestionsMeatEater::GetAllAnswerableQuestionGroupsWithAnsweringSubmissions(array("AnswerableGroupID"=>$items[0]["AnswerableGroupID"]),$output)){
                    $output["errors"][]="Unable to update the Answering Question Group Associated with this Course Content";
                }
                else{
                    $courseContent["LastedSubmissions"]=$output["results"][0];
                }
                if(!AnswerableQuestionsMeatEater::GetCurrentAnsweringGroupForAnswerableGroup($items[0]["AnswerableGroupID"],array(),$output)){
                    $output["errors"][]="Unable to update the Answering Question Group Associated with this Course Content";
                }
                else{
                    $courseContent["AnsweringQuestionGroup"]=$output["results"];
                }

            }

            if(!AnswerableQuestionsMeatEater::GetAnswerableQuestionsGroup($items[0]["AnswerableGroupID"],array(),$output)){
                $output["errors"][]="Unable to get the Answerable Question Group Associated with this Course Content";
            }
            else{
                $courseContent["AnswerableQuestionGroup"]=$output["results"];
            }

            $AnswerableGroupID=$items[0]["AnswerableGroupID"];

            $AnsweringQuestionsGroupProp=array();
            $AnsweringQuestionsGroupProp["AnswerableGroupID"]=$AnswerableGroupID;
            $AnsweringQuestionsGroupProp["StartedBy"]=Info::getCurrentUser()->getUserID();
            $courseContent["HasSubmission"]=!Info::IsTableEmpty("AnsweringQuestionsGroup",$AnsweringQuestionsGroupProp);







        }


        $extras=array(
            "assessment"=>function(&$data){
//                if(!AssessmentsMeatEater::getAssessmentFromCourseContent($data["ContentID"],$output)){
//                    $output["errors"][]="Unable to find the assessment for the course content";
//                }
//
//                $assessment=$output["results"]["Assessment"];
//                $submittedAssessments=Info::AssessmentTable()->getFinishedAssessments();
//                $runningAssessment=Info::AssessmentTable()->getRunningInstance($assessment["AssessmentID"],Info::getCurrentUser()->getUserID());
//
//                if($runningAssessment!=null){
//                    if(!RunningAssessmentsMeatEater::getAssessment($runningAssessment->getAnsweredID(),array(),$temp)){
//                        throw new Exception("Unkown error(2)");
//                    }
//                    $data["Properties"]["RunningAssessment"]=$temp["results"]["ActiveAssessment"];
//                }
//                else if(isset($data["Properties"]["RunningAssessment"])){
//                    unset($data["Properties"]["RunningAssessment"]);
//                }
//
//                $data["Properties"]["Assessment"]=$assessment;
//                $data["Properties"]["SubmittedAssessments"]=$submittedAssessments;
                return true;
            },
            "magic-points"=>function(&$data){

                $properties=$data["Properties"];
                $rows=intval($properties["GridSize"]["Rows"]);
                $columns=intval($properties["GridSize"]["Columns"]);


                $answers=APIHelper::setNewKey($data["AnswerableQuestionGroup"]["Questions"],"AnswerableID",true);
                if(!AnswerableQuestionsMeatEater::GetCurrentAnsweringGroupForAnswerableGroup($data["AnswerableQuestionGroup"]["AnswerableGroupID"],array(),$output)){
                    $output["errors"][]="Unable to update the Answering Question Group Associated with this Course Content";
                }
                else{
                    if($output["results"]!=null){
                        $answers=APIHelper::setNewKey($output["results"]["Questions"],"AnswerableID",true);
                    }

                }






                /************************************************************/
                /* Save the Answers Into the Magic Group                    */
                /************************************************************/
                for($row=0;$row<$rows;$row++)
                {
                    for ($column = 0; $column < $columns; $column++)
                    {
                        $cell=$properties["Grid"][$row][$column];
                        if(isset($cell["AnswerableID"]))
                        {
                            $answer=$answers[$cell["AnswerableID"]][0];
                            $answer["AnswerableID"]=$cell["AnswerableID"];
                            $properties["Grid"][$row][$column]["AnsweredInfo"]=$answer;
                        }
                    }
                }

                $data["Properties"]=$properties;
                return true;

            }
        );

        /*******************************************************************/


        if(isset($extras[$courseContent["Type"]])){
            $extras[$courseContent["Type"]]($courseContent);
        }

        /*******************************************************************/
        $output["results"]=$courseContent;
        return true;
    }
    public static function SaveCourseContentAsTemplate($parameters,&$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(
            "ContentID"=>true,
            "SectionID"=>true,
            "TemplateName"=>true,
            "TemplateNotes"=>true
        ),$output)){
            return false;
        }


    }

    public static function GetCourseContentsGrading($id,$parameters,&$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(
        ),$output)){
            return false;
        }

        $parameters["ContentID"]=$id;
        $parameters["UserID"]=Info::getCurrentUser()->getUserID();
        /*******************************************************************/
        $columns=array(
            "ContentID"=>true,
            "PreviousContentID"=>true,
            "CurrentContentID"=>true,
            "ChildContentID"=>true,
            "SectionID"=>true,
            "Name"=>true,
            "URL"=>true,
            "Description"=>true,
            "ParentFolderID"=>true,
            "RootContentID"=>true,
            "Depth"=>true,
            "Type"=>true,
            "Properties"=>true,
            "Gradable"=>true,
            "CreatedBy"=>true,
            "RolesVisible"=>true,
            "UserID"=>true,
            "Grade"=>true
        );

        $output["results"]=array(
            "Grades"=>APIHelper::QuickFetch(
            "GradeProgress_CourseContentTree",
            $parameters,
            $columns,
            function($item)
            {
                return json_decode(json_encode($item),TRUE);

            })["results"]);
        return true;




    }

    public static function GetCourseContents($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }


        /*******************************************************************/
        $data=APIHelper::QuickFetch(
            "CourseContent",
            $parameters,
            array(
                "ContentID"=>true,
                "SectionID"=>true,
                "Name"=>true,
                "URL"=>true,
                "Description"=>true,
                "ParentFolderID"=>true,
                "RootContentID"=>true,
                "Depth"=>true,
                "Type"=>true,
                "Properties"=>true,
                "Gradable"=>true,
                "CreatedBy"=>true,
                "RolesVisible"=>true,
            ),
            function($item)
            {
                $courseContent=new CourseContent();
                $courseContent->exchangeArray($item);
                return $courseContent->getData();
            })["results"];


        /*******************************************************************/
        $output["results"]=$data;
        return true;


    }
}