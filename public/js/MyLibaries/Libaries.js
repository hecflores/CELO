﻿
jQuery.extend(jQuery.expr[':'], {
    "attrStartsWith": function (el, _, b) {
        for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
            if(atts[i].nodeName.toLowerCase().indexOf(b[3].toLowerCase()) === 0) {
                return true;
            }
        }
        return false;
    }
});

$.extend({
    replaceTag: function (currentElem, newTagObj, keepProps) {
        var $currentElem = $(currentElem);
        var i, $newTag = $(newTagObj).clone();
        if (keepProps) {//{{{
            newTag = $newTag[0];
            newTag.className = currentElem.className;
            $.extend(newTag.classList, currentElem.classList);
            $.extend(newTag.attributes, currentElem.attributes);
        }//}}}
        $currentElem.wrapAll($newTag);
        $currentElem.contents().unwrap();
        // return node; (Error spotted by Frank van Luijn)
        return this; // Suggested by ColeLawrence
    }
});

$.fn.extend({
    replaceTag: function (newTagObj, keepProps) {
        // "return" suggested by ColeLawrence
        return this.each(function() {
            jQuery.replaceTag(this, newTagObj, keepProps);
        });
    }
});


$(document).on('click','.btn-toggle',function() {
    $(this).find('.btn').toggleClass('active');

    if ($(this).find('.btn-primary').size()>0) {
        $(this).find('.btn').toggleClass('btn-primary');
    }
    if ($(this).find('.btn-danger').size()>0) {
        $(this).find('.btn').toggleClass('btn-danger');
    }
    if ($(this).find('.btn-success').size()>0) {
        $(this).find('.btn').toggleClass('btn-success');
    }
    if ($(this).find('.btn-info').size()>0) {
        $(this).find('.btn').toggleClass('btn-info');
    }

    $(this).find('.btn').toggleClass('btn-default');
    $(this).find('.toggle-submit').val($(this).find('.btn[active]').val()=='Yes');

});

function toFunction(callback){
    if(typeof callback == "function"){
        return callback;
    }
    return function(){

    };
}
(function(old) {
    $.fn.attrGrabAndLeave = function(name) {
        if(typeof this.attr(name) == 'undefined'){
            return false;
        }
        var value=this.attr(name);
        this.removeAttr(name);
        return value;
    };
    $.fn.attrOrDefault = function(name, defaultValue) {
        return (typeof this.attr(name) == 'undefined')?defaultValue: this.attr(name);

    };
    $.fn.attr = function() {
        if(arguments.length === 0) {
            if(this.length === 0) {
                return null;
            }

            var obj = {};
            $.each(this[0].attributes, function() {
                if(this.specified) {
                    obj[this.name] = this.value;
                }
            });
            return obj;
        }

        return old.apply(this, arguments);
    };
    $.fn.attrRegex = function(format,replace) {

        var attributes=this.attr();
        var finalAttributes={};
        for(var key in attributes)
        {
            if(!attributes.hasOwnProperty(key)){
                continue;
            }
            if(key.match(format)){
                if(typeof replace != 'undefined'){
                    var newKey=key.replace(format,replace);

                    finalAttributes[newKey]=attributes[key];
                }
                else
                {
                    finalAttributes[key]=attributes[key];
                }
            }
        }
        return finalAttributes;

    };
})($.fn.attr);

