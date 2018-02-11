
var React = require('react');
var TestUtils = require('react-addons-test-utils');//'react-dom/lib/ReactTestUtils'); //I like using the Test Utils, but you can just use the DOM API instead.
var expect = require('expect');
var EventHandler = require('../EventHandler.jsx').default; //my root-test lives in components/__tests__/, so this is how I require in my components.

function buildArguments(numberOfThem){
    var argumentsUsing=[];

    /***************************************************************/
    for(var k=0;k<numberOfThem;k++){
        argumentsUsing.push("test"+k);
    }

    return argumentsUsing;
};

describe('Event Handler', function () {

    /***********************************************************************/
    /* Test Constructor                                                    */
    /***********************************************************************/
    it('You Can Create an Instance', function () {
        var eventHandler=new EventHandler();
        expect(eventHandler instanceof EventHandler).toBeTruthy();
    });

    it('Can only be instantiate', function () {

        expect(function(){
            var eventHandler=EventHandler();
        }).toThrow(/Cannot call/);
    });
    it('Can Handle Basic Events', function () {
        var eventHandler=new EventHandler();

        var test=false;
        eventHandler.on("test",function(e){

            expect(e.sender instanceof EventHandler).toBeTruthy();

           test=true;
        });
        eventHandler.trigger("test");

        expect(test).toBeTruthy();
    });
    it('Can Recieve Messages', function () {
        var eventHandler=new EventHandler();

        var tests=false;
        eventHandler.on("test",function(e){
            tests=true;
            expect(e.message).toEqual("messageTest");
        });
        eventHandler.trigger("test",{message:"messageTest"});

        expect(tests).toBeTruthy();
    });

    it('Can Propagate Messages', function () {
        var eventHandler=new EventHandler();

        var tests1=false;
        var tests2=false;

        eventHandler.on("test1",function(e){
            tests1=true;
            e.sender.trigger("test2");
        });
        eventHandler.on("test2",function(e){
            tests2=true;
        });
        eventHandler.trigger("test1");
        expect(tests1).toBeTruthy();
        expect(tests2).toBeTruthy();


    });
    it('Can Do Multiple Listeners', function () {
        var eventHandler=new EventHandler();

        var tests=[];
        var numberOfTests=10;
        for(var i=0;i<numberOfTests;i++){
            tests.push(false);
        }
        var indexI=0;
        eventHandler.on("test",function(e){
           indexI=-1;//Set it up
        });
        for(var i=0;i<numberOfTests;i++){


            eventHandler.on("test",function(e){
               expect(typeof e.testIndex).toBe("number");
               indexI++;
               if(e.testIndex!=indexI){
                   return;
               }
               expect(tests[e.testIndex]).toBeFalsy();
               tests[e.testIndex]=true;
            });
        }

        for(var i=0;i<numberOfTests;i++){
            for(var k=0;k<numberOfTests;k++){
                tests[k]=false;
            }
            eventHandler.trigger("test",{testIndex:i});
            for(var k=0;k<numberOfTests;k++){
                if(k==i){
                    expect(tests[k]).toBeTruthy();
                    continue;
                }
                expect(tests[k]).toBeFalsy();
            }
        }
    });
    it('Can Handle Unbinding Events', function () {

        /*******************************************************************/
        var eventHandler=new EventHandler();
        var test=false;

        /*******************************************************************/
        eventHandler.on("test",function(e){

            expect(e.sender instanceof EventHandler).toBeTruthy();

            test=true;
        });

        /*******************************************************************/
        eventHandler.unbind("test");

        /*******************************************************************/
        eventHandler.trigger("test");

        /*******************************************************************/
        expect(test).toBeFalsy();
    });

    it('Can Handle Nested Events (Up to 2)', function () {

        /*******************************************************************/
        var eventHandler=new EventHandler();
        var test=false;

        /*******************************************************************/
        eventHandler.on("test","subtest1",function(e){

            expect(e.sender instanceof EventHandler).toBeTruthy();

            test=true;
        });

        /*******************************************************************/
        eventHandler.trigger("test","subtest1");

        /*******************************************************************/
        expect(test).toBeTruthy();
    });

    it('Can Handle Nested Events (Up to 10)', function () {

        /*******************************************************************/
        var n=50;

        for(var i=1;i<n;i++){

            /***************************************************************/

            var argumentsUsing=[];
            var elements=[];

            /***************************************************************/
            for(var k=0;k<i;k++){
                argumentsUsing.push("test"+k);
                elements.push("test"+k);
            }


            /***************************************************************/
            argumentsUsing.push(function(e){
                expect(e.sender instanceof EventHandler).toBeTruthy();

                test=true;
            });

            /*******************************************************************/
            var eventHandler=new EventHandler();
            var test=false;
            EventHandler.prototype.on.apply(eventHandler,argumentsUsing);
            EventHandler.prototype.trigger.apply(eventHandler,elements);

            /*******************************************************************/
            expect(test).toBeTruthy();

        }
    });
    it('Can Handle Nested Events (Up to 10)', function () {

        /*******************************************************************/
        var n=50;

        for(var i=1;i<n;i++){

            /***************************************************************/

            var argumentsUsing=[];
            var elements=[];

            /***************************************************************/
            for(var k=0;k<i;k++){
                argumentsUsing.push("test"+k);
                elements.push("test"+k);
            }


            /***************************************************************/
            argumentsUsing.push(function(e){
                expect(e.sender instanceof EventHandler).toBeTruthy();

                test=true;
            });

            /*******************************************************************/
            var eventHandler=new EventHandler();
            var test=false;
            EventHandler.prototype.on.apply(eventHandler,argumentsUsing);
            EventHandler.prototype.trigger.apply(eventHandler,elements);

            /*******************************************************************/
            expect(test).toBeTruthy();

        }
    });
    it('Can deal with higher order events with lower order', function () {



        /*******************************************************************/
        var n=50;
        var eventHandler=new EventHandler();
        var tests=[];

        for(var i=1;i<n;i++){
            tests.push(false);

            /***************************************************************/
            var argumentsUsing=buildArguments(i);
            var elements=buildArguments(i);

            /***************************************************************/
            argumentsUsing.push(function(e){
                expect(e.sender instanceof EventHandler).toBeTruthy();
                expect(typeof e.item =="number").toBeTruthy();

                tests[e.item]=true;
            });

            /*******************************************************************/
            EventHandler.prototype.on.apply(eventHandler,argumentsUsing);



        }
        for(var i=1;i<n;i++){

            var elements=buildArguments(i);

            /***************************************************************/
            for(var k=1;k<n;k++){
                expect(tests[k-1]).toBe(false);
            }

            elements.push({item:i-1});
            EventHandler.prototype.trigger.apply(eventHandler,elements);

            /***************************************************************/
            for(var k=1;k<n;k++){
                if(k==i){
                    expect(tests[k-1]).toBe(true);
                    tests[k-1]=false;
                    continue;
                }
                expect(tests[k-1]).toBe(false);

            }
        }

    });

    it('Can deal with trigger all', function () {




        var n=50;
        var eventHandler=new EventHandler();
        var tests=[];

        /*******************************************************************/
        for(var i=1;i<=n;i++){

            /***************************************************************/
            var argumentsUsing=buildArguments(i);
            var elements=buildArguments(i);

            /***************************************************************/
            argumentsUsing.push(function(e){
                expect(e.sender instanceof EventHandler).toBeTruthy();

                tests.push(true);
            });

            /*******************************************************************/
            EventHandler.prototype.on.apply(eventHandler,argumentsUsing);



        }

        /*******************************************************************/
        var testArguments=buildArguments(1);
        eventHandler.triggerAll(testArguments[0]);
        expect(tests.length).toBe(n);

    });
    it('Can deal with unbinding all', function () {



        /*******************************************************************/
        var n=50;
        var eventHandler=new EventHandler();
        var tests=[];

        for(var i=1;i<=n;i++){

            /***************************************************************/
            var argumentsUsing=buildArguments(i);
            var elements=buildArguments(i);

            /***************************************************************/
            argumentsUsing.push(function(e){
                expect(e.sender instanceof EventHandler).toBeTruthy();

                tests.push(true);
            });

            /*******************************************************************/
            EventHandler.prototype.on.apply(eventHandler,argumentsUsing);



        }


        tests=[];
        var testArguments=buildArguments(1);
        eventHandler.unbindAll(testArguments[0]);
        eventHandler.triggerAll(testArguments[0]);
        expect(tests.length).toBe(0);

    });
    it('Can Deal with Incorrect us of .on and show correct error', function () {

        var eventHandler = new EventHandler();
        var undefined = ([])[1];

        /*******************************************************************/
        expect(function () {
            eventHandler.on();
        }).toThrow(/EventHandler.on: /);

        expect(function () {
            eventHandler.on({});
        }).toThrow(/EventHandler.on: /);

        expect(function () {
            eventHandler.on({}, {});
        }).toThrow(/EventHandler.on: /);

        expect(function () {
            eventHandler.on(function () {

            });
        }).toThrow(/EventHandler.on: /);

        expect(function () {
            eventHandler.on("hector", {});
        }).toThrow(/EventHandler.on: /);

        expect(function () {
            eventHandler.on("hector", {}, "hecto2", function () {
            });
        }).toThrow(/EventHandler.on: /);

        //If there was an undefined
        expect(function () {
            eventHandler.on("hector", undefined, {});
        }).toThrow(/EventHandler.on: /);
    });
    it('Can Deal with Incorrect us of .trigger and show correct error', function () {

        var eventHandler = new EventHandler();
        var undefined = ([])[1];

        /*******************************************************************/
        expect(function () {
            eventHandler.trigger();
        }).toThrow(/EventHandler.trigger: /);

        expect(function () {
            eventHandler.trigger({});
        }).toThrow(/EventHandler.trigger: /);

        expect(function () {
            var testFunction=function(){
                console.log("Do something");
            };
            eventHandler.trigger("testing", testFunction);
        }).toThrow(/EventHandler.trigger: /);

        expect(function () {
            eventHandler.trigger("testing", undefined, {});
        }).toThrow(/EventHandler.trigger: /);

        expect(function () {
            eventHandler.trigger("testing", undefined, {});
        }).toThrow(/EventHandler.trigger: /);

        expect(function () {
            eventHandler.trigger([], "testing");
        }).toThrow(/EventHandler.trigger: /);

    });
    it('Can Deal with Incorrect us of .triggerAll and show correct error', function () {
        var eventHandler = new EventHandler();
        var undefined = ([])[1];

        /*******************************************************************/
        expect(function () {
            eventHandler.triggerAll();
        }).toThrow(/EventHandler.triggerAll: /);

        expect(function(){
            eventHandler.triggerAll({});
        }).toThrow(/EventHandler.triggerAll: /);

        expect(function(){
            eventHandler.triggerAll("testing",function(){});
        }).toThrow(/EventHandler.triggerAll: /);

        expect(function(){
            eventHandler.triggerAll("testing",undefined,{});
        }).toThrow(/EventHandler.triggerAll: /);

        expect(function(){
            eventHandler.triggerAll("testing",undefined,{});
        }).toThrow(/EventHandler.triggerAll: /);

        expect(function(){
            eventHandler.triggerAll([],"testing");
        }).toThrow(/EventHandler.triggerAll: /);

    });
    it('Can Deal with Incorrect us of .unbind and show correct error', function () {

        var eventHandler = new EventHandler();
        var undefined = ([])[1];

        /*******************************************************************/
        expect(function(){
            eventHandler.unbind();
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind({});
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind(function(){});
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind(undefined);
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind("Cool",undefined,"Really Cool");
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind("Cool",function(){});
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind("Cool",{});
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind("Cool",undefined);
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind(function(){},"Cool");
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind({},"Cool");
        }).toThrow(/EventHandler.unbind: /);

        expect(function(){
            eventHandler.unbind(undefined,"Cool");
        }).toThrow(/EventHandler.unbind: /);

    });
    it('Can Deal with Incorrect us of .unbindAll and show correct error', function () {

        var eventHandler = new EventHandler();
        var undefined = ([])[1];

        /*******************************************************************/
        expect(function(){
            eventHandler.unbindAll({});
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll(function(){});
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll(undefined);
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll("Cool",undefined,"Really Cool");
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll("Cool",function(){});
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll("Cool",{});
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll("Cool",undefined);
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll(function(){},"Cool");
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll({},"Cool");
        }).toThrow(/EventHandler.unbindAll: /);

        expect(function(){
            eventHandler.unbindAll(undefined,"Cool");
        }).toThrow(/EventHandler.unbindAll: /);


    });

    it('Wont Broke on Minor things', function () {
        var eventManager=new EventHandler();
        eventManager.trigger("doesnt-exists");
        eventManager.triggerAll("doesnt-exists");
        eventManager.unbind("doesnt-exists");
        eventManager.unbindAll("doesnt-exists");

        eventManager._events=null;
        eventManager.on("text",function(){

        });

        eventManager._events=function(){};
        eventManager.trigger("text");

        eventManager._events="this is a string";
        eventManager.unbind("text");

        eventManager._events=1;
        eventManager.unbindAll("text");

        eventManager._events="Another String";
        eventManager.triggerAll("text");
    });
});