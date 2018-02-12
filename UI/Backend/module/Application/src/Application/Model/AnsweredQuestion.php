<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 5/3/2017
 * Time: 9:32 PM
 */

namespace Application\Model;


class AnsweredQuestion
{
    public static function getColumns(){
        return array(
            "AnswerableID"=>true,
            "AnsweredHTML"=>true,
            "Attempts"=>true,
            "ChosenAnswer"=>true,
            "AnsweringGroupID"=>true,
        );
    }
}