import $ from 'jquery';
import {EventHandler,MyEvent} from '../EventHandler.jsx';
import GenericAPI from '../GenericAPI.jsx';


/**
 * @class APIHook
 */
export class APIHook{



    _isLive;

    /**
     * @param int
     */
    id;

    /**
     * @param APIListener
     */
    listener;

    /**
     * @constructor
     * @param listener APIListener
     */
    constructor(listener,id){
        this.id=""+id;
        this.listener=listener;
        this._isLive=true;
    }

    /**
     *
     * @returns {int}
     */
    getID(){
        return this.id;
    }

    /**
     *
     * @returns {APIListener}
     */
    getListener(){
        return this.listener;
    }

    /**
     *
     * @returns {boolean}
     */
    isLive(){
        return this._isLive;
    }
    remove(){
        this.getListener().EventHandler().unbindAll(this.getID());
        this.close();
    }
    close(){
        this._isLive=false;
    }
    open(){
        this._isLive=true;
    }
    trigger(eventName, data){

    }
    on(){
        let actualCallback;
        let $this = this;
        switch(arguments.length) {
            case 0:
                throw new Error("Expecting at least 2 arguments, recieved 0");
            case 1:
                throw new Error("Expecting at least 2 arguments, recieved 1");
            case 2:

                actualCallback = arguments[arguments.length - 1];

                /***********************************************************/
                if (typeof actualCallback != "function") {
                    throw new Error("Expecting last argument to be a function, function was not found");
                }

                /***********************************************************/
                arguments[arguments.length - 1] = function (e)
                {
                    if (!$this.isLive()) {
                        return;
                    }
                    actualCallback(e); //.data
                };

                /************************************************************/
                /* Build better argument list                               */
                /************************************************************/

                var newArguments = [];
                newArguments.push(this.getID());//Set a Sub Event allowing us to unbind this one specific hook later
                for (let index in arguments) {
                    newArguments.push(arguments[index]);

                    //We just want to parameters so exit if it reaches that
                    if (newArguments.length == arguments.length) {
                        break
                    }
                }
                newArguments.push("updated");//What is triggered when the data is finished
                newArguments.push(arguments[arguments.length - 1]);

                /***********************************************************/
                this.getListener().on.apply(this.getListener(), newArguments);
                break;
            default:
                actualCallback = arguments[arguments.length - 1];

                /***********************************************************/
                if (typeof actualCallback != "function") {
                    throw new Error("Expecting last argument to be a function, function was not found");
                }

                /***********************************************************/
                arguments[arguments.length - 1] = function (e) {
                    if (!$this.isLive()) {
                        return;
                    }
                    actualCallback(e); //.data
                };

                /************************************************************/
                /* Build better argument list                               */
                /************************************************************/
                var newArguments = [];
                newArguments.push(this.getID());//Set a Sub Event allowing us to unbind this one specific hook later
                for (let index in arguments) {
                    newArguments.push(arguments[index]);

                    //We just want to parameters so exit if it reaches that
                    if (newArguments.length == arguments.length) {
                        break
                    }
                }
                newArguments.push(arguments[arguments.length - 1]);
                this.getListener().on.apply(this.getListener(), newArguments);
        }
        return this;
    }

    /**
     * @param  listener APIListener
     * @param  nameOfCaller string
     * @returns {APIHook}
     */
    static create(listener, nameOfCaller){
        if(typeof nameOfCaller == 'undefined'){
            nameOfCaller=(APIHook.latestHookID++);
        }
        if(typeof APIHook.CurrentHooks[nameOfCaller] =="undefined"){
            let hook= new APIHook(listener,nameOfCaller);
            APIHook.CurrentHooks[nameOfCaller]=hook;
            return hook;
        }
        return APIHook.CurrentHooks[nameOfCaller];
    }

}
APIHook.latestHookID=1;
APIHook.CurrentHooks={};


class APIListener extends GenericAPI
{
    modules;




