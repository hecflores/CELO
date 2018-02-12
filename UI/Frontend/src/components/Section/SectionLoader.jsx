import React from 'react';
import APIComponent from '../Containers/APIComponent.jsx';
import SectionsAPI from '../../libaries/APIs/SectionsAPI.jsx';
import Loader from '../Containers/Loader.jsx';
import $ from 'jquery';
export class SectionLoader extends React.Component
{
    state={
        SectionID:-1
    };

    constructor(props){
        super(props);

    }
    componentWillReceiveProps(props){
        if(props.SectionID!=this.state.SectionID){
            this.setState({SectionID:props.SectionID},function(){
                SectionsAPI.instance.initiate("get",{id:this.state.SectionID});
            }.bind(this));
        }
    }
    componentWillMount(){
        if(this.props.SectionID!=this.state.SectionID){
            this.setState({SectionID:this.props.SectionID},function(){
                SectionsAPI.instance.initiate("get",{id:this.state.SectionID});
            }.bind(this));
        }

    }
    render(){
        let $this=this;
        return  <div className="section-home-page">
                    <div className="section-root-container">
                        <APIComponent Message="Loading Course Section..."  APIListener={SectionsAPI.instance} Event="get" >
                            {function(data,change,send,putTrigger,isLoading) {

                                let {children, ...stuff}={...this.props,...this.state,...$this.props,...$this.state};

                                if(data){
                                    let dataBeingtransferd= {
                                        SectionID:data["SectionID"],
                                        SectionInfo: data,
                                        onChange: change,
                                        onRefresh: send,
                                        isLoading: isLoading,
                                        LastUpdated:$.now(),
                                        ...stuff, // Use I know this is not this
                                    };

                                    if(typeof this.props.children == "function"){
                                        return this.props.children(dataBeingtransferd);
                                    }

                                    return React.cloneElement(this.props.children,dataBeingtransferd);   //(<Section SectionID={this.props.SectionID} SectionInfo={data}>{this.props.children}</Section>);
                                }
                                return null;

                            }.bind(this)}
                        </APIComponent>
                    </div>
                </div>
    }
}
export class SectionLoaderIndicator extends React.Component{

    static propTypes={
        isLoading:React.PropTypes.bool
    };

    render(){
        let {isLoading,children, ...rest}=this.props;
        return this.props.isLoading?<div><Loader/> Loading Section...</div>:
            (React.cloneElement(this.props.children,rest));
    }
}


export default SectionLoader;