$.isLoading=function(){
    if($(".static-spinner").length==0) {


        var spinnerSplashScreen=$("<div class='loading-splash-screen'>"+
            "<div class='loading-spinner-container'>" +
            "<div style='width:30px;height:30px' class='loading-spinner static-spinner'></div></div></div>");
        spinnerSplashScreen.find(".loading-spinner").css({
            width: "50vw",
            height: "50vw",
            zIndex:10000
        });
        spinnerSplashScreen.appendTo("body");
    }
};
$.isNotLoading=function(){
    $(".loading-splash-screen").remove();
};
$.fn.$loading_small=function(clearIt){
    var element=$("<div class='loading-spinner'></div>");
    element.css({

        display: "inline-block",
        position:"relative",
        width:"20px",
        height:"20px",
    });
    if(clearIt!=true){
        $(this).empty();
    }

    $(this).append(element);
};
$.fn.$loading=function(){
     var maxSize=Math.max(Math.min($(this).width(),$(this).height()),100);
    // var element=$("<div class='loading-splash-screen'>" +
    //     "<div class='loading-spinner'>" +
    //     "</div>" +
    //     "</div>");
    // element.find(".loading-spinner").css({
    //         display: "inline-block",
    //         position:"absolute",
    //         width:maxSize*.8,
    //         height:maxSize*.8,
    //         left:"50%",
    //         top:"50%",
    //         "transform":"translate(-50%,-50%)"
    //     });
    // element.find(".loading-container").css({
    //     display: "inline-block",
    //     position:"absolute",
    //     width:maxSize*.8,
    //     height:maxSize*.8,
    //     left:"50%",
    //     top:"50%",
    //     "transform":"translate(-50%,-50%)"
    // });

    var element=$("<div class='loading-helper'><div class='loading-spinner'></div>");
    element.find(".loading-spinner").css({

            display: "inline-block",
            position:"relative",
            width:maxSize*.8,
            height:maxSize*.8
        });
    $(this).empty();
    $(this).append(element);
};
$.fn.$notloading=function(){
    $(this).find('.loading-spinner').remove();

};
$.fn.isMyChecked = function () {
    if ($(this).attr("my-checked") == "true") {
        return true;
    }
    return false;
}
$.fn.checkMyCheck = function () {
    $(this).attr("my-checked", "true");
    $(this).trigger("my-checked-changed");
}
$.fn.UnCheckMyCheck = function () {
    $(this).attr("my-checked", "false");
    $(this).trigger("my-checked-changed");
}
$.fn.toggleMyChecked = function () {
    if ($(this).isMyChecked()) {
        $(this).UnCheckMyCheck();
        return;
    }
    $(this).checkMyCheck();
}

$(document).on("click", ".my-checkbox", function () {
    $(this).toggleMyChecked();
});
Array.prototype.find = function (callback) {
    var foundElement;
    this.forEach(function (item) {
        if (typeof foundElement != "undefined") {
            return;
        }
        if (callback(item)) {
            foundElement = item;
        }
    });
    return foundElement;
};
$.fn.insertAt = function (index, $parent) {
    return this.each(function () {
        if (index === 0) {
            $parent.prepend(this);
        } else {
            if (index >= $parent.children().length) {
                $parent.append(this);
            }
            else {
                $parent.children().eq(index - 1).after(this);
            }
        }
    });
}
function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Z0-9 ]/i);
}
$.fn.scrollTo = function () {
    

    $(document).scrollTop(parseInt($(this).offset().top) - (window.innerHeight / 2));
    
};
$.fn.draggable = function () {

    $(this).mousedown(function (e) {
        $(this).data("position-offset", { left: e.pageX - $(this).offset().left, top: (e.pageY + $(document).scrollTop()) - $(this).offset().top });
        $(this).attr("isDown", true);
        $(this).data("mouse-down-event", e);
        
    });
    var thisAttribute = $(this);
    $(document).mouseup(function (e) {
        if (thisAttribute.attr("isDown")) {
            thisAttribute.removeAttr("isDown");
            thisAttribute.data("mouse-up-event", e);
        }
    });
    $(document).mousemove(function (e) {
        if (thisAttribute.attr("isDown")) {
            thisAttribute.data("mouse-move-event", e);
            thisAttribute.trigger("drag");
        }
    });
    
    $(this).on("drag", function () {
        var positionOffset = $(this).data("position-offset");
        var mouseMoveEvent=$(this).data("mouse-move-event");
        var currentMousePosition={left:mouseMoveEvent.pageX, top:mouseMoveEvent.pageY};
        $(this).css({"left":currentMousePosition.left-positionOffset.left,
            "top":currentMousePosition.top-positionOffset.top});
    });
    return $(this);
}
$.fn.isAfter = function (sel) {
    return this.prevAll(sel).length !== 0;
}
$.fn.isBefore = function (sel) {
    return this.nextAll(element).length !== 0;
}
$.fn.niceFileField = function() { 
        this.each(function(index, file_field) { 
          file_field = $(file_field); 
           var label = file_field.attr("data-label") || "Choose File"; 
 
 
           file_field.css({"display": "none"}); 
        
 
               nice_file_block_text  = '<div class="input-group nice_file_block">'; 
               nice_file_block_text += '  <input type="text" class="form-control">'; 
               nice_file_block_text += '  <span class="input-group-btn">'; 
               nice_file_block_text += '   <button style="border-top-right-radius:5px;border-bottom-right-radius:5px" class="btn btn-primary form-control nice_file_field_button" type="button">' + label + '</button>';
               nice_file_block_text += '  </span>'; 
               nice_file_block_text += '</div>'; 
         
 
               file_field.after(nice_file_block_text); 
         
 
               var nice_file_field_button = file_field.parent().find(".nice_file_field_button"); 
               var nice_file_block_element = file_field.parent().find(".nice_file_block"); 
         
 
               nice_file_field_button.on("click", function(){ console.log("click"); file_field.click() } ); 
                      file_field.change( function(){ 
                            nice_file_block_element.find("input").val(file_field.val()); 
                          }); 
                    }); 
       }; 
