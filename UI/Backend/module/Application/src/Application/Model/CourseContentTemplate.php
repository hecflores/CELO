<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 5/6/2017
 * Time: 5:22 AM
 */

namespace Application\Model;


class CourseContentTemplate
{


    public static function getColumns(){
        return array(
            "TemplateID"=>true,
            "FileID"=>true,
            "Creator"=>true,
            "Notes"=>true,
            "Name"=>true,
            "PrivacyOptions"=>true,
        );
    }
}