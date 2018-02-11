<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/10/2017
 * Time: 2:52 PM
 */

namespace Application\Model;


use Application\Info;
use Application\Service\APIHelper;
use Zend\Db\Adapter\Driver\Pgsql\Statement;
use Zend\Db\Adapter\StatementContainer;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Insert;
use Zend\Db\Sql\Predicate\In;
use Zend\Db\Sql\Predicate\Predicate;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Zend\Db\TableGateway\TableGateway;

class TagTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * @param $data
     * @return bool
     */
    public function save($data){

        if(!Info::ValidateObjectTemplate(array(
            "Category"=>".*",
            "TagID"=>".*",
            "ObjectID"=>"\\d*",
            "Rank"=>"\\d*"
        ),$data)){
            //var_dump($data);
            //return false;
        }


        //if(count($this->get($data["Category"],$data["TagID"],$data["ObjectID"],self::$STRICT))==0){
           $this->tableGateway->insert($data);
           //return true;
//        }
//        $this->tableGateway->update(
//            array(
//                "Rank"=>$data["Rank"]
//            ),
//            array(
//                "Category"=>$data["Category"],
//                "TagID"=>$data["TagID"],
//                "ObjectID"=>$data["ObjectID"],
//            ));

        return true;

    }
    public static $SEARCH="search";
    public static $STRICT="strict";



    public function get($parameters){
        $columns=array_map(function() {
            return true;
        },(new Tag())->getData());

        return APIHelper::PerformAPIFetch($parameters,$columns,$this->tableGateway);
    }

//    /**
//     * @param null $Category
//     * @param null $Search
//     * @param null $ObjectID
//     * @param string $TypeOfSearch
//     * @param null|Select $select
//     * @return array|ø
//     */
//    public function get($Category=null, $Search=null, $ObjectID=null, $TypeOfSearch="search", &$select=null){
//        if($select==null){
//            $select=new Select("Tags");
//        }
//        $where=(new Where(null,Where::COMBINED_BY_AND));
//        $select=new Select("Tags");
//        $select->where($where);
//        /*******************************************************************/
//        /* Category                                                        */
//        /*******************************************************************/
//        if($Category!=null){
//            $where->equalTo("Category",$Category);
//        }
//
//        /*******************************************************************/
//        /* Tag Search                                                      */
//        /*******************************************************************/
//        if($Search!=null){
//            if($TypeOfSearch==self::$SEARCH) {
//                $where->like("TagID", "%$Search%");
//            }
//            else if($TypeOfSearch==self::$STRICT){
//                $where->equalTo("TagID", $Search);
//            }
//        }
//
//        /*******************************************************************/
//        /* Object ID                                                       */
//        /*******************************************************************/
//        if($ObjectID!=null){
//            $where->equalTo("ObjectID",$ObjectID);
//            $select->quantifier(Select::QUANTIFIER_DISTINCT);
//        }
//
//        return iterator_to_array($this->tableGateway->selectWith($select));
//
//    }
    public function copy($columnsCopies,$updateWith)
    {
        $select=new Select();
        $select->from("Tags");
        $select->where($columnsCopies);

        /********************************************************************/
        /* Build Needed Values Array                                        */
        /********************************************************************/
        $values=array("TagID"=>"TagID","ObjectID"=>"ObjectID","Category"=>"Category","Rank"=>"Category");


        //Add Columns we are changing
        foreach($updateWith as $updateColumn=>$value){
            /* KEEP IN MIND */
            //Broke
            //$values[$updateColumn]=new Expression("$value",$updateColumn);
            //Worked
            $values[$updateColumn]=new Expression("$value");
        }

        //Check for any missing columns
        foreach($values as $column=>$value){
            if($value==null){
                echo "<h1 class='text-danger'>Incorrect Use of TagTable::copy()</h1>";
                echo '<h4 class="text-danger">$columnsCopies</h4>';
                var_dump($columnsCopies);
                echo '<h4 class="text-danger">$updateColumn</h4>';
                var_dump($updateColumn);
                echo '<h4 class="text-danger">$values</h4>';
                var_dump($values);
                exit();
            }
        }

        /********************************************************************/
        /* Add Select(Search)                                               */
        /********************************************************************/
        $select->columns($values);
        $insert=new Insert("Tags");
        $insert->columns(array_keys($values));
        $insert->select($select);



        /********************************************************************/
        /*                            I N S E R T                           */
        /********************************************************************/
        $query=Info::SQL()->prepareStatementForSqlObject($insert);
        echo $query->getSql();
        $result=$query->execute();

        //Check
        if(!$result){
            echo "<h1 class='text-danger'>SQL Failed in TagTable::copy()</h1>";
            echo '<h4 class="text-danger">$columnsCopies</h4>';
            var_dump($columnsCopies);
            echo '<h4 class="text-danger">$updateColumn</h4>';
            var_dump($updateColumn);
            echo '<h4 class="text-danger">$values</h4>';
            var_dump($values);
            echo '<h4 class="text-danger">SQL</h4>';
            $insert->getSqlString();
            exit();
        }


    }

}