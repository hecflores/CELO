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
use Application\Model\AnsweringQuestionsGroup;
use Application\Model\AnsweringQuestionsGroupTable;
use Application\Model\AssessmentTable;
use Application\Model\CourseContentTable;
use Application\Model\CourseStatusTable;
use Application\Model\CourseTable;
use Application\Model\FilesTable;
use Application\Model\Invitation;
use Application\Model\InvitationReasons;
use Application\Model\InvitationReasonsTable;
use Application\Model\InvitationTable;
use Application\Model\QuestionsTable;
use Application\Model\QuestionType;
use Application\Model\QuestionTypesTable;
use Application\Model\SectionUsersTable;
use Application\Model\SectionTable;
use Application\Model\TagTable;
use Application\Model\User;
use Application\Model\UserSessionTable;
use Application\Model\UserTable;
use Application\Service\APIHelper;
use Application\Service\Helper;
use Application\Service\LoginService;
use Exception;
use Facebook\WebDriver\Exception\UnsupportedOperationException;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Where;
use Zend\Log\Writer\Mail;
use Zend\Mail\Message;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\ViewModel;

class Info{

    static protected $dispatchedClass;

    public static function getBodyJSON(){
        $content=file_get_contents('php://input');

        $json=json_decode($content,true);
        if(!isset($json)){
            return null;
        }
        return $json;
    }
    /** @var  AbstractActionController */
    static protected $controller;
    static protected $event;
    static protected $Singletons=array();

    /**
     * @return Sql
     */
    public static function SQL(){
        $databaseAdapater=Info::get('Zend\Db\Adapter\Adapter');
        $sql=new Sql($databaseAdapater);
        return $sql;

    }
    public static function IsTableEmpty($tableName, $data, &$foundItems=null)
    {
        $sql=Info::SQL()->select($tableName)->where($data);
        $query=Info::SQL()->prepareStatementForSqlObject($sql);
        $results=$query->execute();
        if($results->count()==0){
            return true;
        }
        $results=iterator_to_array($results,false);


        $foundItems=$results;
        return false;
    }
    public static function RemoveProperty(&$data, $key){
        if(isset($data[$key])){
            unset($data[$key]);
        }
    }
    public static function filterOutData(&$data,$regex,$replace){
        $array=array();
        if($data==null){
            return array();
        }
        $finalData=array();
        foreach($data as $name=>$item){
            if (preg_match($regex,$name))
            {
                $nameNew=preg_replace($regex, $replace, $name);
                $array[$nameNew]=$item;
                continue;
            }
            $finalData[$name]=$item;

        }
        $data=$finalData;
        return $array;
    }

    /**
     * Will Do some fancy stuff
     * @param $TableName string
     * @param $Params array
     * @param $Columns array
     * @param $IdsUsing string|string[]
     * @param $Output array
     * @param $WithKey array
     * @param $Ids array
     * @param bool $MultiDimensional
     * @throws UnsupportedOperationException
     */
    public static function FancyFetch($TableName, $Params, $Columns, $IdsUsing, &$Output, &$WithKey, &$Ids,$oneToOne=true, $MultiDimensional=false){
        $Output=APIHelper::QuickFetch(
            $TableName,
            $Params,
            $Columns,
            function($data){
                return $data->getArrayCopy();
            }
        )["results"];
        if(is_string($IdsUsing)){
            $IdsUsing=array($IdsUsing);
        }
        if(count($IdsUsing)==1){
            $WithKey=APIHelper::setNewKey($Output,$IdsUsing[0],true,$oneToOne);
            $Ids=array_keys($WithKey);
            return;
        }
        if($MultiDimensional){

            if(count($IdsUsing)==2){
                $WithKey=APIHelper::setNewKey($Output,$IdsUsing[0],true,$oneToOne);
                $Ids[$IdsUsing[0]]=array_keys($WithKey);

                foreach($WithKey as $index => $value)
                {
                    $WithKey[$index]=APIHelper::setNewKey($value,$IdsUsing[1],true,$oneToOne);

                }
                $temp=APIHelper::setNewKey($Output,$IdsUsing[1],true,$oneToOne);
                $Ids[$IdsUsing[1]]=array_keys($temp);
                return;
            }

            throw new UnsupportedOperationException("Only up to 2 multi dimensional ids are implemented ");
        }

        foreach($IdsUsing as $index => $value)
        {
            $WithKey[$value]=APIHelper::setNewKey($Output,$value,true,$oneToOne);
            $Ids[$value]=array_keys($WithKey[$value]);
        }

        return;


    }
    public static function PerformDelete($tableName, $filters=array(), $columns){
        $where=new Where();

        $deniedColumns=APIHelper::runFilters($where,$filters,$columns);
        if(count($deniedColumns)!=0){
            throw new Exception("WAIT! Something Went Wrong before delete");
        }

        $sql=Info::SQL()->delete($tableName)->where($where);
        $query=Info::SQL()->prepareStatementForSqlObject($sql);
        $query->execute();

        return true;


    }
    public static function PerformGet($tableName, $where=array(), $removeColumns=null,$callbackFixData=null)
    {
        
        $sql=Info::SQL()->select($tableName)->where($where);
        $query=Info::SQL()->prepareStatementForSqlObject($sql);
        $results=$query->execute();
        $data=array();
        foreach ($results as $result)
        {

            /***************************************************************/
            if($removeColumns!=null)
            {
                $removeColumns=array_keys($removeColumns);

                /***********************************************************/
                foreach($removeColumns as $column){
                    if(!isset($result[$column])){
                        throw new \Exception("PerformGet column $column doesnt exists");
                    }
                    unset($result[$column]);
                }
            }

            /***************************************************************/
            if($callbackFixData!=null && is_callable($callbackFixData)){
                $result=$callbackFixData($result);
            }

            /***************************************************************/
            $data[]=$result;
        }

        return $data;
    }
    public static function PerformInsert($tableName, $data){


        $sql=Info::SQL()->insert($tableName)->columns(array_keys($data))->values(array_values($data));
        $query=Info::SQL()->prepareStatementForSqlObject($sql);
        $query->execute();

        return Info::SQL()->getAdapter()->getDriver()->getLastGeneratedValue();
    }
    public static function PerformUpdate($tableName,$where, $data, &$output=null){
        try {

            $data = array_map(function ($item) {
                return "$item";
            }, $data);

            if(count($data)==0){
                return true;
            }
            $sql = Info::SQL()
                ->update($tableName)
                ->where($where)
                ->set($data);

            $query = Info::SQL()->prepareStatementForSqlObject($sql);
            $query->execute();
        }
        catch (Exception $e){
            $output["errors"][]="Update Failed\n".$e->getMessage()."\n".$e->getTraceAsString();
            return false;
        }
        return true;

    }
    public static function getErrorView($error){
           $view=new ViewModel();
           $view->setTemplate("application/error");
           $view->setVariable("error",$error);
           return $view;

    }

