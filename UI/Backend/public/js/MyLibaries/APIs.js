/**
 * Created by Hector on 3/11/2017.
 */



function Api(){}
function Popups(){}
function Components(){}


/***************************************************************************/
/* Generic API (Were everything comes too.)                                */
/***************************************************************************/
function GenericAPI(){
    this._modules={};
}

/***************************************************************************/
$.extend(GenericAPI.prototype,{
    execute:function(success, error, completed){
        var parameters={};
        var data={};
        var $this=this;
        /*******************************************************************/
        /* Build Parameters from Modules         ***************************/
        for(var module in this._modules){
            if(this._modules[module].enabled){
                if(typeof this._modules[module].data == "function"){
                    if(this._modules[module].isData){
                        data[module]=this._modules[module].data(this.module);
                        continue;
                    }
                    parameters[module]=this._modules[module].data(this,module);
                    continue;
                }
                if(this._modules[module].isData){
                    data[module]=this._modules[module].data;
                    continue;
                }
                parameters[module]=this._modules[module].data;
            }
        }

        $.ajax(
            $.extend(
                parameters,
                {
                    data:data,
                    success:function(data)
                    {
                        $this.checkData(data,success);
                    },
                    error:error,
                    complete:completed
                }));
        return this;

    },
    checkData:function(data,callback){
        if(!data.success)
        {
            MessageBox.ErrorWithJSON("API Error",data.data,data);
            return false;
        }
        if(typeof data.data == "undefined"){
            MessageBox.ErrorWithJSON("API Error","Expected Data to be present, but its not",data);
            return false;
        }

        if(typeof data.data.results == "undefined"){
            MessageBox.ErrorWithJSON("API Error","Expected data.results to be present, but its not",data);
            return false;
        }
        if(data.data.denied) {
            if (Object.keys(data.data.denied).length > 0) {
                MessageBox.ErrorWithJSON("API Error", "Some column filters were denied", data);
                return false;
            }
        }

        callback?callback(data.data.results):true;
        return true;
    },
    get:function(url,parameters){
        this.setModule("url",url)
            .setModule("method","GET")
            .setModuleData("_",function(){
                return $.now();
            });
        if(parameters) {
            for (var par in parameters) {
                this.setModuleData(par, parameters[par]);
            }
        }
        return this;


    },
    checkModule:function(moduleName){
        if(typeof this._modules[moduleName] == "undefined"){
            this._modules[moduleName]=this.createDefaultModule();
        }
    },
    createDefaultModule:function(){
        return {
            isData:false,
            enabled:true,
            locked:false,
            data:{}
        };
    },
    enableModule:function(moduleName){
        this.checkModule(moduleName);

        /*******************************************************************/
        this._modules[moduleName].enabled=true;

        return this;
    },
    disableModule:function(moduleName){
        this.checkModule(moduleName);

        /*******************************************************************/
        this._modules[moduleName].enabled=false;

        return this;
    },
    filter:function(column,filterType,filter){
        var filterInfo={};
        filterInfo[column]={
            type:filterType,
            value:filter
        };

        return this.setModuleData("filters",filterInfo);
    },
    clearAllModules:function(){
        this._modules={};
    },
    setModule:function(moduleName, data, parameters) {
        this.checkModule(moduleName);
        if(typeof parameters == "undefined")
        {
            parameters={};
        }

        /*******************************************************************/
        this._modules[moduleName].isData=false;

        if(parameters["enabled"]==true){
            this._modules[moduleName].enabled=true;
        }

        /*******************************************************************/
        if(parameters["overwrite"]){
            this._modules[moduleName].data=data;
        }

        /*******************************************************************/
        if(typeof data === 'object' && typeof this._modules[moduleName].data != 'object'){
            this._modules[moduleName].data=data;
        }

        /*******************************************************************/
        else if(typeof data != 'object'){
            this._modules[moduleName].data=data;
        }

        /*******************************************************************/
        else if(typeof data === 'object' && typeof this._modules[moduleName].data === 'object'){
            this._modules[moduleName].data=$.extend(true,this._modules[moduleName].data,data);
        }
        else
        {
            this._modules[moduleName].data=data;
        }

        return this;
    },
    setModuleData:function(moduleName, data, replace){
        if(arguments.length==1){
            for(var dataName in arguments[0]){
                this.setModuleData(dataName,arguments[0][dataName]);
            }
            return this;
        }

        this.setModule(moduleName,data,replace);
        this._modules[moduleName].isData=true;

        return this;
    }
});



