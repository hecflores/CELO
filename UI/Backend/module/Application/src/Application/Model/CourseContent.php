<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/8/2017
 * Time: 2:02 PM
 */

namespace Application\Model;


use Application\Info;
use Application\Roles;
use Zend\Permissions\Rbac\Role;

class CourseContent
{
    protected $ContentID;
    protected $Name;
    protected $URL;
    protected $Description;
    protected $ParentFolderID;
    protected $Type;
    protected $CreatedBy;
    protected $Properties;
    protected $data;
    protected $SectionID;
    protected $RolesVisible;
    protected $Setup;
    protected $RootContentID;
    protected $Depth;
    protected $Children=null;
    protected $Breadcrums=null;
    protected $CourseContentNumber;
    function exchangeArray($data)
    {
        $this->ContentID=(isset($data["ContentID"])) ? $data["ContentID"]:"";
        $this->Name=(isset($data["Name"])) ? $data["Name"]:"";
        $this->URL=(isset($data["URL"])) ? $data["URL"]:"";
        $this->Description=(isset($data["Description"])) ? $data["Description"]:"";
        $this->ParentFolderID=(isset($data["ParentFolderID"])) ? $data["ParentFolderID"]:null;
        $this->Type=(isset($data["Type"])) ? $data["Type"]:"";
        $this->CreatedBy=(isset($data["CreatedBy"])) ? $data["CreatedBy"]:"";
        $this->RootContentID=(isset($data["RootContentID"])) ? $data["RootContentID"]:"";
        $this->Properties=(isset($data["Properties"])) ? $data["Properties"]:"";
        $this->SectionID=(isset($data["SectionID"])) ? $data["SectionID"]:"";
        $this->RolesVisible=(isset($data["RolesVisible"])) ? $data["RolesVisible"]:"";
        $this->Depth=(isset($data["Depth"])) ? $data["Depth"]:"";
        $this->Setup=(isset($data["Setup"])) ? $data["Setup"]=="1":false;
        $this->CourseContentNumber=(isset($data["CourseContentNumber"])) ? $data["CourseContentNumber"]:"";
        $json=json_decode($this->Properties,JSON_FORCE_OBJECT);
        $this->Properties=$json;


        $this->data=$data;
    }

    /**
     * @return mixed
     */
    public function getDepth()
    {
        return $this->Depth;
    }

    /**
     * @param mixed $Depth
     */
    public function setDepth($Depth)
    {
        $this->Depth = $Depth;
    }

    /**
     * @return mixed
     */
    public function getRootContentID()
    {
        return $this->RootContentID;
    }

    /**
     * @param mixed $RootContentID
     */
    public function setRootContentID($RootContentID)
    {
        $this->RootContentID = $RootContentID;
    }

    /**
     * @return mixed
     */
    public function isSetup()
    {
        return $this->Setup;
    }

    /**
     * @return mixed
     */
    public function getContentID()
    {
        return $this->ContentID;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->Name;
    }

    /**
     * @return mixed
     */
    public function getURL()
    {
        return $this->URL;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->Description;
    }

    /**
     * @return mixed
     */
    public function getParentFolderID()
    {
        return $this->ParentFolderID;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->Type;
    }

    /**
     * @return mixed
     */
    public function getCreatedBy()
    {
        return $this->CreatedBy;
    }

    public function filterOutData($data,$regex,$replace){
        $array=array();
        if($data==null){
            return array();
        }
        foreach($data as $name=>$item){
            if (preg_match($regex,$name))
            {
                $name=preg_replace($regex, $replace, $name);
                $array[$name]=$item;
            }
        }
        return $array;
    }

    /**
     * @return mixed
     */
    public function getSetup()
    {
        return $this->Setup;
    }

    /**
     * @param mixed $Setup
     */
    public function setSetup($Setup)
    {
        $this->Setup = $Setup;
    }