    /**
     * @return AbstractActionController
     */
    public static function getController()
    {
        return self::$controller;
    }

    /**
     * @param AbstractActionController $controller
     */
    public static function setController($controller)
    {
        self::$controller = $controller;
    }
    /**
     * @return MvcEvent
     */


    public static function  getEvent(){
        return self::$event;
    }
    public static function setEvent(MvcEvent $e)
    {

        self::$event=$e;
    }
    public static function Redirect($url)
    {
        self::getEvent()->setParam("redirect",$url);
    }
    public static function RawParameters(){
        $url=$_SERVER['REQUEST_URI'];
        $url=urldecode($url);

        $re = "/\\/[^\\?]*(.*)$/";
        $str = "hector.com/hector?hector=hector&red=blue&red=green";
        preg_match($re, $url, $matches_rawParameters);

        $rawParameters=$matches_rawParameters[1];

        return $rawParameters;

    }
    public static function Url($getFullPath=false,$includeParameters=false){

        $url=$_SERVER['REQUEST_URI'];
        $url=urldecode($url);
        //echo $url;

        $re = "/(\\?|\\&)([^\\=]*)\\=([^\\&]*)/";
        $str = "hector.com/hector?hector=hector?red=blue?red=blue";

        preg_match_all($re, $url, $matches);



        $re = "/(\\/[^\\?]*)/";
        $str = "hector.com/hector?hector=hector&red=blue&red=green";


        preg_match($re, $url, $matches2);

        $parameters=array();
        for($i=0;$i<count($matches[2]);$i++){
            $parameters[]=array("name" => $matches[2][$i],
                "value" => $matches[3][$i]);
        }

        $re = "/\\/[^\\?]*(.*)$/";
        $str = "hector.com/hector?hector=hector&red=blue&red=green";
        preg_match($re, $url, $matches_rawParameters);

        $rawParameters=$matches_rawParameters[1];
        $url=$matches2[1];

        //$textInformation=include "../configs/Text.php";
        if($getFullPath){
            $url= 'http://'.$_SERVER['HTTP_HOST'].$url;
        }
        if($includeParameters){
            $url=$url.$rawParameters;
        }


        return $url;
    }

