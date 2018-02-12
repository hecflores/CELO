<?php
namespace AdministratorTest\Controller;
use Extensions_Selenium2TestCaseTest;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\WebDriverBy;
use Goutte\Client;
use Application\Info;
use PHPUnit\Exception;
use PHPUnit_Extensions_Selenium2TestCase;
use PHPUnit_Extensions_Selenium2TestCase_Element;
use PHPUnit_Extensions_Selenium2TestCase_Session;
use Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/3/2017
 * Time: 12:24 AM
 */

/**
 *
 */
class WebBrowserTest extends PHPUnit_Extensions_Selenium2TestCase
{
    protected $traceError = true;
    protected $client = true;
    static protected $host;
    /**
     * @var PHPUnit_Extensions_Selenium2TestCase
     */
    static protected $driver;

    /**
     * @var array
     *     @option \PHPUnit_Extensions_Selenium2TestCase_Element "parent"
     */
    protected $data;

    /**
     * @var PHPUnit_Extensions_Selenium2TestCase_Session
     */
    protected $session;
    protected $coverageScriptUrl = 'http://uh-celo.local/phpunit_coverage.php';

    public function __construct($name = NULL, array $data = array(), $dataName = '')
    {
        parent::__construct($name, $data, $dataName);

    }

    public static function setUpBeforeClass(){
        WebBrowserTest::$host = 'http://localhost:4444/wd/hub'; // this is the default



    }
    public function tearDown(){


    }
    protected $setupAlready=false;
    public function setUp()
    {
        $data=array();
        $this->setBrowser("chrome");
        $this->setBrowserUrl("http://uh-celo.local");

        $this->setupAlready=true;
    }

//    public function testGoogleSearch()
//    {
//        $this->url("https://www.facebook.com/");
//        $this->waitUntil(function(){
//            try {
//                if($this->byTag("form")!=null) {
//                    return true;
//                }
//            }
//            catch(Exception $e){
//                return false;
//            }
//            return false;
//        },20000);
//        $form=$this->byTag("form");
//
//        $form->byCssSelector("[name='email']")->value("floreshector21@yahoo.com");
//        $form->byCssSelector("[name='pass']")->value("Armandorocha1-");
//        $form->submit();
//        $this->waitUntil(function(){
//
//            try {
//                if($this->byId("placeholder-2dvbj")!=null) {
//                    return true;
//                }
//            }
//            catch(Exception $e){
//                return false;
//            }
//            return false;
//        },20000);
//        $this->byId("placeholder-2dvbj")->click();
//
//    }

