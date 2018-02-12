
import $ from "jquery";

/***************************************************************************/
export class Rests{


    static Lets(){
        if(typeof Rests._adapter_ == "undefined"){
            Rests._adapter_=new jQueryRest();
        }
        return Rests._adapter_;
    }
    constructor(){
    }
    changeTo(newAdapter){
        Rests._adapter_=newAdapter;
        return Rests.Lets();
    }

    get(url,parameters,success){
        throw new Error("Rest.get: Requires Override");
    }
    post(url,parameters,success){
        throw new Error("Rest.post: Requires Override");
    }
    put(url,parameters,success){
        throw new Error("Rest.put: Requires Override");
    }
    patch(url,parameters,success){
        throw new Error("Rest.patch: Requires Override");
    }
    delete(url,parameters,success){
        throw new Error("Rest.delete: Requires Override");
    }


    setAdapter

}

export class TestingRestRepository{

    constructor(name, urlRegex, method, controllerCallback, init){
        this.name=name;
        this.url=urlRegex;
        this.method=method;
        this.controllerCallback=controllerCallback;
        this.init=init;
    }
}
export class TestingRest extends Rests{

    constructor(){
        super();
        this.__repositories__=[];
        this.addRepository(new TestingRestRepository(
            "assessment",
            /\/rest\/session\/is-logged-in$/i,
            "GET",
            function(results,parameters){
                return {
                    success:true,
                    sessionid:"Session"
                }
            }
            ,function(){
                //Init
            }));

        this.addRepository(new TestingRestRepository(
            "assessment",
            /\/assessments\/(\d+)\/$/i,
            "GET",
            function(results,parameters){
                return {id:              results.match[1],
                    allowed_time_sec:null,
                    expirationDate:  null,
                    istimed:        false,
                    name:            "Hector",
                    subtitle:        "Subtitle",
                    questionSet:     [
                        {
                            id:0,
                            type:"text",
                            content:JSON.stringify({question:"Question"})
                        },
                        {
                            id:0,
                            type:"multiple-choice",
                            content:JSON.stringify({"question":"Unknown","choices":[{"text":"Unknown","letter":"A"},{"text":"Unknown","letter":"B"},{"text":"Unknown","letter":"C"},{"text":"Unknown","letter":"D"}]})
                        }
                    ]
                }
            }
            ,function(){
                //Init
            }));

        this.addRepository(new TestingRestRepository("assessment", /\/rest\/assessments/i, "POST", function(results,parameters){

                return $.extend(results.parameters,{id:results.match[1],
                    allowed_time_sec:null,
                    expirationDate:null,
                    istimed:false,
                    name:"Hector",
                    subtitle:"Subtitle",
                    questionSet:[
                        {
                            id:0,
                            type:"text",
                            content:JSON.stringify({question:"Question"})
                        },
                        {
                            id:0,
                            type:"multiple-choice",
                            content:JSON.stringify({"question":"Unknown","choices":[{"text":"Unknown","letter":"A"},{"text":"Unknown","letter":"B"},{"text":"Unknown","letter":"C"},{"text":"Unknown","letter":"D"}]})
                        }

                    ]})}
            ,function(){}));
        this.addRepository(new TestingRestRepository("assessment", /\/rest\/questions/i, "GET", function(results,parameters) {

            return [
                {
                    id:0,
                    type:"text",
                    content:JSON.stringify({question:"Question"})
                },
                {
                    id:0,
                    type:"multiple-choice",
                    content:JSON.stringify({"question":"Unknown","choices":[{"text":"Unknown","letter":"A"},{"text":"Unknown","letter":"B"},{"text":"Unknown","letter":"C"},{"text":"Unknown","letter":"D"}]})
                }
            ]
        },function(){}))

    }
    addRepository(repository)
    {
        /*******************************************************************/
        if(!(repository instanceof TestingRestRepository)){
            throw new Error("TestingRest.addRepository: Expected type TestingRestRepository, did not recieve that");
        }

        /*******************************************************************/
        this.__repositories__.push(repository);
    }

    searchForRepository(url){
        var found=null;
        this.__repositories__.forEach(function(repo){
            if(found!=null){
                return;
            }
            var results;
            if((results=repo.url.exec(url))===null){
                return;
            }

            found={match:results,repo:repo};
        });

        return found;
    }

    get(url,parameters,success)
    {
        var results=null;
        if((results=this.searchForRepository(url))==null){
            throw new Error("TestingRest.get: Unkown Repo link "+url);
        }

        success(results.repo.controllerCallback(results,parameters));

    }
    post(url,parameters,success){
        var results=null;
        if((results=this.searchForRepository(url))==null){
            throw new Error("TestingRest.post: Unkown Repo link "+url);
        }

        success(results.repo.controllerCallback(results,parameters));
    }
    put(url,parameters,success){
        var results=null;
        if((results=this.searchForRepository(url))==null){
            throw new Error("TestingRest.put: Unkown Repo link "+url);
        }

        success(results.repo.controllerCallback(results,parameters));
    }
    patch(url,parameters,success){
        var results=null;
        if((results=this.searchForRepository(url))==null){
            throw new Error("TestingRest.patch: Unkown Repo link "+url);
        }

        success(results.repo.controllerCallback(results,parameters));
    }
    delete(url,parameters,success){
        var results=null;
        if((results=this.searchForRepository(url))==null){
            throw new Error("TestingRest.delete: Unkown Repo link "+url);
        }

        success(results.repo.controllerCallback(results,parameters));
    }
}

/***************************************************************************/
export class jQueryRest extends Rests{
    constructor(){
        super();
    }
    get(url,parameters,success){
        $.get(url,parameters,success);
    }
    post(url,data,success){
        $.ajax({
            url:url,
            method:"POST",
            contentType:"application/json",
            data:JSON.stringify(data)
        }).done(function(data){
            success?success(data):true;
        });

    }
    put(url,data,success){
        $.ajax({
            url:url,
            method:"PUT",
            contentType:"application/json",
            data:JSON.stringify(data)
        }).done(function(data){
            success?success(data):true;
        });
    }
    patch(url,data,success){
        $.ajax({
            url:url,
            method:"PATCH",
            contentType:"application/json",
            data:JSON.stringify(data)
        }).done(function(data){
            success?success(data):true;
        });
    }
    delete(url,data,success){
        $.ajax({
            url:url,
            method:"DELETE",
            contentType:"application/json",
            data:JSON.stringify(data)
        }).done(function(data){
            success?success(data):true;
        });
    }

}

export default Rests

