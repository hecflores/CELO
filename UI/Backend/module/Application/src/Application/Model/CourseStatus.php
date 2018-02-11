<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/21/2017
 * Time: 8:36 PM
 */

namespace Application\Model;


class CourseStatus
{
    protected $CourseStatus;
    protected $AnyTags;
    protected $data;

    function exchangeArray($data)
    {
        $this->CourseStatus=(isset($data["CourseStatus"])) ? $data["CourseStatus"]:"";
        $this->AnyTags=(isset($data["AnyTags"])) ? $data["AnyTags"]:"";
        $this->data=$data;
    }

    /**
     * @return mixed
     */
    public function getCourseStatus()
    {
        return $this->CourseStatus;
    }

    /**
     * @return mixed
     */
    public function getAnyTags()
    {
        return $this->AnyTags;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    public static function getColumns()
    {
        return array_map(function() {
            return true;
        },(new self())->getData());
    }

}