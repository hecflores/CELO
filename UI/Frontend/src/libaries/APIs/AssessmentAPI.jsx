import APIListener from "./APIListener.jsx";
import AdvancedAPListener from "./AdvancedAPListener.jsx";
import CourseContentAPI from "./CourseContentAPI.jsx";
import $ from 'jquery';
class AssessmentAPI extends AdvancedAPListener{


    constructor()
    {
        super();

        this.addModule("start-assessment",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url", "/api/questions/answerable/" + data.id)
                .setModule("method", "POST")
                .setModuleData("__action__", "start-assessment") //THE MAIN PIECE
                .setModuleData("AssessmentID", data.id)
                .setModuleData("_", function () {
                    return $.now();
                }).execute(function (data) {
                    done(data);
                    CourseContentAPI.instance.initiate("get-course-content-with-running-assessment",{AnsweringGroupID:data.AnsweringGroupID});
                });
        }.bind(this));
        this.addModule("get-assessments",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url", "/api/questions/answering")
                .setModule("method", "GET")
                .setModuleData("_", function () {
                    return $.now();
                }).execute(function (data) {
                done(data);

            });
        }.bind(this));

    }

}
AssessmentAPI.instance=new AssessmentAPI();

export default AssessmentAPI;