import APIListener from "./APIListener.jsx";
import Rests from "../../libaries/Rest.jsx";

class SectionsAPI extends APIListener{


    constructor()
    {
        super();
        var $this=this;

        /*******************************************************************/
        this.addModule("get",function(module, data,done)
        {
            module.clearAllModules()
                  .get("/api/sections/"+data["id"]).execute(function(data){
                     done?done(data):true;
                   });

        }.bind(this));
        this.addModule("create-new-course",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/courses")
                .setModule("method","POST")
                .setModuleData("__action__","create-new-course")
                .setModuleData(data)
                .setModuleData("_",function(){
                    return $.now();
                }).execute(function(data){
                CoursesAPI.instance.initiate("get");
                done?done(data):true
            });


        }.bind(this));
        this.addModule("add-users-in-section",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/sections")
                .setModule("method","POST")
                .setModuleData("__action__","add-user-by-userid")
                .setModuleData(data)
                .setModuleData("_",function(){
                    return $.now();
                }).execute(function(data2){
                SectionsAPI.instance.initiate("get",{id:data["SectionID"]});
                done?done(data2):true
            });


        }.bind(this));
        this.addModule("add-uhids-in-section",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/sections")
                .setModule("method","POST")
                .setModuleData("__action__","add-user-by-uhid")
                .setModuleData(data)
                .setModuleData("_",function(){
                    return $.now();
                }).execute(function(data2){
                SectionsAPI.instance.initiate("get",{id:data["SectionID"]});
                done?done(data2):true
            });


        }.bind(this));

        this.addModule("update",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/sections")
                .setModule("method","POST")
                .setModuleData("__action__","update")
                .setModuleData(data)
                .setModuleData("_",function(){
                    return $.now();
                }).execute(function(data2){
                SectionsAPI.instance.initiate("get",{id:data["SectionID"]});
                done?done(data2):true
            });


        }.bind(this));

    }



}
SectionsAPI.instance=new SectionsAPI();

export default SectionsAPI;