/****************************************************************************/
/* API Component                                                           */
/****************************************************************************/
function APIComponent(properties)
{
    GenericAPI.prototype.constructor.apply(this,arguments);
    this.fetchers={};
    this.events={};
    this.renders={};
    this.actions={};
    this.EventHandler=new EventHandler();

    $.extend(this,properties);
    var $this=this;
    var bindThem=function(module)
    {
        for(var name in $this[module] ){
            if(!$this[module].hasOwnProperty(name)){
                continue;
            }
            $this[module][name]=$this[module][name].bind($this);
        }
    };
    bindThem("fetchers");
    bindThem("events");
    bindThem("renders");
    bindThem("actions");


    this.renders=$.extend(this.renders,{
        "_question_simple_answer_":function(question,element)
        {
            /***********************************************************/
            /* Handle the Refresh of the DOM(Similar to react)         */
            /***********************************************************/
            var domUsing=element.find("[answered-question='"+question["AnswerableID"]+"']");
            if(domUsing.length==0){
                domUsing=$("<div>").attr("answered-question",question["AnswerableID"]).appendTo(element);
            }
            domUsing.empty();

            /***********************************************************/
            /* If Locked, then we onyl have html to show... So show it */
            /***********************************************************/
            if(question["Locked"]){
                var blindElement=$(question["AnsweredHTML"]).appendTo(domUsing);
                blindElement.find(".btn").addClass("disabled").unbind("click"); // Make it look disabled
                return;
            }

            /***********************************************************/
            /* Initilize the Displayer                                 */
            /***********************************************************/
            var displayer=new QuestionDisplayWidget.instances[question["Question"]["QuestionTypeID"]]();
            displayer.__data__=question;

            /***********************************************************/
            displayer.appendTo(domUsing);

            /***********************************************************/
            /* Whenever its time to test if they got the answer right  */
            /***********************************************************/
            displayer.on("test",function(e){

                //$.isLoading();
                // fistTime=false;
                displayer._element.find('.loading-spinner').remove();
                var html=displayer._element.html();

                displayer._element.find(".btn").addClass("disabled").unbind("click");
                //


                Api.AnswerableQuestions.action('answer-question',null,{
                    id: displayer.__data__["AnswerableID"],
                    html: html,
                    answer: e.answer
                },function(){
                    element.trigger('question-answered');
                });

            });
            // /***********************************************************/
            //
            //  displayer.on("render","after",function(e){
            //      if(parseInt(displayer.__data__["Attempts"])>=parseInt(displayer.__data__["AllowedAttempts"])){
            //          displayer._element.html(displayer.__data__["AnsweredHTML"]);
            //          displayer._element.find(".btn").addClass("disabled").unbind("click");
            //      }
            //  });

            displayer.setData(displayer.__data__["AnswerableID"],{
                "parameters": question["Question"]["JSONParameters"],
                "answer":question["ChosenAnswer"]
            });
        },
        "_edit_question_":function(question,element)
        {
            /***********************************************************/
            /* Handle the Refresh of the DOM(Similar to react)         */
            /***********************************************************/
            var domUsing=element.find("[answered-question='"+question["AnswerableID"]+"']");
            if(domUsing.length==0){
                domUsing=$("<div>").attr("answered-question",question["AnswerableID"]).appendTo(element);
            }
            domUsing.empty();

            /***********************************************************/
            /* If Locked, then we onyl have html to show... So show it */
            /***********************************************************/
            if(question["Locked"]){
                var blindElement=$(question["AnsweredHTML"]).appendTo(domUsing);
                blindElement.find(".btn").addClass("disabled").unbind("click"); // Make it look disabled
                return;
            }

            /***********************************************************/
            /* Initilize the Displayer                                 */
            /***********************************************************/
            var displayer=new QuestionDisplayWidget.instances[question["Question"]["QuestionTypeID"]]();
            displayer.__data__=question;
            displayer.__index__=index-1;

            /***********************************************************/
            displayer.appendTo(domUsing);

            /***********************************************************/
            /* Whenever its time to test if they got the answer right  */
            /***********************************************************/
            displayer.on("test",function(e){

                //$.isLoading();
                // fistTime=false;
                var html=displayer._element.html();

                displayer._element.find(".btn").addClass("disabled").unbind("click");
                //


                Api.AnswerableQuestions.action('answer-question',null,{
                    id: displayer.__data__["AnswerableID"],
                    html: html,
                    answer: e.answer
                },function(){
                    Api.RunningAssessments.update();//EventHandler.trigger("updates");
                });

            });
            // /***********************************************************/
            //
            //  displayer.on("render","after",function(e){
            //      if(parseInt(displayer.__data__["Attempts"])>=parseInt(displayer.__data__["AllowedAttempts"])){
            //          displayer._element.html(displayer.__data__["AnsweredHTML"]);
            //          displayer._element.find(".btn").addClass("disabled").unbind("click");
            //      }
            //  });

            displayer.setData(displayer.__data__["AnswerableID"],{
                "parameters": question["Question"]["JSONParameters"],
                "answer":question["ChosenAnswer"]
            });
        },
        "_question_":function(question,element)
        {
            /***********************************************************/
            /* Handle the Refresh of the DOM(Similar to react)         */
            /***********************************************************/
            var domUsing=element.find("[answered-question='"+question["AnswerableID"]+"']");
            if(domUsing.length==0){
                domUsing=$("<div>").attr("answered-question",question["AnswerableID"]).appendTo(element);
            }
            domUsing.empty();

            /***********************************************************/
            /* If Locked, then we onyl have html to show... So show it */
            /***********************************************************/
            if(question[Locked]){
                var blindElement=$(question["AnsweredHTML"]).appendTo(domUsing);
                blindElement.find(".btn").addClass("disabled").unbind("click"); // Make it look disabled
                return;
            }

            /***********************************************************/
            /* Initilize the Displayer                                 */
            /***********************************************************/
            var displayer=new QuestionDisplayWidget.instances[question["Question"]["QuestionTypeID"]]();
            displayer.__data__=question;
            displayer.__index__=index-1;

            /***********************************************************/
            displayer.appendTo(domUsing);

            /***********************************************************/
            /* Whenever its time to test if they got the answer right  */
            /***********************************************************/
            displayer.on("test",function(e){

                //$.isLoading();
                // fistTime=false;
                var html=displayer._element.html();

                displayer._element.find(".btn").addClass("disabled").unbind("click");
                //


                Api.AnswerableQuestions.action('answer-question',null,{
                    id: displayer.__data__["AnswerableID"],
                    html: html,
                    answer: e.answer
                },function(){
                    Api.RunningAssessments.update();//EventHandler.trigger("updates");
                });

            });
            // /***********************************************************/
            //
            //  displayer.on("render","after",function(e){
            //      if(parseInt(displayer.__data__["Attempts"])>=parseInt(displayer.__data__["AllowedAttempts"])){
            //          displayer._element.html(displayer.__data__["AnsweredHTML"]);
            //          displayer._element.find(".btn").addClass("disabled").unbind("click");
            //      }
            //  });

            displayer.setData(displayer.__data__["AnswerableID"],{
                "parameters": question["Question"]["JSONParameters"],
                "answer":question["ChosenAnswer"]
            });
        }
    })

}
Tools.inheritsFrom(APIComponent,GenericAPI);
$.extend(APIComponent.prototype,{
    action:function(name,element,arguments, callback){
        if(typeof this.actions[name] == "undefined"){
            throw new Error('APIComponent: Unkown Action("'+name+"')");
        }

        this.clearAllModules();
        this.actions[name](arguments,element,callback);

    },

    /**
     *
     * @param name
     * @param data
     * @param callback
     * @return {APIComponent}
     */
    fetch:function(name,data,callback)
    {
        if(typeof this.fetchers[name] == "undefined"){
            throw new Error('APIComponent: Unkown Fetcher("'+name+"')");
        }
        var filters=typeof data['filters']?data['filters']:{};
        var sorting=typeof data['sorting']?data['sorting']:{enabled:false};

        if(typeof data["id"] == 'undefined') {
            this.setModuleData('filters', filters)
                .setModuleData('sorting', sorting);
        }

        this.clearAllModules();
        this.fetchers[name](data,callback);
        return this;
    },
    /**
     *
     * @param name
     * @param data
     * @param element
     * @return {APIComponent}
     */
    render:function(name,data,element)
    {
        if(typeof this.renders[name] == "undefined"){
            throw new Error('APIComponent: Unkown Render("'+name+"')");
        }

        this.clearAllModules();
        this.renders[name](data,element);
        return this;
    },
    /**
     *
     * @param name
     * @param data
     * @param element
     * @param callback
     * @return {APIComponent}
     */
    trigger:function(name, data, element,callback)
    {
        if(typeof this.events[name] == "undefined"){
            throw new Error('APIComponent: Unkown Event("'+name+"')");
        }

        this.clearAllModules();
        this.events[name](data,element,callback);
        return this;
    },
    /**
     * @param callback (optional)
     * @return {APIComponent}
     */
    update:function(){
        switch(arguments.length){
            case 0:
                this.EventHandler.trigger("updated");
                return this;
            case 1:
                this.EventHandler.on("updated",arguments[0]);
                return this;
            default:
                throw new Error("More then 1 argument in update function not implmenented");
                return this;
        }
    }
});


/****************************************************************************/
/* Tag API                                                                  */
/****************************************************************************/
function TagsComponent(){

    GenericAPI.prototype.constructor.apply(this,arguments);

    this._modules={};
    this.setModule("method","GET");
    this.setModule("url","/api/tags");

    this.setModuleData("filters",{});
    this.setModuleData("sorting",{});
    this.setModuleData("grouping",{});

    this.setModuleData('_',function(){
        return $.now();
    });
}
Tools.inheritsFrom(TagsComponent,APIComponent);
$.extend(TagsComponent.prototype,
{
    add:function(tag,id,category,rank)
    {
        return this.setModule("method","POST")
                   .setModuleData("TagID",tag)
                   .setModuleData("Category",category)
                   .setModuleData("ObjectID",id)
                   .setModuleData("Rank",rank);
    },
    relatedToQuestions:function(questions){
        return this.setModule("method","GET")
                   .setModuleData("filters",
                       {
                            Category:"Question",
                            ObjectID: {
                                type:"IN",
                                value:questions.map(function(item) {
                                    return item["QuestionID"]
                                })}
                       });
    },
    group:function(by){
        return this.setModuleData("grouping",by);
    }

});


