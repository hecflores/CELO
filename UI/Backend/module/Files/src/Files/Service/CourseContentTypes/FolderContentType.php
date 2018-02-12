<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/8/2017
 * Time: 2:46 PM
 */

namespace Files\Service\CourseContentTypes;


use Files\Service\CourseContentItemManager;

class FolderContentType extends ContainerCourseContent
{
    /**
     * @return mixed
     */
    protected function GetType()
    {
        return "folder";
    }

    /**
     * @param CourseContentItemManager $CourseContentManager
     * @return mixed
     */
    protected function DisplayIcon($CourseContentManager)
    {
        echo "<div style='width:100%;height:100%;position:relative'>".
            "<div style='display:inline-block;'>".
            "   <span style='font-size:20px'>Folder</span>".
            "</div>".
            "</div>";
    }

    /**
     * @return mixed
     */
    protected function GetName()
    {
        return "Folder";
    }
}