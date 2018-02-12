<?php
namespace Files\Service;
use Application\Info;
use Application\Model\CourseContent;
use Files\Service\CourseContentTypes\ContainerCourseContent;
use Files\Service\CourseContentTypes\CourseContentType;
use Files\Service\CourseContentTypes\FileContent;
use Files\Service\CourseContentTypes\FolderContentType;

/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/8/2017
 * Time: 1:58 PM
 */
class CourseContentItemManager
{
    /** @var CourseContent */
    private $CourseContent;

    private static $CourseContentTypes;

    /**
     * @return CourseContentType[]
     */
    public static function GetCourseContentTypes(){
        if(!isset(self::$CourseContentTypes))
        {
            self::$CourseContentTypes=array();

            /***************************************************************/
            /* Content Types                                               */
            /***************************************************************/
            self::$CourseContentTypes[]=new FolderContentType();
            self::$CourseContentTypes[]=new ContainerCourseContent();
            self::$CourseContentTypes[]=new FileContent();
        }
        return self::$CourseContentTypes;
    }

    function __construct($contentID)
    {
        if($contentID instanceof CourseContent){
            $this->CourseContent=$contentID;
        }
        else{
            $this->CourseContent=Info::CourseContentTable()->getByID($contentID);
            if($this->CourseContent==null){
                throwException(new \Exception("Invalid Course ID $contentID"));
            }
        }
    }

    /**
     * @return CourseContent
     */
    public function getCourseContent()
    {
        return $this->CourseContent;
    }

    /**
     * @return CourseContentType|null
     */
    public function getCourseContentType()
    {
        $courseContentTypes=self::GetCourseContentTypes();
        foreach($courseContentTypes as $courseContentType){
            if($courseContentType->is($this->getCourseContent()->getType())){
                return $courseContentType;
            }
        }

        return null;
    }

    public function DisplayPreview()
    {
        $courseContentTypes=$this->getCourseContentType();
        if($courseContentTypes==null){
            echo "<h2 class='text-danger'>Unkown Type</h2>";
            return;
        }
        $courseContentTypes->DisplayPreview($this);
    }
    public function DisplayContent()
    {
        $courseContentTypes=$this->getCourseContentType();
        if($courseContentTypes==null){
            echo "<h2 class='text-danger'>Unkown Type</h2>";
            return;
        }
        $courseContentTypes->DisplayContent($this);
    }

}