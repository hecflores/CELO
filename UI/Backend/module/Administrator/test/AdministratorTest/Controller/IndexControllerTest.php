<?php
//namespace AdministratorTest\Controller;
//use Administrator\Controller\IndexController;
//use Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;
///**
// * Created by PhpStorm.
// * User: Hector
// * Date: 3/3/2017
// * Time: 12:24 AM
// */
//
///**
// * @runTestsInSeparateProcesses
// */
//class IndexControllerTest extends AbstractHttpControllerTestCase
//{
//
//    public function setUp()
//    {
//        $this->setApplicationConfig(
//            include './config/application.config.php'
//        );
//        parent::setUp();
//
//
//    }
//
//    public function testHomePageActionCanBeAccessed()
//    {
//        $this->dispatch('/admin');
//
//        $this->assertResponseStatusCode(302);
//        $this->assertRedirectTo('/administrator/login');
//
//        $this->assertModuleName('Administrator');
//        $this->assertControllerName('Administrator\Controller\User');
//        $this->assertControllerClass('UserController');
//        $this->assertMatchedRouteName('administrator');
//    }
//}