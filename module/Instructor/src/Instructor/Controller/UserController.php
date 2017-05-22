<?php
/**unknown*/

namespace Instructor\Controller;


use Application\Info;
use Application\Model\Section;
use Application\Roles;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\MvcEvent;
use Zend\Permissions\Rbac\Role;
use Zend\View\Model\ViewModel;

class UserController  extends AbstractActionController
{
    public function authenticate()
    {
        $this->getEventManager()->trigger(
            "authenticating",
            $this,
            array( "roles"    => array(__NAMESPACE__)));
    }
    public function onDispatch(MvcEvent $e)
    {
        /*******************************************************************/
        /* User Check                                                      */
        /*******************************************************************/
        $this->getEventManager()->trigger( "authenticating",$this,array( "roles"=> array(__NAMESPACE__)));

        /*******************************************************************/
        $navigation=new ViewModel();
        $navigation->setTemplate("layout/staff/navigation");


        $e->getViewModel()->addChild($navigation,"navigation");

        $parent=parent::onDispatch($e); // TODO: Change the autogenerated stub

        /*******************************************************************/
        /* Basic Links
        /*******************************************************************/
        Info::Helper()->getMenuGroups()->subMenu->openWindow("Questions","/questions");
        Info::Helper()->getMenuGroups()->subMenu->openWindow("Grades",Roles::GetRoleUrl("grades"));

        /*******************************************************************/
        return $parent;
    }

    public function indexAction()
    {
        $view=new ViewModel();
        $view->setTemplate('user/home');

        return $view;
    }
    public function logoutAction()
    {
        Info::LoginService()->SignOut();

        $this->redirect()->toRoute("instructor/login");
    }
    public function sectionHomeAction(){




        $view=new ViewModel();
        $view->setTemplate('user/section/home');
        $sectionID=$this->params()->fromRoute("sectionID");
        $section=Info::SectionTable()->getFromID($sectionID);
        /** @var Section $section */
        if($section==null){
            return Info::getErrorView("Section unkown <span class='label label-primary'>$sectionID</span></h2>");
        }

        $contentID=$this->params()->fromRoute("contentID");
        if(!isset($contentID)){
            $contentID=$section->getMainCourseContentID();
        }
        $courseContent=Info::CourseContentTable()->getByID($contentID);
        $view->setVariable("contentItem",$courseContent);

        $view->setVariable("section",$section);

        return $view;
    }




}