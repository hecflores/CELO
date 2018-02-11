/**
 * Created by Hector on 2/28/2017.
 */


var React = require('react');
var TestUtils = require('react-addons-test-utils');//'react-dom/lib/ReactTestUtils'); //I like using the Test Utils, but you can just use the DOM API instead.
var expect = require('expect');
var App = require('../App.jsx').default; //my root-test lives in components/__tests__/, so this is how I require in my components.


describe('Is the App There', function () {
    it('renders without problems', function () {
        TestUtils.route='/app/';
        var root = TestUtils.renderIntoDocument(<App />);

        expect(root).toExist();
    });
});





