<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/31/2017
 * Time: 2:38 AM
 */

namespace Application\Service\Meat;


use Application\Info;
use Application\Model\Course;
use Application\Model\Section;
use Application\Model\SectionUsers;
use Application\Model\User;
use Application\Roles;
use Application\Service\APIHelper;

class CoursesMeatEater
{

    /**
     * @param $parameters
     * @param $output
     * @return bool
     */
    public static function UpdateSection($parameters, &$output){
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters,array_keys(Section::getPrimaryKey()), $output)) {
            return false;
        }


        /*******************************************************************/
        /* Course                                                          */
        /*******************************************************************/
        if(isset($parameters["Course"]))
        {

            $courseUpdates=array_intersect_key($parameters["Course"],Course::getColumns());
            $courseUpdates=array_diff_key($courseUpdates,Course::getPrimaryKey());
            $courseCondition=array_intersect_key($parameters["Course"],Course::getPrimaryKey());
            if(!Info::PerformUpdate("Courses",$courseCondition,$courseUpdates,$output)){
                $output["errors"][]="Unable to update course";
                return false;
            }
        }

        /*******************************************************************/
        /* Section                                                         */
        /*******************************************************************/
        $sectionUpdates=array_intersect_key($parameters,Section::getColumns());
        $sectionUpdates=array_diff_key($sectionUpdates,Section::getPrimaryKey());
        $sectionCondition=array_intersect_key($parameters,Section::getPrimaryKey());
        if(!Info::PerformUpdate("Sections",$sectionCondition,$sectionUpdates,$output)){
            $output["errors"][]="Unable to update section";
            return false;
        }

        /*******************************************************************/
        if(isset($parameters["Users"])) {

            $users=array_map(function($item){
                return array_intersect_key($item,array("UserID"=>true,"UHID"=>true));
            },$parameters["Users"]);

            if(!self::addUHIDToSection($users,$output)){
                $output["errors"][]="Unable to add users";
                return false;
            }

        }
        return self::getSection($parameters["SectionID"],array(),$output);










    }

    public static function addRealUserToSection($parameters, &$output)
    {
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array(
            "UserID",
            "SectionID"
        ), $output)) {
            return false;
        }

        if(is_array($parameters["UserID"])){

            foreach($parameters["UserID"] as $userID){
                $newParameters=$parameters;
                $newParameters["UserID"]=$userID;
                if(!self::addRealUserToSection($newParameters,$output)){
                    return false;
                }
            }
            $output["results"]=array("status"=>true);
            return true;
        }

        $id=Info::PerformInsert("SectionUsers",array(
            "SectionID"=>$parameters["SectionID"],
            "AddedOn"=>date('m-d-Y H:i:s'),
            "AssignedBy"=>Info::getCurrentUser()->getUserID(),
            "UserID"=>$parameters["UserID"]));

        if($id==null){
            $output["errors"][]="No Id Returned after insert";
            return false;
        }
        $output["results"]=array("status"=>true);
        return true;
    }
    public static function addUHIDToSection($parameters, &$output)
    {

        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array(
            "SectionID",
            "UHID"
        ), $output)) {
            return false;
        }
        if(is_array($parameters["UHID"])){

            foreach($parameters["UHID"] as $userID){
                $newParameters=$parameters;
                $newParameters["UHID"]=$userID;
                if(!self::addUHIDToSection($newParameters,$output)){
                    return false;
                }
            }
            $output["results"]=array("status"=>true);
            return true;
        }


        $id=Info::PerformInsert("SectionUsers",array(
            "SectionID"=>$parameters["SectionID"],
            "AddedOn"=>date('Y-m-d H:i:s'),
            "AssignedBy"=>Info::getCurrentUser()->getUserID(),
            "UHID"=>$parameters["UHID"]));

        if($id==null){
            $output["errors"][]="No Id Returned after insert";
            return false;
        }

        return true;
    }



    public static function addSectionToCourse($parameters, &$output)
    {
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array(
            "CourseUniqueID",
            "SectionNumber",
            "TemplateID"
        ), $output)) {
            return false;
        }

        /*******************************************************************/
        /* First make the Section                                          */
        /*******************************************************************/
        $parameters["CreatedBy"]=Info::getCurrentUser()->getUserID();

        $SectionParam=array_intersect_key($parameters,Section::getColumns());
        $id=Info::PerformInsert("Sections",$SectionParam);

        /*******************************************************************/
        /* Get the Course                                                  */
        /*******************************************************************/
        if(!self::getCourse($parameters["CourseUniqueID"],array(),$temp)){
            $output["errors"][]="This makes no sense, no course found";
            return false;
        }
        $course=$temp["results"];

        /*******************************************************************/
        /* Add the Current User to the Section                             */
        /*******************************************************************/
        Info::PerformInsert("SectionUsers",array(
            "SectionID"=>$id,
            "AddedOn"=>date('Y-m-d H:i:s'),
            "AssignedBy"=>Info::getCurrentUser()->getUserID(),
            "UserID"=>Info::getCurrentUser()->getUserID()
        ));

        $parameters["SectionID"]=$id;
        if($parameters["TemplateID"]!=null){
            if(!CourseContentTemplateMeatEater::LoadOntoSection($parameters,$output)){
                $output["errors"][]="Plan Didnt work";
                return false;
            }
            $CourseContent=$output["results"];

            Info::PerformUpdate("Sections",
                array(
                    "SectionID"=>$id
                ),
                array("MainCourseContentID"=>$CourseContent["ContentID"]));

            return self::getCourse($course["CourseUniqueID"],array(),$output);
        }


        /*******************************************************************/
        /* Creating Course Content For Section                             */
        /*******************************************************************/
        $courseContentID=Info::PerformInsert("CourseContent",array(
            "SectionID"=>$id,
            "Name"=>$course["CourseCategory"]." ".$course["CourseID"]."(".$parameters["SectionNumber"].")",
            "Description"=>$course["Description"],
            "Type"=>"course",
            "Properties"=>"{'SectionID':'$id'}",
            "CourseContentNumber" => 0,
            "RootContentID"=>0,
            "Gradable"=>true,
            "Depth"=>0,
            "CreatedBy"=>Info::getCurrentUser()->getUserID()
        ));

        /*******************************************************************/
        /* Needed for traversal                                            */
        /*******************************************************************/
        Info::PerformUpdate("CourseContent",
            array(
                "CourseContentID"=>$courseContentID),
            array(
                "RootContentID"=>$courseContentID
            ));

        /*******************************************************************/
        /* Update the Sections                                             */
        /*******************************************************************/
        Info::PerformUpdate("Sections",
            array(
                "SectionID"=>$id
            ),
            array("MainCourseContentID"=>$courseContentID));

        return self::getCourse($course["CourseUniqueID"],array(),$output);



    }
    public static function createCourse($parameters, &$output)
    {
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array(
            "CourseName",
            "CourseCategory",
            "CourseID",
            "Description",
            "TemplateID"
        ), $output)) {
            return false;
        }

        /********************************************************************/
        $parameters["CreatedBy"]=Info::getCurrentUser()->getUserID();
        $parameters["CourseStatus"]="Online";

        $parametersForCourse=array_intersect_key($parameters,Course::getColumns());
        /********************************************************************/
        $id=Info::PerformInsert("Courses",$parametersForCourse);


        /********************************************************************/
        if(!self::getCourses(array("CourseUniqueID"=>$id,"IgnoreUser"=>true),$temp)){
            $output["errors"][]="Unable to get created course";
            return false;
        }

        /********************************************************************/
        return self::addSectionToCourse(array(
            "CourseUniqueID"=>$id,
            "SectionNumber"=>1234,
            "TemplateID"=>$parameters["TemplateID"]),$output

            );



    }
    public static function getCourse($id,$parameters, &$output){
        MeatEater::InitializeOutput($output);
        if (!MeatEater::CheckParameters($parameters, array(), $output)) {
            return false;
        }

        
        if(!self::getCourses(array("CourseUniqueID"=>$id),$temp)){
            $output["errors"][]="Unable to get created course";
            return false;
        }
        $output["results"]=$temp["results"][0];
        return true;

    }
    public static function getSection($SectionID, $parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            $output["errors"][]="What...";
            return false;
        }
        $section=APIHelper::QuickFetch(
            "Sections",
            array("SectionID"=>$SectionID),
            Section::getColumns(),
            function($item)
            {
                $course=new Section();
                $course->exchangeArray($item);
                $data=$course->getData();
                return $data;
            }
        )["results"][0];

        if(!self::getCourses(array("SectionID"=>$SectionID,"CourseUniqueID"=>$section["CourseUniqueID"],"IgnoreUser"=>true),$output)){
            $output["errors"][]="Unable to find the course associated with the section";
            return false;
        }
        if(count($output["results"])==0){
            $output["errors"][]="No Course Found with this Section($SectionID)";
            return false;
        }
        $course=$output["results"][0];
        $section=$course["Sections"][0];

        /********************************************************************/
        /* Get the Course Content                                           */
        /********************************************************************/
        if(!CourseContentMeatEater::GetCourseContent($section["MainCourseContentID"],array(),$output)){
            $output["errors"][]="Unable to get the Course Content";
            return false;
        }
        $courseContent=$output["results"];

        $output["results"]=$section;
        $output["results"]["Course"]=$course;
        $output["results"]["CourseContent"]=$courseContent;
        return true;



        /********************************************************************/
        /* Get the Course                                                   */
        /********************************************************************/
        $course=APIHelper::QuickFetch(
            "Courses",
            array("CourseUniqueID"=>$section["CourseUniqueID"]),
            array("CourseUniqueID"=>true),
            function($item)
            {
                $course=new Course();
                $course->exchangeArray($item);
                return $course->getData();
            }
        )["results"][0];

        /********************************************************************/
        /* Get the Course Content                                           */
        /********************************************************************/
        if(!CourseContentMeatEater::GetCourseContent($section["MainCourseContentID"],array(),$output)){
            $output["errors"][]="Unable to get the Course Content";
            return false;
        }
        $courseContent=$output["results"];

        /********************************************************************/
        /* Build What is needed to get the users                            */
        /********************************************************************/
        $users=APIHelper::QuickFetch(
            "CourseSectionsReport",
            array("SectionID"=>$SectionID),
            array("SectionID"=>true),
            function($item)
            {
                $course=new SectionUsers();
                $course->exchangeArray($item);
                $data=$course->getData();

                $user=array_intersect_key($item,User::getColumns());
                return $user;
            }
        )["results"];



        /********************************************************************/
        $section["FullDescription"]=$section["SectionNumber"]."-".$course["CourseCategory"]."".$course["CourseID"]."-".$course["CourseName"];
        $section["Course"]=$course;
        $section["CourseContent"]=$courseContent;
        $section["Users"]=$users;



        $output["results"]=$section;
        return true;



    }

    public static function getCourses($parameters, &$output){
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        $parameters["filters"]=isset($parameters["filters"])?$parameters["filters"]:array();

        $parametersForCourses=array();
        $parametersForSections=array();
        if(isset($parameters["filters"])){
            $parametersForCourses["filters"]=array();
            foreach(Course::getColumns() as $key=>$course){
                if(isset($parameters[$key])){
                    $parametersForCourses["filters"][$key]=$parameters[$key];

                }
            }

            $parametersForSections["filters"]=array();
            foreach(Section::getColumns() as $section){
                if(isset($parameters["filters"][$section])){
                    $parametersForSections["filters"][$section]=$parameters["filters"][$section];
                }
            }
        }
//        if(MeatEater::GetAndRemoveField($parameters,"IgnoreUser")==null) {
//            $parametersForCourses["filters"]["CreatedBy"] = Info::getCurrentUser()->getUserID();
//        }
//
//
//        $coursesRaw=APIHelper::QuickFetch(
//            "Courses",
//            $parametersForCourses,
//            array(
//                "CourseUniqueID"=>true,
//                "CourseName"=>true,
//                "CourseCategory"=>true,
//                "Setup"=>true,
//                "CourseID"=>true,
//                "Description"=>true,
//                "CourseStatus"=>true,
//                "CreatedBy"=>true,
//            ),
//            function($item)
//            {
//                $course=new Course();
//
//                $course->exchangeArray($item);
//
//                return $course->getData();
//            }
//        )["results"];

        if(MeatEater::GetAndRemoveField($parameters,"IgnoreUser")==null) {
            $parameters["filters"]["UserID"] = Info::getCurrentUser()->getUserID();
        }
        $courses=APIHelper::QuickFetch(
            "CourseSectionsReport",
            $parameters,
            array(
                "CourseUniqueID"=>true,
                "CourseName"=>true,
                "CourseCategory"=>true,
                "Setup"=>true,
                "CourseID"=>true,
                "Description"=>true,
                "CourseStatus"=>true,
                "SectionID"=>true,
                "SectionNumber"=>true,
                "StartDate"=>true,
                "EndDate"=>true,
                "Location"=>true,
                "TextBookInformation"=>true,
                "CreatedBy"=>true,
                "AssignedBy"=>true,
                "UserID"=>true,
                "MainCourseContentID"=>true,
            ),
            function($item)
            {
                $course=new Course();
                $section=new Section();
                $user=new User();
                $course->exchangeArray($item);
                $section->exchangeArray($item);
                $user->exchangeArray($item);
                $data=array(
                    "Course"=>$course->getData(),
                    "Section"=>$section->getData(),
                    "User"=>array_merge($user->getData(),array("isActive"=>$item["isActive"]==1)));

                $data["Section"]["urls"]=array
                (
                    "home"=>Roles::GetRoleUrl("section/".$data["Section"]["SectionID"])
                );

                return $data;
            }

        )["results"];


        $sections=array_map(function($item){
            return $item["Section"];
        },$courses);
        $users=array_map(function($item){
            return array_merge($item["User"],
                array( "SectionID"=>$item["Section"]["SectionID"]));

        },$courses);



        $newCourses=array();
        $coursesIndexer=array();

        /********************************************************************/
        foreach($courses as $course) {
            if(isset($coursesIndexer[$course["Course"]["CourseUniqueID"]])){
                continue;
            }
            $coursesIndexer[$course["Course"]["CourseUniqueID"]] = $course["Course"];
            $coursesIndexer[$course["Course"]["CourseUniqueID"]]["SectionsIndexing"]=array();
            $coursesIndexer[$course["Course"]["CourseUniqueID"]]["Sections"]=array();
            $coursesIndexer[$course["Course"]["CourseUniqueID"]]["Users"]=array();
        }

        /********************************************************************/
        foreach($sections as $section)
        {
            if($section["SectionID"]==null || isset($coursesIndexer[$section["CourseUniqueID"]]["SectionsIndexing"][$section["SectionID"]])){
                continue;
            }
            $coursesIndexer[$section["CourseUniqueID"]]["SectionsIndexing"][$section["SectionID"]]=true;
            $section["Users"]=array();
            foreach($users as $user)
            {
                if($user["SectionID"]!=$section["SectionID"]){
                    continue;
                }
                $section["Users"][]=$user;
            }
            $coursesIndexer[$section["CourseUniqueID"]]["Sections"][]=$section;
        }


        /********************************************************************/
//        foreach($coursesIndexer as $courseIdentifier=>$course) {
//            if(!isset($course[$course["CourseCategory"]])){
//                $newCourses[$course["CourseCategory"]]=array();
//            }
//            if(!isset($course[$course["CourseCategory"]][$course["CourseID"]])){
//                $newCourses[$course["CourseCategory"]][$course["CourseID"]]=array();
//
//                continue;
//            }
//            $settingCourse=$course;
//            $newCourses[$course["CourseCategory"]][$course["CourseID"]][]=$settingCourse;
//
//        }
        foreach($coursesIndexer as $courseIdentifier=>$course) {
            $newCourses[] = $course;
        }


        /********************************************************************/
        $output["results"]=$newCourses;
        return true;


    }
}