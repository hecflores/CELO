<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/26/2017
 * Time: 1:16 AM
 */

namespace Application\Service;


use Application\Info;
use Application\Model\AnswerableQuestion;
use Exception;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Predicate\Predicate;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Zend\Db\TableGateway\TableGateway;

class APIHelper
{

    /**
     * @param array $filters
     * @param array $columnsAllowed
     * @return array = [
     *    "filtersDenied" => array().
     *    "fixedFilters" => array()
     * ]
     */
    public static function fixFilters($filters, $columnsAllowed){
        $filtersDenied=array();
        $newFilters=array();

        /*******************************************************************/
        $filterAgents=array(
            "IS_NULL"=>function($where,$filterName,$filterInfo){
                /** #@var Where $where */
                /** #@var array $filterInfo */
                $where->isNull($filterName);
            },
            "IS_NOT_NULL"=>function($where,$filterName,$filterInfo){
                /** #@var Where $where */
                /** #@var array $filterInfo */
                $where->isNotNull($filterName);
            },
            "VALUE_OR_NULL"=>function($where,$filterName,$filterInfo){
                /** #@var Where $where */
                /** #@var array $filterInfo */
                $where->addPredicate((new Predicate(array(),Predicate::COMBINED_BY_OR))->isNull($filterName)->equalTo($filterName,$filterInfo["value"]),Predicate::COMBINED_BY_AND);
            },
            "EQUALS"=>function($where,$filterName,$filterInfo){
                /** #@var Where $where */
                /** #@var array $filterInfo */
                $where->equalTo($filterName,$filterInfo["value"]);
            },
            "NOT_EQUAL"=>function($where,$filterName,$filterInfo){
                /** #@var Where $where */
                /** #@var array $filterInfo */
                $where->notEqualTo($filterName,$filterInfo["value"]);
            },
            "CONTAINS"=>function($where,$filterName,$filterInfo){
                /** #@var Where $where */
                /** #@var array $filterInfo */
                $where->like($filterName,"%{$filterInfo["value"]}%");
            },
            "NOT_CONTAINS"=>function($where,$filterName,$filterInfo){
                /** #@var Where $where */
                /** #@var array $filterInfo */
                $where->notLike($filterName,"%{$filterInfo["value"]}%");
            },
            "IN"=>function($where,$filterName,$filterInfo){
                /** #@var Where $where */
                /** #@var array $filterInfo */
                if(!is_array($filterInfo["value"])){
                    $filterInfo["value"]=array($filterInfo["value"]);
                }
                if(count($filterInfo["value"])==0){
                    return;
                }
                if(count($filterInfo["value"])==1){
                    $where->equalTo($filterName,$filterInfo["value"][0]);
                    return;
                }
                $where->in($filterName,$filterInfo["value"]);
            }
        );

        /*******************************************************************/
        foreach($filters  as $filterName=>$filter)
        {
            $newFilter=array();

            /***************************************************************/
            /* If Column is not allowed                                    */
            /***************************************************************/
            if($columnsAllowed==null && !isset($columnsAllowed[$filterName]))
            {
                if($filterName=='_'){ //This is used to not catch get request... So just ignore them
                    continue;
                }
                $filtersDenied[$filterName]=array(
                    "filter"=>$filterName,
                    "reason"=>"Not Part of the Column"
                );
                continue;
            }

            /***************************************************************/
            if(!is_array($filter))
            {
                $filter=array(
                    "type"=>"EQUALS",
                    "value"=>$filter
                );
            }

            /***************************************************************/
            if(is_array($filter))
            {
                /***********************************************************/
                if(!isset($filter["type"])){
                    $newFilter["type"]="EQUALS";
                }

                /***********************************************************/
                if(!isset($filter["value"])){
                    $filtersDenied[$filterName]=array(
                        "filter"=>$filterName,
                        "reason"=>"Value missing"
                    );
                    continue;
                }

                /***********************************************************/
                if(!isset($filterAgents[$filter["type"]])){
                    $filtersDenied[$filterName]=array(
                        "filter"=>$filterName,
                        "reason"=>"Type {$filter["type"]} is not recognized"
                    );
                    continue;
                }

                /***********************************************************/
                $newFilter["value"]=$filter["value"];
                $newFilter["type"]=$filterAgents[$filter["type"]];
            }
            else{
                $filtersDenied[$filterName]=array(
                    "filter"=>$filterName,
                    "reason"=>"Unknown Column Type"
                );
            }

            $newFilters[$filterName]=$newFilter;
        }

        return array(
            "filtersDenied" => $filtersDenied,
            "fixedFilters"=>$newFilters
        );
    }

