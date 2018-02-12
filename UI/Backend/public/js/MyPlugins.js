/**
 * Created by paula on 3/24/2016.
 */
function RefreshMyPlugIns(init){

    RefreshSecretText();
    RefreshAjaxCalls();
    RefreshHoverChange();
    refreshImageInputs(init);
    initilizeTabToggle(init);
    refreshSlideShows(init);
    refreshSynSizes();
    RefreshImageLoaders();
    RefreshFancyText();
    RefreshPopupEditForms();
    RefreshFormValidations();
    RefreshParentClass();
    RefreshFancyUnderline();
    RereshFadeInBorders();
    RefreshDisplayWhenInViewPoint();
    refreshPressToHide();
    RefreshChatroom();
    RefreshFormatedTextbox();
}
function RefreshFormatedTextbox(){
    $("input[type='text'][pattern]").not(".format").data("value","").addClass("format").keyup(function(e){

        var format="^"+$(this).attr("pattern")+"$";
        var regex=new RegExp(format);
        if(!regex.test($(this).val())){
            $(this).parent().addClass("has-error").removeClass("has-success");
        }
        else{
            $(this).parent().addClass("has-success").removeClass("has-error");
        }

    });
}
function RefreshChatroom(){

    setInterval(function() {
        $(".chatroom-channels").chatChannels();
        $(".chatroom-my-channels").myChannels();
    },2000);

}
function RefreshChatrooms(){
    $(".chatroom-channel").addClass("tab-content").addMyChatrooms();
}
function RefreshAjaxCalls(){
    $(".ajax-call").removeClass("ajax-call").click(function(){
        var url=$(this).attr("src");
        var dropOnto=$(this).attr("drop-onto");
        dropOnto=$(dropOnto);
        dropOnto.attr("loading",url);
        $(dropOnto).html("<div class='text-center'> <h1><strong>Loading...</strong></h1></div>");
        var method='get';
        if(typeof $(this).attr("method")!="undefined"){
            method=$(this).attr("method");
        }
        if(method=="get") {
            $.get(url, {ajax: "true"}).done(function (data) {
                if (dropOnto.attr("loading") != url)
                    return;
                $(dropOnto).html(data);
                RefreshMyPlugIns();
            }).fail(function(data){
                if (dropOnto.attr("loading") != url)
                    return;

                $(dropOnto).html(data).addClass("panel panel-danger");
                RefreshMyPlugIns();
            });
        }
        else if(method=="post"){
            $.post(url, {ajax: "true"}).done(function (data) {
                if (dropOnto.attr("loading") != url)
                    return;
                $(dropOnto).replaceWith($(data));
                RefreshMyPlugIns();
            }).fail(function(data){
                if (dropOnto.attr("loading") != url)
                    return;

                $(dropOnto).replaceWith($(data)).addClass("panel panel-danger");
                RefreshMyPlugIns();

            });
        }
    });
}
function RefreshSecretText(){
    $(".secret-text").removeClass("secret-text").each(function(){
        $(this).data("secret-shown",$(this).text()).data("secret-hidden",$(this).text().replace(/./g,"*"));
        $(this).text($(this).data("secret-hidden"));


    }).css("cursor","pointer").hover(function(){
        $(this).text($(this).data("secret-shown"));
    }).mouseleave(function(){
        $(this).text($(this).data("secret-hidden"));
    });
}
function RefreshStickyPanels(){

    $(".sticky").removeClass("sticky").waypoint(function(direction) {
        //alert("dsd");
        var element=$(this.element);
        var width=element.width();
        var height=element.height();
        var left=element.offset().left;
        element.css("position","absolute").css("top",0).css("left",left).css("width",width).css("height",height);
    }, {
        offset: '100%'
    });
}
function RefreshDisplayWhenInViewPoint(){
    $('.move-to-the-left2-when-in-view').removeClass("move-to-the-left2-when-in-view").waypoint(function(direction) {
        //alert("dsd");
        $(this.element).addClass("move-to-the-left2");
    }, {
        offset: '100%'
    });
    $('.move-to-the-right2-when-in-view').waypoint(function(direction) {
        //alert("dsd");
        $(this.element).addClass("move-to-the-right2");
    }, {
        offset: '100%'
    });
    $('.move-to-the-bottom2-when-in-view').waypoint(function(direction) {
        //alert("dsd");
        $(this.element).addClass("move-to-the-bottom2");
    }, {
        offset: '100%'
    });
    $('.move-to-the-top2-when-in-view').waypoint(function(direction) {
        //alert("dsd");
        $(this.element).addClass("move-to-the-top2");
    }, {
        offset: '100%'
    });


    $('.move-to-the-left-when-in-view').removeClass("move-to-the-left-when-in-view").waypoint(function(direction) {
        //alert("dsd");
        $(this.element).addClass("move-to-the-left");
    }, {
        offset: '100%'
    });
    $('.move-to-the-right-when-in-view').waypoint(function(direction) {
        //alert("dsd");
        $(this.element).addClass("move-to-the-right");
    }, {
        offset: '100%'
    });
    $('.move-to-the-bottom-when-in-view').waypoint(function(direction) {
        //alert("dsd");
        $(this.element).addClass("move-to-the-bottom");
    }, {
        offset: '100%'
    });
    $('.move-to-the-top-when-in-view').waypoint(function(direction) {
        //alert("dsd");
        $(this.element).addClass("move-to-the-top");
    }, {
        offset: '100%'
    });
}
function RereshFadeInBorders(){
    var whiteBorders=$("div.border-fade-white").removeClass("border-fade-white");
    whiteBorders.each(function(){
        var thinkness=10;
        if(typeof $(this).attr("border-size") !="undefined"){
            thinkness=$(this).attr("border-size");
        }
        $("<div>").addClass("absolute z-index-50 full-width height10-percent top-left top-to-down-white").css("height",thinkness+"%").appendTo($(this));
        $("<div>").addClass("absolute z-index-50 width10-percent height100-percent top-left left-to-right-white").css("width",thinkness+"%").appendTo($(this));
        $("<div>").addClass("absolute z-index-50 width10-percent height100-percent top-right right-to-left-white").css("width",thinkness+"%").appendTo($(this));
        $("<div>").addClass("absolute z-index-50 full-width height10-percent bottom-left down-to-top-white").css("height",thinkness+"%").appendTo($(this));
    });



}
function RefreshFancyUnderline(){
    $("<div>").addClass("center-to-outer-black full-width gradient-border").css("opacity","0").css("transition","opacity 1s").attr("ignore-parent-class","").css("height","1px").appendTo(
        $("div.border-bottom-fancy-black-hover").hover(function(){
            $(this).children(".gradient-border").css("opacity","1");
        }).mouseleave(function(){
            $(this).children(".gradient-border").css("opacity","0");
        }).removeClass("border-bottom-fancy-black-hover"));

    $("<div>").addClass("center-to-outer-white full-width gradient-border").css("opacity","0").css("transition","opacity 1s").attr("ignore-parent-class","").css("height","1px").appendTo(
        $("div.border-bottom-fancy-white-hover").hover(function(){
            $(this).children(".gradient-border").css("opacity","1");
        }).mouseleave(function(){
            $(this).children(".gradient-border").css("opacity","0");
        }).removeClass("border-bottom-fancy-white-hover"));

    $("<div>").addClass("center-to-outer-gray  full-width gradient-border").css("opacity","0").css("transition","opacity 1s").attr("ignore-parent-class","").css("height","1px").appendTo(
        $("div.border-bottom-fancy-gray-hover").hover(function(){
            $(this).children(".gradient-border").css("opacity","1");
        }).mouseleave(function(){
            $(this).children(".gradient-border").css("opacity","0");
        }).removeClass("border-bottom-fancy-gray-hover"));

    $("<div>").addClass("center-to-outer-black full-width gradient-border").css("opacity","0").css("transition","opacity 1s").attr("ignore-parent-class","").css("height","1px").prependTo(
        $("div.border-top-fancy-black-hover").hover(function(){
            $(this).children(".gradient-border").css("opacity","1");
        }).mouseleave(function(){
            $(this).children(".gradient-border").css("opacity","0");
        }).removeClass("border-top-fancy-black-hover"));

    $("<div>").addClass("center-to-outer-white full-width gradient-border").css("opacity","0").css("transition","opacity 1s").attr("ignore-parent-class","").css("height","1px").prependTo(
        $("div.border-top-fancy-white-hover").hover(function(){
            $(this).children(".gradient-border").css("opacity","1");
        }).mouseleave(function(){
            $(this).children(".gradient-border").css("opacity","0");
        }).removeClass("border-top-fancy-white-hover"));

    $("<div>").addClass("center-to-outer-gray  full-width gradient-border").css("opacity","0").css("transition","opacity 1s").attr("ignore-parent-class","").css("height","1px").prependTo(
        $("div.border-top-fancy-gray-hover").hover(function(){
            $(this).children(".gradient-border").css("opacity","1");
        }).mouseleave(function(){
            $(this).children(".gradient-border").css("opacity","0");
        }).removeClass("border-top-fancy-gray-hover"));



    $("<div>").addClass("columns center-to-outer-black full-width gradient-border").attr("ignore-parent-class","").css("height","1px").appendTo($(".border-bottom-fancy-black").removeClass("border-bottom-fancy-black"));
    $("<div>").addClass("columns center-to-outer-gray full-width gradient-border").attr("ignore-parent-class","").css("height","1px").appendTo($(".border-bottom-fancy-gray").removeClass("border-bottom-fancy-gray"));
    $("<div>").addClass("columns center-to-outer-white full-width gradient-border").attr("ignore-parent-class","").css("height","1px").appendTo($(".border-bottom-fancy-white").removeClass("border-bottom-fancy-white"));
    $("<div>").addClass("columns center-to-outer-black full-width gradient-border").attr("ignore-parent-class","").css("height","1px").prependTo($(".border-top-fancy-black").removeClass("border-top-fancy-black"));
    $("<div>").addClass("columns center-to-outer-gray full-width gradient-border").attr("ignore-parent-class","").css("height","1px").prependTo($(".border-top-fancy-gray").removeClass("border-top-fancy-gray"));

    $("<div>").addClass("columns left-to-right-black full-width gradient-border").attr("ignore-parent-class","").css("height","1px").appendTo($(".border-bottom-fancy-to-right-black").removeClass("border-bottom-fancy-to-right-black"));
    $("<div>").addClass("columns left-to-right-gray full-width gradient-border").attr("ignore-parent-class","").css("height","1px").appendTo($(".border-bottom-fancy-to-right-gray").removeClass("border-bottom-fancy-to-right-gray"));
    $("<div>").addClass("columns left-to-right-white full-width gradient-border").attr("ignore-parent-class","").css("height","1px").appendTo($(".border-bottom-fancy-to-right-white").removeClass("border-bottom-fancy-to-right-white"));
    $("<div>").addClass("columns left-to-right-black full-width gradient-border").attr("ignore-parent-class","").css("height","1px").prependTo($(".border-top-fancy-to-right-black").removeClass("border-top-fancy-to-right-black"));
    $("<div>").addClass("columns left-to-right-gray full-width gradient-border").attr("ignore-parent-class","").css("height","1px").prependTo($(".border-top-fancy-to-right-gray").removeClass("border-top-fancy-to-right-gray"));
}
function RefreshParentClass(){
    $("div.animate-spread").each(function(){
        $(this).find("*").each(function(index){
            $(this).css("animation-delay",index*100+"ms");
        });
    });
    $("div[parent-class]").each(function(){
        var targetSelectors="*";
        if(typeof $(this).attr("target-selector") != "undefined")
        {
            targetSelectors=$(this).attr("target-selector");
        }
        $(this).addClass($(this).attr("parent-class"));
        $(this).find(targetSelectors).not("input, textarea, select, option, div[ignore-parent-class]").addClass($(this).attr("parent-class"));
    });
}
function RefreshFormValidations(){
    $("form.catch").find("input[type='submit']").css("transition","background 1s");

    $("form.catch").ajaxForm({beforeSubmit:function(arr,$form,options){
        if(typeof $form.attr("submited") != "undefined"){
            return false;
        }
        $form.find("input[type='submit']").val("Processing...");
        $form.attr("submited",true);
    },
        success:function(data,statusText,xhr,element){
            //alert(data);
            element.find("input[type='submit']").val("Thank You!").addClass("success");
        }});

}
function RefreshHoverChange(){
    var hoverChange=$(".hover-change");
    hoverChange.each(function(){

        hoverChange=$(this);
        var canvas=hoverChange.find(".hover-change-canvas").css("overflow-y","hidden").find(".hover-change-panel1, .hover-change-panel2").css("transition","transform 1s");
        hoverChange.mouseenter(function(){
            var canvas=$(this).find(".hover-change-canvas");
            var maxHeight=canvas.find(".hover-change-panel1").eq(0).height();
            canvas.find(".hover-change-panel1, .hover-change-panel2").css("transform","translate(0px,-"+maxHeight+"px)");


        }).mouseleave(function(){
            var canvas=$(this).find(".hover-change-canvas");
            canvas.find(".hover-change-panel1, .hover-change-panel2").css("transform","translate(0px,0px)");
        });
    })

}
function RefreshPopupEditForms(){
    $(".popup-edit-trigger").next(".popup-edit-container").css("display","none");
    $(".popup-edit-trigger").unbind("click");
    $(".popup-edit-trigger").click(function(){
        var popup=$("<div>").css("zIndex",9).addClass(" border-theme9  fixed center-middle  width75 background-theme1");
        var rowForContent=$("<div>").addClass("row ").css("height","70vh").css("overflow-y","scroll").appendTo(popup);
        var copyIfCancel=$(this).next(".popup-edit-container:first").clone(true, true);
        var copyIfSaved=$(this).next(".popup-edit-container:first").addClass("padding-20 padding-left-40").css("display","").appendTo(rowForContent);
        copyIfCancel.appendTo(rowForContent);


        var buttonRow=$("<div>").addClass("row").appendTo(popup);
        var editButton=$(this);
        $("<div>").addClass("column large-6 medium-6 small-6 button").text("Cancel").click(function(){
            copyIfCancel.insertAfter(editButton);
            popup.remove();
        }).appendTo(buttonRow);
        $("<div>").addClass("column large-6 medium-6 small-6 button").text("Save").click(function(){

            copyIfSaved.insertAfter(editButton).css("display","none");
            popup.remove();
            if(copyIfSaved.find(".popup-edit-submit").length!=0){
                copyIfSaved.find(".popup-edit-submit").trigger("about-to-submit");
                copyIfSaved.find(".popup-edit-submit").submit();
            }
            copyIfSaved.trigger("saved");

        }).appendTo(buttonRow);

        popup.appendTo("body");


    });
}
function BuildOptions(element){
    var re = /((\d*)=([^:;]*):([^:;]*))+/g;
    var str = element.attr("fancy-options");
    var m;

    var options=[];
    while ((m = re.exec(str)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        //alert(JSON.stringify(m));
        options.push({delay:parseInt(m[2]),attr:m[3],value:m[4]});
        // View your result using the m-variable.
        // eg m[0] etc.
    }
    return options;

}
function RefreshFancyText(){
    $(".fancy_text").each(function(){
        //BuildOptions($(this));
        var text=$(this).text();
        $(this).html("");
        for(var i=0;i<text.length;i++){
            var character=text.charAt(i);
            var characterElement=$("<div>").addClass("inline-block fancy_text_char").text(character).appendTo($(this));
            var delayIndex=0;
            //Math.abs(((text.length/2)-i));
            characterElement.css("transition","color 1s, font-size .5s, padding 1s, margin .5s, transform 1s, border 1s");
            characterElement.css("transition-delay",delayIndex*100+"ms");
        }


    });
    $(".fancy_text").mouseenter(function(){
        $(this).attr("hover","");
        var fancyText=$(this);
        var options=BuildOptions($(this));
        $(this).find(".fancy_text_char").css("color","pink").css("transform","scale(1.9,1.9)");
        var element=$(this).find(".fancy_text_char");
        element.each(function(index){
            var delayIndex=Math.abs(((element.length/2)-index));
            var thisElement=$(this);
            options.forEach(function(element_inoption, index, array){
                var option=element_inoption;
                setTimeout(function(){
                    if(typeof fancyText.attr("hover")=="undefined")
                        return;
                    thisElement.css(option.attr,option.value);
                },option.delay);
            })
//            setTimeout(function(){
//                //thisElement.css("color","purple");
//                //thisElement.css("transform","");
//             },200+(delayIndex*100));
//             setTimeout(function(){
//                thisElement.css("color","");
//                thisElement.css("transform","");
//             },500+(delayIndex*100));
        });

//        setTimeout(function(){
//            element.css("color","blue");
//        },1000);

    }).mouseleave(function(){
        $(this).removeAttr("hover");
        $(this).find(".fancy_text_char").css("transform","").css("color","").css("font-size","").css("margin-left","").css("margin-right","");
    });
}
function WaitForBackgroundImagesToLoad(){
    var element=$(this);
    setTimeout(function(){


        element.each(function(){

            if(typeof $(this).attr("load_until") == "undefined"){
                $(this).attr("load_until","original");
            }
            if(typeof $(this).attr("size_loaded") !="undefined"){
                if($(this).attr("size_loaded")=='xs'){
                    if($(this).attr("load_until")=='xs'){
                        return;
                    }
                    $(this).attr("size_loaded","s");
                    $(this).css("background-image","url('"+$(this).attr("original")+".s.jpg')")
                }
                else if($(this).attr("size_loaded")=='s'){
                    if($(this).attr("load_until")=='s'){
                        return;
                    }
                    $(this).attr("size_loaded","m");
                    $(this).css("background-image","url('"+$(this).attr("original")+".m.jpg')")
                }
                else if($(this).attr("size_loaded")=='m'){
                    if($(this).attr("load_until")=='m'){
                        return;
                    }
                    $(this).attr("size_loaded","original");
                    $(this).css("background-image","url('"+$(this).attr("original")+"')")
                }
                else if($(this).attr("size_loaded")=='original'){
                    if($(this).attr("load_until")=='original'){
                        return;
                    }
                    $(this).attr("size_loaded","l");
                    $(this).css("background-image","url('"+$(this).attr("original")+".l.jpg')")
                }
                else if($(this).attr("size_loaded")=='l'){
                    if($(this).attr("load_until")=='l'){
                        return;
                    }
                    $(this).attr("size_loaded","xl");
                    $(this).css("background-image","url('"+$(this).attr("original")+".xl.jpg')")
                }
                else if($(this).attr("size_loaded")=='xl'){
                    if($(this).attr("load_until")=='xl'){
                        return;
                    }

                }
            }
            else{
                $(this).attr("size_loaded","xs");
                $(this).css("background-image","url('"+$(this).attr("original")+".xs.jpg')")
            }
        });
        element.waitForImages(WaitForBackgroundImagesToLoad);
    },2000);
}
function RefreshImageLoaders(){

    $("div.load-slowly").each(function(){
        if(typeof $(this).attr("load_until") == "undefined"){
            $(this).attr("load_until","original");
        }
        if(typeof $(this).attr("size_loaded") =="undefined"){
            $(this).attr("size_loaded","xs");
            $("<img>").css("display","none").addClass("image_loader_helper").appendTo($(this)).attr("src",$(this).attr("original")+".xs.jpg");

        }
    }).promise().done(function(){
        //alert($(".image_loader_helper").length);
        $(".image_loader_helper").load(function(){


            $(this).parent(".load-slowly").each(function(){

                $(this).css("background-image","url('"+$(this).find(".image_loader_helper").attr("src")+"')");
                if(typeof $(this).attr("load_until") == "undefined"){
                    $(this).attr("load_until","original");
                }
                if(typeof $(this).attr("size_loaded") !="undefined"){
                    if($(this).attr("size_loaded")=='xs'){
                        if($(this).attr("load_until")=='xs'){
                            $(this).find(".image_loader_helper").remove();
                            return;
                        }
                        $(this).attr("size_loaded","s");
                        $(this).find(".image_loader_helper").attr("src",$(this).attr("original")+".s.jpg");
                    }
                    else if($(this).attr("size_loaded")=='s'){
                        if($(this).attr("load_until")=='s'){
                            $(this).find(".image_loader_helper").remove();
                            return;
                        }
                        $(this).attr("size_loaded","m");
                        $(this).find(".image_loader_helper").attr("src",$(this).attr("original")+".m.jpg");
                    }
                    else if($(this).attr("size_loaded")=='m'){
                        if($(this).attr("load_until")=='m'){
                            $(this).find(".image_loader_helper").remove();
                            return;
                        }
                        $(this).attr("size_loaded","original");
                        $(this).find(".image_loader_helper").attr("src",$(this).attr("original")+"");
                    }
                    else if($(this).attr("size_loaded")=='original'){
                        if($(this).attr("load_until")=='original'){
                            $(this).find(".image_loader_helper").remove();
                            return;
                        }
                        $(this).attr("size_loaded","l");
                        $(this).find(".image_loader_helper").attr("src",$(this).attr("original")+".l.jpg");
                    }
                    else if($(this).attr("size_loaded")=='l'){
                        if($(this).attr("load_until")=='l'){
                            $(this).find(".image_loader_helper").remove();
                            return;
                        }
                        $(this).attr("size_loaded","xl");
                        $(this).find(".image_loader_helper").attr("src",$(this).attr("xl")+".xl.jpg");
                    }
                    else if($(this).attr("size_loaded")=='xl'){
                        if($(this).attr("load_until")=='xl'){
                            $(this).find(".image_loader_helper").remove();
                            return;
                        }
                        $(this).find(".image_loader_helper").remove();

                    }
                }
                else{
                    $(this).attr("size_loaded","xs");
                    $(this).find(".image_loader_helper").attr("src",$(this).attr("original")+".xs.jpg");
                }
            });
        });
    });
    $("img.load-slowly").each(function(){
        if(typeof $(this).attr("load_until") == "undefined"){
            $(this).attr("load_until","original");
        }
        if(typeof $(this).attr("size_loaded") =="undefined"){
            $(this).attr("size_loaded","xs");
            $(this).attr("src",$(this).attr("original")+".xs.jpg");
        }
    });
    $("img.load-slowly").load(function(){

        if(typeof $(this).attr("load_until") == "undefined"){
            $(this).attr("load_until","original");
        }
        if(typeof $(this).attr("size_loaded") !="undefined"){
            if($(this).attr("size_loaded")=='xs'){
                if($(this).attr("load_until")=='xs'){
                    return;
                }

                $(this).attr("size_loaded","s");
                $(this).attr("src",$(this).attr("original")+".s.jpg");
            }
            else if($(this).attr("size_loaded")=='s'){
                if($(this).attr("load_until")=='s'){
                    return;
                }
                $(this).attr("size_loaded","m");
                $(this).attr("src",$(this).attr("original")+".m.jpg");
            }
            else if($(this).attr("size_loaded")=='m'){
                if($(this).attr("load_until")=='m'){
                    return;
                }
                $(this).attr("size_loaded","original");
                $(this).attr("src",$(this).attr("original")+"");
            }
            else if($(this).attr("size_loaded")=='original'){
                if($(this).attr("load_until")=='original'){
                    return;
                }
                $(this).attr("size_loaded","l");
                $(this).attr("src",$(this).attr("original")+".l.jpg");
            }
            else if($(this).attr("size_loaded")=='l'){
                if($(this).attr("load_until")=='l'){
                    return;
                }
                $(this).attr("size_loaded","xl");
                $(this).attr("src",$(this).attr("original")+".xl.jpg");
            }
            else if($(this).attr("size_loaded")=='xl'){
                if($(this).attr("load_until")=='xl'){
                    return;
                }

            }
        }
        else{
            $(this).attr("size_loaded","xs");
            $(this).attr("src",$(this).attr("original")+".xs.jpg");
        }
    });

}
function refreshPressToHide(){
    $(".click-toggle").removeClass("click-toggle").click(function() {
        var id=$(this).attr("target");
        var target=$("#"+id);
        if(target.attr("active")=="false"){
            target.css("display","");
            target.attr("active","true");
        }
        else{
            target.css("display","none").addClass("fade-in");
            target.attr("active","false");
        }
    }).each(function(){
            var id=$(this).attr("target");
            var target=$("#"+id);

            target.css("display","none").addClass("fade-in");
            target.attr("active","false");


        });

}
function refreshSynSizes(){
    $(".sync-height").each(function(){
        $(this).css("height",$(this).width());
    });
    $(".sync-width").each(function(){
        $(this).css("width",$(this).height());
    });

}
$(window).resize(function(){
    refreshSynSizes();
});
function refreshSlideShows(init){
    $(".slide-show").mouseenter(function(){
        if(typeof $(this).attr("can-pause")=="undefined"){
            return;
        }
        $(this).attr("paused","");
    }).mouseleave(function(){
        $(this).removeAttr("paused");
    });
    $(".slide-show").each(function(){

        //$(this).css("height",$(this).width());
        var slideShowContainer=$(this).addClass("relative");
        var slideShowContent=$(this).find(".slide-show-content").addClass(" full-screen");
        if(typeof $(this).attr("corners")=="undefined"){
            slideShowContent.addClass("round-border");
        }
        var maxHeight=0;
        var maxWidth=0;
//        slideShowContent.each(function(){
//           if(maxHeight<$(this).height()){
//               maxHeight=$(this).height();
//               slideShowContainer.css("height",maxHeight);
//           }
//        });
        slideShowContent.addClass("absolute top-left cover-page-info-hidden");
        $(this).find(".cover-page-info-hidden:first").removeClass("cover-page-info-hidden").addClass("cover-page-info-show");
        setInterval(function(){
            if(typeof slideShowContainer.attr("paused") !="undefined"){
                return;
            }
            var showingPage=slideShowContainer.find(".cover-page-info-show");
            var nextOne=showingPage.next(".cover-page-info-hidden");
            if(nextOne.length==0){
                nextOne=showingPage.parents(".slide-show:first").find(".slide-show-content:first");
            }
            showingPage.removeClass("cover-page-info-show").addClass("cover-page-info-hidden");
            nextOne.removeClass("cover-page-info-hidden").addClass("cover-page-info-show");
        },8000)
    });
}
function refreshImageInputs(init){
//    $(".image-input-multiple").each(function(index){
//       $(this).find("img").
//    });
    var multiImages=$(".image-input-multiple");
    multiImages.addClass("cursor-pointer").unbind("click").click(function(){
        var imagesListOfUrls=[];
        var images=$(this).find("img");
        for(var i=0;i<images.length;i++){
            imagesListOfUrls.push({url:images.eq(i).attr("src")});
        }
        var image=$(this);
        var imageFolder="uploads/";
        if(typeof image.attr("image-folder")!== "undefined"){
            imageFolder=image.attr("image-folder")+"/";
        }

        var imageSelection=new ImagePicker({
            multiple:true,
            done:function(data)
            {
                image.attr("src",data[0].url);
                image.val(data[0].url);
                image.find("img").remove();
                image.find("input").remove();
                for(var i=0;i<data.length;i++){
                    var newImage=$("<img>").addClass("full-screen").addClass("absolute top-left").attr("src",data[i].url).attr("name",image.attr("name")+"["+i+"][url]");
                    var newInput=$("<input>").attr("type","hidden").attr("value",data[i].url).attr("name",image.attr("name")+"["+i+"][url]");
                    newImage.css("left",i*5);
                    newImage.css("top",i*5);
                    newImage.appendTo(image);
                    newInput.appendTo(image);
                }



            },
            canceled:function(){},
            message:"Pick the images",
            folder:imageFolder,
            opened:function(){}});
        imageSelection.options.opened=function(){
            imageSelection.select(JSON.stringify(imagesListOfUrls));
        };
        imageSelection.open();


    });
    multiImages.each(function(index){
        $(this).addClass("relative");
        var image=$(this);
        $(this).find("input").remove();
        $(this).find("img").addClass("absolute top-left").each(function(index){
            $(this).css("left",index*5);
            $(this).css("top",index*5);
            $(this).addClass("full-screen").attr("name",image.attr("name")+"["+index+"][url]");
            var newInput=$("<input>").attr("type","hidden").attr("value",$(this).attr("src")).attr("name",image.attr("name")+"["+index+"][url]");
            newInput.insertAfter($(this));
        });


    });
    $(".image-input").each(function(index){
        var input=$(this).next("input");
        input.attr("name",$(this).attr("name"));
        input.val($(this).attr('src'));

    });
    $(".image-input").unbind("click");
    $(".image-input").click(function(){
        var image=$(this);
        var imageFolder="uploads/";
        if(typeof image.attr("image-folder")!== "undefined"){
            imageFolder=image.attr("image-folder")+"/";
        }

        var imageSelection=new ImagePicker({
            multiple:false,
            done:function(data)
            {
                image.attr("src",data[0].url);
                image.val(data[0].url);

                var input=image.next("input");
                input.attr("name",image.attr("name"));
                input.val(image.val());
            },
            canceled:function(){},
            message:"Pick the images",
            folder:imageFolder,
            opened:function(){}});

        imageSelection.open();

    });
}
function initilizeTabToggle(init){
    $(".has-tabs-toggle").each(function(index){
        if(init){
            $(this).find(".tabs-toggle-content").css("display","none").addClass("expand-vertical");
        }
        $(".has-tabs-toggle").find(".tabs-toggle-label").unbind("click").removeClass("cursor-pointer").addClass("cursor-pointer");
        $(".has-tabs-toggle").find(".tabs-toggle-label").click(function(){
//                alert("hector");
//                alert($(this).parents(".has-tabs:first").length);
            var element=$(this);

            var elementDisplaying=$(this).next(".tabs-toggle-content:first");
            $(this).parents(".has-tabs-toggle:first").find(".tabs-toggle-label").not(element).each(function(index){
                if($(this).removeClass("box-shadow").removeClass("background-theme2").next(".tabs-toggle-content:first").css("display")!='none'){
                    $(this).removeClass("box-shadow").removeClass("background-theme2").next(".tabs-toggle-content:first").animate({height:"0vh"},1000,"swing",function(){
                        $(this).css("display","none");
                    });
                }

                //$(this).removeClass("box-shadow").removeClass("background-theme2").next(".tabs-toggle-content:first").css("display","none");

            });


            if(elementDisplaying.css("display")=='none'){
                $(this).addClass("background-theme2");

                var scrollableThing=$(this).parents(".expand-vertical:first");
                if(scrollableThing.length==0)
                    scrollableThing=$("html,body");

                elementDisplaying.css("display","").addClass("box-shadow").addClass("border-bottom-theme9");
                elementDisplaying.css("height","70vh");
                var top=$(this).offset().top-scrollableThing.offset().top;
                elementDisplaying.css("height","0vh");
                elementDisplaying.animate({height:"70vh"},1000);



                scrollableThing.animate({scrollTop:top},500);
                //$("html,body").animate({scrollTop:$(this).offset().top},500);
            }
            else{
                elementDisplaying.animate({height:"0vh"},1000,function(){
                    $(this).css("display","none").removeClass("box-shadow");
                });

                $(this).removeClass("box-shadow").removeClass("background-theme2");
                var tabOpened=$(this).parents(".tabs-toggle-content:first").prev(".tabs-toggle-label");
                //alert(tabOpened.length);
                if(tabOpened.length!=0){
                    $("html, body").animate({scrollTop:tabOpened.offset().top},500);
                }
                else{
                    tabOpened=$(this).parents(".has-tabs-toggle:first");
                    if(tabOpened.length!=0){
                        $("html, body").animate({scrollTop:tabOpened.offset().top},500);
                    }
                }

            }
        });
    });
}
