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

        this.addModule("get-course-content",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/" + data["id"])
                .setModule('method','GET')
                .execute(function(data){
                    done(data);
                });

        }.bind(this));
        this.addModule("update-course-content",function(module, data2,done)
        {
            let data=$.extend({},data2);
            if(typeof data["Properties"]=='object'){
                data["Properties"]=JSON.stringify(data["Properties"]);
            }
            else if(data["Properties"]=="string")
            {}
            else{
                data["Properties"]="{}";
            }

            let {id,...rest}=data;
            module.clearAllModules()
                .setModule("url","/api/course-contents/" + data["id"])
                .setModule('method','POST')
                .setModuleData('__action__',"update-course-content")
                .setModuleData(rest)
                .execute(function(data){
                    done(data);
                });

        }.bind(this));

        this.addModule("create-course-content",function(module, data2,done)
        {
            let data=$.extend({},data2);
            if(typeof data["Properties"]=='object'){
                data["Properties"]=JSON.stringify(data["Properties"]);
            }
            else if(data["Properties"]=="string")
            {}
            else{
                data["Properties"]="{}";
            }

            let {id,...rest}=data;
            module.clearAllModules()
                .setModule("url","/api/course-contents/" + data["id"])
                .setModule('method','POST')
                .setModuleData('__action__',"create-new-content")
                .setModuleData(rest)
                .execute(function(data2){
                    if(data2.Depth<=1){
                        SectionsAPI.instance.initiate("get",{id:data2.SectionID});
                    }
                    else{
                        CourseContentAPI.instance.initiate("get-course-content",data)
                    }
                    done(data2);
                });

        }.bind(this));



        this.addModule("get-course-content-with-assessment",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents")
                .setModule('method','GET')
                .setModuleData(data)
                .setModuleData('__fetcher__',"by-assessment")
                .execute(function(data){
                    done(data);
                });

        }.bind(this));
        this.addModule("get-course-content-with-running-assessment",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents")
                .setModule('method','GET')
                .setModuleData(data)
                .setModuleData('__fetcher__',"by-running-assessment")
                .execute(function(data){
                    done(data);
                });

        }.bind(this));

        this.addModule("save-root-as-template",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/" + data["id"])
                .setModule('method','POST')
                .setModuleData(data)
                .setModuleData('__action__',"save-root-as-template")
                .execute(function(data){
                    done(data);
                });

        }.bind(this));

        this.addModule("delete-course-content",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/" + data["id"])
                .setModule('method','POST')
                .setModuleData(data)
                .setModuleData('__action__',"delete-course-content")
                .execute(function(data){
                    done(data);
                });

        }.bind(this));


    }



}
CourseContentAPI.instance=new CourseContentAPI();

export default CourseContentAPI;