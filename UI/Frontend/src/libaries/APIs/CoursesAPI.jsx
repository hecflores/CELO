import APIListener from "./APIListener.jsx";

class CoursesAPI extends APIListener{


    constructor()
    {
        super();
        var $this=this;

        /*******************************************************************/
        this.addModule("get",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/courses")
                .setModule('method','get')
                .setModuleData("__fetcher__","default")
                .execute(function(data){
                    done(data);
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
        this.addModule("add-section",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/courses")
                .setModule("method","POST")
                .setModuleData("__action__","add-section")
                .setModuleData(data)
                .setModuleData("_",function(){
                    return $.now();
                }).execute(function(data){
                CoursesAPI.instance.initiate("get");
                done?done(data):true
            });


        }.bind(this));

    }

}
CoursesAPI.instance=new CoursesAPI();
export default CoursesAPI;