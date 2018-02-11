<?php
namespace ApplicationTest\Controller;
use Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/3/2017
 * Time: 12:24 AM
 */
/**
 * @runTestsInSeparateProcesses
 */
class IndexControllerTest extends AbstractHttpControllerTestCase
{
    protected $traceError = true;

    public function setUp()
    {
        $this->setApplicationConfig(
            include './config/application.config.php'
        );
        parent::setUp();
    }
    public function testIndexActionCanBeAccessed()
    {
        $this->dispatch('/');
        $this->assertResponseStatusCode(200);

        $this->assertModuleName('Application');
        $this->assertControllerName('Application\Controller\Index');
        $this->assertControllerClass('IndexController');
        $this->assertActionName('index');
        $this->assertMatchedRouteName('home');
    }

    public function testLoginActionCanBeAccessed()
    {
        $this->dispatch('/login');
        echo $this->getResponse()->getContent();
        $this->assertResponseStatusCode(200);

        $this->assertModuleName('Application');
        $this->assertControllerName('Application\Controller\Index');
        $this->assertControllerClass('IndexController');
        $this->assertActionName('login');
        $this->assertMatchedRouteName('login');
    }
}