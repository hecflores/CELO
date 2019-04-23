<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 4/7/2017
 * Time: 7:38 PM
 */

namespace QuestionUploader;


use Zend\Validator\Uuid;

class QuestionsUploader
{
    /**
     * @var string
     */
    protected $file;

    /**
     * @var object
     */
    protected $Results;
    function __construct()
    {

    }


    protected function Preprocess(){
        throw new \Exception("Abstract Method, needs to be override");
    }

    /**
     * @throws \Exception
     */
    protected function Process(){
        throw new \Exception("Abstract Method, needs to be override");
    }

    /**
     * @throws \Exception
     * @return array
     */
    protected function Postprocess()
    {
        throw new \Exception("Abstract Method, needs to be override");
    }

    /**
     * @return string
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * @return string
     */
    public function getFolder()
    {
        return dirname($this->file);
    }


    /**
     * @return object
     */
    public function getResults()
    {
        return $this->Results;
    }

    /**
     * @param $zipFile
     * @throws \Exception
     */
    function Upload($zipFile)
    {
        /*******************************************************************/
        /* Get the ID                                                      */
        /*******************************************************************/
        $id=uniqid();
		if (!file_exists('data')) {
			mkdir('data', 0777, true);
		}
		if (!file_exists('data/Questions')) {
			mkdir('data/Questions', 0777, true);
		}
		if (!file_exists('data/Questions/QuestionCollections')) {
			mkdir('data/Questions/QuestionCollections', 0777, true);
		}
        /*******************************************************************/
        /* Fix the Folder                                                  */
        /*******************************************************************/
        $folderToPlace="data/Questions/QuestionCollections/$id";
        while(file_exists($folderToPlace)){
            $folderToPlace="data/Questions/QuestionCollections/$id";
        }

        /*******************************************************************/
        /* Create the Folder                                               */
        /*******************************************************************/
        if(!mkdir($folderToPlace)){
            throw new \Exception("Folder '$folderToPlace' was not able to be created'");
        }

        /*******************************************************************/
        /* Copy                                                            */
        /*******************************************************************/
        $fileName=basename($zipFile);
        $newFile=$folderToPlace."/$fileName";

        /*******************************************************************/
        if(!copy($zipFile,$newFile)){
            throw new \Exception("Unable to copy file $zipFile to $newFile");
        }
        $this->file=$newFile;


        /*******************************************************************/
        /* Process the File                                                */
        /*******************************************************************/
        $this->Preprocess();
        $this->Process();
        $this->Results=$this->Postprocess();


    }
}