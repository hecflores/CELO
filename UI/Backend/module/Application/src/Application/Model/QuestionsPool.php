<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 5/11/2017
 * Time: 7:54 PM
 */

namespace Application\Model;


class QuestionsPool
{


    public static function getColumns()
    {
        return array(
            "QuestionsPoolID"=>true,
            "ParentQuestionPool"=>true,
            "UserID"=>true,
            "Name"=>true,
            "Description"=>true,
            "Parameters"=>true);
    }
}