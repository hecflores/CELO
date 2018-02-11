<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 3/2/2017
 * Time: 2:57 AM
 */

namespace Application\Service;


class Item{

    /** @var  mixed */
    protected $callback;
    protected $properties;
    function __construct($properties, $callback)
    {
        $this->callback=$callback;
        $this->properties=$properties;
    }

    public function render(){
        $customCallback=$this->callback;
        $customCallback($this->properties);
    }
}

class Menu{
    /** @var Item[]|Menu[]  */
    protected $_overwrittenTitleComponent=null;
    protected $_items=array();

    function __construct()
    {
    }
    function reanderHead(){
        $this->_overwrittenTitleComponent->render();
    }
    function hasCustomHead(){
        return $this->_overwrittenTitleComponent!=null;
    }
    function headLink($name,$link, $styles=array()){
        $this->_overwrittenTitleComponent = new Item(array("name"=>$name,"link"=>$link,"styles"=>$styles),function($parameters){

            $styleStr="";
            foreach($parameters["styles"] as $name=>$value){
                $styleStr.=$name.":".$value.";";
            }
            echo "<a style='$styleStr' href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>{$parameters["name"]}<span class='caret'></span></a>";
        });

        return $this;
    }
    function link($name,$link, $styles=array()){
        $this->callback(array("name"=>$name,"link"=>$link,"styles"=>$styles),function($parameters){

            $styleStr="";
            foreach($parameters["styles"] as $name=>$value){
                $styleStr.=$name.":".$value.";";
            }
            echo "<a style='$styleStr' href={$parameters['link']}>{$parameters["name"]}</a>";
        });
        return $this;
    }
    function custom($string){
        $this->callback(array("string"=>$string),function($parameters){
            echo $parameters['string'];
        });
    }

    function callback($parameters,$callback){
        $this->_items[]=new Item($parameters,$callback);
    }
    function __set($name, $value)
    {
        if($value instanceof Menu){
            $this->_items[$name]=$value;
            return;
        }


        throwException(new \Exception("Unkown Type ".gettype($value)." expecting Menu"));

    }
    function render(){

        echo "<ul class='dropdown-menu'>";
        foreach($this->_items as $name=>$item){
            echo '<li>';
            $item->render();
            echo '</li>';
        }
        echo "</ul>";
    }
    /**
     * @param $name
     * @return Menu
     */
    function __get($name)
    {
        if(isset($this->_items[$name])){
            return $this->_items[$name];
        }
        $this->_items[$name]=new Menu();

        return $this->_items[$name];
    }

    /**
     * @return array
     */
    public function &getItems()
    {
        return $this->_items;
    }

}

class MenuGroup{
    /** @var Menu[]  */
    protected $_menus=array();
    protected $_addedClasses=array();

    protected $_failed=false;
    protected $_errorMessage;
    function __construct()
    {
    }

    function link($name,$link, $styles=array()){
        $this->callback(array("name"=>$name,"link"=>$link,"styles"=>$styles),function($parameters){

            $styleStr="";
            foreach($parameters["styles"] as $name=>$value){
                $styleStr.=$name.":".$value.";";
            }
            echo "<a style='$styleStr' href={$parameters['link']}>{$parameters["name"]}</a>";
        });
    }
    function openWindow($name,$link, $styles=array()){
        $this->callback(array("name"=>$name,"link"=>$link,"styles"=>$styles),function($parameters){

            $styleStr="";
            foreach($parameters["styles"] as $name=>$value){
                $styleStr.=$name.":".$value.";";
            }
            echo "<a target='_blank' style='$styleStr' href={$parameters['link']}>{$parameters["name"]}</a>";
        });
    }
    function custom($string){
        $this->callback(array("string"=>$string),function($parameters){
            echo $parameters['string'];
        });
    }
    function callback($parameters,$callback){
        $this->_menus[]=new Item($parameters,$callback);
    }

    function __set($name, $value)
    {
        if($value instanceof Menu){
            $this->_menus[$name]=$value;
            return;
        }


        throwException(new \Exception("Unkown Type ".gettype($value)." expecting Menu"));

    }
    /**
     * @return array
     */
    public function &getItems()
    {
        return $this->_menus;
    }
    function isRight(){
        $this->_addedClasses[]='navbar-right';
        return $this;
    }
    function render(){
        $classes='nav navbar-nav';
        foreach($this->_addedClasses as $class){
            $classes.=" ".$class;
        }
        echo "<ul style='margin:7.5px 0px' class='$classes'>";

        foreach($this->_menus as $name=>$item)
        {
            if($item instanceof Item) {
                echo "<li>";
                $item->render();
                echo "</li>";
                continue;
            }


            echo "<li class='dropdown'>";
            if($item->hasCustomHead()){
                $item->reanderHead();
            }
            else {
                echo "     <a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>$name<span class='caret'></span></a>";
            }
            $item->render();
            echo "</li>";
        }
        echo '</ul>';
    }
    /**
     * @param $name
     * @return Menu
     */
    function __get($name)
    {
        if(isset($this->_menus[$name])){
            return $this->_menus[$name];
        }
        $this->_menus[$name]=new Menu();

        return $this->_menus[$name];
    }

}

class MenuGroupManager{
    /** @var MenuGroup[]  */
    protected $_menus=array();

    function __construct()
    {

    }


    function render(){


        foreach($this->_menus as $name=>$item)
        {
            $item->render();
        }
    }
    function __set($name, $value)
    {
        if($value instanceof MenuGroup){
            $this->_menus[$name]=$value;
            return;
        }


        throwException(new \Exception("Unkown Type ".gettype($value)." expecting MenuGroup"));

    }

    /**
     * @param $name
     * @return MenuGroup
     */
    function __get($name)
    {
        if(isset($this->_menus[$name])){
            return $this->_menus[$name];
        }
        $this->_menus[$name]=new MenuGroup();

        return $this->_menus[$name];
    }


}

class Helper
{
    /** @var MenuGroupManager */
    protected $_menuGroups;

    function __construct()
    {
        $this->_menuGroups=new MenuGroupManager();
    }

    /**
     * @return MenuGroupManager
     */
    public function getMenuGroups()
    {
        return $this->_menuGroups;
    }

}