import React from 'react';
import APIComponent from 'components/Containers/APIComponent.jsx';
import QuestionsAPI from 'libaries/APIs/QuestionsAPI.jsx';

class QuestionsLoader extends React.Component{

    static defaultProps={
        onQuestionsLoaded:function(){},
        Questions:[],
        Fetch:false
    };
    static propTypes={
        onQuestionsLoaded:React.PropTypes.func,
        Questions:React.PropTypes.array,
        Fetch:React.PropTypes.bool
    };

    constructor(props)
    {
        super(props);
        this.state={
            Fetch:this.props.Fetch,
            Questions:this.props.Questions
        };

        this.stopFetching=this.stopFetching.bind(this);
        this.incomingData=this.incomingData.bind(this);
    }
    componentDidMount()
    {
        QuestionsAPI.instance.initiate("get-all-questions");
    }
    componentWillReceiveProps(props){
        this.setState({
            Questions:props.Questions,
            Fetch:props.Fetch
        });
    }
    stopFetching(){
        this.setState({
            Fetch:false
        });
    }
    incomingData(data){
        this.setState({
            Questions:data.Questions,
            Fetch:false
        },function(){
            this.props.onQuestionsLoaded(this.state.Questions);
        }.bind(this));
    }
    render(){
        return <APIComponent Message="Loading Questions..."  Fetch={this.state.Fetch} onSubmit={this.incomingData}  initialOutput={{Questions:this.state.Questions}}  onFetching={this.stopFetching} APIListener={QuestionsAPI.instance} Event="get-all-questions">
                {function(data) {
                    return data && React.cloneElement(React.Children.only(this.props.children), {Questions: data.Questions || (this.state.Questions)});
                }.bind(this)}
               </APIComponent>
    }
}


export default QuestionsLoader