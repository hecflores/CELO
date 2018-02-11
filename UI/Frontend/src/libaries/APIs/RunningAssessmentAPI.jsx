import APIListener from "./APIListener.jsx";
import AdvancedAPListener from "./AdvancedAPListener.jsx";
import $ from 'jquery';
import CourseContentAPI from './CourseContentAPI.jsx';
class RunningAssessmentAPI extends AdvancedAPListener{

    static instance=new RunningAssessmentAPI();

    constructor()
    {
        super();

        this.addModule("get-running-assessment",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url", "/api/running-assessments/" + data.id)
                .setModule("method", "GET")
                .setModuleData("_", function () {
                    return $.now();
                }).execute(function (data) {
                    done(data);
                });
        }.bind(this));
        this.addModule("submit-assessment",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url", "/api/questions/answering/" + data.id)
                .setModule("method", "POST")
                .setModuleData("AnsweredID",data.id)
                .setModuleData("__action__", "submit-assessment") //THE MAIN PIECE
                .setModuleData("_", function () {
                    return $.now();
                }).execute(function (data2) {
                done(data2);

            });
        }.bind(this));
    }
}

export default RunningAssessmentAPI;