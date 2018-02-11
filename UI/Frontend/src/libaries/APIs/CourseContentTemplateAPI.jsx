import AdvancedAPListener from "./AdvancedAPListener.jsx";
import Rests from "../../libaries/Rest.jsx";
import SectionsAPI from '../APIs/SectionsAPI.jsx';
class CourseContentAPI extends AdvancedAPListener{


    constructor()
    {
        super();
        var $this=this;

        /*******************************************************************/
        this.addModule("get",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/" + id)
                .setModule('method','GET')
                .setModuleData("username",data.username)
                .execute(function(data){
                    done(data);
                });

        }.bind(this));

        this.addModule("get-my-templates",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/templates")
                .setModule('method','GET')
                .setModuleData("__fetcher__","get-mine")
                .execute(function(data){
                    done({Templates:data});
                });

        }.bind(this));

        this.addModule("get-templates",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/templates")
                .setModule('method','GET')
                .execute(function(data){
                    done({Templates:data});
                });

        }.bind(this));

        this.addModule("save-as-template",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/templates")
                .setModule('method','POST')
                .setModuleData("__action__","create-new-content-template")
                .setModuleData(data)
                .execute(function(data){
                    done(data);
                });

        }.bind(this));


    }



}
CourseContentAPI.instance=new CourseContentAPI();

export default CourseContentAPI;