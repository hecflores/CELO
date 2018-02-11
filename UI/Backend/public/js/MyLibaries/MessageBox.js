function MessageBoxOptionType(html, classes,callback,closeModelWhenClicked,modal)
{
    
    this.callback = callback;

    var $this = this;
    this.element = $("<span style='color:#fff;border:none;margin-left:10px' class='btn btn-lg "+classes+"'>" + html + "</span>").click(function () {
        $this.callback(modal);
        if (closeModelWhenClicked) {
            modal.close();
        }
    });
    this.setContent(html);
}
MessageBoxOptionType.prototype.setContent = function (content) {
    if (typeof content == "string") {
        this.element.html(content);
    }
    else if (typeof content == "function") {
        var returnType = content(this);
        return this.setContent(returnType);

    }
    else if (content instanceof jQuery) {
        this.element.empty();
        this.element.append(content);
    }
}
MessageBoxOptionType.DefaultOptions = function () {
    var object = {
        //Option Possibilities:
        //   "default","warning","danger","success"
          type:"default",


        //Option Types:
        //   String
        //   function() return String/jQuery
        //   jQuery
          content:"Ok",
          causeClose:true,
        //Option Possibilities:
        //   "default","warning","danger","success"
          callback:function(modal){
                modal.close();
           }
    }
    return object;
}
MessageBoxOptionType.BuildOptions = function (options) {
    return $.extend({}, MessageBoxOptionType.DefaultOptions(), options);
}
function MyModal(modalElement)
{
    this.element = modalElement;

    this.TitleElement = this.element.find(".modal-title");
    this.BodyElement = this.element.find(".modal-body");
    this.FooterElement = this.element.find(".modal-footer");
    this._properties={};
    this.setFooter("");
    this.setBody("");
    this.setTitle("");

    var $this=this;
    $this.element.on("hidden.bs.modal",function(){
        if(typeof $this._properties=='undefined'){
            return;
        }
        if(typeof $this._properties.closeCallback!='function'){
            return;
        }
        $this._properties.closeCallback($this);
    });
}
MyModal.prototype.close=function(){

    this.element.modal('hide');
}
MyModal.prototype.setTitle = function (titleContent) {
    if (typeof titleContent == "string") {
        this.TitleElement.html(titleContent);
    }
    else if (typeof titleContent == "function") {
        var returnType = titleContent(this);
        return this.setTitle(returnType);
        
    }
    else if (titleContent instanceof jQuery) {
        this.TitleElement.empty();
        this.TitleElement.append(titleContent);
    }
    return this;
}
MyModal.prototype.setBody = function (titleContent) {
    if (typeof titleContent == "string") {
        this.BodyElement.html(titleContent);
    }
    else if (typeof titleContent == "function") {
        var returnType = titleContent(this);
        return this.setBody(returnType);

    }
    else if (titleContent instanceof jQuery) {
        this.BodyElement.empty();
        this.BodyElement.append(titleContent);
    }
    return this;
}
MyModal.prototype.setFooter = function (titleContent) {
    if (typeof titleContent == "string") {
        this.FooterElement.html(titleContent);
    }
    else if (typeof titleContent == "function") {
        var returnType = titleContent(this);
        return this.setFooter(returnType);

    }
    else if (titleContent instanceof jQuery) {
        this.FooterElement.empty();
        this.FooterElement.append(titleContent);
    }
    return this;
}
MyModal.create = function () {
    return new MyModal(Tools.OpenModal("", ""));
}
MyModal.prototype.close = function () {
    this.element.modal('hide');
}
function MessageBox() {
}
MessageBox.DefaultOptions = function () {
    
    var object=
    {
        //Option Types:
        //   String
        //   function() return String/jQuery
        //   jQuery
        title: "Unkown",

        //Option Types:
        //   String
        //   function() return String/jQuery
        //   jQuery
        content: "",
        closeCallback:function($modal){

        },
        options:
        {
            //"ok":
            //{
                //Option Possibilities:
                //   "default","warning","danger","success"
            //  type:"default",


                //Option Types:
                //   String
                //   function() return String/jQuery
                //   jQuery
            //  content:"Ok",
            //  causeClose:false,
                //Option Possibilities:
                //   "default","warning","danger","success"
            //  callback:function(modal){
            //        modal.close();
            //   }
            //}
        }
    };
    return object
}
MessageBox.BuildOptions = function (options) {
    var options = $.extend({}, MessageBox.DefaultOptions(), options);
    for (var optionName in options.options) {
        var option = options.options[optionName];
        options.options[optionName] = MessageBoxOptionType.BuildOptions(option);
    }
    return options;
}
MessageBox.ShowPopup = function (perameters) {

    var options = MessageBox.BuildOptions(perameters);
    var modal = MyModal.create();
    
    modal.setTitle(options.title);
    modal.setBody(options.content);
    modal._properties=perameters;
    modal.setFooter(function (modal) {
        var container=$("<div style='text-align:right' class='options'></div>");
        for(var optionName in perameters.options){
            var option=perameters.options[optionName];
            var actionOption=new MessageBoxOptionType(option.content,"btn-"+option.type,option.callback,option.causeClose,modal);
            container.append(actionOption.element);
        }
        return container;
    });

    return modal;
}
MessageBox.ShowOptionPopup=function(title,message, messageBoxOptions)
{

    
    var html =  message + "<div style='text-align:right' class='options'></div>";
    var modal = Tools.OpenModal(title, html);
    
    var options = modal.find(".modal-footer");

    options.empty();
    messageBoxOptions.forEach(function (messageOption) {
        messageOption.element.click(function () {
            modal.find(".close").trigger("click");
        });
        options.append(messageOption.element);
    });
}
MessageBox.ShowContinueOrCancel = function (perameters)
{

   

    var defaultPerameters = { title: "Unkown", message: "", continueCallback: function () { }, cancelCallback: function () { } ,continueText:"Continue",cancelText:"Cancel"};

    
    
    perameters = $.extend({}, defaultPerameters, perameters);

    MessageBox.ShowPopup(
    {
        title: perameters.title,
        content: perameters.message,
        options:
        {
            "cancel":
            {
                type: "danger",
                content: perameters.cancelText,
                callback:perameters.cancelCallback
            },
            "continue":
            {
                type: "success",
                content: perameters.continueText,
                callback: perameters.continueCallback
            }
        }
    });
    
                                                                    
}

