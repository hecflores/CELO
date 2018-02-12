<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Application\Info;
use Application\Model\Assessment;
use Application\Model\SectionUsersTable;
use Application\Model\Tag;
use Application\Roles;
use Application\Service\LoginService;
use Application\Service\Meat\AnswerableQuestionsMeatEater;
use Application\Service\Meat\AssessmentsMeatEater;
use Application\Service\Meat\CourseContentMeatEater;
use Application\Service\Meat\CourseContentTemplateMeatEater;
use Application\Service\Meat\CoursesMeatEater;
use Application\Service\Meat\QuestionsMeatEater;
use Application\Service\Meat\QuestionTypesMeatEater;
use Application\Service\Meat\RunningAssessmentsMeatEater;
use Application\Service\Meat\UserMeatEater;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zend\Mvc\MvcEvent;
use Zend\View\View;

class RepositoryController extends AbstractActionController
{
    public function onRender(MvcEvent $e)
    {
        $e->getViewModel()->setTemplate("application/tools/json");
    }

    protected $repositoryDetails=array();
    public function Json($obj){
        $v=new ViewModel();
        $v->setTerminal(true);
        $v->setVariable("object",$obj);
        $v->setTemplate("application/tools/json");
        return $v;
    }
    public function onDispach(MvcEvent $e)
    {
        $e->getTarget()->params()->fromQuery("_id_");

        $repositoryDetails=array(
            "assessments" => array(
                "columns"=>array(
                    "all"=>Assessment::getColumns()
                )

            )
        );

    }
    public function getAllParams(){
        return array(
            "post"=>$this->params()->fromPost(),
            "query"=>$this->params()->fromQuery(),
            "route"=>$this->params()->fromRoute());
    }
    public function indexAction()
    {
        return $this->Json(array(
            "developer" => "Hector Flores",
            "program"=>"CELO"
        ));
    }
    function ValidateObjectTemplate($template, $object){

        foreach($template as $name=>$value){
            if(!isset($object->{$name})){
                return false;
            }
            $foundObject=$object->{$name};
            if(is_array($value)){
                if(!$this->ValidateObjectTemplate($value,$foundObject)){
                    return false;
                }
            }
            else{
                if(is_array($foundObject)||is_object($foundObject)){
                    return false;
                }
                if(!preg_match($value,$foundObject)){
                    return false;
                }
            }

        }
        return true;
    }