    /**
     * @return mixed
     */
    public function getData($index=0,$breadcrums=true)
    {
        $array=array();

        $courseContent=$this->filterOutData($this->data,'/CourseContent\_(.*)/','\1');
        $section=$this->filterOutData($this->data,'/Sections\_(.*)/','\1');
        $sectionCreatedBy=$this->filterOutData($section,'/Section\_CreatedBy\_(.*)/','\1');
        $course=$this->filterOutData($this->data,'/Course\_(.*)/','\1');
        $section["CreatedBy"]=$sectionCreatedBy;
        $section["Course"]=$course;

        $courseContent=$this->data;
        $array["ContentID"]=(isset($courseContent["ContentID"]))?$courseContent["ContentID"]:null;
        $array["SectionID"]=(isset($courseContent["SectionID"]))?$courseContent["SectionID"]:null;
        $array["Name"]=(isset($courseContent["Name"]))?$courseContent["Name"]:null;
        $array["URL"]=Roles::GetRoleUrl("section/{$this->data["SectionID"]}/course-content/{$this->data["ContentID"]}"); //  (isset($courseContent["URL"]))?$courseContent["URL"]:null;
        $array["Description"]=(isset($courseContent["Description"]))?$courseContent["Description"]:null;
        $array["ParentFolderID"]=(isset($courseContent["ParentFolderID"]))?$courseContent["ParentFolderID"]:null;
        $array["RootContentID"]=(isset($courseContent["RootContentID"]))?$courseContent["RootContentID"]:null;
        $array["Type"]=(isset($courseContent["Type"]))?$courseContent["Type"]:null;
        $array["Properties"]=(isset($courseContent["Properties"]))?$courseContent["Properties"]:null;
        $array["Depth"]=(isset($courseContent["Depth"]))?$courseContent["Depth"]:null;
        $array["Gradable"]=(isset($courseContent["Gradable"]))?$courseContent["Gradable"]:null;
        $array["CreatedBy"]=(isset($courseContent["CreatedBy"]))?$courseContent["CreatedBy"]:null;
        $array["RolesVisible"]=(isset($courseContent["RolesVisible"]))?$courseContent["RolesVisible"]:null;
        $array["CourseContentNumber"]=(isset($courseContent["CourseContentNumber"]))?$courseContent["CourseContentNumber"]:null;

        $array["Properties"]=$this->Properties;

        if($index<1)
        {
            $array["Children"]=iterator_to_array($this->getChildren());
            foreach($array["Children"] as $name=>$children){
                $array["Children"][$name]=$array["Children"][$name]->getData($index+1,false);
            }
        }
        if(!$breadcrums){
            return $array;
        }
        if($index==0){

            $array["Breadcrums"]=$this->getBreadcrumbs();


        }




        return $array;
    }

    /**
     * @return array
     */
    public function getChildren()
    {
        if($this->Children==null){
            $this->Children=Info::CourseContentTable()->get(array("ParentFolderID"=>$this->getCourseContentNumber(),
                                                                  "SectionID"=>$this->getSectionID()));

            $root=Info::CourseContentTable()->get(array("CourseContentNumber"=>0,"SectionID"=>$this->getSectionID()));
            if(count($root)!=0){
                //$this->Children[]=$root;
            }

        }
        return $this->Children;
    }

    /**
     * @return CourseContent[]
     */
    public function getBreadcrumbs()
    {
        if($this->Breadcrums!=null){
            return $this->Breadcrums;
        }

        $breadcrumb=array();

        $currentNode=$this->getData(0,false);
        while($currentNode!=null){

            if(!is_numeric($currentNode["ParentFolderID"])){
                break;
            }

            $currentNode=Info::CourseContentTable()->get(array("SectionID"=>$this->getSectionID(), "CourseContentNumber"=>$currentNode["ParentFolderID"]),true);
            if(count($currentNode)==0){

                break;
            }
            $currentNode=$currentNode[0];
            $currentNode=$currentNode->getData(0,false);
            $breadcrumb[]=$currentNode;

            if($currentNode["ParentFolderID"]==null){
                break;
            }

        }
        if($this->getCourseContentNumber()!=0) // If we are the root already...
        {
            if ((count($currentNode = Info::CourseContentTable()->get(array("SectionID" => $this->getSectionID(), "CourseContentNumber" => 0), true))) != 0) // Fount Root
            {
                $currentNode = $currentNode[0];
                $currentNode = $currentNode->getData(0, false);
                $breadcrumb[] = $currentNode;
            }
        }
        return $breadcrumb;



        $data=Info::PerformGet(
            'CourseContentBreadcrumbs',
            array(
                'ChildContentID'=>$this->getContentID()
            ),
            array(),
            function($data){
                $data=json_decode(json_encode($data),TRUE);
                $data["URL"]=Roles::GetRoleUrl('section/'.$data["SectionID"].'/course-content/'.$data['ContentID']);
                return $data;
            }

        );

        $data[]=$this->getData(0,false);

        $this->Breadcrums=$data;



        return $data;
    }

    /**
     * @return mixed
     */
    public function getProperties()
    {
        return $this->Properties;
    }

    /**
     * @return null
     */
    public function getBreadcrums()
    {
        return $this->Breadcrums;
    }

    /**
     * @return mixed
     */
    public function getCourseContentNumber()
    {
        return $this->CourseContentNumber;
    }

    /**
     * @return mixed
     */
    public function getSectionID()
    {
        return $this->SectionID;
    }

    /**
     * @return mixed
     */
    public function isVisible()
    {
        /* todo NEED TO IMPLEMENT. We need to add inital roles because if we dont, you will create a invisible course content
        if(strrpos($this->RolesVisible,Roles::GetRole())==-1){
            return false;
        }*/
        return true;

    }

    /**
     * @return mixed
     */
    public function getRolesVisible()
    {
        return $this->RolesVisible;
    }

    public static function getColumns()
    {
        return array(
            "ContentID"=>true,
            "CourseContentNumber"=>true,
            "SectionID"=>true,
            "Name"=>true,
            "URL"=>true,
            "Description"=>true,
            "ParentFolderID"=>true,
            "RootContentID"=>true,
            "Depth"=>true,
            "Type"=>true,
            "Properties"=>true,
            "Gradable"=>true,
            "CreatedBy"=>true,
            "RolesVisible"=>true,
        );
    }
}