<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 4/29/2017
 * Time: 9:38 PM
 */

namespace Files\Controller;


use Application\Info;
use Application\Model\FilesTable;
use Zend\Mvc\Controller\AbstractActionController;

class FileManagerController extends AbstractActionController
{

    function getFileAction(){

        $FileID=$this->params()->fromRoute("FileID");

        $File=Info::FilesTable()->getFromID($FileID);

        header("Content-Type: ".$File->getContentType());
        echo file_get_contents($File->getPath());
        exit();
    }


}