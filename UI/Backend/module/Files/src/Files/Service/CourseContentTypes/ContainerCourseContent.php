<?php
namespace Files\Service\CourseContentTypes;
use Files\Service\CourseContentItemManager;

/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/8/2017
 * Time: 2:31 PM
 */
class ContainerCourseContent extends CourseContentType
{
    /**
     * @return mixed
     */
    protected function GetType()
    {
        return "container";
    }

    /**
     * @param CourseContentItemManager $CourseContentManager
     * @return mixed
     */
    protected function DisplayPreviewSubContent($CourseContentManager)
    {
        echo "<p><b>{$CourseContentManager->getCourseContent()->getDescription()}</b></p>";
    }

    /**
     * @param CourseContentItemManager $CourseContentManager
     * @return mixed
     */
    protected function DisplayIcon($CourseContentManager)
    {
        echo "<div style='width:100%;height:100%;position:relative'>".
              "<div style='display:inline-block;'>".
               "   <span style='font-size:20px'>Container</span>".
              "</div>".
            "</div>";
    }

    /**
     * @param CourseContentItemManager $CourseContentManager
     * @return mixed
     */
    protected function DisplayMeat($CourseContentManager)
    {
        /** @var CourseContentItemManager[] $children */
        $children=$CourseContentManager->getCourseContent()->getChildren();
        $children=array_map(function($item){
            return new CourseContentItemManager($item);
        },iterator_to_array($children));
        foreach($children as $child){
            $child->DisplayPreview();
            echo "<div class='col-lg-12'><hr></div>";
        }
    }

    /**
     * @return mixed
     */
    protected function CreateFormDetails()
    {
        echo "";
    }

    /**
     * @return mixed
     */
    protected function GetName()
    {
         return "Basic Container";
    }
}