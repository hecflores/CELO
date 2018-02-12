<?php
namespace Application\Service;
use Application\Info;
use Application\Model\User;
use Application\Roles;
use Zend\Permissions\Rbac\Role;
use Zend\ServiceManager\ServiceManager;

/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 10:25 AM
 */
class LoginService
{
    protected $sm;

    protected $userLoggedOn=null;

    public function CurrentUser(){
        if($this->userLoggedOn!=null){
            return $this->userLoggedOn;
        }

        /*******************************************************************/
        if(!isset($_COOKIE["SessionID"]))
        {
            return ($this->userLoggedOn=User::Guest());
        }

        /*******************************************************************/
        $SessionID=$_COOKIE["SessionID"];
        $session=$this->getUserSessionTable()->getUserBySessionID($SessionID);

        if($session==null){
            return ($this->userLoggedOn=User::Guest());
        }

        /*******************************************************************/
        $user=Info::UserTable()->getUserById($session->getUserID());
        if($user==null){
            return ($this->userLoggedOn=User::Guest());
        }


        return ($this->userLoggedOn=$user);


    }

    /***********************************************************************/
    /* User Table
    /***********************************************************************/
    protected $userTable;


    public function getUserTable()
    {
        return Info::UserTable();
    }


    /***********************************************************************/
    /* User SessionTable
    /***********************************************************************/
    protected $userSessionTable;


    public function getUserSessionTable()
    {
        return Info::UserSessionTable();
    }


    /***********************************************************************/


    public function __construct(ServiceManager $sm)
    {
        $this->sm = $sm;
    }



    public function GetUserID()
    {
        return $this->CurrentUser()->getUserID();
    }
    public function SignOut()
    {

        if(!$this->IsAlreadySignedIn()){

            return;
        }

        setcookie("SessionID",null,-1,'/');
        $this->getUserSessionTable()->deleteUserSession($this->GetUserID());

    }

    public function SignIn($UserName, $Password, $Role)
    {
        /*******************************************************************/
        if(($user=$this->getUserTable()->validateUser($UserName,$Password,$Role))!=null)
        {
            $userSesson=$this->getUserSessionTable()->saveNewUserSession($user);
            setcookie("SessionID",$userSesson->getSessionID(),time()+60*60*24,"/"); // Set the Cookie to remember you
            Roles::ResetRole($Role);
            if(isset($_GET['callback'])){
                Info::Redirect($_GET['callback']);
            }
            return $userSesson;
        }

        /*******************************************************************/
        return null;
    }
    public function IsAlreadySignedIn($roles=null)
    {
        if($roles==null){

            return ($this->CurrentUser()->Role!=Roles::$GUEST);
        }
        /*******************************************************************/
        if(is_array($roles)){
            foreach($roles as $role){
                if($role==$this->CurrentUser()->getRole() || $role==Roles::$GUEST){
                    return true;
                }
            }
        }
        else if($roles==$this->CurrentUser()->getRole() || $roles==Roles::$GUEST){
            return true;
        }
        return false;

    }
    public static function RedirectToLogin($reason,$saveCallback){

        $url="/login?reason=$reason".($saveCallback?'&callback='.Info::Url(true):'');
        Info::getServiceManager()->get(Info::getEvent()->getController())->redirect($url);
        //header( 'Location: '.$url );
        //exit();
    }

    /**
     * @param array $role
     * @param bool $redirect
     * @return bool
     */
    public function Authorize($roles, $redirect=true)
    {
        if(Roles::IsOverride($roles)){
            return true;
        }

        $isAuthorized=false;

        /*******************************************************************/
        if(is_array($roles)){
            foreach($roles as $role){
                if($role==$this->CurrentUser()->getRole() || $role==Roles::$GUEST){
                    $isAuthorized=true;
                }
            }
        }
        else if($roles==$this->CurrentUser()->getRole()  || $roles==Roles::$GUEST){
            $isAuthorized=true;
        }

        if($isAuthorized){
            Roles::SetRole($this->CurrentUser()->getRole());
            return true;
        }

        if($redirect) {
            self::RedirectToLogin('un-authorized', false);
        }
        return false;


    }
    public function IsAuthorized($roles)
    {

        return $this->Authorize($roles,false);


    }
}