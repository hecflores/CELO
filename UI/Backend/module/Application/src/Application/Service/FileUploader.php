<?php
namespace Application\Service;

use Application\Info;
use Application\Model\FileContent;

class FileUploader{


    /**
     * @param $file string
     */
    static function UploadFile($file){

        $info=pathinfo($file["name"]);
        $File=new FileContent($file["tmp_name"],$file["type"],$info["extension"]);

        /*******************************************************************/
        $newFilePath=$File->Copy();

        /*******************************************************************/
        $FileID=uniqid();
        while(Info::FilesTable()->getFromID($FileID)!=null){
            $FileID=uniqid();
        }

        /*******************************************************************/
        Info::FilesTable()->Insert(array(
            "FileID"=>$FileID,
            "Path"=>$newFilePath,
            "ContentType"=>$File->getType(),
            "Name"=>$File->getName(),
            "CreatedBy"=>Info::getCurrentUser()->getUserID()
        ));

        return $FileID;
    }

    static function UploadContent($text, $ext){

        $tempFile=uniqid()."_temp.$ext";
        file_put_contents($tempFile,$text);
        $File=new FileContent($tempFile,"application/json",$ext);

        /*******************************************************************/
        $newFilePath=$File->Copy();

        /*******************************************************************/
        $FileID=uniqid();
        while(Info::FilesTable()->getFromID($FileID)!=null){
            $FileID=uniqid();
        }

        /*******************************************************************/
        Info::FilesTable()->Insert(array(
            "FileID"=>$FileID,
            "Path"=>$newFilePath,
            "ContentType"=>$File->getType(),
            "Name"=>$File->getName(),
            "CreatedBy"=>Info::getCurrentUser()->getUserID()
        ));

        return $FileID;
    }


}