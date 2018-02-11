import $ from "jquery";
/**
 * Created by Hector on 2/27/2017.
 * I made awhile back for js, converted for React use
 */
export class MyEvent{
    constructor(data){
        $.extend(this, data);
    }
}
export  class EventHandler{
    constructor(){
        this._events = {events: [], subevents: {}};
    }
    unbind(){
        if (typeof this._events != "object") {
            this._events = { events: [], subevents: {} };
        }
        switch (arguments.length) {
            case 0:
                throw Error("EventHandler.unbind: Invalid number of parameters");
            default:
                /*******************************************************/
                /* Grab the corresponding Event Node                   */
                /*******************************************************/
                var node = this._events;
                var nodeBefore=null;
                var keyForSubNode=null;
                for (var i = 0; i < arguments.length; i++) {

                    /*******************************************************/
                    if(typeof arguments[i] != "string"){
                        throw new Error("EventHandler.unbind: Parameter("+i+") - String Event Identifiers Excepted only, "+(typeof arguments[i]) +" not excepted");
                    }

                    /*******************************************************/
                    if (typeof node.subevents[arguments[i]] == "undefined") {
                        node=null;
                        continue;
                    }

                    /*******************************************************/
                    nodeBefore=node;
                    keyForSubNode=arguments[i];
                    node = node.subevents[keyForSubNode];
                }

                /*******************************************************/
                if(node==null){
                    return;
                }

                /*******************************************************/
                node.events=[];

                break;

        }
    }
    unbindAll(){
        if (typeof this._events != "object") {
            this._events = { events: [], subevents: {} };
        }
        /*******************************************************/
        /* Grab the corresponding Event Node                   */
        /*******************************************************/
        var node = this._events;
        var nodeBefore=null;
        var keyForSubNode=null;
        for (var i = 0; i < arguments.length; i++) {

            /*******************************************************/
            if(typeof arguments[i] != "string"){
                throw new Error("EventHandler.unbindAll: Parameter("+i+") - String Event Identifiers Excepted only, "+(typeof arguments[i]) +" not excepted");
            }

            /*******************************************************/
            if (typeof node.subevents[arguments[i]] == "undefined") {
                node=null;
                continue;
            }

            /*******************************************************/
            nodeBefore=node;
            keyForSubNode=arguments[i];
            node = node.subevents[keyForSubNode];
        }

        /*******************************************************/
        if(node==null){
            return;
        }

        /*******************************************************/
        delete nodeBefore.subevents[keyForSubNode];


    }
    on(){
        if (this._events==null || typeof this._events != "object") {
            this._events = { events: [], subevents: {} };
        }
        switch (arguments.length) {
            case 0:
                throw new Error("EventHandler.on: Invalid number of parameters(0)");
            case 1:
                throw new Error("EventHandler.on: Invalid number of parameters(1)");
            default:
                if (typeof arguments[arguments.length - 1] != "function") {
                    throw new Error("EventHandler.on: Last argument is not a function");
                }

                /*******************************************************/
                /* Grab the corresponding Event Node                   */
                /*******************************************************/
                var node = this._events;
                for (var i = 0; i < arguments.length - 1; i++) {

                    /*******************************************************/
                    if(typeof arguments[i] != "string"){
                        throw new Error("EventHandler.on: Parameter("+i+") - String Event Identifiers Excepted only, "+(typeof arguments[i]) +" not excepted");
                    }

                    /*******************************************************/
                    if (typeof node.subevents[arguments[i]] == "undefined" ) {
                        node.subevents[arguments[i]] = { events: [], subevents: {} };
                    }

                    /*******************************************************/
                    node = node.subevents[arguments[i]];
                }

                /*******************************************************/
                /* Add the Event to the List of Events                 */
                /*******************************************************/
                node.events.push(arguments[arguments.length - 1]);

        }
        return this;
    }

