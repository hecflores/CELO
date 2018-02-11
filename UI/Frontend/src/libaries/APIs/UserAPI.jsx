import APIListener from "./APIListener.jsx";
import Rests from "../../libaries/Rest.jsx";

class UserAPI extends APIListener{


    constructor()
    {
        super();
        var $this=this;

        /*******************************************************************/
        this.addModule("find-user",function(module, data,done)
        {
            module.clearAllModules()
                  .setModule("url","/api/users")
                  .setModule('method','post')
                  .setModuleData("__action__","find-user")
                  .setModuleData(data)
                  .execute(function(data){
                      done(data);
                  });

        }.bind(this));
        this.addModule("login",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/users")
                .setModule('method','post')
                .setModuleData("__action__","login")
                .setModuleData(data)
                .execute(function(data){
                    done(data);
                });

        }.bind(this));
        this.addModule("logout",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/users")
                .setModule('method','post')
                .setModuleData("__action__","logout")
                .setModuleData(data)
                .execute(function(data){
                    done(data);
                });

        }.bind(this));
        this.addModule("register",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/users")
                .setModule('method','post')
                .setModuleData("__action__","register")
                .setModuleData(data)
                .execute(function(data){
                    window.location="/portal";
                    done(data);
                });

        }.bind(this));
        /*******************************************************************/
        this.addModule("get-user-profile",function(module, data,done){
            module.clearAllModules()
                .setModule("url","/api/users")
                .setModule('method','GET')
                .setModuleData("__fetcher__","get-user-profile")
                .setModuleData(data)
                .execute(function(data){
                    done(data);
                });


        });
    }

    hookToUser(callback)
    {
        this.hook().on("get-user-profile",callback);
        this.initiate("get-user-profile");
    }
    login(username, password,callback){
        this.quick("log-in",{username:username,password:password},callback);
    }
    logout(){
        this.quick("log-out",{},function(){});
    }

}
UserAPI.instance=new UserAPI();

export default UserAPI;