    constructor()
    {
        super();
        this.modules={};
        //console.debug("MAIN CLASS: "+this.constructor.name);

    }
    EventHandler(){
        if(APIListener.eventHandlers[this.constructor.name]){
            return APIListener.eventHandlers[this.constructor.name];
        }
        APIListener.eventHandlers[this.constructor.name]=new EventHandler();
        return APIListener.eventHandlers[this.constructor.name];
    }



    AjaxCall(data, callback){

        //Here is where you can use what ever you want
        $.ajax(data).done(callback);
    }
    /**
     * On the event given your callback will be called
     * @return APIListener
     */
    on(){
        switch(arguments.length){
            case 0:
                throw new Error("Expecting at least 2 arguments, recieved 0");
            case 1:
                throw new Error("Expecting at least 2 arguments, recieved 1");
            default:
                EventHandler.prototype.on.apply(this.EventHandler(),arguments);
        }
        return this;
    }
    copy(){
        const newThing=new APIListener();
        newThing._ApiRepos=this._ApiRepos;
        newThing._modules=this._modules;
        return newThing;
    }

    /**
     * Will have the api event be started evert {miliseconds} of time with the given data
     * @param name string
     * @param milliseconds int
     * @param data function|object
     */
    setConstantUpdate(name,milliseconds,data){
        if(typeof data=="function"){
            data=data();
        }
        else if(typeof data!="object"){
            throw new Error("Expecting either a function or data for constant update");
        }

        /*******************************************************************/
        let $this=this;
        let triggerFunction;
        triggerFunction=function(){
            $this.initiate(name,data);
            setTimeout(function(){
                triggerFunction();
            },milliseconds);
        };
        triggerFunction();

    }

    /**
     * Adds a api call. The name can be anything, so... example add-assessment
     * @param name string
     * @param callback function
     */
    addModule(name, callback)
    {
        /*******************************************************************/
        if(typeof callback != "function"){
            throw new Error("Expecting a function in addModule");
        }

        /*******************************************************************/
        let $this=this;
        this.EventHandler().on(name, "start",function(e)
        {
            const $e=new MyEvent({continue:true});
            this.EventHandler().triggerAllRoots(name,"beforeSend",$e);
            if($e.continue==false){
                return;
            }

            let Errors=[];
            $this.catchErrors(function(error){
                Errors.push(error);
            });

            this.EventHandler().triggerAllRoots(name,"start",$e);

            callback($this,e.data,function(data){ //.data
                const $e=new MyEvent({data:data});

                this.EventHandler().triggerAllRoots(name,"finished",$e);
                if(Errors.length!=0)
                {
                    $e.message=Errors.join(',');
                    this.EventHandler().triggerAllRoots(name,"failed",$e)
                }
                else
                {
                    this.EventHandler().triggerAllRoots(name,"updated",$e);
                }



            }.bind(this));

            if(typeof e.___GET_API___ != 'undefined'){
                 e.___GET_API___=$this.copy();
            }
        }.bind(this));
    }
    generate(eventName, data)
    {
        data=new MyEvent({data:data,___GET_API___:false});
        this.skipExecute(true);
        this.EventHandler().triggerAllRoots(eventName,"start",data);

        if(!data.___GET_API___){
            throw new Error('API Module '+eventName+' failed to provide its api');
        }
        this.skipExecute(false);
        return data.___GET_API___.getAjaxInfo();

    }
    initiate(eventName, data,callback)
    {
        if(callback){
            let hook=this.hook();
            hook.on(eventName,function(data){
                callback(data);
                hook.remove();
            });
            this.EventHandler().trigger(eventName,"start",{data:data?data:{}});
            return;
        }
        this.EventHandler().trigger(eventName,"start",{data:data?data:{}});
    }
    quick(moduleName,data,callback){
        this.hook().on(moduleName,callback);
        this.initiate(moduleName,data);
    }
    /**
     * This is the routine that is called to get an instance of the abilities of the listener
     * @returns {APIHook}
     */
    hook()
    {
        return APIHook.create(this); // Will auto generate one
    }
}

APIListener.eventHandlers={}; //new EventHandler();
export default APIListener;