function Api(){

}
$.extend(Api,{
    Sections:new APIComponent({
        fetchers:{
            getByID:function(data,callback){
                this.get("/api/sections/"+data["id"]).execute(function(data){
                    callback?callback(data):true;
                });
            },
            dumby:function(data,callback){
                callback({});
            }
        },
        renders:{

        },
        actions:{

        }
    }),
    Courses:new APIComponent({
        fetchers:{
            get:function(data,callback){
                this.get("/api/courses").execute(function(data){
                    callback?callback(data):true;
                });
            },
            dumby:function(data,callback){
                callback({});
            }
        },
        actions:{
            "create-new-course":function(data,element,callback){
                this.setModule("url","/api/courses")
                    .setModule("method","POST")
                    .setModuleData("__action__","create-new-course")
                    .setModuleData(data)
                    .setModuleData("_",function(){
                        return $.now();
                    }).execute(function(data){
                        Api.Courses.update();
                        callback?callback():true
                });
            },
            "add-section":function(data,element,callback){
                this.setModule("url","/api/courses")
                    .setModule("method","POST")
                    .setModuleData("__action__","add-section")
                    .setModuleData(data)
                    .setModuleData("_",function(){
                        return $.now();
                    }).execute(function(data){
                    Api.Courses.update();
                    callback?callback():true
                });
            }
        }

    }),
    AnswerableQuestions:new APIComponent({
        fetchers:{
            get:function(data,callback)
            {
                /***********************************************************/
                if(typeof data['filters']["id"] == 'undefined'){
                    this.get("/api/questions/answerable")
                        .execute(function(data)
                        {
                            callback(data);
                        });
                    return this;
                }

                /***********************************************************/
                this.get("/api/questions/answerable/"+data['filters']["id"]).execute(function(data){
                    callback?callback(data.AnswerableQuestion):true;
                });
            }
        },
        actions:{
            "answer-question":function(data,element,callback){
                var id=data["id"];
                var html=data["html"];
                var answer=data["answer"];

                this.setModule("url","/api/questions/answerable/"+id)
                    .setModule("method","POST")
                    .setModuleData("__action__","answer-question")
                    .setModuleData("AnswerableID",id)
                    .setModuleData("html",html)
                    .setModuleData("answer",answer)
                    .setModuleData("_",function(){
                        return $.now();
                    }).execute(function(data){
                    callback?callback():true
                });
            }
        },
        events:{

        }
    }),
    Questions:new APIComponent({
        actions:
        {
            "create":function(data,element,callback){
                this.setModule("url","/api/questions")
                    .setModule("method","POST")
                    .setModuleData("__action__","create-question")
                    .setModuleData(data)
                    .execute(function(data)
                    {
                        toFunction(callback)(data);
                    });

            }
        },
        fetchers:{
            get:function(data,callback)
            {
                this.get("/api/questions",$.extend(data,{'_':$.now()})).execute(function(data){
                    callback?callback(data):true;
                });

            },
            getOne:function(data,callback){
                Api.Questions.fetch('get',data,function(data){
                    if(data.length==0){
                        failed?failed("No Questions found"):true;
                        return
                    }

                    callback?callback(data[0]):true
                });
            }
        }

    }),
    QuestionTypes:new APIComponent({
        fetchers: {
            get: function (data, callback) {
                this.get("/api/questions/types", $.extend(data, {'_': $.now()})).execute(function (data) {
                    callback ? callback(data) : true;
                });
            },
            getOne: function (data, callback) {
                Api.QuestionTypes.fetch("get", function (data) {
                    if (data.length == 0) {
                        failed ? failed("No Question Types found") : true;
                        return
                    }
                    callback ? callback(data[0]) : true
                });
            }
        }
    }),
    Assessments:new APIComponent({
        fetchers:{
            get:function(data,callback){
                var id=data["id"];
                this.setModule("url","/api/assessments/"+id)
                    .setModule("method","GET")
                    .setModuleData("_",function(){
                        return $.now();
                    }).execute(function(data){
                    callback?callback(data.Assessment):true;
                });
            }
        },
        renders:{
            questions:function(data,element){
                Components.Questions.render(data["questions"],element);
            }
        },
        actions:{
            "add-question":function(data,callback)
            {
                var $this=this;
                var id=data.id;
                var updateStatus=function(on,outof){

                };

                Popups.Questions().MultiSelect(true).Callback(function(questions)
                {
                    var questions=questions;
                    var modal=MessageBox.ShowPopup({
                        title:"Adding Questions...",
                        content:function(){
                            var status=$("<h3 class='text-success'>").text("Adding ");
                            updateStatus=function(on,outof){
                                status.text("Adding "+on+" out of "+outof);
                            };
                            return status;
                        }
                    });

                    var currentIndex=0;
                    var functionAddIt;
                    functionAddIt=function(currentIndex) {
                        if (currentIndex>=questions.length) {
                            Api.Assessments.update();
                            toFunction(callback)();
                            modal.close();
                            return;
                        }

                        updateStatus(currentIndex,questions.length);
                        $this.setModule("url", "/api/assessments/" + id)
                            .setModule("method", "POST")
                            .setModuleData("__action__", "add-question")
                            .setModuleData("QuestionID", questions[currentIndex]["QuestionID"])
                            .setModuleData("AssessmentID", id)
                            .execute(function () {

                                functionAddIt(currentIndex + 1);

                            });
                    }
                    functionAddIt(0);

                }).Open();
            },
            "start-assessment":function(data,callback)
            {
                var id=data.id;
                this.setModule("url","/api/assessments/"+id)
                    .setModule("method","POST")
                    .setModuleData("__action__","start-assessment") //THE MAIN PIECE
                    .setModuleData("AssessmentID",id)
                    .setModuleData("_",function()
                    {
                        return $.now();
                    }).execute(function(data){

                        window.open(data.ActiveAssessment.Assessment["urls"]["run"]);
                });
            }
        }
    }),
    CourseContent:new APIComponent({
        fetchers:{
            get: function (data, callback)
            {
                var id=data["id"];
                this.setModule("url", "/api/course-contents/" + id)
                    .setModule("method", "GET")
                    .setModuleData("_", function () {
                        return $.now();
                    }).execute(function (data) {
                    callback ? callback(data) : true;
                });
            },

            grades:function (data, callback){
                var id=data["id"];
                this.setModule("url", "/api/course-contents/" + id)
                    .setModule("method", "GET")
                    .setModuleData("__fetcher__","grades-per-course-content")
                    .setModuleData("_", function () {
                        return $.now();
                    }).execute(function (data) {
                    callback ? callback(data) : true;
                });

            }
        },
        renders:{
            "grades":function(data,element){
                element.empty();
                element.html(SpiderHouse.cretePathDom(300,data["Grades"]));
            },

            "questions":function(data,element){
                Components.Questions.render(data["questions"],element);
            },
            "assessment-view":function(data,element){
                var template=element.children().clone(true,true);

                element.html("");
                if(data["Type"]=='assessment'){
                    var id=data["id"];
                    element.css({"display":""});
                    this.setModule("url","/api/assessments")
                        .setModule("method","GET")
                        .setModuleData("AssociatedCourseContentID",id)
                        .setModuleData("_",function(){
                            return $.now();
                        }).execute(function(data){
                        data=data[0];
                        $("" +
                            '<div api-component="Assessments" api-fetcher="get" api-parameter-id='+data["AssessmentID"]+'>' +

                            '</div>').append(template).appendTo(element).trigger("created");
                    },500);

                }
            }
        },
        actions:{
            delete: function(data,element,callback)
            {
                var id=data["id"];
                this.setModule("url","/api/course-contents/"+id)
                    .setModule("method","POST")
                    .setModuleData("__action__","delete-course-content")
                    .execute(function(data){
                        Api.CourseContent.update(); // EventHandler.trigger("updates",{Assessment:data.Assessment});
                    });
            },
            update: function(data,element,callback)
            {

                /***********************************************************/
                /* Important Variables                                     */
                /***********************************************************/
                var attribute=(element.attr("api-updating-attribute")?element.attr("api-updating-attribute"):
                        element.attr('api-attribute'));
                var value=data["data"];
                //
                // /***********************************************************/
                // /* Create the DOM.                                         */
                // /***********************************************************/
                // var input=$("<input class='editing-form-input'>");
                // input.val(value);
                // element.replaceWith(input);
                // input.focus();
                // var id=data["id"];
                // input.enterkey(function()
                // {
                //     input.addClass('spinner');
                //     this.setModule("url", "/api/course-contents/" + id)
                //         .setModule("method","POST")
                //         .setModuleData("__action__","update-course-content")
                //         .setModuleData(attribute,input.val())
                //         .execute(function(data)
                //         {
                //             input.replaceWith(element);
                //             Api.CourseContent.update(); // EventHandler.trigger("updates",{Assessment:data.Assessment});
                //         });
                // }.bind(this));
                //
                // return;
                /***********************************************************/
                /* Different Approach                                      */
                /***********************************************************/
                var left=element.offset().left;
                var top=element.offset().top;
                var width=element.width();
                var height=element.height();

                left=(left+(width/2));
                top=top+(height/2);
                var input=$("<input class='form-control'>");

                input.css({
                    left:left,
                    top:top,
                    display:'inline-block',
                    width:width,
                    padding:'21px 4px',
                    height:height,
                    position:'absolute',
                    opacity:1,
                    zIndex:1000,
                    'transform':'translate(-50%,-50%)',
                    "min-width":"30vw",
                    'text-align':'center',
                    'font-size':element.css("font-size"),
                    'font-weight':element.css("font-weight"),
                    'font-family':element.css("font-family"),
                    transition:'all 500ms'
                });
                input.val(value);
                element.replaceWith(input);
                element.html('');

                input.focus();
                var id=data["id"];
                input.enterkey(function()
                {
                    input.css({'opacity':0});
                    this.setModule("url", "/api/course-contents/" + id)
                        .setModule("method","POST")
                        .setModuleData("__action__","update-course-content")
                        .setModuleData(attribute,input.val())
                        .execute(function(data)
                        {
                            input.replaceWith(element);
                            Api.CourseContent.update(); // EventHandler.trigger("updates",{Assessment:data.Assessment});
                        });
                }.bind(this));

                input.blur(function()
                {
                    element.html(value);
                    input.replaceWith(element);
                    Api.CourseContent.update();
                });



            },
            "add-question":function(data,element,callback)
            {
                var $this=this;
                var id=data["id"];
                Popups.Questions().Callback(function(question){

                    $this.setModule("url","/api/assessments/"+id)
                        .setModule("method","POST")
                        .setModuleData("__action__","add-question")
                        .setModuleData("QuestionID",question["QuestionID"])
                        .setModuleData("AssessmentID",id)
                        .execute(function(data){
                            Api.Assessments.update(); // EventHandler.trigger("updates",{Assessment:data.Assessment});
                        });

                }).Open();

            },
            "start-assessment":function(data,callback)
            {
                var $this=this;
                $this.setModule("url","/api/assessments/"+id)
                    .setModule("method","POST")
                    .setModuleData("__action__","start-assessment") //THE MAIN PIECE
                    .setModuleData("AssessmentID",id)
                    .setModuleData("_",function(){
                        return $.now();
                    }).execute(function(data){
                    window.open(data.ActiveAssessment.Assessment["urls"]["run"]);
                });
            }
        }
    }),
    RunningAssessments: new APIComponent({
        fetchers: {
            getAll: function (data, callback){

                this.setModule("url", "/api/running-assessments")
                    .setModule("method", "GET")
                    .setModuleData("_", function () {
                        return $.now();
                    }).execute(function (data) {
                    callback ? callback(data) : true;
                });
            },
            get: function (data, callback)
            {
                var id=data["id"];
                this.setModule("url", "/api/running-assessments/" + id)
                    .setModule("method", "GET")
                    .setModuleData("_", function () {
                        return $.now();
                    }).execute(function (data) {
                    callback ? callback(data.ActiveAssessment) : true;
                });

            }
        },
        actions:{
            "start-assessment":function(data,element,callback){
                var id=data['id'];
                window.open("/assessments/"+id+"/run");
            },
            "submit-assessment":function (data,element, callback)
            {
                var id=data['id'];
                this.setModule("url","/api/running-assessments/"+id)
                    .setModule("method","POST")
                    .setModuleData("__action__","submit-assessment") //THE MAIN PIECE
                    .setModuleData("AnsweredID",id)
                    .setModuleData("_",function(){
                        return $.now();
                    }).execute(function(data){
                    window.location=data.ActiveAssessment["urls"]["view"];
                });
            }
        },
        renders:{
            "report-questions":function(data,element)
            {
                var mainContainer=$("<div filter='all' class='assessment-report-questions-main-container'>");
                var filtersContainer=$("<div class='filters-container'>").appendTo(mainContainer);
                $("<div class='show-correct-only-btn'>")
                    .appendTo(filtersContainer)
                    .click(function(){
                        mainContainer.attr("filter","correct-only");
                    });
                $("<div class='show-incorrect-only-btn'>")
                    .appendTo(filtersContainer)
                    .click(function(){
                        mainContainer.attr("filter","wrong-only");
                    });
                $("<div class='show-all-btn'>")
                    .appendTo(filtersContainer)
                    .click(function(){
                        mainContainer.attr("filter","all");
                    });

                data["Questions"].forEach(function(item){
                    var itemElement=$("<div class='assessment-report-question-item'>");
                    itemElement.attr("correct",item["IsCorrect"]);
                    itemElement.append($("<div class='answered-html'>"+item["AnsweredHTML"]+"</div>"));
                    itemElement.append($("<div class='points-worth'>"+item["PointsWorth"]+"</div>"));
                    itemElement.append($("<div class='expected-answer'>"+item["CorrectAnswer"]+"</div>"));
                    itemElement.append($("<div class='picked-answer'>"+item["ChosenAnswer"]+"</div>"));
                    mainContainer.append(itemElement);
                });
                element.empty();
                element.append(mainContainer);
            },
            "question-status":function(data,element){
                console.log("Updating Question Status");
                if(typeof  element.attr("loaded") =="undefined")
                {
                    var html="" +
                        "<div class='main-status-and-submition-container'>" +
                        "    <div class='submit-assessment-container'>" +
                        "         <div api-action='submit-assessment'>Submit</div>" +
                        "    </div>"+
                        "    <div class='assessment-progress-status-main-container' new>" +
                        "        <div class='progress'>" +
                        "          <div class='progress-bar progress-bar-finished' role='progressbar' style='width:"+0+"%'>" +
                        "              Finished "+Math.round(0)+"%  " +
                        "          </div>"+
                        "          <div class='progress-bar progress-bar-unseen' role='progressbar'   style='width:"+0+"%'>" +
                        "              Unseen "+Math.round(0)+"% " +
                        "          </div>" +
                        "       </div>" +
                        "    </div>" +
                        "</div>";
                    element.empty();
                    $(html).appendTo(element);
                    element.attr("loaded",true);
                }


                var locked=0;
                var seen=0;
                var unseen=0;
                data["QuestionStatus"].forEach(function(item) {
                    if (item == "LOCKED") {
                        locked++;
                    }
                    if (item == "UNSEEN") {
                        unseen++;
                    }
                    if (item == "SEEN") {
                        seen++;
                    }
                });

                finished=locked+seen;
                finished=(finished/data["TotalQuestions"])*100.0;
                unseen=(unseen/data["TotalQuestions"])*100.0;

                var assessmentProgress=element.find(".assessment-progress-status-main-container");
                assessmentProgress.attr("new",true);

                var finishedElement=assessmentProgress.find(".progress-bar-finished");
                var unseenElement=assessmentProgress.find(".progress-bar-unseen");
                finishedElement.text("Finished "+Math.round(finished)+"%");
                unseenElement.text("Unseen "+Math.round(unseen)+"%");
                unseenElement.css({width:Math.round(unseen)+"%"});
                finishedElement.css({width:Math.round(finished)+"%"});
                // bubbleText({
                //     element: unseenElement,
                //     newText: "Unseen "+Math.round(unseen)+"%",
                //     proportional:false,
                //     timeBetweenRepeat:500
                // });
                //
                // bubbleText({
                //     element: finishedElement,
                //     newText:"Finished "+Math.round(finished)+"%",
                //     proportional:false,
                //     timeBetweenRepeat:500
                // });





                setTimeout(function(){
                    assessmentProgress.removeAttr("new");

                    if(finished==100){
                        element.find(".main-status-and-submition-container").attr("ready-to-submit",true);
                    }

                },1000);
                //
                // var html="" +
                //     "<div class='assessment-progress-status-main-container'>"+
                //     "    <div class='progress'>" +
                //     "        <div class='progress-bar progress-bar-finished' role='progressbar' style='width:"+locked+"%'>" +
                //     "            Finished "+Math.round(finished)+"%  " +
                //     "        </div>"+
                //     "        <div class='progress-bar progress-bar-unseen' role='progressbar' style='width:"+unseen+"%'>" +
                //     "            Unseen "+Math.round(unseen)+"% " +
                //     "        </div>" +
                //     "    </div>" +
                //     "</div>";
                // element.empty();
                // $(html).appendTo(element);
                //
                //
                // if(data["TotalQuestions"]==)

            },
            "questions":function(data,element){
                var index=0;
                data["Questions"].forEach(function(question)
                {


                    /***********************************************************/
                    /* Handle the Refresh of the DOM(Similar to react)         */
                    /***********************************************************/
                    var domUsing=element.find("[answered-question='"+question["AnswerableID"]+"']");
                    if(domUsing.length==0){
                        domUsing=$("<div>").attr("answered-question",question["AnswerableID"]).appendTo(element);
                    }
                    domUsing.empty();

                    /***********************************************************/
                    /* If Locked, then we onyl have html to show... So show it */
                    /***********************************************************/
                    if(data["QuestionStatus"][index++]=="LOCKED"){
                        var blindElement=$(question["AnsweredHTML"]).appendTo(domUsing);
                        blindElement.find(".btn").addClass("disabled").unbind("click"); // Make it look disabled
                        return;
                    }

                    /***********************************************************/
                    /* Initilize the Displayer                                 */
                    /***********************************************************/
                    var displayer=new QuestionDisplayWidget.instances[question["Question"]["QuestionTypeID"]]();
                    displayer.__data__=question;
                    displayer.__index__=index-1;

                    /***********************************************************/
                    displayer.appendTo(domUsing);

                    /***********************************************************/
                    /* Whenever its time to test if they got the answer right  */
                    /***********************************************************/
                    displayer.on("test",function(e){

                        //$.isLoading();
                        // fistTime=false;
                        var html=displayer._element.html();

                        displayer._element.find(".btn").addClass("disabled").unbind("click");
                        //


                        Api.AnswerableQuestions.action('answer-question',null,{
                            id: displayer.__data__["AnswerableID"],
                            html: html,
                            answer: e.answer
                        },function(){
                            Api.RunningAssessments.update();//EventHandler.trigger("updates");
                        });

                    });
                    // /***********************************************************/
                    //
                    //  displayer.on("render","after",function(e){
                    //      if(parseInt(displayer.__data__["Attempts"])>=parseInt(displayer.__data__["AllowedAttempts"])){
                    //          displayer._element.html(displayer.__data__["AnsweredHTML"]);
                    //          displayer._element.find(".btn").addClass("disabled").unbind("click");
                    //      }
                    //  });

                    displayer.setData(displayer.__data__["AnswerableID"],{
                        "parameters": question["Question"]["JSONParameters"],
                        "answer":question["ChosenAnswer"]
                    });


                });

            }
        }
    })
});


