import APIListener from "./APIListener.jsx";
import AdvancedAPListener from "./AdvancedAPListener.jsx";
import CourseContentAPI from "./CourseContentAPI.jsx";
import $ from 'jquery';

class AnswerableItems extends AdvancedAPListener
{
    /**
     *
     * @type {AnswerableItems}
     */
    static instance=new AnswerableItems();

    constructor(){
        super();

        this.addModule("update",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url", "/api/answerable-items")
                .setModule("method", "POST")
                .setModuleData("__action__", "update") //THE MAIN PIECE
                .setModuleData(data)
                .setModuleData("_", function () {
                    return $.now();
                }).execute(function (data) {
                    done(data);
                    AnswerableItems.instance("get");
            });
        }.bind(this));
        this.addModule("get",function(module, data,done)
        {
            module.clearAllModules()
                .setModule("url", "/api/answerable-items")
                .setModule("method", "GET")
                .setModuleData(data)
                .setModuleData("_", function () {
                    return $.now();
                }).execute(function (data) {
                done(data);

            });
        }.bind(this));
    }
}

export default AnswerableItems