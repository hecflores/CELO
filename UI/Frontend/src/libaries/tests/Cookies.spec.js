
var React = require('react');
var TestUtils = require('react-addons-test-utils');//'react-dom/lib/ReactTestUtils'); //I like using the Test Utils, but you can just use the DOM API instead.
var expect = require('expect');
var Cookies = require('../Cookies.jsx').default; //my root-test lives in components/__tests__/, so this is how I require in my components.


describe('Cookie', function () {

    /***********************************************************************/
    /* Test Constructor                                                    */
    /***********************************************************************/
    it('You Can Create an Instance', function () {
        var cookie=new Cookies();
        expect(cookie instanceof Cookies).toBeTruthy();
    });
    it("Doesn't Allow class as a function",function(){
        expect(function () {
            var test=Cookies();
        }).toThrow(/Cannot call/)
    });

    /***********************************************************************/
    /* Test Basics(get,set)                                                */
    /***********************************************************************/
    it('sets a Cookie with no problem', function () {
        Cookies.setCookie("test","testValue",5);
    });
    it('gets a Cookie with no problem', function () {
        var cookieValue=Cookies.getCookie("test");
        expect(cookieValue).toEqual("testValue");
    });

    /***********************************************************************/
    /* Test More then One Cookie at a time(get/set)                        */
    /***********************************************************************/
    it('sets multiple Cookies with no problem', function () {
        Cookies.setCookie("test1","testValue3",5);
        Cookies.setCookie("test2","testValue4",5);
    });
    it('gets multiple Cookies with no problem', function () {
        var cookie1Value=Cookies.getCookie("test1");
        var cookie2Value=Cookies.getCookie("test2");
        expect(cookie1Value).toEqual("testValue3");
        expect(cookie2Value).toEqual("testValue4");
    });

    /***********************************************************************/
    /* Test Modifying Cookies                                              */
    /***********************************************************************/
    it('Manipulate Cookies with no problem', function () {
        Cookies.setCookie("test","testValueMod",5);
        Cookies.setCookie("test1","testValue3Mod",5);
        Cookies.setCookie("test2","testValue4Mod",5);

        var cookieValue=Cookies.getCookie("test");
        var cookie1Value=Cookies.getCookie("test1");
        var cookie2Value=Cookies.getCookie("test2");
        expect(cookieValue).toEqual("testValueMod");
        expect(cookie1Value).toEqual("testValue3Mod");
        expect(cookie2Value).toEqual("testValue4Mod");

    });

    /***********************************************************************/
    /* Test Remove Cookies                                                 */
    /***********************************************************************/
    it('Removes Cookies with no problem', function () {
        Cookies.removeCookie("test");
        Cookies.removeCookie("test1");
        Cookies.removeCookie("test2");

        var cookieValue=Cookies.getCookie("test");
        var cookie1Value=Cookies.getCookie("test1");
        var cookie2Value=Cookies.getCookie("test2");
        expect(cookieValue).toNotExist();
        expect(cookie1Value).toNotExist();
        expect(cookie2Value).toNotExist();


    });
});