    /**
     * @param $options
     *        {
     *           "actions":{
     *                  "someEvent":{
     *                       "data":{
     *                            "required":[....],
     *                            "optional":[
     *                                "name":"defaultValue"
     *                            ]
     *                       }
     *                       "runner":function($routePar,$postArgs, &$output,&$data) returns bool
     *           },
     *           "fetchers":{
     *                "default":
     *                       "data":{
     *                            "required":[....],
     *                            "optional":[
     *                                "name":"defaultValue"
     *                            ]
     *                       }
     *                       "runner":function($routePar,$postArgs, &$output,&$data) returns bool
     *           }
     *        }
     * @return ViewModel
     * @throws \Exception
     */
    public function WrapController($options)
    {
        $data=array();
        $output=array(
            "errors"=>array(),
            "data" =>  "Unable able to issue request",
            "request"=>$this->getAllParams(),
            "success" => false
        );

        if($this->getRequest()->isPost())
        {
            $postArgs=$this->params()->fromPost();

            /***************************************************************/
            /* Merge All File and Post Content                             */
            /***************************************************************/
            $files=$this->getRequest()->getFiles()->toArray(); // We need to get the files aswell...
            $postArgs=array_replace_recursive($postArgs,$files);


            if(isset($options["data"])){
                if(isset($options["data"]["required"])){
                    throw new \Exception("Not Implemented Yet");
                }
                if(isset($options["data"]["optional"])){
                    throw new \Exception("Not Implemented Yet");
                }
            }


            if(!isset($options["actions"])){
                $output["data"]="Action was not found";
                return $this->Json($output);
            }
//            else if(!isset($options["actions"]["runner"])){
//                $output["data"]="Action Runner was not found";
//                return $this->Json($output);
//            }

            $postCommands=isset($options["actions"])?$options["actions"]:array();


            /***************************************************************/
            if(!isset($postArgs["__action__"]))
            {
                $output["data"] = "Action Required";
                return $this->Json($output);
            }


            /***************************************************************/
            if(!isset($postCommands[$postArgs["__action__"]])){
                $output["data"] = "Unkown Action {$postArgs["__action__"]}";
                return $this->Json($output);
            }


            /***************************************************************/
            $action=$postArgs["__action__"];
            unset($postArgs["__action__"]);
            if(isset($postArgs["_"])) unset($postArgs["_"]);

            /***************************************************************/
            if(!$postCommands[$action]($this->params()->fromRoute(),$postArgs,$output,$data)){
                $output["results"]["errors"][]="Action $action failed";
                $output["success"]=false;
            }
            else{
                $output["success"]=true;
            }
        }
        if($this->getRequest()->isGet())
        {
            $queryArgs=$this->params()->fromQuery();
            $fetcherCommands=isset($options["fetchers"])?$options["fetchers"]:array();

            $fetcher=isset($queryArgs["__fetcher__"])?$queryArgs["__fetcher__"]:"default";
            if(isset($queryArgs["__fetcher__"])) { unset($queryArgs["__fetcher__"]); }
            if(isset($queryArgs["_"])) unset($queryArgs["_"]);

            /***************************************************************/
            if(!$fetcherCommands[$fetcher]($this->params()->fromRoute(),$queryArgs,$output,$data)){
                $output["data"]="Fetcher $fetcher failed";
                $output["success"]=false;
                return $this->Json($output);
            }
            $output["success"]=true;
        }
        if($this->getRequest()->isDelete()){
            
        }
        if($this->getRequest()->isPatch()){

        }

        $output["data"]=$data;
        return $this->Json($output);

    }

