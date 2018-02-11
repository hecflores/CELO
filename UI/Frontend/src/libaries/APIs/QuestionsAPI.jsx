import APIListener from "./APIListener.jsx";
import CourseContentAPI from './CourseContentAPI.jsx';
class QuestionsAPI extends APIListener{


    constructor()
    {
        super();
        var $this=this;

        /*******************************************************************/
        this.addModule("get-answerable-questions",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/questions/answerable")
                .setModule('method','get')
                .setModuleData("__fetcher__","default")
                .execute(function(data){
                    done(data);
                });

        }.bind(this));

        this.addModule("get-answerable-question",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/questions/answerable/"+data.id)
                .setModule('method','get')
                .setModuleData("__fetcher__","default")
                .execute(function(data){
                    done(data);
                });

        }.bind(this));

        this.addModule("answer-question",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/questions/answerable/"+data.AnswerableID)
                .setModule('method','POST')
                .setModuleData(data)
                .setModuleData("__action__","answer-question")
                .execute(function(data2){

                    QuestionsAPI.instance.initiate("get-answerable-question",{id:data.AnswerableID});
                    done(data2);

                });

        }.bind(this));
        /*******************************************************************/
        this.addModule("get-all-questions",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/questions")
                .execute(function(data){
                    done({Questions:data});
                });

        }.bind(this));

        /*******************************************************************/
        this.addModule("get-question-pools",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/questions/pools")
                .setModuleData(data)
                .execute(function(data){
                    done({Questions:data});
                });

        }.bind(this));

        this.addModule("add-question-pools",function(module, data,done)
        {
            module.clearAllModules()
                .setModule('method','POST')
                .setModuleData(data)
                .setModuleData("__action__","create-question-pool")
                .execute(function(data){
                    done({Questions:data});
                });

        }.bind(this));

        this.addModule("add-question-to-pools",function(module, data,done)
        {
            module.clearAllModules()
                .setModule('method','POST')
                .setModuleData(data)
                .setModuleData("__action__","add-question")
                .execute(function(data){
                    done({Questions:data});
                });

        }.bind(this));



    }

}
QuestionsAPI.instance=new QuestionsAPI();
export default QuestionsAPI;