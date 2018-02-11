<?php
namespace AdministratorTest\Controller;
use Extensions_Selenium2TestCaseTest;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\WebDriverBy;
use Goutte\Client;
use Application\Info;
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

    public function setUp()
    {
        $this->setBrowser("chrome");
        $this->setBrowserUrl("http://uh-celo.local");
    }
    public function saveScreenShot($saveScreenShot){

        $filedata = $this->currentScreenshot();
        file_put_contents('D:\wamp\www\CELO\build\tests\screenShots'."\\".$this->getName().'-'."-$saveScreenShot-.png",$filedata);
    }
    public function testUserLoginPagesAccessible()
    {

    }

    public function testUserAuthentication()
    {

    }




}