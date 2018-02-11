import $ from "jquery";

/**
 * Created by Hector on 2/27/2017.
 * I made awhile back for js, converted for React use
 */
class GenericAPI
{
    constructor()
    {
        this._modules = {};
        this._settings={};
    }

    getAjaxInfo()
    {
        let parameters = {};
        let data = {};

        /*******************************************************************/
        /* Build Parameters from Modules                                   */
        /*******************************************************************/
        for (var module in this._modules) {
            if(!this._modules.hasOwnProperty(module)){
                break;
            }
            if (this._modules[module].enabled) {
                if (typeof this._modules[module].data == "function") {
                    if (this._modules[module].isData) {
                        data[module] = this._modules[module].data(this.module);
                        continue;
                    }
                    parameters[module] = this._modules[module].data(this, module);
                    continue;
                }
                if (this._modules[module].isData) {
                    data[module] = this._modules[module].data;
                    continue;
                }
                parameters[module] = this._modules[module].data;
            }
        }
        parameters=$.extend(
            parameters,
            {
                data: data,
            }
        );
        return parameters;
    }

    /**
     * @author Vladimir Novopashin from stackoverflow.
     * @link http://stackoverflow.com/questions/22783108/convert-js-object-to-form-data
     * @param FormData
     * @param data
     * @param name
     */
    appendFormdata(FormData, data, name){
        name = name || '';
        if (typeof data === 'object'){
            $.each(data, function(index, value){
                if (name == ''){
                    this.appendFormdata(FormData, value, index);
                } else {
                    this.appendFormdata(FormData, value, name + '['+index+']');
                }
            }.bind(this))
        } else {
            FormData.append(name, data);
        }
    }

    execute(success, error, completed) {
        const parameters = {};
        const data = {};
        const $this = this;

        /*******************************************************************/
        /* Just in case                                                    */
        /*******************************************************************/
        if(this.skipExecute()){
            success?success({}):true;
            completed?completed({}):true;
            return;
        }

        /*******************************************************************/
        /* Build Parameters from Modules                                   */
        /*******************************************************************/

        for (var module in this._modules) {
            if(!this._modules.hasOwnProperty(module)){
                break;
            }
            if (this._modules[module].enabled) {
                if (typeof this._modules[module].data == "function") {
                    if (this._modules[module].isData) {
                        data[module] = this._modules[module].data(this.module);
                        continue;
                    }
                    parameters[module] = this._modules[module].data(this, module);
                    continue;
                }
                if (this._modules[module].isData) {
                    data[module] = this._modules[module].data;
                    continue;
                }
                parameters[module] = this._modules[module].data;
            }
        }

        let formData=new FormData();
        this.appendFormdata(formData,data);
        $.ajax(
            $.extend(
                parameters,
                {
                    data:data, // Using formData instead of data advised from link below


                    success:function(data)
                    {
                        $this.checkData(data,success,error);
                    },
                    error:error,
                    complete:completed
                }));
        return this;
    }
    skipExecute(){
        switch(arguments.length){
            case 0:
                return this._settings["skip-execute"];
            case 1:
                this._settings["skip-execute"]=arguments[0];
        }
        return this;

    }
    catchErrors(){
        switch(arguments.length){
            case 0:
                return this._settings["catch-errors"];
            case 1:
                this._settings["catch-errors"]=arguments[0];
        }
        return this;

    }
    checkData(data,success,error) {


        let showError=function(message){
            MessageBox.ErrorWithJSON("API Error", message, data);
        };
        if(this.catchErrors()) {
            showError = function(error){
                this.catchErrors()(error);
                success ? success() : error;
            }.bind(this)
        }

        if (!data.success) {
            showError("Data came back failed");
            return false;
        }
        if (typeof data.data == "undefined") {
            showError("Expected Data to be present, but its not");
            return false;
        }

        if (typeof data.data.results == "undefined") {
            showError("Expected data.results to be present, but its not");
            return false;
        }
        if (data.data.denied) {
            if (Object.keys(data.data.denied).length > 0) {
                showError("Some column filters were denied");
                return false;
            }
        }

        success ? success(data.data.results) : error;
        return true;
    }

    get(url,parameters) {
        this.setModule("url", url)
            .setModule("method", "GET")
            .setModuleData("_", function () {
                return $.now();
            });
        if (parameters) {
            for (var par in parameters) {
                this.setModuleData(par, parameters[par]);
            }
        }
        return this;

    }

    checkModule(moduleName) {
        if (typeof this._modules[moduleName] == "undefined") {
            this._modules[moduleName] = this.createDefaultModule();
        }
    }

    createDefaultModule() {
        return {
            isData: false,
            enabled: true,
            locked: false,
            data: {}
        };
    }
    enableModule(moduleName)
    {
        this.checkModule(moduleName);

        /*******************************************************************/
        this._modules[moduleName].enabled = true;

        return this;
    }

    disableModule(moduleName) {
        this.checkModule(moduleName);

        /*******************************************************************/
        this._modules[moduleName].enabled = false;

        return this;
    }
    filter(column,filterType,filter) {

        return this.setModuleData("filters", filterInfo);
    }

    copy(){
        const newAPI=new GenericAPI();
        newAPI._modules=this._modules;

        return newAPI;
    }
    clearAllModules()
    {
        this._modules={};
        return this;
    }
    setModule(moduleName, data, parameters) {
        this.checkModule(moduleName);
        if (typeof parameters == "undefined") {
            parameters = {};
        }

        /*******************************************************************/
        this._modules[moduleName].isData = false;

        if (parameters["enabled"] == true) {
            this._modules[moduleName].enabled = true;
        }

        /*******************************************************************/
        if (parameters["overwrite"]) {
            this._modules[moduleName].data = data;
        }

        /*******************************************************************/
        if (typeof data === 'object' && typeof this._modules[moduleName].data != 'object') {
            this._modules[moduleName].data = data;
        }

        /*******************************************************************/
        else if (typeof data != 'object') {
            this._modules[moduleName].data = data;
        }

        /*******************************************************************/
        else if (typeof data === 'object' && typeof this._modules[moduleName].data === 'object') {
            this._modules[moduleName].data = $.extend(true, this._modules[moduleName].data, data);
        }
        else {
            this._modules[moduleName].data = data;
        }

        return this;
    }

    setModuleData(moduleName, data, replace) {
        if (arguments.length == 1) {
            for (var dataName in arguments[0]) {
                this.setModuleData(dataName, arguments[0][dataName]);
            }
            return this;
        }

        this.setModule(moduleName, data, replace);
        this._modules[moduleName].isData = true;

        return this;
    }



}


export default GenericAPI;