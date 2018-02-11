<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 8:36 PM
 */

namespace Application\Model;

class FileContent
{
    /**
     * #var array
     */
    protected $FileInfo;
    protected $Type;
    protected $PathInfo;
    protected $Extension;
    /**
     * FileContent constructor.
     * @param $fileInfo array File Info Grabbed from $_FILES
     */
    function __construct($path, $type,$extensions)
    {
        $this->FileInfo=$path;
        $this->Extension=$extensions;
        $this->PathInfo=pathinfo($path);
        $this->Type=$type;
    }

    /**
     * @return mixed
     */
    public function getFileInfo()
    {
        return $this->FileInfo;
    }

    /**
     * @return mixed
     */
    public function getPathInfo()
    {
        return $this->PathInfo;
    }

    /**
     * @return mixed
     */
    public function getName(){
        return $this->PathInfo["filename"];
    }

    /**
     * @return mixed
     */
    public function getType(){
        return $this->Type;
    }
    protected static function FindAvailableFileName($extension){
        $folder="data/Files";
        $files = glob($folder . "*.$extension");
        $index=count($files);
        while(file_exists("$folder/File$index.$extension")){
            $index++;
        }
        return "$folder/File$index.$extension";
    }

    /**
     * Copies the file to a location then returns the file path
     * @return string
     */
    function Copy(){
        $fileCopingTo=self::FindAvailableFileName($this->Extension);
        copy($this->FileInfo,$fileCopingTo);

        return $fileCopingTo;
    }








}
