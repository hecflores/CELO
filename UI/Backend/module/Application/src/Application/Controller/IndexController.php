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
use Application\Roles;
use Application\Service\LoginService;
use SebastianBergmann\CodeCoverage\CodeCoverage;
use SebastianBergmann\CodeCoverage\Driver\Xdebug;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Mvc\MvcEvent;
use Zend\View\View;

class IndexController extends AbstractActionController
{

    protected $xdebug;

    public function onDispatch(MvcEvent $e)
    {


        $navigation=new ViewModel();
        $navigation->setTemplate("layout/navigation");

        $banner=new ViewModel();
        $banner->setTemplate("layout/banner");

        $e->getViewModel()->addChild($navigation,"navigation");
        $e->getViewModel()->addChild($banner,"banner");
        //e->getViewModel()->setTemplate("visitors/layout");
        $parent=parent::onDispatch($e); // TODO: Change the autogenerated stub

        return $parent;//parent::onDispatch($e); // TODO: Change the autogenerated stub


    }

    public function indexAction()
    {
        $view=new ViewModel();
        if(Info::LoginService()->Authorize(Roles::All(),false)){
            $this->redirect()->toUrl(Roles::GetRoleUrl());
        }
        return $view;
    }

    public function loginAction()
    {

        $view=new ViewModel();
        $view->setTemplate("application/login");

        if(Info::LoginService()->Authorize(Roles::All(),false)){
            $this->redirect()->toUrl(Roles::GetRoleUrl());
        }
        return $view;
    }


}
