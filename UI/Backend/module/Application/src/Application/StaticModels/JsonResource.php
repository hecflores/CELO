<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 1/7/2017
 * Time: 8:49 AM
 */

namespace Application;


class JsonResource
{
    private $file;
    private $loaded=false;
    private $json=null;
    public function __construct($file)
    {
        $this->file=$file;
    }
    public function Set($json)
    {
        $this->json=$json;
        $this->Save();
    }
    public function &Json()
    {
        if(!$this->loaded){
            $this->Load();
        }
        return $this->json;
    }
    public function Attribute($key, $value)
    {
        $this->Json()[$key]=$value;
        return $this;
    }
    /**
     * @return bool
     */
    public function Load()
    {
        /*******************************************************************/
        if(!file_exists($this->file)){
            $this->json=array("dumbyAtt"=>"test");
            $this->Save();
            return $this->Load();
        }
        $jsonText=file_get_contents($this->file);
        $json=json_decode($jsonText,true);
        if($json==null){
            $json=array("error"=>"Unable To Convert Array to Json","jsonText"=>$jsonText);
        }
        $this->json=$json;
        $this->loaded=true;
        return true;
    }
    public function Save()
    {
        if($this->json==null){
            $this->json=array("dumbyAtt"=>"test");
        }
        $jsonText=json_encode($this->json,JSON_FORCE_OBJECT);

        $handle = fopen($this->file, 'w') or die('Cannot open file:  '.$this->file); //implicitly creates file
        fwrite($handle, $jsonText);
        fclose($handle);

        $this->loaded=false;
    }
}