// getByID:function(id,callback,failed){
//     Api.Questions.get(function(data){
//         if(data.length==0){
//             failed?failed("No Questions found"):true;
//             return
//         }
//
//         callback?callback(data[0]):true
//     },{QuestionID:id});
// }
/****************************************************************************/
/* Tags                                                                     */
/****************************************************************************/
// Api.Tag={
//     get:function(id,category,callback)
//     {
//         $.get("/api/tags",{'_':$.now(),Category:category,ObjectID:id},function(data){
//             callback?callback(data.data.results):true;
//         });
//     },
//     add:function(tag,id,category,rank,callback)
//     {
//         Api.Tag.fancy().add(tag,id,category,rank).execute(callback);
//         // $.post("/api/tags",{TagID:tag,Category:category,ObjectID:id,Rank:10},function(data){
//         //     callback?callback(data):true;
//         // });
//     },
//     getCount:function()
//     {
//         $.post("/api/tags",{TagID:tag,Category:category,ObjectID:id,Rank:10},function(data){
//             callback?callback(data):true;
//         });
//     },
//
//     /**
//      *
//      * @return {TagsComponent}
//      */
//     fancy:function(){
//         return new TagsComponent();
//     }
// };




// /***************************************************************************/
// /* Answered Questions.                                                     */
// /* Repository                                                              */
// /***************************************************************************/
// Api.AnswerableQuestions=
// {
//     EventHandler:new EventHandler(),
//     get:function(id,callback)
//     {
//         var api=new GenericAPI();
//         switch(arguments.length)
//         {
//             case 1:
//                 api.get("/api/question-answers").execute(function(data){
//                     arguments[0](data);
//                 });
//                 break;
//             case 2:
//                 api.get("/api/question-answers/"+id).execute(function(data){
//                     callback?callback(data.AnswerableQuestion):true;
//                 });
//                 break;
//             default:
//                 MessageBox.ErrorOk("API Error","Invalid number of parameters");
//         }
//     },
//
//     specialAtt:{
//
//     },
//     events:{
//         "answer-question":function(data,element,callback){
//             var id=data["id"];
//             var html=data["html"];
//             var answer=data["answer"];
//
//             this.setModule("url","/api/question-answers/"+id)
//                 .setModule("method","POST")
//                 .setModuleData("__action__","answer-question")
//                 .setModuleData("AnswerableID",id)
//                 .setModuleData("html",html)
//                 .setModuleData("answer",answer)
//                 .setModuleData("_",function(){
//                     return $.now();
//                 }).execute(function(data){
//                 callback?callback():true
//             });
//         }
//     }
// };

