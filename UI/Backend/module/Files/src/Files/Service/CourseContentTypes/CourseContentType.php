<?php
namespace Files\Service\CourseContentTypes;
use Application\Info;
use Files\Service\CourseContentItemManager;
use Zend\Form\Element\Url;

/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/8/2017
 * Time: 2:18 PM
 */
abstract class CourseContentType
{
    /**
     * @return mixed
     */
    abstract protected function GetName();

    /**
     * @return mixed
     */
    abstract protected function GetType();

    /**
     * @param CourseContentItemManager $CourseContentManager
     * @return mixed
     */
    abstract protected function DisplayPreviewSubContent($CourseContentManager);

    /**
     * @return mixed
     */
    abstract protected function CreateFormDetails();

    /**
     * @param CourseContentItemManager $CourseContentManager
     * @return mixed
     */
    abstract protected function DisplayIcon($CourseContentManager);

    /**
     * @param CourseContentItemManager $CourseContentManager
     * @return mixed
     */
    abstract protected function DisplayMeat($CourseContentManager);


    /**
     * @param $courseContentType
     * @return bool
     */
    public function is($courseContentType){
        return $courseContentType==$this->GetType();
    }
    /**
     * @param CourseContentItemManager $CourseContentManager
     */
    public function DisplayPreview($CourseContentManager)
    {
        echo "<div class='col-lg-12 courseContentPreview'>";
        echo "   <div class='courseContentIconContainer col-lg-3'>";

        $this->DisplayIcon($CourseContentManager);

        echo "   </div>";
        echo "   <div class='courseContentContainer'>";
        echo "       <div><a href='/course-content/{$CourseContentManager->getCourseContent()->getContentID()}' class='course-content-link'>{$CourseContentManager->getCourseContent()->getName()}</a></div>";
        $this->DisplayPreviewSubContent($CourseContentManager);
        echo "   </div>";
        echo "</div>";
    }

    /**
     * @param CourseContentItemManager $CourseContentManager
     */
    public function DisplayContent($CourseContentManager)
    {
        echo "<div class='col-lg-12'>";
        echo "   <div style='background:rgba(240,240,240,.9)'><h1>{$CourseContentManager->getCourseContent()->getName()}</h1></div>";
        echo "   <div class='col-lg-12'>";
        $this->DisplayMeat($CourseContentManager);
        echo "   </div>";
        echo "</div>";
    }
    /**
     * @param CourseContentItemManager $CourseContentManager
     */
   public function CreateForm($CourseContentManager=null){

        if($CourseContentManager==null){
            $url="/course-content/create/{$this->GetType()}";
        }
        else{
            $url="/course-content/{$CourseContentManager->getCourseContent()->getContentID()}/create/{$this->GetType()}";
        }
        echo "<form method='POST' action='$url'>";


        echo "   <div class='form-group'>";
        echo "      <label for='type'>Type</label>";
        echo "      <select name='type' class='form-control' id='Type'>";
        echo "          <option value='{$this->GetType()}'>{$this->GetName()}</option>";
        foreach(CourseContentItemManager::GetCourseContentTypes() as $contentType){
            if($contentType->GetType()==$this->GetType()){continue;}
            echo "          <option value='{$contentType->GetType()}'>{$contentType->GetName()}</option>";
        }
        echo "      </select>";
        $this->CreateFormDetails();
        echo "<input type='submit' class='form-control btn btn-default' value='Create'/>";
        echo "   </div>";
   }

}