$("[type='file']").niceFileField();
function Tools() { }
Tools.insertBeforeKey = function (objectInserting, keyOfNewObject, keyInsertingBefore, object) {
    var newCopyOfObject = {};
    for (var key in object) {
        if (keyInsertingBefore == key) {
            newCopyOfObject[keyOfNewObject] = objectInserting;
        }
        newCopyOfObject[key] = object[key];
    }
    for (var key in object) {
        delete object[key];
    }
    for (var key in newCopyOfObject) {
        object[key] = newCopyOfObject[key];
    }

};
Tools.prettyJson=function(json){
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 4);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return "<pre class='json-output'>"+json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        })+"</pre>"
};
/**
 *  Returns a usable jQuery element that has pretty json
 * @param Object obj
 * @return {jQuery}
 */
Tools.prettyJsonElement=function(json){
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 4);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return $("<pre class='json-output'>"+json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        })+"</pre>");
};
Tools.containsOnly = function (object,value,offset) {
    for(var i=offset;i<Object.keys(object).length;i++){
        if (object[i] != value) {
            return false;
        }
    }
    return true;
}
Tools.inheritsFrom = function (child, parent) {
    var oldConstructor = child.prototype.constructor;
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = oldConstructor;
};
Tools.status = function (status) {
    //$("#status").html("<span class='label label-info'>" + status + "</span>");
}
Tools.copy = function (object) {
    var newObject = {};
    for (var key in object) {
        newObject[key] = object[key];
    }
    return newObject;
}
Tools.fullTypeof = function (value) {
    if (arguments.length > 1) {
        var object = { all: Tools.fullTypeof(arguments[0]), any: Tools.fullTypeof(arguments[0]), none: Tools.fullTypeof(arguments[0]) };
        for (var key in object.none) {
            object.none[key] = !object.none[key];
        }
        for (var i = 1; i < arguments.length; i++) {
            var tempObject = Tools.fullTypeof(arguments[i]);
            for (var key in object.all) {
                if (object.all[key]) {
                    object.all[key] = tempObject[key];
                }
            }
            for (var key in object.any) {
                if (tempObject[key]) {
                    object.any[key] = tempObject[key];
                }
            }
            for (var key in object.none) {
                if (tempObject[key]) {
                    object.none[key] = false;
                }
            }
            return object;
        }

    }

    var object = {};
    object.undefined = (typeof value == "undefined");
    object.object = (typeof value == "object");
    object.boolean = (typeof value == "boolean");
    object.number = (typeof value == "number");
    object.string = (typeof value == "string");
    object.symbol = (typeof value == "symbol");
    object.function = (typeof value == "function");
    return object;
}
Tools.setIfUndefined = function (object, parameter, setTo) {
    if (Tools.fullTypeof(object).undefined) {
        return;
    }
    if (Tools.fullTypeof(object[parameter]).undefined) {
        object[parameter] = setTo;
    }
};
Tools.OpenModal = function (title, html, width) {
    if (typeof width == "undefined") {
        width = 75;
    }
    var str = '<div  class="modal fade" role="dialog" data-backdrop="static">\n' +
                '<div style="width:'+width+'vw" class="modal-dialog">\n' +
                    '<div class="modal-content">\n' +
                        '<div class="modal-header">\n' +
                            '<button type="button" class="close" data-dismiss="modal">&times;</button>\n' +
                            '<h4 class="modal-title">' + title + '</h4>' +
                        '</div>' +
                        '<div id="hFileContent" class="modal-body row">' +
                        html +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    if ($(".modal:last").length == 0) {
        return $(str).prependTo($("body")).modal().on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }
    return $(str).insertAfter($(".modal:last")).modal().on('hidden.bs.modal', function () {
        $(this).remove();
    });
};
Tools.merge_options = function (obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}
Tools.areEqualObjects = function (obj1, obj2,ignoreThis) {
    for (var attrname in obj1) {
        if (typeof obj1[attrname] == "undefined") {
            continue;
        }
        if (attrname == ignoreThis) {
            continue;
        }
        if (obj2[attrname] != obj1[attrname]) {
            return false;
        }
    }
    for (var attrname in obj2) {
        if (typeof obj2[attrname] == "undefined") {
            continue;
        }
        if (attrname == ignoreThis) {
            continue;
        }
        if (obj2[attrname] != obj1[attrname]) {
            return false;
        }
    }
    return true;
}
Tools.NotifyUser=function(message){
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(message);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(message);

            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
};