/****************************************************************************/
/* Questions                                                                */
/* Repository                                                              */
/****************************************************************************/
// Api.Questions= {
//
//     create:function(data,callback){
//         MessageBox.ErrorOk("Api.Questions","Feature not implemented(create)");
//     },
//     get:function(callback, parameters )
//     {
//         if(!parameters){
//             parameters={};
//         }
//         $.get("/api/questions",$.extend(parameters,{'_':$.now()})).done(function(data){
//             callback?callback(data.data.results):true;
//
//
//         });
//     },
//     getByID:function(id,callback,failed){
//         Api.Questions.get(function(data){
//             if(data.length==0){
//                 failed?failed("No Questions found"):true;
//                 return
//             }
//
//             callback?callback(data[0]):true
//         },{QuestionID:id});
//     }
// };
// Api.QuestionTypes={
//     get:function(callback, parameters )
//     {
//         if(!parameters){
//             parameters={};
//         }
//         $.get("/api/questions/types",$.extend(parameters,{'_':$.now()})).done(function(data){
//             callback?callback(data.data.results):true;
//         });
//     },
//     getByID:function(id,callback,failed){
//         Api.QuestionTypes.get(function(data){
//             if(data.length==0){
//                 failed?failed("No Question Types found"):true;
//                 return
//             }
//             callback?callback(data[0]):true
//         },{QuestionTypeID:id});
//     }
// };
//
// Api.Assessments={
//     EventHandler:new EventHandler(),
//     get:function(id,callback){
//         var api=new GenericAPI();
//         api.setModule("url","/api/assessments/"+id)
//             .setModule("method","GET")
//             .setModuleData("_",function(){
//                 return $.now();
//             }).execute(function(data){
//                     callback?callback(data.Assessment):true;
//                 });
//
//     },
//     specialAtt:{
//         "questions":function(element,data,id){
//             Components.Questions.render(data["questions"],element);
//         }
//     },
//     events:{
//         "add-question":function(id)
//         {
//             Popups.Questions().Callback(function(question){
//
//                 var api=new GenericAPI();
//                 api.setModule("url","/api/assessments/"+id)
//                     .setModule("method","POST")
//                     .setModuleData("__action__","add-question")
//                     .setModuleData("QuestionID",question["QuestionID"])
//                     .setModuleData("AssessmentID",id)
//                     .execute(function(data){
//                         Api.Assessments.EventHandler.trigger("updates",{Assessment:data.Assessment});
//                     });
//
//                 }).Open();
//
//         },
//         "start-assessment":function(id)
//         {
//             var api=new GenericAPI();
//             api.setModule("url","/api/assessments/"+id)
//                 .setModule("method","POST")
//                 .setModuleData("__action__","start-assessment") //THE MAIN PIECE
//                 .setModuleData("AssessmentID",id)
//                 .setModuleData("_",function(){
//                     return $.now();
//                 }).execute(function(data){
//                     window.open(data.ActiveAssessment.Assessment["urls"]["run"]);
//                 });
//         }
//
//     }
// };
// Api.CourseContent={
//     EventHandler:new EventHandler(),
//     get:function(id,callback){
//         var api=new GenericAPI();
//         api.setModule("url","/api/course-contents/"+id)
//             .setModule("method","GET")
//             .setModuleData("_",function(){
//                 return $.now();
//             }).execute(function(data){
//             callback?callback(data):true;
//         });
//
//     },
//     specialAtt:{
//         "questions":function(element,data,id){
//             Components.Questions.render(data["questions"],element);
//         },
//         "assessment-view":function(element,data,id){
//             var template=element.children().clone(true,true);
//
//             element.html("");
//             if(data["Type"]=='assessment'){
//                 var api=new GenericAPI();
//                 api.setModule("url","/api/assessments")
//                     .setModule("method","GET")
//                     .setModuleData("AssociatedCourseContentID",id)
//                     .setModuleData("_",function(){
//                         return $.now();
//                     }).execute(function(data){
//                     data=data[0];
//                     $("" +
//                         '<div action-component="Assessments"   action-id='+data["AssessmentID"]+'>' +
//
//                         '</div>').append(template).appendTo(element).trigger("created");
//                 },500);
//
//             }
//         }
//     },
//     events:{
//         "add-question":function(id)
//         {
//             Popups.Questions().Callback(function(question){
//
//                 var api=new GenericAPI();
//                 api.setModule("url","/api/assessments/"+id)
//                     .setModule("method","POST")
//                     .setModuleData("__action__","add-question")
//                     .setModuleData("QuestionID",question["QuestionID"])
//                     .setModuleData("AssessmentID",id)
//                     .execute(function(data){
//                         Api.Assessments.EventHandler.trigger("updates",{Assessment:data.Assessment});
//                     });
//
//             }).Open();
//
//         },
//         "start-assessment":function(id)
//         {
//             var api=new GenericAPI();
//             api.setModule("url","/api/assessments/"+id)
//                 .setModule("method","POST")
//                 .setModuleData("__action__","start-assessment") //THE MAIN PIECE
//                 .setModuleData("AssessmentID",id)
//                 .setModuleData("_",function(){
//                     return $.now();
//                 }).execute(function(data){
//                 window.open(data.ActiveAssessment.Assessment["urls"]["run"]);
//             });
//         }
//
//     }
// };
//
// Api.RunningAssessments={
//     EventHandler:new EventHandler(),
//     getAll:function(callback){
//         var api=new GenericAPI();
//         api.setModule("url","/api/running-assessments")
//             .setModule("method","GET")
//             .setModuleData("_",function(){
//                 return $.now();
//             }).execute(function(data){
//             callback?callback(data):true;
//         });
//     },
//     get:function(id,callback){
//         var api=new GenericAPI();
//         api.setModule("url","/api/running-assessments/"+id)
//             .setModule("method","GET")
//             .setModuleData("_",function(){
//                 return $.now();
//             }).execute(function(data){
//             callback?callback(data.ActiveAssessment):true;
//         });
//
//     },
//     specialAtt:{
//         "report-questions":function(element,data,id){
//             var mainContainer=$("<div filter='all' class='assessment-report-questions-main-container'>");
//             var filtersContainer=$("<div class='filters-container'>").appendTo(mainContainer);
//             $("<div class='show-correct-only-btn'>")
//                 .appendTo(filtersContainer)
//                 .click(function(){
//                     mainContainer.attr("filter","correct-only");
//                 });
//             $("<div class='show-incorrect-only-btn'>")
//                 .appendTo(filtersContainer)
//                 .click(function(){
//                     mainContainer.attr("filter","wrong-only");
//                 });
//             $("<div class='show-all-btn'>")
//                 .appendTo(filtersContainer)
//                 .click(function(){
//                     mainContainer.attr("filter","all");
//                 });
//
//             data["Questions"].forEach(function(item){
//                 var itemElement=$("<div class='assessment-report-question-item'>");
//                 itemElement.attr("correct",item["IsCorrect"]);
//                 itemElement.append($("<div class='answered-html'>"+item["AnsweredHTML"]+"</div>"));
//                 itemElement.append($("<div class='points-worth'>"+item["PointsWorth"]+"</div>"));
//                 itemElement.append($("<div class='expected-answer'>"+item["CorrectAnswer"]+"</div>"));
//                 itemElement.append($("<div class='picked-answer'>"+item["ChosenAnswer"]+"</div>"));
//                 mainContainer.append(itemElement);
//             });
//             element.empty();
//             element.append(mainContainer);
//         },
//         "question-status":function(element,data,id){
//             console.log("Updating Question Status");
//             if(typeof  element.attr("loaded") =="undefined")
//             {
//                 var html="" +
//                     "<div class='main-status-and-submition-container'>" +
//                     "    <div class='submit-assessment-container'>" +
//                     "         <div action-event='submit-assessment'>Submit</div>" +
//                     "    </div>"+
//                     "    <div class='assessment-progress-status-main-container' new>" +
//                     "        <div class='progress'>" +
//                     "          <div class='progress-bar progress-bar-finished' role='progressbar' style='width:"+0+"%'>" +
//                     "              Finished "+Math.round(0)+"%  " +
//                     "          </div>"+
//                     "          <div class='progress-bar progress-bar-unseen' role='progressbar'   style='width:"+0+"%'>" +
//                     "              Unseen "+Math.round(0)+"% " +
//                     "          </div>" +
//                     "       </div>" +
//                     "    </div>" +
//                     "</div>";
//                 element.empty();
//                 $(html).appendTo(element);
//                 element.attr("loaded",true);
//             }
//
//
//             var locked=0;
//             var seen=0;
//             var unseen=0;
//             data["QuestionStatus"].forEach(function(item) {
//                 if (item == "LOCKED") {
//                     locked++;
//                 }
//                 if (item == "UNSEEN") {
//                     unseen++;
//                 }
//                 if (item == "SEEN") {
//                     seen++;
//                 }
//             });
//
//             finished=locked+seen;
//             finished=(finished/data["TotalQuestions"])*100.0;
//             unseen=(unseen/data["TotalQuestions"])*100.0;
//
//             var assessmentProgress=element.find(".assessment-progress-status-main-container");
//             assessmentProgress.attr("new",true);
//
//             var finishedElement=assessmentProgress.find(".progress-bar-finished");
//             var unseenElement=assessmentProgress.find(".progress-bar-unseen");
//             finishedElement.text("Finished "+Math.round(finished)+"%");
//             unseenElement.text("Unseen "+Math.round(unseen)+"%");
//             unseenElement.css({width:Math.round(unseen)+"%"});
//             finishedElement.css({width:Math.round(finished)+"%"});
//             // bubbleText({
//             //     element: unseenElement,
//             //     newText: "Unseen "+Math.round(unseen)+"%",
//             //     proportional:false,
//             //     timeBetweenRepeat:500
//             // });
//             //
//             // bubbleText({
//             //     element: finishedElement,
//             //     newText:"Finished "+Math.round(finished)+"%",
//             //     proportional:false,
//             //     timeBetweenRepeat:500
//             // });
//
//
//
//
//
//             setTimeout(function(){
//                 assessmentProgress.removeAttr("new");
//
//                 if(finished==100){
//                     element.find(".main-status-and-submition-container").attr("ready-to-submit",true);
//                 }
//
//             },1000);
//             //
//             // var html="" +
//             //     "<div class='assessment-progress-status-main-container'>"+
//             //     "    <div class='progress'>" +
//             //     "        <div class='progress-bar progress-bar-finished' role='progressbar' style='width:"+locked+"%'>" +
//             //     "            Finished "+Math.round(finished)+"%  " +
//             //     "        </div>"+
//             //     "        <div class='progress-bar progress-bar-unseen' role='progressbar' style='width:"+unseen+"%'>" +
//             //     "            Unseen "+Math.round(unseen)+"% " +
//             //     "        </div>" +
//             //     "    </div>" +
//             //     "</div>";
//             // element.empty();
//             // $(html).appendTo(element);
//             //
//             //
//             // if(data["TotalQuestions"]==)
//
//         },
//         "questions":function(element,data,id){
//             var index=0;
//             data["Questions"].forEach(function(question)
//             {
//
//
//                 /***********************************************************/
//                 /* Handle the Refresh of the DOM(Similar to react)         */
//                 /***********************************************************/
//                 var domUsing=element.find("[answered-question='"+question["AnswerableID"]+"']");
//                 if(domUsing.length==0){
//                     domUsing=$("<div>").attr("answered-question",question["AnswerableID"]).appendTo(element);
//                 }
//                 domUsing.empty();
//
//                 /***********************************************************/
//                 /* If Locked, then we onyl have html to show... So show it */
//                 /***********************************************************/
//                 if(data["QuestionStatus"][index++]=="LOCKED"){
//                     var blindElement=$(question["AnsweredHTML"]).appendTo(domUsing);
//                     blindElement.find(".btn").addClass("disabled").unbind("click"); // Make it look disabled
//                     return;
//                 }
//
//                 /***********************************************************/
//                 /* Initilize the Displayer                                 */
//                 /***********************************************************/
//                 var displayer=new QuestionDisplayWidget.instances[question["Question"]["QuestionTypeID"]]();
//                 displayer.__data__=question;
//                 displayer.__index__=index-1;
//
//                 /***********************************************************/
//                 displayer.appendTo(domUsing);
//
//                 /***********************************************************/
//                 /* Whenever its time to test if they got the answer right  */
//                 /***********************************************************/
//                 displayer.on("test",function(e){
//
//                     //$.isLoading();
//                     // fistTime=false;
//                      var html=displayer._element.html();
//
//                     displayer._element.find(".btn").addClass("disabled").unbind("click");
//                     //
//                     Api.AnswerableQuestions.events["answer-question"](
//                         displayer.__data__["AnswerableID"],html,e.answer,function(){
//                             Api.RunningAssessments.EventHandler.trigger("updates");
//                             //$.isNotLoading();
//                         });
//
//                 });
//                 // /***********************************************************/
//                 //
//                 //  displayer.on("render","after",function(e){
//                 //      if(parseInt(displayer.__data__["Attempts"])>=parseInt(displayer.__data__["AllowedAttempts"])){
//                 //          displayer._element.html(displayer.__data__["AnsweredHTML"]);
//                 //          displayer._element.find(".btn").addClass("disabled").unbind("click");
//                 //      }
//                 //  });
//
//                 displayer.setData(displayer.__data__["AnswerableID"],{
//                     "parameters": question["Question"]["JSONParameters"],
//                     "answer":question["ChosenAnswer"]
//                 });
//
//
//             });
//
//         }
//     },
//     events:{
//         "submit-assessment":function (id) {
//             var api=new GenericAPI();
//             api.setModule("url","/api/running-assessments/"+id)
//                 .setModule("method","POST")
//                 .setModuleData("__action__","submit-assessment") //THE MAIN PIECE
//                 .setModuleData("AnswerableID",id)
//                 .setModuleData("_",function(){
//                     return $.now();
//                 }).execute(function(data){
//                 window.location=data.ActiveAssessment["urls"]["view"];
//             });
//         }
//     }
// };


