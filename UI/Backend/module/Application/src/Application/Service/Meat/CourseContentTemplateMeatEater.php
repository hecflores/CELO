<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 5/6/2017
 * Time: 5:24 AM
 */

namespace Application\Service\Meat;


use Application\Info;
use Application\Model\Course;
use Application\Model\CourseContent;
use Application\Model\CourseContentTemplate;
use Application\Model\Files;
use Application\Roles;
use Application\Service\FileUploader;

class CourseContentTemplateMeatEater
{
    public static function GetTemplates($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters,array(), $output)
        ) {
            return false;
        }

        $CourseContentTemplates_Params=array_intersect_key($parameters,CourseContentTemplate::getColumns());
        $Files_Params=array();

        /*******************************************************************/
        Info::FancyFetch("CourseContentTemplates",$CourseContentTemplates_Params,CourseContentTemplate::getColumns(),"FileID",$CourseContentTemplates,$CourseContentTemplatesKey,$CourseContentTemplatesIDs);

        /*******************************************************************/
        $Files_Params["FileID"]=array("type"=>"IN","value"=>$CourseContentTemplatesIDs);
        Info::FancyFetch("Files",$Files_Params,Files::getColumns(),"FileID",$Files,$FilesKey,$FilesIDs);

        /*******************************************************************/
        $CourseContentTemplates=array_map(function($CourseContentTemplate) use($FilesKey){
            $FileForTestCourseContent=$FilesKey[$CourseContentTemplate["FileID"]];
            $jsonContent= file_get_contents($FileForTestCourseContent["Path"]);
            $Content=json_decode($jsonContent,JSON_FORCE_OBJECT);
            $CourseContentTemplate["CourseContent"]=$Content;

            return $CourseContentTemplate;
        },$CourseContentTemplates);

        /*******************************************************************/

        /*******************************************************************/
        $output["results"]=$CourseContentTemplates;

        return true;
    }
    public static function GetMyTemplates($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters,array(), $output)
        ) {
            return false;
        }


        /*******************************************************************/
        if(!Info::LoginService()->IsAuthorized(Roles::$STAFF))
        {
            $output["errors"][]="Not Authorized";
            return false;
        }
        $parameters["Creator"]=Info::getCurrentUser()->getUserID();


        /*******************************************************************/
        return self::GetTemplates($parameters,$output);
    }
    public static function GetATemplate($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters,array("TemplateID"), $output)
        ) {
            return false;
        }

        if(!self::GetTemplates($parameters,$output)){
            $output["errors"][]="Unable to perform GetTemplate";
            return false;
        }

        if(count($output["results"])!=1){
            $output["errors"][]="Course Content Not Found";
            return false;
        }

        $output["results"]=$output["results"][0];

        /*******************************************************************/
        return true;
    }
    public static function SaveCurrentTemplate($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters,array("SectionID"), $output)
        ) {
            return false;
        }

        /*******************************************************************/
        if(!CourseContentMeatEater::GetRawRootCourseContentInfo($parameters,$output)){
            $output["errors"][]=["unable to get all the course content"];
            return false;
        }


        /*******************************************************************/
        $data=json_encode($output["results"],JSON_FORCE_OBJECT);
        $parameters["Creator"]=Info::getCurrentUser()->getUserID();
        $fileParameters=array_intersect_key($parameters,Files::getColumns());

        /*******************************************************************/
        $fileID=FileUploader::UploadContent($data,"json");
        $fileParameters["FileID"]=$fileID;
        Info::PerformInsert("CourseContentTemplates",$fileParameters);

        return self::GetATemplate(array("TemplateID"=>$fileID),$output);
    }
    public static function LoadOntoSection($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters,array("SectionID","TemplateID"), $output)) {
            return false;
        }

        if(!self::GetATemplate($parameters,$output)){
            $output["errors"][]=["unable to get all the course content"];
            return false;
        }
        $CourseContentTemplate=$output["results"];

        $CourseContentTemplate=$CourseContentTemplate["CourseContent"]["All"];

        /*******************************************************************/
        $FirstContentID=-1;
        $ContentID=-1;
        foreach($CourseContentTemplate as $index=>$CourseContent){
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

        return CourseContentMeatEater::GetCourseContent($FirstContentID,array(),$output);
    }
}