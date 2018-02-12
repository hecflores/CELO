<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 4/7/2017
 * Time: 7:41 PM
 */

namespace QuestionUploader;


use ZipArchive;

class PublisherQuestionUploader extends QuestionsUploader{

    /**
     * @var string
     */
    protected $zipFolder;
    protected $FileInfo=array();
    protected $ZipInfo=array();
    protected function LoadXML($loadFolder, $identifier, &$data)
    {
        foreach(glob($loadFolder."/*.xml") as $file){
            $data[$identifier."/".basename($file)]=simplexml_load_file($file);
        }

        foreach (scandir($loadFolder) as $file){
            if($file=="."){continue;}
            if($file==".."){continue;}
            if(is_dir($loadFolder."/".$file)){
                $identifierNew=$identifier.((count($identifier)==0)?"":"/").basename($file);
                $this->LoadXML($loadFolder."/".$file,$identifierNew,$data);
            }
        }
    }
    protected function Preprocess()
    {

        $zip = new ZipArchive;
        if ($zip->open($this->getFile()) === TRUE)
        {
            $fileInfo=pathinfo($this->getFile());
            $this->zipFolder=$this->getFolder()."/".$fileInfo["filename"];
            mkdir($this->zipFolder);
            $zip->extractTo($this->zipFolder);
            $zip->close();


            echo 'ok';
        }
        else
        {
            echo 'failed';
        }
    }
    function MainXMLFile()
    {
        $xmlFile=$this->zipFolder."/imsmanifest.xml";
        if(!file_exists($xmlFile)){
            throw new \Exception("Main XML $xmlFile was not found");
        }
        return $xmlFile;
    }
    protected function Process()
    {
        $this->LoadXML($this->zipFolder,"",$this->ZipInfo);
        return $this->ZipInfo;
    }
    protected function Postprocess()
    {
        if(!isset($this->ZipInfo['/QIZ_0_M/data/questionDB.xml'])){
            throw new \Exception("Question DB was not found.");
        }

        $questionsDB=$this->ZipInfo['/QIZ_0_M/data/questionDB.xml'];
        $sectionsFound=$questionsDB->section;

        $finalReport=array();
        foreach($sectionsFound as $section)
        {
            $finalReportForSection=array();
            $finalReportForSection["questions"]=array();

            /***************************************************************/
            $questions=$section->item;
            foreach($questions as $item=>$questionFound)
            {


                /***********************************************************/
                $answer=null;

                /***********************************************************/
                /**
                 * @var $questionFound \SimpleXMLElement
                 */
                $questionTitle=$questionFound->attributes();
                $questionTitle=(string)$questionTitle->title;
                $presentation=$questionFound->presentation->flow;

                $questionDisplayed=(string)$presentation->material->mattext;
                $answers=array();
                $answersFound=$presentation->response_lid->render_choice->flow_label->response_label;

                /***********************************************************/
                for($answerIndex=0;$answerIndex<count($answersFound);$answerIndex++){


                    $answerFound=$answersFound[$answerIndex];
                    $questionAnswer=(string)$answerFound->material->mattext;

                    $pointsEarned=$questionFound->resprocessing->respcondition[$answerIndex]->setvar;
                    if($pointsEarned=="100")
                    {
                        if($answer!=null){
                            throw new \Exception("Expected Only One Answer. Found More then one");
                        }
                        $answer=$questionAnswer;
                    }
                    $answers[]=$questionAnswer;
                }

                $question=array(
                    "question"=>$questionTitle,
                    "display"=>$questionDisplayed,
                    "answers"=>$answers,
                    "answer"=>$answer
                );
                $finalReport[]=$question;
            }

        }
        return $finalReport;
    }
}