/**
 *
 * @return {QuestionsPopup}
 * @constructor
 */
Popups.Questions=function(){
    return new QuestionsPopup();
};



/** @constructor */
function QuestionsPopup(){
    this._multiselect=false;
    this._callback=function(){alert("Question Popup was not properly setup")};
    this._searchable=false; //todo Need to be able to do searchable
    this._sortable=false; //todo Need to be able to do sortable
    this._isOpen=false;
    this._max_selected=-1;
}
$.extend(QuestionsPopup.prototype,{

    /***********************************************************************/
    /**
     * @this QuestionsPopup
     * @param {boolean=} $_multiselect Some value (optional).
     * @return boolean|QuestionsPopup
     */
    MultiSelect:function($_multiselect)
    {
        switch(arguments.length){
            case 0:
                return this._multiselect;
            case 1:
                this._multiselect=$_multiselect;
                return this;
                break;
            default:
                console.error("Incorrect number of arguments: QuestionsPopup.multiselect");
        }
    },

    /**
     * @this QuestionsPopup
     * @param {function=} $_callback Callback Function (optional).
     * @return function|QuestionsPopup
     */
    Callback:function($_callback)
    {
        switch(arguments.length){
            case 0:
                return this._callback;
            case 1:
                this._callback=$_callback;
                return this;
                break;
            default:
                console.error("Incorrect number of arguments: QuestionsPopup.Callback");
        }
    },
    /**
     * @this QuestionsPopup
     * @param {boolean=} $_max Some value (optional).
     * @return int|QuestionsPopup
     */
    MaximumSelected:function($_max_selected)
    {
        switch(arguments.length){
            case 0:
                return this._max_selected;
            case 1:
                this._max_selected=$_max_selected;
                this.MultiSelect(true);
                return this;
                break;
            default:
                console.error("Incorrect number of arguments: QuestionsPopup.Searchable");
        }
    },

    /**
     * @this QuestionsPopup
     * @param {boolean=} $_searchable Some value (optional).
     * @return boolean|QuestionsPopup
     */
    Searchable:function($_searchable)
    {
        switch(arguments.length){
            case 0:
                return this._searchable;
            case 1:
                this._searchable=$_searchable;
                return this;
                break;
            default:
                console.error("Incorrect number of arguments: QuestionsPopup.Searchable");
        }
    },

    /**
     * @this QuestionsPopup
     * @return boolean
     */
    IsOpen:function()
    {
        return this._isOpen;
    },

    /**
     * @this QuestionsPopup
     */
    Open:function()
    {
        if(this.IsOpen()){
            return;
        }
        var $this=this;
        element=$(
            "<div api-component='Questions' api-fetcher='get'>" +
            "    <input type='text' class='form-control' placeholder='Search...' api-filter='Question' api-filter-type='CONTAINS'>" +
            "    <table class='table'>" +
            "        <thead>" +
            "            <tr>" +
            "                <th>Question ID</th>" +
            "                <th>Question</th>" +
            "                <th>Type</th>" +
            "            </tr>" +
            "        </thead>"+
            "        <tbody api-drop-here='Questions' >" +
            "            <tr api-data-export class='questionItem' api-array-template api-save-data-as='Question'>" +
            "                <td api-attribute='QuestionID'></td>" +
            "                <td api-attribute='Question'></td>" +
            "                <td api-attribute='QuestionType'></td>" +
            "            </tr>" +
            "        </tbody>" +
            "    </table>" +
            "</div>");
        var selected={};
        MessageBox.ShowPopup({
            title:this.MultiSelect()?"Pick You Question":"Pick Your Questions",
            content:element,
            options:[
                {
                    type:'danger',
                    causeClose:true,
                    content:'Cancel'
                },
                {
                    type:'success',
                    causeClose:true,
                    content:'Ok',
                    callback:function(modal){
                        modal.close();
                        data=Object.values(selected);
                        if($this.MultiSelect()){
                            $this.Callback()(data);
                        }
                        else{
                            $this.Callback()(data[0]);
                        }
                    }
                }
            ]
        });

        element.on("click",".questionItem[api-data-expectedanswer]:not(locked)",function(){
            var clickedQuestion=$(this).data("Question");
            var currentlySelected=element.find(".questionItem[selected]");
            if($this.MultiSelect()){
                if($(this).attr("selected")){
                    $(this).removeAttr("selected");
                    delete selected[clickedQuestion["QuestionID"]];


                }
                else {
                    $(this).attr("selected", true);
                    selected[clickedQuestion["QuestionID"]] = clickedQuestion;
                }
            }
            else
            {
                if($(this).attr("selected")){
                }
                else
                {
                    currentlySelected.each(function(){
                        var question=$(this).data("Question");
                        delete selected[question["QuestionID"]];
                        $(this).removeAttr("selected");
                    });

                    $(this).attr("selected",true);
                    selected[clickedQuestion["QuestionID"]]=clickedQuestion;
                }
            }

            if(Object.keys(selected).length>=$this.MaximumSelected() && $this.MaximumSelected()>0 && $this.MultiSelect()){
                element.find(".questionItem:not([selected])").attr("locked",true);
            }
            else
            {
                element.find(".questionItem[locked]").removeAttr("locked");
            }


        });
        element.trigger('created');
        return;


        /*******************************************************************/
        var element=$("<div  class='col-lg-12 questions-popup-main-container '>");
        element.html("<div  class='col-lg-12 adding-button'><a target='_blank' href='/questions/questions/create' class='btn btn-primary'>Add New Question</a></div> " +
                     "<div class='col-lg-12  sub-main-container'>"+
                     "   <div class='col-lg-2 tags-container'>"+
                     "      <div class='tags-view-container'>"+
                     "         <div class='tags-view-title'>"+
                     "            Tags"+
                     "         </div>"+
                     "         <div class='tags-view-body'>"+
                     "         </div>"+
                     "      </div>"+
                     "   </div>"+
                     "   <div class='col-lg-10 questions-container'>"+
                     "      <table class='table table-hover'>"+
                     "         <thead>"+
                     "            <tr >"+
                     "               <th class='question-column-header'>Question</th>"+
                     "               <th class='question-type-column-header'>Question Type</th>"+
                     "            </tr>"+
                     "         </thead>"+
                     "         <tbody>"+
                     "           <span class='spinner'></span>"+
                     "         </tbody>"+
                     "      </table>"+
                     "  </div>"+
                     "</div>");



        /*******************************************************************/
        element.on("click",".tag-selection-item",function(){
            if($(this).attr("filter")=='on'){
                $(this).data("questions").css("display","none");
                $(this).attr("filter","off");
                return;
            }

            $(this).data("questions").css("display","");
            $(this).attr("filter","on");


        });
        element.on("mouseover",".tag-selection-item",function(){
            element.find("[question-id][highlighted]").removeAttr("highlighted");
            $(this).data("questions").attr("highlighted",true);
        });


        /*******************************************************************/
        MessageBox.ShowPopup({
            title:this.MultiSelect()?"Pick You Question":"Pick Your Questions",
            content:element,
            options:[
                {
                    type:'danger',
                    causeClose:true,
                    content:'Cancel'
                },
                {
                    type:'success',
                    causeClose:true,
                    content:'Ok',
                    callback:function(modal){
                        modal.close();
                        data=Object.values(selected);
                        if($this.MultiSelect()){
                            $this.Callback()(data);
                        }
                        else{
                            $this.Callback()(data[0]);
                        }
                    }
                }
            ]
        });

        var updateTags=function(questions){
            var tagsBody=element.find(".tags-view-body");
            tagsBody.$loading();
            Api.Tag.fancy()
                .relatedToQuestions(questions)
                .filter("Category","EQUALS","Question")
                .setModuleData("key","TagID")
                .execute(function(data){
                    tagsBody.$notloading();
                    for(var tag in data){
                        var count=data[tag].length;
                        var tagElement=$("<div class='tag-selection-item' filter='on'>" +
                                "<div class='tag-section-filter-on-indicator'><h2 class='glyphicon glyphicon-check'></h2></div>"+
                                "<div class='tag-selection-tag-name'>" +
                                tag+
                                "</div>" +
                                "<div class='tag-selection-tag-count'>" +
                                count+
                                "</div>")
                        tagsBody.append(tagElement);

                        var selectorForQuestions=data[tag].map(function(item){
                            return "[question-id='"+item["ObjectID"]+"']";
                        }).join();

                        tagElement.data("questions",element.find(selectorForQuestions));
                        tagElement.data("questions").each(function(){
                            if(typeof $(this).data("tags") == "undefined"){
                                $(this).data("tags",[]);
                            }
                            $(this).data("tags").push(tag);
                        });



                    }
                });
                // .group("TagID")
                // .execute(function(data){
                //     tagsBody.$notloading();
                //     tagsBody.empty();
                //     data.forEach(function(item){
                //         tagsBody.append($("<div class='tag-selection-item'>" +
                //             "<div class='tag-selection-tag-name'>" +
                //                 item["TagID"]+
                //             "</div>" +
                //             "<div class='tag-selection-tag-count'>" +
                //                 item["Count"]+
                //             "</div>"));
                //     });
                // });
        };



        /*******************************************************************/
        var tableBody=element.find("tbody");
        Api.Questions.get(function(questions){
            element.find(".spinner").remove();

            updateTags(questions);
            tableBody.empty();
            questions.forEach(function(item){
                var question=item["JSONParameters"]["question"];
                var row=$("<tr question-id='"+item["QuestionID"]+"' class='questionItem'>"+
                    "   <td>"+(question.length>40?question.substring(0,40):question)+"...</td>"+
                    "   <td>"+item["QuestionType"]+"</td>"+
                    "</tr>");



                row.data("Question",item);
                row.appendTo(tableBody);
            });

            tableBody.trigger("created");
        });



    }

});
/**
 * @return QuestionsPopup
 */