    public static function RootFolder(){
        return __DIR__."/../../";
    }
    /**
     * @return User
     */
    public static function getCurrentUser()
    {
        return self::LoginService()->CurrentUser();
    }
    public static function setServiceManager($sm){

            self::$Singletons["ServiceManager"]=$sm;
    }
    /**
     * @return \Zend\ServiceManager\ServiceLocatorInterface
     */
    public static function getServiceManager(){



        if(!isset(self::$Singletons["ServiceManager"])){
            self::$Singletons["ServiceManager"]=self::getEvent()->getApplication()->getServiceManager();
        }
        return self::$Singletons["ServiceManager"];
    }
    public static function ValidateObjectTemplate($template, $object){

        foreach($template as $name=>$value){
            if(!isset($object->{$name})){
                return false;
            }
            $foundObject=$object->{$name};
            if(is_array($value)){
                if(!ValidateObjectTemplate($value,$foundObject)){
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
     * @param String $name
     * @return mixed
     */
    public static function get($name){
        if(!isset(self::$Singletons[$name])){
            self::$Singletons[$name]=self::getServiceManager()->get($name);
        }
        return self::$Singletons[$name];
    }

    /**
     * @return LoginService
     */
    public static function LoginService(){
        return self::get("LoginService");
    }

    /**
     * @return Helper
     */
    public static function Helper(){
        return self::get("Helper");
    }

    /**
     * @return UserSessionTable
     */
    public static function UserSessionTable(){
        return self::get("Application\Model\UserSessionTable");
    }

    /**
     * @return UserTable
     */
    public static function UserTable(){
        return self::get("UsersTable");
    }
    /**
     * @return CourseTable
     */
    public static function CourseTable(){
        return self::get("CoursesTable");
    }
    /**
     * @return CourseStatusTable
     */
    public static function CourseStatusTable(){
        return self::get("CourseStatusTable");
    }
    /**
     * @return InvitationTable
     */
    public static function InvitationTable(){
        return self::get("InvitationTable");
    }
    /**
     * @return InvitationReasonsTable
     */
    public static function InvitationReasonsTable(){
        return self::get("InvitationReasonsTable");
    }

    /**
     * @return SectionTable
     */
    public static function SectionTable(){
        return self::get("SectionTable");
    }

    /**
     * @return QuestionTypesTable
     */
    public static function QuestionTypesTable(){
        return self::get("QuestionTypeTable");
    }

    /**
     * @return QuestionsTable
     */
    public static function QuestionsTable(){
        return self::get("QuestionsTable");
    }

    /**
     * @return TagTable
     */
    public static function TagTable(){
        return self::get("TagTable");
    }

    /**
     * @return SectionUsersTable
     */
    public static function SectionUsersTable(){
        return self::get("SectionUsersTable");
    }

    public static function setDispatchedClass($setIt)
    {
        self::$dispatchedClass=$setIt;
    }
    public static function DispatchedClass()
    {
        return  self::$dispatchedClass;
    }

    /**
     * @return CourseContentTable
     */
    public static function CourseContentTable()
    {
        return self::get("CourseContentTable");
    }
    /**
     * @return AssessmentTable
     */
    public static function AssessmentTable()
    {
        return self::get("AssessmentTable");
    }

    /**
     * @return ActiveQuestionsTable
     */
    public static function ActiveQuestionsTable()
    {
        return self::get("ActiveQuestionsTable");
    }

    /**
     * @return FilesTable
     */
    public static function FilesTable()
    {
        return self::get("FilesTable");
    }
    /**
     * @return AnsweringQuestionsGroupTable
     */
    public static function AnsweringQuestionsGroupTable()
    {
        return self::get("AnsweringQuestionsGroupTable");
    }

    public static function mime_content_type($filename) {

        $mime_types = array(

            'txt' => 'text/plain',
            'htm' => 'text/html',
            'html' => 'text/html',
            'php' => 'text/html',
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'xml' => 'application/xml',
            'swf' => 'application/x-shockwave-flash',
            'flv' => 'video/x-flv',

            // images
            'png' => 'image/png',
            'jpe' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'jpg' => 'image/jpeg',
            'gif' => 'image/gif',
            'bmp' => 'image/bmp',
            'ico' => 'image/vnd.microsoft.icon',
            'tiff' => 'image/tiff',
            'tif' => 'image/tiff',
            'svg' => 'image/svg+xml',
            'svgz' => 'image/svg+xml',

            // archives
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            'exe' => 'application/x-msdownload',
            'msi' => 'application/x-msdownload',
            'cab' => 'application/vnd.ms-cab-compressed',

            // audio/video
            'mp3' => 'audio/mpeg',
            'qt' => 'video/quicktime',
            'mov' => 'video/quicktime',

            // adobe
            'pdf' => 'application/pdf',
            'psd' => 'image/vnd.adobe.photoshop',
            'ai' => 'application/postscript',
            'eps' => 'application/postscript',
            'ps' => 'application/postscript',

            // ms office
            'doc' => 'application/msword',
            'rtf' => 'application/rtf',
            'xls' => 'application/vnd.ms-excel',
            'ppt' => 'application/vnd.ms-powerpoint',

            // open office
            'odt' => 'application/vnd.oasis.opendocument.text',
            'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
        );

        $ext = strtolower(array_pop(explode('.',$filename)));
        if (array_key_exists($ext, $mime_types)) {
            return $mime_types[$ext];
        }
        elseif (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME);
            $mimetype = finfo_file($finfo, $filename);
            finfo_close($finfo);
            return $mimetype;
        }
        else {
            return 'application/octet-stream';
        }
    }
    public static function CONV_DB_TO_ARR($old){

        foreach ($old as $old1){
            $new[]=$old1;
        }

        return $new;
    }

}