    public function saveScreenShot($saveScreenShot){

        $filedata = $this->currentScreenshot();
        file_put_contents('D:\wamp\www\CELO\build\tests\screenShots'."\\".$this->getName().'-'."-$saveScreenShot-.png",$filedata);
    }
    public function testUserLoginPagesAccessible()
    {

        /********************************************************************/
        /* Start(Home Page)                                                 */
        /********************************************************************/
        $this->url("http://uh-celo.local");
        $this->saveScreenShot("Home Page");

        /********************************************************************/
        /* Find Login Button                                                */
        /********************************************************************/
        $this->assertNotNull(($loginBtn=$this->byLinkText("Main Login")));
        $this->assertTrue($loginBtn->displayed());
        $loginBtn->click(); //Click it

        /********************************************************************/
        /* Start(Home Page) -> Login Page                                   */
        /********************************************************************/
        $this->assertEquals('http://uh-celo.local/login',$this->url());
        $this->saveScreenShot("Login Page");


        $parent=null;


        $doTheTesting=function($parentSelector,$appendText, $preFunction) {
            /**
             * @var \PHPUnit_Extensions_Selenium2TestCase_Element $parent
             */
            $parent=$preFunction();

            /****************************************************************/
            /* Start(Home Page) -> Login Page -> Instructor Login Page      */
            /****************************************************************/
            $this->assertNotNull(($instructorLink = $parent->byLinkText("Instructor")));
            $this->assertTrue($instructorLink->displayed());
            $instructorLink->click(); // Click it
            $this->assertEquals('http://uh-celo.local/instructor/login', $this->url());
            $this->saveScreenShot("Instructor Login Page - ".$appendText);
            $this->back();

            $parent=$preFunction();

            /****************************************************************/
            /* Start(Home Page) -> Login Page -> Ta Login Page              */
            /****************************************************************/
            $this->assertNotNull(($taLink = $parent->byLinkText("TA")));
            $this->assertTrue($taLink->displayed());
            $taLink->click();
            $this->assertEquals('http://uh-celo.local/ta/login', $this->url());
            $this->saveScreenShot("Ta Login Page - ".$appendText);
            $this->back();

            $parent=$preFunction();

            /****************************************************************/
            /* Start(Home Page) -> Login Page -> Administrator Login Page   */
            /****************************************************************/
            $this->assertNotNull(($adminLink = $parent->byLinkText("Administrator")));
            $this->assertTrue($adminLink->displayed());
            $adminLink->click();
            $this->assertEquals('http://uh-celo.local/administrator/login', $this->url());
            $this->saveScreenShot("Administrator Login Page - ".$appendText);
            $this->back();

            $parent=$preFunction();

            /****************************************************************/
            /* Start(Home Page) -> Login Page -> Student Login Page         */
            /****************************************************************/
            $this->assertNotNull(($studentLink = $parent->byLinkText("Student")));
            $this->assertTrue($studentLink->displayed());
            $studentLink->click();
            $this->assertEquals('http://uh-celo.local/student/login', $this->url());
            $this->saveScreenShot("Student Login Page - ".$appendText);

            /****************************************************************/
            /* Test to go back(Start(Home Page))                            */
            /****************************************************************/
            $this->back();
            $this->back();
            $this->url('http://uh-celo.local/');
            $this->assertEquals('http://uh-celo.local/', $this->url());
            $this->saveScreenShot("End of Login Pages Tests - ".$appendText);


        };
        $doTheTesting(".container","From Main Page",function(){
            $this->assertEquals(count($parent=$this->byCssSelector(".container")),1);
            return $parent;
        });

        $doTheTesting(".navbar","From Top Right Tabs",function(){
            $this->assertEquals(count($parent=$this->byCssSelector(".navbar")),1);

            $this->assertEquals(count($loginDropDown=$this->byLinkText("Login")),1);
            $loginDropDown->click();

            return $parent;
        });
    }
    public function testInstructorAuthentication(){
        $this->runFullUserAuthenticationForRole("instructor","Instructor");
    }
    public function testTAAuthentication(){
        $this->runFullUserAuthenticationForRole("ta","TA");
    }
    public function testStudentAuthentication(){
        $this->runFullUserAuthenticationForRole("student","Student");
    }
    public function testAdministratorAuthentication(){
        $this->runFullUserAuthenticationForRole("administrator","Administrator");
    }

