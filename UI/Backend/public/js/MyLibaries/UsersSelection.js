/**
 * Created by Hector on 3/4/2017.
 */


/***************************************************************************/
/* User. A Systamatic and portable way to search for users                 */
/***************************************************************************/
function User(data, parent){
    this.element=$(
        "<tr class='user_searchItem'>"+
        "    <td><b style='font-size:30px' class='glyphicon glyphicon-user'></b></td>"+
        "    <td>"+data.FirstName+" "+data.LastName+"</td>"+
        "    <td>"+data.Email+"</td>"+
        "    <td>"+data.PhoneNumber+"</td>"+
        "    <td>"+data.Role+"</td>"+
        "</tr>");

    this.data=data;
    var $this=this;
    this.element.click(function(){
        parent.select($this);
    });

}
$.extend(User.prototype,{
    UserID:function(){
        return this.data["UserID"];
    },

    /** @return String */
    UserName:function(){
        return this.data["FirstName"]+" "+this.data["LastName"];
    }

});

function Users(){
    this.setup();
}
Tools.inheritsFrom(Users, EventHandler);

Users.createInput=function($container){
    var userSelection=new Users();
    userSelection.displayElementItems.appendTo($container);
};

Users.Roles={
    STUDENT:"Student",
    INSTRUCTOR:"Instructor",
    TA:"TA",
    ADMINISTRATOR:"Administrator"
};

/** @return Users */
Users.search=function(filters){
    var userSelection=new Users();
    userSelection.activeSearch();
    userSelection.updateFilter(filters);
    return userSelection;

};
$.extend(Users.prototype,{

    /***********************************************************************/
    setup:function(){

        /*******************************************************************/
        this.state={active:false};
        var $this=this;

        /********************************************************************/
        this.displayElement=$("<div><div class='card-container'>"+
                                   "    <div class='card-icon'> <b class='glyphicon glyphicon-user'></b></div>"+
                                   "    <div class='card-name'></div>"+
                                   "</div>"+
                               "<input type='hidden' class='resultentId'/></div>");
        this.displayElement.css({
            display:"inline-block", //..."inline-block",
            "padding":"20px",
            "margin":"15px",
            "box-shadow":"0px 2px 5px rgba(0,0,0,.5), inset 0px 3px rgba(255,255,255,.7)",
            "border-radius":"15px"
        });
        this.displayElementItems=
            {
                main:this.displayElement,
                container:this.displayElement.find(".card-container"),
                icon:this.displayElement.find(".card-icon"),
                name:this.displayElement.find(".card-name"),
                hiddenInput:this.displayElement.find(".resultentId")
            };

        $("html, body").click(function(){
            $this.trigger("search-deactivated");
        });

        this.displayElementItems.main.click(function($e){
            $this.trigger("search-activated");
            $e.preventDefault();
            $e.stopPropagation();
        });

        /********************************************************************/
        this.searchElement=$(""+
                       "<div class='' >"+
                       "    <div class='form-group'>"+
                       "        <input class='search-criteria form-control' type='text' placeholder='Search User by (Email, Name, ID)...'/>"+
                       "    </div>"+
                       "    <div class='search-results-container'>"+
                       "        <table class='table search-results'></table>"+
                       "    </div>"+
                       "</div>");

        this.searchElement.css({
            display:"hidden", //..."inline-block",
            //position:"absolute",
            //width:"200px",
            //"max-height":"500px",
            //"box-shadow":"0px 2px 5px rgba(0,0,0,.5), inset 0px 3px rgba(255,255,255,.7)",
            "border-radius":"15px"
        });
        this.searchElementItems=
            {
                resultsContainer:this.searchElement.find(".search-results-container"),
                criteria:this.searchElement.find(".search-criteria"),
                results:this.searchElement.find(".search-results")
            };
        this.searchElementItems.results.css({
            //"display":"-webkit-flex",
            //"flex-wrap": "wrap"
        });
        this.searchElementItems.resultsContainer.css({
            "box-shadow":"0px 2px 4px rgba(0,0,0,.7), inset 0px 4px rgba(255,255,255,.5)",
            "border-radius":"10px",
            "padding":"20px"
        });

        /*******************************************************************/
        /* Activate the Filtering System                                   */
        /*******************************************************************/
        this._data={filters:{}};
        this.searchElementItems.criteria.keyup(function(){
            $this.updateFilter({FirstName:$(this).val(),
                                LastName:$(this).val(),
                                Email:$(this).val()
                                });
        });


        /*******************************************************************/
        this.searchElementItems.criteria.on("click",function(){
            $this.trigger("activated");
        });

        this.on("update","start",function(){
            $this.searchElementItems.results.html("<span class='loadingSpinner spinner'></span>");
        });
        this.on("loading",function(){

        });
        this.on("loading","finished",function(){

        });
        this.on("search-activated",function(){
            $this.modal=MessageBox.ShowPopup({
                title:"Search for User",
                content:$this.searchElement
            });
        });
        this.update();

    },
    updateFilter:function(filter){
        if(typeof this._data["filters"] == "undefined"){
            this._data["filters"]={};
        }
        $.extend(this._data["filters"],filter);
        this.update();
    },
    activeSearch:function(){
        this.trigger("search-activated");
    },

    /***********************************************************************/
    fetch:function(callback){
        if(typeof this._reqID == "undefined"){
            this._reqID=0;
        }
        if(typeof this._data["filters"] == "undefined"){
            this._data["filters"]={};
        }
        var $this=this;

        this._data.request={id:++this._reqID};
        
        
        $.get("/api/users",this._data,function (inputData) {
            try
            {
                if(inputData.request.id!=$this._reqID){
                    return;
                }
                if(!inputData.success){
                    alert("<h2>Not Successfull</h2><h4>"+JSON.stringify(inputData)+"</h4>");
                    return;
                }
                callback(inputData.data);
            }
            catch(e){
                MessageBox.ErrorOk("Exception",e.stackTrace+"<br><br><div class='well'>"+JSON.stringify($this._data)+"</div><div class='well'>"+inputData+"</div>");
            }
        });

    },
    /***********************************************************************/
    update:function(){
        var $this=this;
        this.trigger("update","start");
        $this.fetch(function(data){
            $this.searchElementItems.results.empty();
            data.forEach(function(item){
                var item1=new User(item,$this);
                $this.searchElementItems.results.append(item1.element);
            });

        });


    },
    done:function(callback){
        this.on("selected",function(e){
            callback(e.item);
        });
    },
    select:function($item){

        this.displayElementItems.name.html($item.data["FirstName"]+" "+$item.data["LastName"]);
        this.displayElementItems.hiddenInput.val($item.data["UserID"]);
        if(this.modal){
            this.modal.close();
        }

        this.trigger("selected",{"item":$item});
    }

});
$(document).ready(function(){
    $(".userInput").each(function(){
        var userSelection=new Users();
        userSelection.displayElementItems.appendTo($(this));
    });

});