QuestionsPopup.Create=function(){
    return new QuestionsPopup();
};



/***************************************************************************/
/*                                Components                               */
/***************************************************************************/
Components.Questions={
    render:function(questions, element){
        if(typeof questions == 'undefined'){
            return;
        }
        var html=
            "<table class='table questions-table'>"+
            "   <thead>" +
            "      <tr>" +
            "         <th>Question ID</th>" +
            "         <th>Question</th>" +
            "         <th>Type</th>" +
            "         <th>Weight</th>" +
            "      </tr>" +
            "    </thead>" +
            "    <tbody class='questions-body'>" +
            "" + questions.map(function(item){
                return "<tr>" +
                       "    <td>"+item["QuestionID"]+"</td>" +
                       "    <td>"+item["Question"]+"</td>" +
                       "    <td>"+item["QuestionType"]+"</td>" +
                       "    <td>"+item["Weight"]+"</td>";
            }).join("")+
            "    </tbody>" +
            "</table>";
        var htmlElement=$(html);
        element.empty();
        element.append(htmlElement);

    }
}
Components.QuestionTypes=function(){
    return new QuestionTypesCreationComponent();
};

/** @constructor */
function QuestionsCreationComponent()
{
    this._element=$("<div>");
    var $this=this;

    this.Render();


}
$.extend(QuestionsCreationComponent.prototype,{

    Render:function(){

    }
});

