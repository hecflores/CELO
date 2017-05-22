 

/***************************************************************************/
/* *IMPORTANT*                                                             */
/* This code should not be changed. Only in the comments *CUSTOM* Should  */
/* you change code                                                         */
/***************************************************************************/
$.extend(QuestionWidget.prototype, {

    /***********************************************************************/
    /* Functions part of QuestionWidget                                    */
    /*                                                                     */
    /* nextQuestion()                                                      */
    /* startTimer()                                                        */
    /* stopTimer()                                                         */
    /* initializeTimer(someObject for info)                                */
    /* setAnswer(anwer Choicen)                                               */
    /***********************************************************************/

    /***********************************************************************/
    /* Will be called in the beginning for any setup of the parameters      */
    /* $props will be the object that will given to your deployment side   */
    /***********************************************************************/
    setup: function($props){
        // *CUSTOM*
        var $this=this;
        var $cleanedData=$props;

        $cleanedData["answers"]=(typeof $props["answers"] == "undefined")?[]:$props["answers"];

        return $cleanedData;//This is used in render


    },

    render:function($_containerElement){
        var $this=this;
        //*CUSTOM*

        /*******************************************************************/
        var html="<div class='col-lg-12'>"+
        "      <h1 class='question'>"+$this.$_cleanedData.question+"</h1>"+
        "      <div class='questions'></div>"+
        "</div>";
        var container=$(html);

        /*******************************************************************/
        /* Get Important Components for later use                          */
        /*******************************************************************/
        var questionsContainer=container.find(".questions");

        var createQuestionComponent=function(item){
            var ItemComponent=$(
                "<div style='margin:5px' class='questionItem'>"+
                "       <span style='margin-right:5px;display:inline-block' class='btn btn-default answerChoice'><span class='prefix'></span></span>"+
                "       <span style='display:inline-block'><span class='questionConent'>"+item+"</span></span> "+
                "</div>");
            ItemComponent.data("itemQuestion",item);

            //Allow the delete of a question
            ItemComponent.find('.answerChoice').click(function(){
                container.find(".answerChoice[my-choice]")
                    .removeClass("btn-success")
                    .addClass("btn-default")
                    .removeAttr("my-choice");
                $(this)
                    .removeClass("btn-default")
                    .addClass("btn-success")
                    .attr("my-choice",true);

                $this.setAnswer($(this).parents(".questionItem:first").data("itemQuestion"));
            });
            questionsContainer.append(ItemComponent);
            if(item==$this._managed_data["answer"]){
                ItemComponent.find('.answerChoice')
                    .removeClass("btn-default")
                    .addClass("btn-success")
                    .attr("my-choice",true);
            }
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
        });



        /*******************************************************************/
        container.appendTo($_containerElement);

        container.find('pre code').each(function(i,block){
            
            hljs.highlightBlock(block);
            
        });

    },

    beforeAnswering:function(answerInfo){
        //*CUSTOM*
    },

    afterAnswering:function(answerResponse){
      //answerResponse.correct   =   boolean
      //answerResponse.hints     =   object
        //*CUSTOM*
    }

});