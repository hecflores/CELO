<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 4/1/2017
 * Time: 10:35 PM
 */

namespace Application\Service\Meat;


use Application\Model\QuestionType;
use Application\Service\APIHelper;

class QuestionTypesMeatEater
{
    public static function getQuestionTypes($parameters, &$output)
    {
        /*******************************************************************/
        /* Check Variables                                                 */
        /*******************************************************************/
        MeatEater::InitializeOutput($output);
        if(!MeatEater::CheckParameters($parameters,array(),$output)){
            return false;
        }

        /*******************************************************************/
        $output= APIHelper::QuickFetch(
            "QuestionTypesReport",
            $parameters,
            QuestionType::getColumns(),
            function($item){
                $questionType=new QuestionType();
                $questionType->exchangeArray($item);
                $data=$questionType->getData();
                $data["Edit"]="/questions/question-types/".$data["QuestionTypeID"];
                return $data;
            });

        return true;



    }
}