<?php

namespace Application;


use Application\Info;
use Application\Model\QuestionType;
use Application\Module;

class QuestionTypeManager{

    /***********************************************************************/
    /* Statics                                                             */
    /***********************************************************************/
    public static function Create($name){

        /*******************************************************************/
        if(($questionType=Info::QuestionTypesTable()->saveData(array("Name" => $name)))==null){
            self::ExitWithError("Unable to save the data");
        }

        /*******************************************************************/
        return new QuestionTypeManager($questionType->getQuestionTypeID());
    }

    /***********************************************************************/
    public static function ExitWithError($string){
        echo "<h1>Error With Question Type</h1><h2>$string</h2>";
        exit();
    }

    /***********************************************************************/
    public static function CreateOrError($folder){
        if(!file_exists($folder))
        {
            if(!mkdir($folder))
            {
                self::ExitWithError("Unable to create root folder $folder");
            }
        }
    }

    /***********************************************************************/
    public static function EnsureQuestionsFolder(){
        self::CreateOrError(Info::RootFolder()."data");
        self::CreateOrError(Info::RootFolder()."data/Questions");
        self::CreateOrError(Info::RootFolder()."data/Questions/Question_Types");
    }

    /***********************************************************************/
    public static function RootFolder(){

        self::EnsureQuestionsFolder();
        $folder="data/Questions/Question_Types/";

        /*******************************************************************/
        return $folder;
    }
    /***********************************************************************/
    /***********************************************************************/
    /***********************************************************************/
    /***********************************************************************/
    public static $DefaultQuestionTypeDirectory="data/Questions/Question_Types/default";

    /** @var Integer  */
    protected $id;

    /** @var QuestionType  */
    protected $questionType=null;

    /** @var JsonResource  */
    protected $_config=null;

    function __construct($id)
    {
        if($id instanceof QuestionType)
        {
            $this->id=$id->getQuestionTypeID();
            $this->questionType=Info::QuestionTypesTable()->getFromById($this->id);
        }
        else
        {
            $this->id=$id;
            $this->questionType=Info::QuestionTypesTable()->getFromById($id);
        }
        $this->Update();
    }


    /***********************************************************************/
    function Delete()
    {
        if($this->getQuestionType()==null){
            return;
        }

        Info::QuestionTypesTable()->deleteFromID($this->getQuestionType()->getQuestionTypeID());

    }

    /***********************************************************************/
    function Config(){
        return $this->_config;
    }

    /***********************************************************************/
    function Success()
    {
        return $this->questionType!=null;
    }




    /**
     * @return string
     */
    public function MainFolder(){

        /*******************************************************************/
        if($this->questionType==null)
        {
            self::ExitWithError("No question found when getting main folder. Error in logic");
        }

        /*******************************************************************/
        $folder=$this->getQuestionType()->getSrcDirectory();
        if($folder==null){

            $this->Delete();
            self::ExitWithError("The Folder Saved was invalid");
        }
        if(!file_exists($folder)){
            self::ExitWithError("The Folder $folder seemed to just disappear");
        }
        return $folder;

    }
    function recurse_copy($src,$dst) {
        $dir = opendir($src);
        @mkdir($dst);
        while(false !== ( $file = readdir($dir)) ) {
            if (( $file != '.' ) && ( $file != '..' )) {
                if ( is_dir($src . '/' . $file) ) {
                    $this->recurse_copy($src . '/' . $file,$dst . '/' . $file);
                }
                else {
                    copy($src . '/' . $file,$dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }
    function CopyAllDefaultContent(){
        $src = self::$DefaultQuestionTypeDirectory;
        $dst = $this->MainFolder();
        $this->recurse_copy($src,$dst);
    }
    public function getMainFileFodCode($code){
        $json=$this->Config()->Json();
        if(!isset($json[$code])){
            self::ExitWithError("Unable to find any $code code");
        }
        if(!isset($json[$code]["main"])){
            self::ExitWithError( "Unable to find a main in the $code code");
        }
        $file=$this->MainFolder()."/".$json[$code]["main"];
        if(!file_exists($file)){
            self::ExitWithError( "Main File in $code '$file' was not found");
        }

        return $file;
    }
    public function getMainForCode($code)
    {

        $file=$this->getMainFileFodCode($code);
        return file_get_contents($file);
    }
    public function getDeploymentCode()
    {
        return $this->getMainForCode("deployment");
    }
    public function getDevelopmentCode()
    {
        return $this->getMainForCode("development");
    }
    public function setDeploymentCode($code)
    {
        $file=$this->getMainFileFodCode("deployment");
        file_put_contents($file,$code);
    }
    public function setDevelopmentCode($code)
    {
        $file=$this->getMainFileFodCode("development");
        file_put_contents($file,$code);
    }

    /**
     * @return bool
     */
    function Update()
    {



        /*******************************************************************/
        /* Brand New Question Type                                         */
        /*******************************************************************/
        if($this->questionType==null)
        {
            /***************************************************************/
            if(($this->questionType=Info::QuestionTypesTable()->saveData(array("Name" => "Unkown Question Type")))==null){
                self::ExitWithError("Unable to save the data");
            }

        }

        /*******************************************************************/
        /* Create New Folder with Default Settings                         */
        /*******************************************************************/
        if($this->questionType->getSrcDirectory()==null || !file_exists($this->questionType->getSrcDirectory())){
            /***************************************************************/
            /* Make Entry in database                                      */
            /***************************************************************/
            $folderSaving=self::RootFolder()."QuestionType_".$this->getQuestionType()->getQuestionTypeID();
            if(file_exists($folderSaving)==true){
                self::ExitWithError("Folder $folderSaving already exists. Somthing went wrong");
            }

            /***************************************************************/
            /* Create the Folder                                           */
            /***************************************************************/
            if(!mkdir($folderSaving)){
                self::ExitWithError("Folder $folderSaving was unable to be created");
            }

            /***************************************************************/
            /* Save the data                                               */
            /***************************************************************/
            if(($this->questionType=Info::QuestionTypesTable()->saveData(
                    array(
                        "SrcDirectory" => $folderSaving,
                        "QuestionTypeID"=>$this->getQuestionType()->getQuestionTypeID()))
                )==null){
                self::ExitWithError("Saving of the newly created $folderSaving into the database failed");
            }

            //Make the Folder all defaults
            $this->CopyAllDefaultContent();
        }


        /*******************************************************************/
        if($this->MainFolder()==null) {//Will Do its own testing
            self::ExitWithError("Main Folder Failed");
        }

        /*******************************************************************/
        /* Setup Config                                                    */
        /*******************************************************************/
        $this->_config=new JsonResource($this->MainFolder()."/config.json");
        $this->Config()->Load();


        return true;



    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return QuestionType
     */
    public function getQuestionType()
    {
        return $this->questionType;
    }



}
