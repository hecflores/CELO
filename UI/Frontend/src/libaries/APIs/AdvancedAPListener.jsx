import APIListener from './APIListener.jsx';


class AdvancedAPListener extends APIListener
{
    constructor() {
        super();
    }

    /**
     * Adds API Action
     * @param actionName string
     */
    addAction(actionName)
    {
        this.addModule(actionName,function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/" + data["id"])
                .setModule('method','POST')
                .setModuleData("__action__",actionName)
                .setModuleData(data)
                .execute(function(data){
                    done(data);
                });

        }.bind(this));
    }

    /**
     * Adds API Fetcher
     * @param actionName string
     */
    addFetcher(actionName)
    {
        this.addModule(actionName,function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url","/api/course-contents/" + data["id"])
                .setModule('method','GET')
                .setModuleData("__fetcher__",actionName)
                .setModuleData(data)
                .execute(function(data){
                    done(data);
                });

        }.bind(this));
    }
}

export default AdvancedAPListener