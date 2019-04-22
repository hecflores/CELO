<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/8/2017
 * Time: 2:48 PM
 */

namespace Files\Service\CourseContentTypes;


use Files\Service\CourseContentItemManager;

class FileContent extends CourseContentType
{

    /**
     * @return mixed
     */
    protected function GetType()
    {
        return "file";
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
            "   <span style='font-size:20px'>File</span>".
            "</div>".
            "</div>";
    }

    /**
     * @return mixed
     */
    protected function CreateFormDetails()
    {
        echo "<h2>Html</h2><input type='file' name='Properties.html'/>";

    }
    /**
     * @return mixed
     */
    protected function GetName()
    {
        return "HTML File";
    }

    /**
     * @param CourseContentItemManager $CourseContentManager
     * @return mixed
     */
    protected function DisplayMeat($CourseContentManager)
    {

    }
}