    /***********************************************************************/
    /* Users                                                               */
    /***********************************************************************/
    public function UsersAction()
    {

        return $this->WrapController(array(
            "actions"=>array(
                "find-user"=>function($routePar,$postArgs, &$output,&$data)
                {
                    $users=Info::UserTable()->get(array("UserName"=>$postArgs["username"]))["results"];

                    if(count($users)==0){
                        $data["errors"]=array("No Users Found With that User Name");
                        $data["success"]=false;
                        return false;
                    }
                    $role=$users[0]["Role"];
                    $data["results"]=array("success"=>true,"Role"=>$role);
                    return true;
                },
                "login"=>function($routePar,$postArgs, &$output,&$data)
                {
                    return UserMeatEater::Login($postArgs,$data);
                },
                "logout"=>function($routePar,$postArgs, &$output,&$data)
                {
                    return UserMeatEater::Logout($postArgs,$data);
                },
                "register"=>function($routePar,$postArgs, &$output,&$data){
                    return UserMeatEater::Register($postArgs,$data);
                }


            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    $data=Info::UserTable()->search($query["filters"],true);
                    return true;
                },
                "get-user-profile"=>function($routePar,$postArgs, &$output,&$data){
                    return UserMeatEater::GetProfile($postArgs,$data);
                }
            )
        ));

    }
    public function UserAction()
    {
        return $this->WrapController(array(
            "actions"=>array(
            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return false;
                }
            )
        ));
    }

    /***********************************************************************/
    /* Courses                                                             */
    /***********************************************************************/
    public function CoursesAction()
    {
        return $this->WrapController(array(
            "actions"=>array(
                "create-new-course"=>function($routePar,$postArgs, &$output,&$data)
                {
                    return CoursesMeatEater::createCourse($postArgs,$data);
                },
                "add-section"=>function($routePar,$postArgs, &$output,&$data)
                {
                    return CoursesMeatEater::addSectionToCourse($postArgs,$data);
                }
            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return CoursesMeatEater::getCourses($query,$data);
                }
            )
        ));


    }
    public function CourseAction()
    {

        return $this->WrapController(array(
            "actions"=>array(

            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                }
            )
        ));
    }
    /***********************************************************************/
    /* Sections                                                            */
    /***********************************************************************/
    public function SectionsAction()
    {
        return $this->WrapController(array(
            "actions"=>array(
                "update"=>function($routePar,$postArgs, &$output,&$data)
                {
                    return CoursesMeatEater::UpdateSection($postArgs,$data);
                },
                "add-user-by-uhid"=>function($routePar,$postArgs, &$output,&$data)
                {
                    return CoursesMeatEater::addUHIDToSection($postArgs,$data);
                },
                "add-user-by-userid"=>function($routePar,$postArgs, &$output,&$data)
                {
                    return CoursesMeatEater::addRealUserToSection($postArgs,$data);
                },
            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    $data["results"]=Info::SectionTable()->get($query,true);
                    return true;
                }
            )
        ));

    }
    public function SectionAction()
    {
        return $this->WrapController(array(
            "actions"=>array(

            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return CoursesMeatEater::getSection($routerPar["id"],array(),$data);

                },
                "add"=>function($routerPar,$query, &$output,&$data){
                    return CoursesMeatEater::getSection($routerPar["id"],array(),$data);

                },

            )
        ));


    }
    /***********************************************************************/
    /* Assessments                                                         */
    /***********************************************************************/
    public function AssessmentsAction()
    {
        return $this->WrapController(array(
            "actions"=>array(

            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return AnswerableQuestionsMeatEater::GetAllAnswerableQuestionGroupsWithAnsweringSubmissions($query,$data);
                }
            )
        ));



    }


    public function AssessmentAction()
    {

        return $this->WrapController(array(
            "actions"=>array(

                "update"=>function($routerPar,$postArgs,&$output) {
                    $output["data"] = "Needs update";
                    return false;
                }
            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return AssessmentsMeatEater::getAssessment($routerPar["id"],$data);

                }
            )
        ));
    }

    /***********************************************************************/
    /* Course Content                                                      */
    /***********************************************************************/
    public function CourseContentsAction()
    {
        return $this->WrapController(array(
            "actions"=>array(
                "create-new-content"=>function($routerPar,$postArgs,&$output,&$data)
                {
                    /***************************************************************/
                    return CourseContentMeatEater::CreateNewCourseContent($postArgs["Content"],$data);
                }
            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return CourseContentMeatEater::GetCourseContents($query,$data);
                },
                "by-assessment"=>function($routerPar,$postArray, &$output,&$data){
                    return CourseContentMeatEater::GetCourseContentFromAnswerableQuestionGroup($postArray,$data);
                },
                "by-running-assessment"=>function($routerPar,$postArray, &$output,&$data){
                    return CourseContentMeatEater::GetCourseContentFromAnsweringQuestionsGroup($postArray,$data);
                }

            )
        ));
    }


    public function CourseContentAction()
    {
        return $this->WrapController(array(
            "actions"=>array(
                "save-root-as-template"=>function($routerPar,$postArgs,&$output,&$data){
                    return CourseContentMeatEater::SaveCourseContent($postArgs,$data);
                },
                "create-new-content"=>function($routerPar,$postArgs,&$output,&$data)
                {
                    /***************************************************************/
                    return CourseContentMeatEater::CreateNewCourseContent(array_merge($postArgs,
                                                                                        array("ParentFolderID"=>$routerPar["id"])),$data);
                },
                "delete-course-content"=>function($routerPar,$postArgs,&$output,&$data)
                {
                    return CourseContentMeatEater::DeleteCourseContent($routerPar["id"],$postArgs,$data);
                },
                "update-course-content"=>function($routerPar,$postArgs,&$output,&$data)
                {
                    return CourseContentMeatEater::UpdateCourseContent($routerPar["id"],$postArgs,$data);
                }

            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return CourseContentMeatEater::GetCourseContent($routerPar["id"],$query,$data);
                },
                "grades-per-course-content"=>function($routerPar,$postArray, &$output,&$data){
                    return CourseContentMeatEater::GetCourseContentsGrading($routerPar["id"],$postArray,$data);
                },


            )
        ));

    }
    /***********************************************************************/
    /* Course Content                                                      */
    /***********************************************************************/
    public function CourseContentTemplatesAction()
    {
        return $this->WrapController(array(
            "actions"=>array(
                "create-new-content-template"=>function($routerPar,$postArgs,&$output,&$data)
                {
                    /***************************************************************/
                    return CourseContentTemplateMeatEater::SaveCurrentTemplate($postArgs,$data);
                }
            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return CourseContentTemplateMeatEater::GetTemplates($query,$data);
                },
                "get-mine"=>function($routerPar,$postArray, &$output,&$data){
                    return CourseContentTemplateMeatEater::GetMyTemplates($postArray,$data);
                }
            )
        ));
    }


    public function CourseContentTemplateAction()
    {
        return $this->WrapController(array(
            "actions"=>array(


            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return CourseContentTemplateMeatEater::GetATemplate(array("TemplateID"=>$routerPar["id"]),$data);
                },

            )
        ));

    }
    /***********************************************************************/
    /* Answering Answering Group                                           */
    /***********************************************************************/
    public function AnsweringQuestionsAction()
    {
        return $this->WrapController(array(
            "actions"=>array(

            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return AnswerableQuestionsMeatEater::GetAllAnswerableQuestionGroupsWithAnsweringSubmissions($query,$data);
                }
            )
        ));

    }


    public function AnsweringQuestionAction()
    {
        return $this->WrapController(array(
            "actions"=>array(
                "submit-assessment"=>function($routerPar,$postArgs,&$output,&$data){
                    return AnswerableQuestionsMeatEater::FinishAnsweringGroup($routerPar["id"],$postArgs,$data);
                }
            ),
            "fetchers"=>array(
                "default"=>function($routerPar,$query, &$output,&$data){
                    return AnswerableQuestionsMeatEater::GetGradableItem($routerPar["id"],$query,$data);
                }
            )
        ));


    }
    /***********************************************************************/
    /* Questions                                                           */
    /***********************************************************************/
    public function QuestionsAction()
    {
        return $this->WrapController(array(
            "actions" => array(
                "create-question" => function ($routerPar,$postArgs, &$output, &$data) {
                    return QuestionsMeatEater::InsertQuestion($postArgs, $data);
                },
                "upload-questions" => function ($routerPar,$postArgs, &$output, &$data) {
                    return QuestionsMeatEater::UploadQuestions($postArgs, $data);
                }
            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    return QuestionsMeatEater::getQuestions($query, $data);
                }
            )
        ));

    }

    public function QuestionAction()
    {
        return $this->WrapController(array(
            "actions" => array(

            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    $data="Not Implemented";
                    return false;
                }
            )
        ));
    }
    /***********************************************************************/
    /* Questions                                                           */
    /***********************************************************************/
    public function QuestionPoolsAction()
    {
        return $this->WrapController(array(
            "actions" => array(
                "create-question-pool" => function ($routerPar,$postArgs, &$output, &$data) {
                    return QuestionsMeatEater::CreateQuestionPool($postArgs, $data);
                }
            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    return QuestionsMeatEater::GetQuestionPools($query, $data);
                }
            )
        ));

    }

    public function QuestionPoolAction()
    {
        return $this->WrapController(array(
            "actions" => array(
                "add-question" => function ($routerPar,$postArgs, &$output, &$data) {
                    $postArgs["QuestionsPoolID"]=$routerPar["id"];
                    return QuestionsMeatEater::InsertQuestion($postArgs, $data);
                },
                "update" => function ($routerPar,$postArgs, &$output, &$data) {
                    $postArgs["QuestionsPoolID"]=$routerPar["id"];
                    return QuestionsMeatEater::UpdateQuestionPool($postArgs, $data);
                }
            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    $query["QuestionsPoolID"]=$routerPar["id"];
                    return QuestionsMeatEater::GetQuestionPools($query, $data);
                }
            )
        ));
    }


    /***********************************************************************/
    /* Answered Answers                                                    */
    /***********************************************************************/
    public function AnsweredQuestionsAction()
    {
        return $this->WrapController(array(
            "actions" => array(

            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    $data="Not Implemented";
                    return false;
                }
            )
        ));
    }
    public function AnsweredQuestionAction()
    {
        return $this->WrapController(array(
            "actions" => array(

            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    $data="Not Implemented";
                    return false;
                }
            )
        ));
    }

    /***********************************************************************/
    /* Answerable Answers                                                  */
    /***********************************************************************/
    public function AnswerableQuestionsAction()
    {

        return $this->WrapController(array(
            "actions" => array(

            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    return AnswerableQuestionsMeatEater::GetAnsweringQuestionsGroupQuestions($query,$data);
                }
            )
        ));


    }



    public function AnswerableQuestionAction()
    {

        return $this->WrapController(array(
            "actions" => array(
                "start-assessment"=>function($routerPar,$postArgs,&$output,&$data){
                    return AnswerableQuestionsMeatEater::CreateNewAnsweringQuestionGroup($routerPar["id"],$postArgs,$data);
                },
                "answer-question"=>function($routerPar,$postArgs, &$output,&$data) {
                    return AnswerableQuestionsMeatEater::AnswerAQuestion($routerPar["id"],$postArgs, $data);
                },
            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    return AnswerableQuestionsMeatEater::getAnswerableQuestion($routerPar["id"],$query, $data);
                }
            )
        ));


    }
    /***********************************************************************/
    /* Answerable Items                                                    */
    /***********************************************************************/
    public function AnswerableItemsAction()
    {
        return $this->WrapController(array(
            "actions" => array(

            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data)
                {

                    return AnswerableQuestionsMeatEater::GetAllAnswerableQuestionGroupsWithAnsweringSubmissions($query,$data);
                }
            )
        ));


    }
    public function AnswerableItemAction()
    {
        return $this->WrapController(array(
            "actions" => array(
                "update" => function ($routerPar, $query, &$output, &$data) {
                    return AnswerableQuestionsMeatEater::UpdateAnswerableQuestionGroup($routerPar["id"],$query,$data);
                }

            ),
            "fetchers" => array(
//                "default" => function ($routerPar, $query, &$output, &$data) {
//                    return AnswerableQuestionsMeatEater::GetAllAnswerableQuestionGroupsWithAnsweringSubmissions($routerPar["id"],$query,$data);
//                }
            )
        ));


    }


    /***********************************************************************/
    /* Question Types                                                      */
    /***********************************************************************/
    public function QuestionTypesAction()
    {
        return $this->WrapController(array(
            "actions" => array(
            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    return QuestionTypesMeatEater::getQuestionTypes($query,$data);
                }
            )
        ));

    }
    public function QuestionTypeAction()
    {
        return $this->WrapController(array(
            "actions" => array(

            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    $data="Not Implemented";
                    return false;
                }
            )
        ));

    }
    public function tagsAction()
    {

        return $this->WrapController(array(
            "actions" => array(

            ),
            "fetchers" => array(
                "default" => function ($routerPar, $query, &$output, &$data) {
                    $data="Not Implemented";
                    return false;
                }
            )
        ));




    }


}
