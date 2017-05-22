 

/***************************************************************************/
/* *IMPORTANT*                                                             */
/* This code should not be changed. Only in the comments *CUSTOM* Should  */
/* you change code                                                         */
/***************************************************************************/
$.extend(QuestionWidget.prototype, {

    /***********************************************************************/
    /* Functions part of QuestionWidget                                    */
    /*                                                                     */
    /* this.$_cleanedData                                                  */
    /* setAnswer(answer,callback)                                          */
    /***********************************************************************/


    /**
     *
     * @param input string
     * @param results
     *    @type { parameters:{},answer:"" }
     * @return boolean
     */
    ParseInput:function(input, results)
    {
        var afterSplit=input.split("\t");

        return (afterSplit.length<3)?false:(function(){
            return (afterSplit[0]!="MC")?false:(function(){
                return (afterSplit.length%2==0)?false:(function(){

                    /******************************************************/
                    /* Check to make sure there is correct and incorrect  */
                    /******************************************************/
                    var isTrue=false;
                    for(var i=3;i<afterSplit.length;i+=2)
                    {
                        if(!/^(incorrect|correct)$/i.test(afterSplit[i])){
                            return false;
                        }
                        afterSplit[i]=/^(correct)$/i.test(afterSplit[i]);
                        if(afterSplit[i] && isTrue){
                            return false;
                        }
                        isTrue=afterSplit[i];
                    }

                    /******************************************************/
                    /* We made, now we will do the extraction             */
                    /******************************************************/
                    return (function(){
                        var question=afterSplit[1];

                        /**************************************************/
                        var answers=[];
                        for(var i=2;i<afterSplit.length;i+=2){
                           answers.push(afterSplit[i]);
                           if(afterSplit[i+1]){
                               results.answer=afterSplit[i];
                           }
                        }

                        /**************************************************/
                        results.parameters={
                            question:question,
                            answers:answers
                        };


                    }.bind(this)());
                 }.bind(this)());
            }.bind(this)());
        }.bind(this)());


    },
    /***********************************************************************/
    /* Will be called in the beginning for any setup of the parameters      */
    /* $props will be the object that will given to your deployment side   */
    /***********************************************************************/
    setup:function($props){
        var $this=this;
        var $cleanedData=$props;
        // *CUSTOM*
        if(Array.isArray($cleanedData)){
            $cleanedData={}; 
        }
        $cleanedData["answers"]=(typeof $props["answers"] == "undefined")?['test']:$props["answers"];
        return $cleanedData;//This is used in render
    },

    render:function($_containerElement){
        var $this=this;
        //*CUSTOM*

        /*******************************************************************/
        var html="<div class='col-lg-12'>"+
                 "      <div class='col-lg-12'>"+
                 "           <h1>Question:</h1>"+
                 "           <textarea  class='form-control questionText' >"+ $this.$_cleanedData.question+"</textarea>"+
                 "           <h1>Add Questions <span class='btn btn-primary addBtn'>Add</span></h1>"+
                 "           <input type='text' class='form-control addQuestionText'>"+
                 "      </div>"+
                 "      <div class='questions'></div>"+
                 "</div>";
        var container=$(html);

        /*******************************************************************/
        /* Get Important Components for later use                          */
        /*******************************************************************/
        var addBtn=container.find(".addBtn");
        var inputText=container.find(".addQuestionText");
        var questionsContainer=container.find(".questions");
        container.find(".questionText").keyup(function(){
            $this.$_cleanedData.question=$(this).val();
        });
        var createQuestionComponent=function(item){
            var ItemComponent=$(
                "<div style='margin:5px' class='questionItem'>"+
                "       <span class='btn btn-danger btnDeleteAnswer'><span class='glyphicon glyphicon-remove'></span></span>"+
                "       <span style='margin-right:5px' class='setAsAnswerBtn btn btn-default'><span class='prefix'></span></span>"+
                "       <span style='cursor:pointer' class='questionContent'>"+item+"</span> "+
                "</div>");
            //Put the item in the element so we dont loose it
            ItemComponent.data("itemQuestion",item);
            if($this.getAnswer()==item){
                ItemComponent.find(".setAsAnswerBtn").removeClass("btn-default")
                    .addClass("btn-success")
                    .attr("set",true);
            }
            ItemComponent.find(".setAsAnswerBtn").click(function(){
                var $parent=$(this).parents(".questions:first");
                $parent.find(".setAsAnswerBtn[set]")
                    .removeClass("btn-success")
                    .addClass("btn-default")
                    .removeAttr("set");

                $(this)
                    .removeClass("btn-default")
                    .addClass("btn-success")
                    .attr("set",true);

                $this.setAnswer($(this).parents(".questionItem:first").data("itemQuestion"));
            });

            //Allow the delete of a question
            ItemComponent.find(".btnDeleteAnswer").click(function(){
                var indexOfItem=$this.$_cleanedData.answers.indexOf($(this).data("itemQuestion"));
                if(indexOfItem==-1){
                    //Error...Later add the MessageBox thing I made for work
                }
                $this.$_cleanedData.answers.splice(indexOfItem,1);

                $(this).parents(".questionItem:first").remove();
            });
            questionsContainer.append(ItemComponent);
            updateLettering();
            return ItemComponent;
        };

        /*******************************************************************/
        var updateLettering=function(){
             var letters=['A','B','C','D','E','F','G','H'];
             maxWidth=0;
             container.find('.questionItem').each(function(index){
                  $(this).find(".prefix").html("<b>"+letters[index%letters.length]+"</b>")
                  maxWidth=Math.max(maxWidth,$(this).outerWidth(true));
             });
             container.find('.questionItem').each(function(index){
             });
        };

        /*******************************************************************/
        /* Populate current questions                                      */
        /*******************************************************************/
        $this.$_cleanedData.answers.forEach(function(item){
            var ItemComponent=createQuestionComponent(item);

            questionsContainer.append(ItemComponent);
        });
        

        $_containerElement.on("click",".questionContent",function(){
            var input=$("<input>");
            var element=$(this);
            var oldText=element.html();
            var indexReplacing=$this.$_cleanedData.answers.indexOf(oldText);
            input.val(oldText);
            element.replaceWith(input); 
            input.focus();
            input.blur(function(){
                $this.$_cleanedData.answers[indexReplacing]=input.val();
                element.html(input.val());
                input.replaceWith(element);
            });
            input.enterkey(function(){
                $this.$_cleanedData.answers[indexReplacing]=input.val();
                element.html(input.val());
                input.replaceWith(element);
            });
            
        });
        /*******************************************************************/
        /* Add Functionality to add button                                 */
        /*******************************************************************/
        addBtn.click(function(){
            var $text=container.find(".addQuestionText").val();
            var ItemComponent=createQuestionComponent($text);
            $this.$_cleanedData.answers.push($text);
            questionsContainer.append(ItemComponent);
        });
        
        /*******************************************************************/
        container.appendTo($_containerElement);
        
       container.find('pre code').each(function(i,block){
            
            hljs.highlightBlock(block);
        });


    },

    beforeSubmitingChanges:function($_paramers){
        var $this=this;
        //*CUSTOM*

        alert(JSON.stringify($_paramers))
    },

    afterSubmitingChanges:function(response){
        var $this=this;
        //*CUSTOM*

        if(!response.success){
            alert("Error Happend");
        }
        alert(JSON.stringify(response))
    }

});