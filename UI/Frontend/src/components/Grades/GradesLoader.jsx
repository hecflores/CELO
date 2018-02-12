import React from 'react';
import AnswerableItemsAPI from '../../libaries/APIs/AnswerableItems.jsx';
import APIComponent from '../Containers/APIComponent.jsx';
import Loader from '../Containers/Loader.jsx';
class GradesLoader extends React.Component
{
    /**
     * @var {APIHook}
     */
    hook;

    static contextTypes={
        UserInfo:React.PropTypes.object,
        router:React.PropTypes.object
    };

    state={
        Grades:false
    };
    static defaultProps={
        Filters:[]
    };
    static propTypes={
        Filters:React.PropTypes.array
    };
    constructor(props)
    {
        super(props);

        this.hook=AnswerableItemsAPI.instance.hook().on("get",function(data){
            this.setState({
                Grades:data.data
            });

        }.bind(this));
    }
    componentWillUnmount(){
        this.hook.close();
    }
    componentWillMount()
    {
        this.hook.open();

        AnswerableItemsAPI.instance.initiate("get",{SectionID:this.context.router.params.sectionID, ...this.props.Filters});
    }
    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
        let change=false;

        change|=context.router.params.sectionID!=this.context.router.params.sectionID;
        Object.keys(props.Filters).forEach((key)=>{change|=props.Filters[key]!=this.props.Filters[key];});

        if(change) {
            AnswerableItemsAPI.instance.initiate("get", {SectionID: context.router.params.sectionID, ...props.Filters});
        }
    }

    render(){
        return <APIComponent APIListener={AnswerableItemsAPI.instance} Event="get">
                    {function(data){
                        if(!data){
                            return <div className="full-screen"><Loader/>Loading Grades...</div> ;
                        }

                        let Grades=data;

                        if(!this.state.Grades){
                            return null;
                        }

                        if(typeof this.props.children == "undefined")
                        {
                            return null;
                        }

                        if(Array.isArray(this.props.children)){
                            return React.Children.map(this.props.children,(child,index)=>{
                                return React.cloneElement(child,{key:index,Grades:Grades});
                            });
                        }

                       return  React.cloneElement(this.props.children,{Grades:Grades});

                    }.bind(this)}
               </APIComponent>

    }
}

export default GradesLoader