    trigger(){
        if (typeof this._events != "object") {
            this._events = { events: [], subevents: {} };
        }

        switch (arguments.length) {

            case 0:
                throw new Error("EventHandler.trigger: Invalid number of parameters");
            case 1:
                if(typeof arguments[0] != "string"){
                    throw new Error("EventHandler.trigger: If one parameter it must be a string name of the event");
                }
            default:

                if (!(arguments[arguments.length - 1] instanceof MyEvent)) {
                    if (typeof arguments[arguments.length - 1] == "object") {
                        arguments[arguments.length - 1] = this.createEvent(arguments[arguments.length - 1]);
                    }
                    else {

                        arguments[arguments.length++] = this.createEvent({});

                    }
                }


                /*******************************************************/
                /* Grab the corresponding Event Node                   */
                /*******************************************************/
                var node = this._events;
                for (var i = 0; i < arguments.length-1; i++) {


                    /*******************************************************/
                    if(typeof arguments[i] != "string"){
                        throw new Error("EventHandler.trigger: Parameter("+i+") - String Event Identifiers Excepted only, "+(typeof arguments[i]) +" not excepted");
                    }

                    /*******************************************************/
                    if (typeof node.subevents[arguments[i]] == "undefined") {
                        node=null;
                        break;
                    }

                    /*******************************************************/
                    node = node.subevents[arguments[i]];
                }

                /*******************************************************/
                if(node==null){
                    return;
                }

                /*******************************************************/
                /* Trigger all events in that Event Group              */
                /*******************************************************/
                var myArguments = arguments;
                node.events.forEach(function (item) {
                    item(myArguments[myArguments.length - 1]);
                });
        }
    }
    triggerAllRoots(){
        if (typeof this._events != "object") {
            this._events = { events: [], subevents: {} };
        }
        switch (arguments.length) {
            case 0:
                throw new Error("EventHandler.triggerAllRoots: Invalid number of parameters");
            default:
                var node = this._events;


                for(let subevent in node.subevents)
                {
                    if(!node.subevents.hasOwnProperty(subevent)){
                        break;
                    }
                    let argumentsAsArray=[subevent];
                    for(let item in arguments){
                        if(!arguments.hasOwnProperty(item)){
                            break;
                        }
                        argumentsAsArray.push(arguments[item]);
                    }

                    EventHandler.prototype.trigger.apply(this,argumentsAsArray);
                }
        }
        return this;
    }
    triggerAll(){
        if (typeof this._events != "object") {
            this._events = { events: [], subevents: {} };
        }
        switch (arguments.length) {
            case 0:
                throw new Error("EventHandler.triggerAll: Invalid number of parameters");
            case 1:
                if(typeof arguments[0] != "string"){
                    throw new Error("EventHandler.triggerAll: If one parameter it must be a string name of the event");
                }
            default:



                if (!(arguments[arguments.length - 1] instanceof MyEvent)) {
                    if (typeof arguments[arguments.length - 1] == "object") {
                        arguments[arguments.length - 1] = this.createEvent(arguments[arguments.length - 1]);
                    }
                    else {
                        arguments[arguments.length++] = this.createEvent({});
                    }
                }

                /***********************************************************/
                var node = this._events;
                var myArguments = arguments;


                /*******************************************************/
                /* Grab the corresponding Event Node                   */
                /*******************************************************/
                for (var i = 0; i < arguments.length - 1; i++)
                {
                    /*******************************************************/
                    if(typeof arguments[i] != "string"){
                        throw new Error("EventHandler.triggerAll: Parameter("+i+") - String Event Identifiers Excepted only, "+(typeof arguments[i]) +" not excepted");
                    }

                    /*******************************************************/
                    if (typeof node.subevents[arguments[i]] == "undefined") {
                        node=null;
                        continue;
                    }
                    node = node.subevents[arguments[i]];
                }

                /***********************************************************/
                if(node==null){
                    return;
                }

                /***********************************************************/
                /* It was not easy to convert it to array for some reason  */
                /* React didnt know what Object.values. I think its because*/
                /* It comes from the browser and we test using phantom     */
                /***********************************************************/
                var argumentsAsArray=[];
                for(var item in myArguments){
                    argumentsAsArray.push(myArguments[item]);
                }

                /***********************************************************/
                var $this=this;
                Object.keys(node.subevents).forEach(function(subEvent){


                    var newArguments=argumentsAsArray;

                    //Remove Event Parameters
                    newArguments.splice(newArguments.length-1,1);

                    //Add New SubEvent
                    newArguments.push(subEvent);

                    //Add Event Back(We want it last)
                    newArguments.push(myArguments[myArguments.length-1]);

                    EventHandler.prototype.triggerAll.apply($this,newArguments);
                });

                /***********************************************************/
                node.events.forEach(function (item) {
                    item(myArguments[myArguments.length - 1]);
                });
        }
    }
    createEvent(data){
        var newData = $.extend({}, data, { sender: this });
        return new MyEvent(newData);
    }
}

export default EventHandler;