    /**
     * @param Where $where
     * @param array $filters
     * @throws \Exception
     */
    public static function setupWhereFromFilters($where, $filters)
    {
        foreach($filters  as $filterName=>$filter)
        {
            if(!is_callable($filter["type"])){
                throw new \Exception("$filterName: Expected type to be callable. Possibly fixFilters was not used to fix filters");
            }

            $filter["type"]($where,$filterName,$filter);
        }
    }

    public static function runFilters($where, $filters, $columns){
        $results=self::fixFilters($filters,$columns);
        $deniedFilters=$results["filtersDenied"];
        $filters=$results["fixedFilters"];

        self::setupWhereFromFilters($where,$filters);

        return $deniedFilters;
    }

    /**
     * @param array $parameters
     * @param array $allowedColumns
     * @param TableGateway $tableGateway
     * @return array
     * @throws \Exception
     */
    public static function PerformAPIFetch($parameters, $allowedColumns, $tableGateway,$orderBy=null){
        /*******************************************************************/
        if(!(isset($parameters["filters"]) && is_array($parameters["filters"]))){
            $parameters["filters"]=[];
        }

        /*******************************************************************/
        $initialized=$tableGateway->isInitialized();
        if(!$initialized){
            $tableGateway->initialize();
        }


        $columns=$allowedColumns;

        /*******************************************************************/
        /* Sorting.                                                        */
        /*******************************************************************/
        $orderByArray=array();
        if(!isset($parameters["sorting"])){
            $parameters["sorting"]=array("enabled"=>false);
        }
        if(!(is_array($parameters["sorting"]))){
            if(is_string($parameters["sorting"])){
                $parameters["sorting"]=array("enabled"=>true,"by"=>array(
                    $parameters["sorting"]=>"DESC"
                ));
            }
        }

        if(!isset($parameters["sorting"]["enabled"])){
            $parameters["sorting"]=array("enabled"=>false);
        }
        if(!(isset($parameters["sorting"]["by"]) && is_array($parameters["sorting"]["by"]))){
            $parameters["sorting"]=array("enabled"=>false);
        }
        if($parameters["sorting"]["enabled"]){
            foreach($parameters["sorting"]["by"] as $byColumn=>$direction)
            {
                if($columns==null && !isset($columns[$byColumn])){
                    throw new \Exception("$byColumn: Not a valid column");
                }
                if(!is_string($direction)){
                    throw new \Exception("$byColumn: Order Direction is not of type string");
                }
                if(!($direction=="DESC" || $direction=="ASC")){
                    throw new \Exception("$byColumn: Order Direction $direction is not valid");
                }
                if(!is_string($direction)){
                    throw new \Exception("Direction is not of type string");
                }

                $orderByArray[]=$byColumn." ".$direction;
            }
        }

        /*******************************************************************/
        $filters=$parameters["filters"];
        unset($parameters["filters"]);


        /*******************************************************************/
        $select=new Select();
        $select->from($tableGateway->getTable());

        /*******************************************************************/
        /* Sorting                                                         */
        /*******************************************************************/
        if($parameters["sorting"]["enabled"]){
            $select->order($orderByArray);
        }
        unset($parameters["sorting"]);


        /*******************************************************************/
        /* Grouping                                                        */
        /*******************************************************************/
        $groupingEnabled=false;
        if(isset($parameters["grouping"]))
        {
            $groupingEnabled=true;
            $grouping=$parameters["grouping"];
            $finalGroups=array();

            /***************************************************************/
            if(is_string($grouping)){
                preg_match_all('/([^\,]+)(\,|$)/', $grouping, $matches, PREG_SET_ORDER, 0);
                $grouping=array_map(function($match){
                    return $match[1];
                },$matches);
            }

            /***************************************************************/
            foreach($grouping as $group)
            {
                if(!is_string($group)){
                    throw new \Exception("$group: Grouping is not of type string");
                }
                if($allowedColumns!=null && !isset($allowedColumns[$group])){
                    throw new \Exception("$group: Grouping is not a valid column");
                }


                $finalGroups[$group]=$group;
            }
            $finalGroups["Count"]=new Expression("COUNT(*)");

            $select->columns($finalGroups);
            $select->group($grouping);

            unset($parameters["grouping"]);
        }

        /*******************************************************************/
        /* Key                                                             */
        /*******************************************************************/
        $keyEnabled=false;
        $key=null;
        if(isset($parameters["key"]))
        {
            $keyEnabled=true;
            $key=$parameters["key"];
            if(!is_string($key)){
                throw new \Exception("$key: Key is not of type string");
            }
            if($allowedColumns!=null && !isset($allowedColumns[$key])){
                throw new \Exception("$key: Key is not a valid column");
            }
            if($groupingEnabled){
                if(!isset($grouping[$key])){
                    throw new \Exception("$key: Key is not a valid column becaused we are gouping");
                }
            }

            unset($parameters["key"]);


        }

        /*******************************************************************/
        foreach($parameters as $name=>$value)
        {
            $filters[$name]=$value;
        }

        /*******************************************************************/
        /* Convert Filters to usable, interpreted filters                  */
        /*******************************************************************/
        $where=new Where();
        $deniedFilters=self::runFilters($where,$filters,$columns);
        $select->where($where);
        if($orderBy!=null){
            $select->order($orderBy);
        }
        $sql=Info::SQL();
        $query=$sql->prepareStatementForSqlObject($select);
        $sqlString=$query->getSql();

        /*******************************************************************/
        /* Perform Select                                                  */
        /*******************************************************************/
        if(!$groupingEnabled) {
            $results = $tableGateway->selectWith($select);

            /***************************************************************/
            $results=array_map(function($item){
                /** #@var AnswerableQuestion $item */
                if(method_exists($item,"getData")){
                    return $item->getData();
                }
                return $item;

            },iterator_to_array($results));
        }
        else{
            $sql=Info::SQL();
            $query=$sql->prepareStatementForSqlObject($select);
            try {
                $results = $query->execute();
            }
            catch(Exception $k){
                echo $k->getMessage();
            }

            $results=iterator_to_array($results,false);
        }

        $finalResults=$results;
        if($keyEnabled){
            $finalResults=array();
            foreach($results as $index=>$item){
                $copy=$item;
                $keyValue=$item[$key];
                if(!isset($finalResults[$keyValue])){
                    $finalResults[$keyValue]=array();
                }

                unset($copy[$key]);
                $finalResults[$keyValue][]=$copy;
            }
        }

        /*******************************************************************/
        return array(
            "results"=>$finalResults,
            "denied"=>$deniedFilters
        );
    }
    public static function setNewKey($results,$key,$preserveOldAttribute=false,$oneToOne=false){
        $finalResults=array();

        foreach($results as $index=>$item){
            $copy=$item;
            $keyValue=$item[$key];
            if(!isset($finalResults[$keyValue])){
                if($oneToOne){
                    $finalResults[$keyValue]=$copy;
                    continue;
                }
                $finalResults[$keyValue]=array();
            }
            if(!$preserveOldAttribute) {
                unset($copy[$key]);
            }
            if($oneToOne){
                $finalResults[$keyValue]=array($finalResults[$keyValue]);
            }
            $finalResults[$keyValue][]=$copy;
        }
        return $finalResults;
    }
    public static function is_assoc($array)
    {
        return is_array($array) && count($array) !== array_reduce(array_keys($array), 'is_assoc_callback', 0);
    }
    public static function QuickFetch($tableName, $parameters, $allowedColumns,$mapper=null,$orderBy=null)
    {
        $dbAdapter = Info::getServiceManager()->get('Zend\Db\Adapter\Adapter');
        $resultSetPrototype = new ResultSet();
        $tableGateway=new TableGateway($tableName, $dbAdapter, null, $resultSetPrototype);

        $data=self::PerformAPIFetch($parameters,$allowedColumns,$tableGateway,$orderBy);


        if(isset($parameters["key"]))
        {
            if(is_callable($mapper))
            {
                foreach($data["results"] as $index=>$item)
                {
                    $data["results"][$index]=array_map($mapper,$item);
                }
            }
        }
        else if(is_callable($mapper))
        {
            $data["results"]=array_map($mapper,$data["results"]);
        }

        return $data;

    }
}