MessageBox.ErrorContinue = function (title,message, callback) {
    MessageBox.ShowContinueOrCancel(
    {
        title: "<h2 class='text-danger'><span class='glyphicon glyphicon-remove'></span> "+title+"</h2>",
        message: "<strong class='text-danger'>"+message+"<br>" +
                "Please contect your <a href='mailto:hector.arm.flores@hpe.com'>Administrator</a><br>" +
                "<br>" +
                "<u>Would you like to continue?</u></strong>",
        continueCallback: callback
    });
}
MessageBox.ErrorWithJSON=function(title,error,obj){
    MessageBox.ShowPopup(
        {
            title: "<h2 class='text-danger'><span class='glyphicon glyphicon-remove'></span> " + title + "</h2>",
            content: function() {
                var jsonElement=Tools.prettyJsonElement(obj);
                var container=$("<div>");
                var errorMessage=$("<strong class='text-danger'>" + error + "<br>");

                container.append(errorMessage);
                container.append(jsonElement);
                return container;
            },
            options:
                {
                    "ok":
                        {
                            type: "success",
                            content: "Ok",
                            callback:function(){}
                        },
                }
        });
};
MessageBox.ErrorOk = function (title, message,callback,details) {

    MessageBox.ShowPopup(
        {
            title: "<h2 class='text-danger'><span class='glyphicon glyphicon-remove'></span> " + title + "</h2>",
            content: "<strong class='text-danger'>" + message + "<br>",
            options:
                {
                    "ok":
                        {
                            type: "success",
                            content: "Ok",
                            callback:callback
                        },
                }
        });
}

MessageBox.WarningOk = function (title, message) {
    MessageBox.ShowPopup(
    {
        title: "<h2 class='text-warning'><span class='glyphicon glyphicon-alert'></span> " + title + "</h2>",
        content: "<strong class='text-warning'>" + message + "<br>",
        options:
        {
            "ok":
            {
                type: "success",
                content: "Ok"
            },
        }
    });
}