function getObjectClass(obj) {
    if (obj && obj.constructor && obj.constructor.toString) {
        var arr = obj.constructor.toString().match(
            /function\s*(\w+)/);

        if (arr && arr.length == 2) {
            return arr[1];
        }
    }

    return undefined;
}
function New(func) {
    var res = {};
    if (func.prototype !== null) {
        res.__proto__ = func.prototype;
    }
    var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
    if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
        return ret;
    }
    return res;
}

function alert(message, isHtml) {
    Tools.OpenModal("<h3><span class='glyphicon glyphicon-alert'></span> Alert! </h3>", "<h4><strong>" + message + "</strong></h4>");
}

console.tools = {};
console.tools.status = "on";
console.tools.prepend = "";
console.using = "org";
console.error_org = console.error;
console.error_new=function (errorMessage) { 
    Tools.OpenModal("<h3><span class='glyphicon glyphicon-remove-sign'></span> Error! </h3>", "<h4><strong>" + errorMessage + "</strong></h4>");
}
console.debug_org= console.debug;
console.debug_new = function (message) {

};
console.log_org= console.log;
console.log_new = function (message) {
    var container=$(".logOutput");
    if(container.length==0){
        return;
    }
    var scroll = $("<div style='border-bottom:1px solid rgba(0,0,0,.4);padding:10px'>").html("<strong >" + message + "</strong>").appendTo(container);
    container.scrollTop(container.scrollTop()+scroll.height()*4);
    console.log_org(message);
}
console.pushIndent = function () {
    console.tools.prepend = console.tools.prepend + "   ";
    return console;
}
console.popIndent = function () {
    console.tools.prepend = console.tools.prepend.replace(/    /i, "");
    return console;
}
console.logOff = function () {
    console.tools.status = "off";
}
console.logOn = function () {
    console.tools.status = "on";
}
console.RIn = console.pushIndent;
console.LIn = console.popIndent;
console.new = function () {
    console.error = function (message) {
        console.error_new(console.tools.prepend + message);
        return console;
    };
    console.log = function (message) {
        if (console.tools.status == "on") {
            console.log_new(console.tools.prepend + message);
        }
        return console;
    };
    console.using = "new";
}
console.org = function () {
    console.error = function (message) {

        console.error_org(console.tools.prepend + message);
        return console;
    };
    console.log = function (message) {
        if (console.tools.status == "on") {
            console.log_org(console.tools.prepend + message);
        }
        return console;
    };
    console.using = "org";
}
console.toggle = function () {
    if (console.using == "org") {
        console.new();
    }
    else {
        console.org();
    }
}
console.debugOn=function(){
    console.debug=console.debug_org;
};
console.debugOff=function(){
    console.debug=console.debug_new;
};
console.new();

Date.prototype.getMonthName = function () {
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[this.getMonth()];
}

$(function () {
    $('[data-toggle="popover"]').popover()
})