    /**
     * @param $role
     * @param $roleTitle
     */
    public function runFullUserAuthenticationForRole($role, $roleTitle)
    {
        /****************************************************************/
        /* Start(Home Page)                                             */
        /****************************************************************/
        $this->url("http://uh-celo.local");

        /****************************************************************/
        /* Find Login Button                                            */
        /****************************************************************/
        $this->assertNotNull(($loginBtn = $this->byLinkText("Main Login")));
        $this->assertTrue($loginBtn->displayed());
        $loginBtn->click(); //Click it

        /****************************************************************/
        /* Start(Home Page) -> Login Page                               */
        /****************************************************************/
        $this->assertEquals("http://uh-celo.local/login", $this->url());


        $this->data["parent"] = null;
        $this->data["userNameElement"] = null;
        $this->data["passwordElement"] = null;
        $this->data["submitElement"] = null;/**
         * @param \PHPUnit_Extensions_Selenium2TestCase_Element $parent
         */;
        $refreshElements = function () {
            $this->data["userNameElement"] = $this->byCssSelector("[name='userName']");
            $this->data["passwordElement"] = $this->byCssSelector("[name='password']");
            $this->data["submitElement"] = $this->byCssSelector("[type='submit']");
            $this->data["parent"] = $this->byCssSelector(".container");
        };


        /****************************************************************/
        $this->data["parent"] = $this->byCssSelector(".container");

        /****************************************************************/
        /* Start(Home Page) -> Login Page -> $roleTitle Login Page          */
        /****************************************************************/
        $this->assertNotNull(($roleLink = $this->data["parent"]->byLinkText("$roleTitle")));
        $this->assertTrue($roleLink->displayed());
        $roleLink->click(); // Click it
        $this->assertEquals("http://uh-celo.local/$role/login", $this->url());

        /****************************************************************/
        /* Enter Credentials and Login in                               */
        /****************************************************************/

        /****************************************************************/
        /* Test 1(Wrong User name and Password)                         */
        /****************************************************************/
        $refreshElements();
        $this->data["userNameElement"]->value("$role" . "1_wrong");
        $this->data["passwordElement"]->value("$role" . "1_wrong");
        $this->data["submitElement"]->click();
        $this->assertEquals("http://uh-celo.local/$role/login", $this->url());
        $this->assertEquals("Username and Password was not found", $this->byCssSelector(".login-form-error")->text());
        $this->saveScreenShot("$roleTitle Login In - Invalid_1");
        $this->url($this->url());//Basically a refresh but this will make sure it does a GET

        /****************************************************************/
        /* Test 2(Entered Nothing at all)                               */
        /****************************************************************/
        $refreshElements();
        $this->data["submitElement"]->click();
        $this->assertEquals("http://uh-celo.local/$role/login", $this->url());
        $this->assertEquals("Username and Password was not found", $this->byCssSelector(".login-form-error")->text());
        $this->saveScreenShot("$roleTitle Login In - Invalid_2");
        $this->url($this->url());//Basically a refresh but this will make sure it does a GET

        /****************************************************************/
        /* Test 3(Entered Good Password, Wrong User Name)               */
        /****************************************************************/
        $refreshElements();
        $this->data["userNameElement"]->value("$role" . "1_wrong");
        $this->data["passwordElement"]->value("$role" . "1");
        $this->data["submitElement"]->click();
        $this->assertEquals("http://uh-celo.local/$role/login", $this->url());
        $this->assertEquals("Username and Password was not found", $this->byCssSelector(".login-form-error")->text());
        $this->saveScreenShot("$roleTitle Login In - Invalid_3");
        $this->url($this->url());//Basically a refresh but this will make sure it does a GET

        /****************************************************************/
        /* Test 4(Entered Good User Name, Wrong Password)               */
        /****************************************************************/
        $refreshElements();
        $this->data["userNameElement"]->value("$role" . "1");
        $this->data["passwordElement"]->value("$role" . "1_wrong");
        $this->data["submitElement"]->click();
        $this->assertEquals("http://uh-celo.local/$role/login", $this->url());
        $this->assertEquals("Username and Password was not found", $this->byCssSelector(".login-form-error")->text());
        $this->saveScreenShot("$roleTitle Login In - Invalid_4");
        $this->url($this->url());//Basically a refresh but this will make sure it does a GET

        /****************************************************************/
        /* Final Test. Entered Correct Credentials                      */
        /****************************************************************/
        $refreshElements();
        $this->data["userNameElement"]->value("$role" . "1");
        $this->data["passwordElement"]->value("$role" . "1");
        $this->data["submitElement"]->click();
        $this->assertEquals("http://uh-celo.local/$role", $this->url());
        $this->saveScreenShot("$roleTitle Login In - Valid");


        /****************************************************************/
        /* Make Sure redirects to home page from all visitor pages      */
        /****************************************************************/
        $this->url("http://uh-celo.local/$role/login");
        $this->assertEquals("http://uh-celo.local/$role", $this->url());

        /****************************************************************/
        $this->url("http://uh-celo.local/login");
        $this->assertEquals("http://uh-celo.local/$role", $this->url());

        /****************************************************************/
        $this->url("http://uh-celo.local");
        $this->assertEquals("http://uh-celo.local/$role", $this->url());


        /****************************************************************/
        /* Grab on valid link to test later                             */
        /****************************************************************/
//            $courseList = $this->byCssSelector(".coursesList");
//            $sections = $courseList->byCssSelector(".list-group-item");
//            $this->assertGreaterThan(0, count($sections), "Number of Sections is greater then 0");
//            $linkForSections = $sections->attribute("href");
//            $this->assertNotEmpty($linkForSections);

        /****************************************************************/
        /* Logout Works                                                 */
        /****************************************************************/
        $this->data["parent"] = $this->byCssSelector(".navbar");

        $this->assertEquals(count($loginDropDown = $this->data["parent"]->byLinkText("$roleTitle")), 1);
        $loginDropDown->click();
        $this->data["logoutBtn"] = $this->data["parent"]->byLinkText("Logout");
        $this->data["logoutBtn"]->click();
        $this->url("http://uh-celo.local/$role/login");

        /****************************************************************/
        /* Now we should be going to the actual login                   */
        /****************************************************************/
        $this->url("http://uh-celo.local/login");
        $this->assertEquals("http://uh-celo.local/login", $this->url());

        /****************************************************************/
        $this->url("http://uh-celo.local");
        $this->assertEquals("http://uh-celo.local/", $this->url());

        /****************************************************************/
        $this->url("http://uh-celo.local/$role/login");
        $this->assertEquals("http://uh-celo.local/$role/login", $this->url());

        /****************************************************************/
        /* Test to see if when going to url, after signing in takes me t*/
        /* that url                                                     */
        /****************************************************************/
//            $this->url($linkForSections);
//            $this->assertEquals("http://uh-celo.local/$role/login", $this->url());
//
//            $refreshElements();
//            $this->data["userNameElement"]->value("$role" . "1");
//            $this->data["passwordElement"]->value("$role" . "1");
//            $this->data["submitElement"]->click();
//            $this->assertEquals($linkForSections, $this->url());


    }




}