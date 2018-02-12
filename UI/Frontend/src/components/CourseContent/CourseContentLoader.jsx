import React from 'react';
import $ from 'jquery';
import APIComponent from '../Containers/APIComponent.jsx';
import CourseContentAPI from "../../libaries/APIs/CourseContentAPI.jsx";



class CourseContentLoader extends React.Component
{
    static childContextTypes={
        refresh:React.PropTypes.func
    };
    static defaultProps={
        isFetching:true,
        onUpdated:function(){}
    };
    static propTypes={
        isFetching:React.PropTypes.bool,
        CourseContentID:React.PropTypes.number.isRequired,
        onUpdated:React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state={
            isFetching:this.props.isFetching,
            CourseContent:this.props.CourseContent,
            CourseContentID:this.props.CourseContentID

        };

        /*******************************************************************/
        this.fetchingOn=this.fetchingOn.bind(this);
        this.fetchingToggle=this.fetchingToggle.bind(this);
        this.fetchingOff=this.fetchingOff.bind(this);
        this.setFetching=this.setFetching.bind(this);
        this.fetchedData=this.fetchedData.bind(this);
    }
    getChildContext(){
        return {
            refresh:()=>{
                CourseContentAPI.instance.initiate("get-course-content",{id:this.props.CourseContentID});
            }
        }
    }
    componentWillReceiveProps(props){
        if(this.state.CourseContentID!=props.CourseContentID){
            this.setState({
                CourseContentID:props.CourseContentID,
                isFetching:true
            });
            return;
        }
        this.setFetching(props.isFetching);
    }

    fetchedData(data){
        this.setState({
            isFetching:false,
            CourseContent:data,
            LastUpdated:$.now()

        },function(){
            this.props.onUpdated(this.state.CourseContent);
        }.bind(this));

    }
    fetchingToggle(){
        if(this.state.isFetching){
            this.fetchingOff();
            return;
        }

        this.fetchingOn();
    }
    fetchingOff(){
        this.setFetching(false);
    }
    fetchingOn(){
        this.setFetching(true);
    }
    setFetching(isFetching){
        this.setState({
            isFetching:isFetching
        })
    }
    render()
    {
        let $this=this;
        return (<APIComponent Message="Loading Course Content..." Name="Cource Content" Fetch={this.state.isFetching}
                            onSubmit={this.fetchedData}
                            initialOutput={this.state.CourseContent || {}}
                            APIListener={CourseContentAPI.instance}
                            Event="get-course-content"
                            initialInput={{id:this.props.CourseContentID}} >
                {function(data,change,send,setData,isLoading){
                    if(!data){
                        return null;
                    }
                    let dataBeingtransferd=$.extend(
                        {
                            CourseContent:data,
                            Data:data,
                            onChange:change,
                            onRefresh:send,
                            isLoading:isLoading,
                        },
                        $this.props,
                        $this.state,
                        this.props, // Use I know this is not this
                        this,       // Use I know this is not this
                        this.state // Use I know this is not this
                        );
                    if(typeof $this.props.children == 'function'){
                        return $this.props.children(dataBeingtransferd);
                    }
                    return React.Children.map($this.props.children,(child,index)=>
                    {



                        return React.cloneElement(child, $.extend(
                            {
                                CourseContent:data,
                                Data:data,
                                onChange:change,
                                onRefresh:send,
                                isLoading:isLoading,
                            },
                            $this.props,
                            $this.state,
                            this.props, // Use I know this is not this
                            this,       // Use I know this is not this
                            this.state, // Use I know this is not this
                            {key:index}
                        ));
                    });
                }}
             </APIComponent>);
    }
}

export default CourseContentLoader