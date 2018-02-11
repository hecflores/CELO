import React from 'react';
import AssessmentAPI from '../../libaries/APIs/AssessmentAPI.jsx';

class AssessmentsLoader extends React.Component
{

    state={
        Assessments:[]
    };

    /**
     * @var APIHook
     */
    apiHook;

    constructor(props){
        super(props);

        this.apiHook=AssessmentAPI.instance.hook().on("get-assessments",function(data){
            this.setState({
                Assessments:data.data
            });
        }.bind(this));

    }

    componentDidMount(){
        this.apiHook.open();
        this.apiHook.getListener().initiate("get-assessments");
    }
    componentWillUnmount(){
        this.apiHook.close();
    }

    render(){
        return React.cloneElement(this.props.children,{Assessments:this.state.Assessments});
    }
}

export default AssessmentsLoader
