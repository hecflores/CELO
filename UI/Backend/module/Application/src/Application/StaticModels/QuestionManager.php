<?php

namespace Application;


use Application\Info;
use Application\Model\Question;
use Application\Module;

class QuestionManager{

    public static $DefaultQuestionDirectory="data/Questions/Questions/default";

    /** @var Integer  */
    protected $id;

    /** @var Question  */
    protected $question=null;

    /** @var JsonResource  */
    protected $_config=null;

    function __construct($id)
    {
        $this->id=$id;
        $this->question=Info::QuestionsTable()->getFromById($id);

        $this->Update();
    }
    public function getQuestionType(){
        return $this->getQuestion()->getQuestionTypeManager();
    }
    public static function Create($questionTypeID){
        $questionType=Info::QuestionTypesTable()->getFromById($questionTypeID);
        if($questionType==null) {
            return null;
        }
        $question=Info::QuestionsTable()->UpdateInsertData(null,
            array(
                "QuestionTypeID" => $questionType->getQuestionTypeID(),
                "Name"=>"New Question"
            )
        );

        return new QuestionManager($question->getQuestionID());
    }
    function Delete()
    {
        if($this->getQuestion()==null){
            return;
        }

        Info::QuestionsTable()->DeleteQuestion($this);

    }
    function Config(){
        return $this->_config;
    }
    function Success()
    {
        return $this->question!=null;
    }
    public static function ExitWithError($string){
        echo "<h1>Error With Question </h1><h2>$string</h2>";
        exit();
    }
    public static function CreateOrError($folder){
        /*******************************************************************/
        if(!file_exists($folder))
        {
            if(!mkdir($folder))
            {
                self::ExitWithError("Unable to create root folder $folder");
            }
        }
    }
    public static function EnsureQuestionsFolder(){
        self::CreateOrError("data");
        self::CreateOrError("data/Questions");
        self::CreateOrError("data/Questions/Questions");
    }
    public static function RootFolder(){

        self::EnsureQuestionsFolder();
        $folder="data/Questions/Questions/";

        /*******************************************************************/
        return $folder;
    }

    /**
     * @return string
     */
    public function MainFolder(){

        /*******************************************************************/
        if($this->question==null)
        {
            self::ExitWithError("No question found when getting main folder. Error in logic");
        }

        /*******************************************************************/
        $folder=$this->getQuestion()->getSrcDirectory();
        if($folder==null){
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
        $src = self::$DefaultQuestionDirectory;
        $dst = $this->MainFolder();
        $this->recurse_copy($src,$dst);
    }



    function Update()
    {
        /*******************************************************************/
        /* Brand New Question                                          */
        /*******************************************************************/
        if($this->question==null || $this->question->getSrcDirectory()==null)
        {

            $questionType=null;
            if($this->question==null) {
                $questionTypes = Info::QuestionTypesTable()->fetch();
                if (count($questionTypes) == 0) {
                    $questionType = new QuestionTypeManager(-1);
                } else {
                    $questionType = new QuestionTypeManager($questionTypes->current()->getQuestionTypeID());
                }
            }
            else{
                $questionType= new QuestionTypeManager($this->getQuestion()->getQuestionTypeID());
            }

            /***************************************************************/
            if(($this->question=Info::QuestionsTable()->UpdateInsertData(null,array("QuestionTypeID"=>$questionType->getQuestionType()->getQuestionTypeID(),"Name" => "Unkown Question ")))==null){
                self::ExitWithError("Unable to Save the Information");
            }
            /***************************************************************/
            /* Make Entry in database                                      */
            /***************************************************************/
            $folderSaving=self::RootFolder()."Question_".$this->getQuestion()->getQuestionID();
            if(file_exists($folderSaving)){
                self::ExitWithError("Folder $folderSaving already exists. Something went wrong");
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
            if(($this->question=Info::QuestionsTable()->UpdateInsertData($this,
                array(
                    "ExpectedAnswer" => "Answer Goes Here",
                    "SrcDirectory" => $folderSaving))
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

    public function getParameters()
    {
        $perameters=$this->Config()->Json()["parameters"];
        if(!isset($perameters)){
            $this->Config()->Attribute("parameters",array());
            $this->Config()->Save();
            $this->Config()->Load();
        }
        return $this->Config()->Json();
    }
    public function setParameters($parameters)
    {
        $this->Config()->Attribute("parameters",$parameters);

        $this->Config()->Save();
        $this->Config()->Load();

        return $this->Config()->Json();
    }
    public function getAnswer()
    {
        return $this->getQuestion()->getExpectedAnswer();
    }
    public function setAnswer($answer)
    {
        $this->question=Info::QuestionsTable()->UpdateInsertData($this,array(
            "ExpectedAnswer"=>$answer));

        return $this->getQuestion()->getExpectedAnswer();
    }
    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
    }



}
