<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Application\Model\ActiveQuestionsTable;
use Application\Model\AnswerableQuestion;
use Application\Model\AnsweringQuestionsGroup;
use Application\Model\Assessment;
use Application\Model\AssessmentTable;
use Application\Model\Course;
use Application\Model\CourseContent;
use Application\Model\CourseContentTable;
use Application\Model\CourseStatusTable;
use Application\Model\CourseTable;
use Application\Model\Files;
use Application\Model\FilesTable;
use Application\Model\Invitation;
use Application\Model\InvitationReasons;
use Application\Model\InvitationReasonsTable;
use Application\Model\InvitationTable;
use Application\Model\Question;
use Application\Model\QuestionsTable;
use Application\Model\QuestionType;
use Application\Model\QuestionTypesTable;
use Application\Model\Section;
use Application\Model\SectionUsers;
use Application\Model\SectionUsersTable;
use Application\Model\SectionTable;
use Application\Model\Tag;
use Application\Model\TagTable;
use Application\Model\User;
use Application\Model\UserSession;
use Application\Model\UserSessionTable;
use Application\Model\UserTable;
use Application\Service\Helper;
use Application\Service\Item;
use Application\Service\LoginService;
use Slim\View;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\Feature\MetadataFeature;
use Zend\Db\TableGateway\TableGateway;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\ViewModel;

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        /* include_once __DIR__."/../../vendor/phpmailer/phpmailer/PHPMailerAutoload.php"; */

        ini_set('memory_limit', '-1');

        Info::setEvent($e);
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);


        Info::Helper()->getMenuGroups()->heading->getItems();
        Info::Helper()->getMenuGroups()->subMenu->getItems();
        Info::Helper()->getMenuGroups()->userInfo->isRight();
        Info::Helper()->getMenuGroups()->userAction->isRight();


        /*******************************************************************/
        /* Events. Here we exploit all the possible events from Zend       */
        /*******************************************************************/
        $e->getApplication()->getEventManager()->attach("render",function($e)
        {
            /** @var MvcEvent $e */
            if(isset($_GET['ajax']) || isset($_POST['ajax'])){
                $e->getViewModel()->setTemplate("layout/empty");
            }

            /***************************************************************/
            /* Route Not Found. Rendering React Code                       */
            /***************************************************************/
            if($e->getRouteMatch()==null){
                $e->getResponse()->setStatusCode(200);
                $react=new ViewModel();
                $react->setTemplate('react/index');
                $e->getViewModel()->addChild($react,"content");
                return;
            }

            /***************************************************************/
            /* Putting a title on the page                                 */
            /***************************************************************/
            Info::Helper()->getMenuGroups()->heading->link(Info::DispatchedClass()." ".$e->getParam("title"),"/admin/login",array("color"=>"white","font-size"=>"25px"));

        });

        /*******************************************************************/
        $e->getApplication()->getEventManager()->attach(MvcEvent::EVENT_DISPATCH,function($e2)
        {

            /** @var MvcEvent $e2 */
            Info::setDispatchedClass(array_slice(explode('\\', get_class($e2->getTarget())), 0, -1)[0]);

            /***************************************************************/
            /* Handle Redirects                                            */
            /***************************************************************/
            $redirect=$e2->getParam("redirect");
            if(isset($redirect)){
                //echo "Redirect to $redirect";
                $e2->getTarget()->redirect()->toUrl($redirect);
            }
        });

        /*******************************************************************/
        $e->getApplication()->getEventManager()->attach(MvcEvent::EVENT_ROUTE,function($e2)
        {
            /** @var MvcEvent $e2 */



            /***************************************************************/
            /* Make sure I didn't forget to specify the roles available    */
            /***************************************************************/
            $roles=$e2->getRouteMatch()->getParam('roles');
            $title=$e2->getRouteMatch()->getParam('title');
            if(!isset($roles) || !isset($title)) {
                throwException(new \Exception("There were no roles/titles specified for this page. Please check settings."));
            }

            /***************************************************************/
            /* Deal With Authorizing the User                              */
            /***************************************************************/
            if(!Info::LoginService()->IsAuthorized($roles)){
                if(count($roles)==1) {
                    Roles::SetRole($roles[0]);
                    Info::Redirect(Roles::GetRoleUrl("login"));
                }
                else
                {
                    Roles::SetRole('');
                    Info::Redirect(Roles::GetRoleUrl("login"));

                }
                Roles::SetRole(Roles::$GUEST);
            }

            $e2->setParam("title",$title);
            if(Info::getCurrentUser()->isLoggedOn())
            {
                Info::Helper()->getMenuGroups()->userInfo
                    ->{Roles::GetRole()}->headLink(Roles::GetRole(), Roles::GetRoleUrl(""), array(
                        'font-size' => '25px',
                        'color' => 'white',
                    ))->link("Home", Roles::GetRoleUrl(""), array("font-weight" => "bold", "font-size" => '20px'))
                    ->link("Logout", Roles::GetRoleUrl("logout"), array('color' => 'red', "font-size" => '20px', 'font-weight' => 'bold'));
            }
            else{
                Info::Helper()->getMenuGroups()
                    ->userAction
                    ->{"Login"}->headLink("Login",Roles::GetRoleUrl(""),array(
                        'font-size'=>'25px',
                        'color'=>'white',
                    ))
                    //->link("Student","/student/login",array("font-weight"=>"bold","font-size"=>'20px'))
                    ->link("Student","/student/login",array("font-weight"=>"bold","font-size"=>'20px'))
                    ->link("Instructor","/instructor/login",array("font-weight"=>"bold","font-size"=>'20px'))
                    ->link("TA","ta/login",array("font-weight"=>"bold","font-size"=>'20px'))
                    ->link("Administrator","/administrator/login",array("font-weight"=>"bold","font-size"=>'20px'));
            }

        });


    }
    public function test(MvcEvent $e)
    {
        if(isset($_GET['ajax']) || isset($_POST['ajax'])){
            $e->getViewModel()->setTemplate("layout/empty");
            return;
        }
    }
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }
    protected $loadedAlready=false;
    public function LoadConsumeFiles()
    {
        if($this->loadedAlready){
            return;
        }
        //todo Doing for now, dont know why zend doesnt load it
        include_once __DIR__.'/src/Application/Service/LoginService.php';
        include_once __DIR__.'/src/Application/Service/Helper.php';
        include_once __DIR__.'/src/Application/Service/APIHelper.php';
        include_once __DIR__.'/src/Application/Service/Meat/AssessmentsMeatEater.php';
        include_once __DIR__.'/src/Application/Service/Meat/RunningAssessmentsMeatEater.php';
        include_once __DIR__.'/src/Application/Service/Meat/AnswerableQuestionsMeatEater.php';
        include_once __DIR__.'/src/Application/Service/Meat/CourseContentMeatEater.php';
        include_once __DIR__.'/src/Application/Service/Meat/MeatEater.php';
        include_once __DIR__.'/src/Application/Service/Meat/CoursesMeatEater.php';
        include_once __DIR__.'/src/Application/Service/Meat/QuestionsMeatEater.php';
        include_once __DIR__.'/src/Application/Service/Meat/QuestionTypesMeatEater.php';
        include_once __DIR__.'/src/Application/Service/Meat/QuestionTypesMeatEater.php';
        include_once __DIR__.'/src/Application/QuestionUploaders/QuestionsUploader.php';
        include_once __DIR__.'/src/Application/QuestionUploaders/PublisherQuestionUploader.php';
        include_once __DIR__.'/src/Application/Service/Meat/UserMeatEater.php';
        include_once __DIR__.'/src/Application/Service/FileUploader.php';
        include_once __DIR__.'/src/Application/Service/FileUploader.php';
        include_once __DIR__.'/src/Application/Service/Meat/CourseContentTemplateMeatEater.php';



        $this->loadedAlready=true;
    }
    public function getServiceConfig()
    {
        return array(

            'factories' => array(

                'Helper' => function($sm) {
                    $this->LoadConsumeFiles();
                    return new Helper($sm);
                },

                'LoginService' => function($sm) {
                    $this->LoadConsumeFiles();
                    return new LoginService($sm);
                },
                /***********************************************************/
                'AnsweringQuestionsGroupTable' =>  function($sm) {
                    $tableGateway = $sm->get('AnsweringQuestionsGroupGateway');
                    $table = new FilesTable($tableGateway);
                    return $table;
                },
                'AnsweringQuestionsGroupGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new AnsweringQuestionsGroup());
                    return new TableGateway('AnsweringQuestionsGroup', $dbAdapter, null, $resultSetPrototype);
                },
                /***********************************************************/
                'FilesTable' =>  function($sm) {
                    $tableGateway = $sm->get('FilesTableGateway');
                    $table = new FilesTable($tableGateway);
                    return $table;
                },
                'FilesTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Files());
                    return new TableGateway('Files', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'ActiveQuestionsTable' =>  function($sm) {
                    $tableGateway = $sm->get('ActiveQuestionsTableGateway');
                    $table = new ActiveQuestionsTable($tableGateway);
                    return $table;
                },
                'ActiveQuestionsTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new AnswerableQuestion());
                    return new TableGateway('AnsweredQuestions', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'TagTable' =>  function($sm) {
                    $tableGateway = $sm->get('TagTableGateway');
                    $table = new TagTable($tableGateway);
                    return $table;
                },
                'TagTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Tag());
                    return new TableGateway('Tags', $dbAdapter, null, $resultSetPrototype);
                },
                /***********************************************************/
                'AssessmentTable' =>  function($sm) {
                    $tableGateway = $sm->get('AssessmentTableGateway');
                    $table = new AssessmentTable($tableGateway);
                    return $table;
                },
                'AssessmentTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Assessment());
                    return new TableGateway('Assessments', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'CourseContentTable' =>  function($sm) {
                    $tableGateway = $sm->get('CourseContentTableGateway');
                    $table = new CourseContentTable($tableGateway);
                    return $table;
                },
                'CourseContentTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new CourseContent());
                    return new TableGateway('CourseContent', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'SectionUsersTable' =>  function($sm) {
                    $tableGateway = $sm->get('SectionUsersTableGateway');
                    $table = new SectionUsersTable($tableGateway);
                    return $table;
                },
                'SectionUsersTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new SectionUsers());
                    return new TableGateway('SectionUsers', $dbAdapter, null, $resultSetPrototype);
                },


                /***********************************************************/
                'QuestionsTable' =>  function($sm) {
                    $tableGateway = $sm->get('QuestionsTableGateway');
                    $table = new QuestionsTable($tableGateway);
                    return $table;
                },
                'QuestionsTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Question());
                    return new TableGateway('QuestionsReport', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'QuestionTypeTable' =>  function($sm) {
                    $tableGateway = $sm->get('QuestionTypeTableGateway');
                    $table = new QuestionTypesTable($tableGateway);
                    return $table;
                },
                'QuestionTypeTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new QuestionType());
                    return new TableGateway('QuestionTypesReport', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'SectionTable' =>  function($sm) {
                    $tableGateway = $sm->get('SectionTableGateway');
                    $table = new SectionTable($tableGateway);
                    return $table;
                },
                'SectionTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Section());
                    return new TableGateway('Sections', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'InvitationReasonsTable' =>  function($sm) {
                    $tableGateway = $sm->get('InvitationReasonsTableGateway');
                    $table = new InvitationReasonsTable($tableGateway);
                    return $table;
                },
                'InvitationReasonsTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new InvitationReasons());
                    return new TableGateway('InvitationReasons', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'InvitationTable' =>  function($sm) {
                    $tableGateway = $sm->get('InvitationTableGateway');
                    $table = new InvitationTable($tableGateway);
                    return $table;
                },
                'InvitationTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Invitation());
                    return new TableGateway('Invitation', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'CoursesStatusTable' =>  function($sm) {
                    $tableGateway = $sm->get('CoursesStatusTableGateway');
                    $table = new CourseStatusTable($tableGateway);
                    return $table;
                },
                'CoursesStatusTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\CourseStatus());
                    return new TableGateway('CourseStatus', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'CoursesTable' =>  function($sm) {
                    $tableGateway = $sm->get('CoursesTableGateway');
                    $table = new CourseTable($tableGateway);
                    return $table;
                },
                'CoursesTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Course());
                    return new TableGateway('Courses', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'UsersTable' =>  function($sm) {
                    $tableGateway = $sm->get('UserTableGateway');
                    $table = new UserTable($tableGateway);
                    return $table;
                },
                'UserTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new User());
                    return new TableGateway('Users', $dbAdapter, null, $resultSetPrototype);
                },

                /***********************************************************/
                'Application\Model\UserSessionTable' =>  function($sm) {
                    $tableGateway = $sm->get('UserSessionTableGateway');
                    $table = new UserSessionTable($tableGateway);
                    return $table;
                },
                'UserSessionTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new UserSession());
                    return new TableGateway('UserSessions', $dbAdapter, null, $resultSetPrototype);
                },

            ),
        );
    }
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                    __NAMESPACE__.'\Controller' => __DIR__ . '/src/' . __NAMESPACE__."/Controller",

                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__."/StaticModels",
                    __NAMESPACE__.'\Model' => __DIR__ . '/src/' . __NAMESPACE__."/Model",
                    __NAMESPACE__.'\Tables' => __DIR__ . '/src/' . __NAMESPACE__."/Tables",
                ),


            ),
        );
    }
}