/** @constructor */
function QuestionTypesCreationComponent(){
    var $this=this;
    this.state={page:"main"};
    this._element=$("<div>");
    this._element.on("click","[move-to-page]",function(){
        $this.setState({page:$(this).attr("move-to-page")});
    });
    this.pages={
        "main": {
            render: function () {
                var element=$("<div>");
                element.append("<div move-to-page='chooseType' class='btn btn-default new-question-choice-from-scratch'>From Scratch</div>");
                element.append("<div move-to-page='chooseCopyFromQuestion' class='btn btn-default new-question-choice-copy-existing-question'>From Existing Question</div>");
                $this._element.empty();
                $this._element.append(element);
            }
        },
        "chooseCopyFromQuestion":{
            render:function(){
                $this._element.empty();
                Popups.Questions().MultiSelect(false).Callback(function(question){
                    $this.setState({page:"ready",data:{copyFrom:question.QuestionID}});
                }).Open();
            }
        },
        "chooseType":{
            render:function(){

                Api.QuestionTypes.fetch("get",{},function(questionTypes){
                    var listElementContainer=$("<div class='list-group question-type-list'>");
                    questionTypes.forEach(function(item,index)
                    {
                        var listItem=$("<a href='#' class='list-group-item question-type-list-item'>"+item.Name+"</a>");
                        listItem.data("questionType",item);

                        if(index==0)
                        {
                            listItem.addClass("active");
                        }
                        listItem.click(function(){
                            $this.setState({page:"chooseQuestion",data:{QuestionTypeID:$(this).data("questionType").QuestionTypeID}})
                        });
                        listElementContainer.append(listItem);
                    });
                    $this._element.empty();
                    $this._element.append(listElementContainer);

                });
            }
        },
        "chooseQuestion":{

            render:function(){
                var inputText=$("<input type='text' class='form-control' placeholder='Enter the Question...'>");
                inputText.enterkey(function(){
                    $this.setState({page:"ready",data:$.extend($this.state.data,{Question:inputText.val()})});
                });
                $this._element.empty();
                $this._element.append(inputText);
            }
        },
        "ready":{
            render:function(){
                Api.Questions.action("create",null,$this.state.data,function(question){
                    window.open("/questions/questions/"+question.QuestionID+"");
                });
            }
        }
    }
}
$.extend(QuestionTypesCreationComponent.prototype,{
    setState:function(state){
        this.state=$.extend(this.state,state);
        this.Render();
    },
    appendTo:function(element){
        this._element.appendTo(element);
        this.Render();
    },
    Render:function(){
        /********************************************************************/
        this.pages[this.state.page].render();

    }

});
QuestionTypesCreationComponent.Create=function(){
    return new QuestionTypesCreationComponent();
};