import React from 'react';
import $ from 'jquery';
import APIFetcher from './APIFetcher.jsx';
import DataContainer from './DataContainer.jsx';
import APIListener from '../../libaries/APIs/APIListener.jsx';
import Loader from './Loader.jsx';

class APIComponent extends React.Component
{
    static defaultProps = {
        Fetch:false,
        onFetching:function(){

        },
        onSubmit:function(){

        },
        children: function (data, change, submit, update) {

        }
    };

    static propTypes = {
        Fetch:React.PropTypes.bool,
        initialInput:React.PropTypes.object,
        initialOutput:React.PropTypes.object,
        APIListener:React.PropTypes.instanceOf(APIListener).isRequired,
        Event:React.PropTypes.string.isRequired,
        onFetching:React.PropTypes.func,
        onChange:React.PropTypes.func,
        onSubmit:React.PropTypes.func,
        children: React.PropTypes.oneOfType([React.PropTypes.func,React.PropTypes.array,React.PropTypes.element]),

    };


    constructor(props) {
        super(props);
        this.state={
            Fetch:this.props.Fetch,
            data:{
                input:this.props.initialInput?this.props.initialInput:{},
                output:this.props.initialOutput?this.props.initialOutput:{},
            },
            loading:false
        };


        /*******************************************************************/

        this.weWereAskedToGetTheAPI=this.weWereAskedToGetTheAPI.bind(this);
        this.onIncomingOutput=this.onIncomingOutput.bind(this);
        this.onIncomingInput=this.onIncomingInput.bind(this);
        this.weAreLoading=this.weAreLoading.bind(this);
        this.weAreNotLoading=this.weAreNotLoading.bind(this);
        this.weHaveErrors=this.weHaveErrors.bind(this);

    }
    componentDidMount()
    {

        /* his.api.getListener().initiate(this.props.Event,this.state.data.input); */
    }
    componentWillReceiveProps(props)
    {
        //console.debug("APIComponent: Fetch issue - componentWillReceiveProps "+(props.Fetch));
        this.setState({
            Fetch: props.Fetch,
            data: {
                output: $.extend(true, this.state.data.output, props.initialOutput ? props.initialOutput : {}),
                input: $.extend(true, this.state.data.input, props.initialInput ? props.initialInput : {})
            }
        });


        // }
        // if(props.initialOutput){
        //     this.onIncomingOutput(props.initialOutput);
        // }

    }
    onIncomingOutput(data){
        //console.debug("APIComponent: onIncomingOutput(data: "+")");
        this.setState({
            Fetch:false,

            data:{
                input:{},
                output:$.extend(this.state.data.output,data?data:{})
            }
        },function(){
            this.props.onSubmit(this.state.data.output);
        }.bind(this));
    }
    onIncomingInput(data){
        //console.debug("APIComponent: onIncomingInput(data: "+")");
        this.setState({
            errors:null,
            data:{
                output:{},
                input:$.extend(true,this.state.data.input,data?data:{})
            }
        })
    }
    weAreLoading(){
        this.props.onFetching();
        //console.debug("APIComponent: weAreLoading()");
        this.setState({
            loading:true
        })
    }
    weAreNotLoading(){

        //console.debug("APIComponent: weAreNotLoading()");
        this.setState({
            loading:false
        })
    }
    weHaveErrors(errors){
        //console.debug("APIComponent: weHaveErrors()");
        this.setState({
            errors:errors,
            loading:false
        });
    }
    weWereAskedToGetTheAPI()
    {
        //console.debug("APIComponent: weWereAskedToGetTheAPI(): event:"+this.props.Event+", input:");
        return this.props.APIListener.generate(this.props.Event, this.state.data["input"]);
    }
    render()
    {
        //console.debug("APIComponent: render(data: "+")");
        return (
            <div>
                <DataContainer defaultData={this.state.data} >

                    {/*******************************************************/}
                    {/* Data Body                                           */}
                    {/*******************************************************/}
                    {function (data, change, submit, putTrigger) {
                        //console.debug("APIComponent: render(). 1st(data: "+")");
                        return (
                            <APIFetcher Input={data["input"]?data["input"]:{}}
                                        Event={this.props.Event}
                                        Fetch={this.state.Fetch}
                                        Instance={this.props.APIListener}
                                        onSuccess={this.onIncomingOutput}
                                        onLoading={this.weAreLoading}
                                        onFinish={this.weAreNotLoading}
                                        onError={this.weHaveErrors}
                            >

                                {/*******************************************/}
                                {/* API Listener                            */}
                                {/*******************************************/}
                                {function (data2,getTrigger)
                                {
                                    //console.debug("APIComponent: render(). 2nd");
                                    let finalData={data:(this.state.Fetch?this.props.initialOutput:data2),
                                        onChanged:this.onIncomingInput, onFetch:getTrigger,onSetData:putTrigger,
                                        isLoading:this.state.loading,Input:data["input"]?data["input"]:{}};

                                    {/***************************************/}
                                    {/* Nested Final Components             */}
                                    {/***************************************/}
                                    return (this.state.Fetch && (typeof this.props.initialOutput == "undefined")?(<div className="full-screen">{this.props.Message}<Loader/></div>):(
                                                <div>
                                                    {(typeof this.props.children == "function")?
                                                       this.props.children(finalData.data,finalData.onChanged,finalData.onFetch,finalData.onSetData,finalData.isLoading,finalData.Input):
                                                        (React.Children.count(this.props.children)>1?React.Children.map(function(child,index){

                                                            return React.cloneElement(child,{key:index,...finalData});

                                                    }):React.cloneElement(this.props.children,finalData))}
                                                    {this.state.loading?(<div className="full-screen">{this.props.Message}<Loader/></div>):null}
                                                    {this.state.errors?(<h4 className="text-danger errors">{this.state.errors}</h4>):null}
                                                </div>
                                             ));



                                }.bind(this)}

                            </APIFetcher>);


                    }.bind(this)}

                </DataContainer>
            </div>);
    }
}

export default APIComponent