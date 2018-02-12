/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import QuestionsAPI from '../../libaries/APIs/QuestionsAPI.jsx';
import Loader from '../Containers/Loader.jsx';
class QuestionsController extends React.Component {

    static childContextTypes = {
        QuestionsController:React.PropTypes.shape({
            Refresh:React.PropTypes.func,
            setNumberPerPage:React.PropTypes.func,
            setCurrentPage:React.PropTypes.func,
            nextPage:React.PropTypes.func,
            previousPage:React.PropTypes.func,
            searchOn:React.PropTypes.func,
            searchOff:React.PropTypes.func,
            setSearch:React.PropTypes.func,
            clearSelection:React.PropTypes.func,
            setSelection:React.PropTypes.func,
            addSelection:React.PropTypes.func,
            removeSelection:React.PropTypes.func,
            Questions:React.PropTypes.array
        })
    };
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        Questions:React.PropTypes.array
    };

    state = {
        CurrentPage:0,
        ItemsPerPage:50,
        Search:false,
        SearchRegex:/.*/,
        Selected:{},
        Questions:{},
        Loaded:false,
        OrderBy:"QuestionID"
    };

    /**
     * @var APIHook
     */
    apiHook;


    /**
     * @var array
     */
    QueriedQuestions=[];
    setNewKey(array, KeyColumnName, Singleton=false){
        let newObject={};

        array.forEach(function(item){
            if(Singleton){
                newObject[item[KeyColumnName]]=item;
                return;
            }
            if(typeof newObject[item[KeyColumnName]] == "undefined"){

                newObject[item[KeyColumnName]]=[];
            }
            newObject[item[KeyColumnName]].push(item);
        }.bind(this))

        return newObject;
    }
    constructor(props) {
        super(props);

        this.apiHook=QuestionsAPI.instance.hook().on("get-all-questions",function(data1){

            let data=data1.data.Questions;
            data=this.setNewKey(data,"QuestionID",true);

            this.setState({Questions:data,Loaded:true});

        }.bind(this))

        this.updateQuestions=this.updateQuestions.bind(this);
    }

    getChildContext() {

        this.updateQuestions();
        return {QuestionsController: {
                    Refresh: () => {
                        QuestionsAPI.instance.initiate("get-all-questions")
                    },
                    setNumberPerPage: (items) => {
                        this.setState({ItemsPerPage: items})
                    },
                    setCurrentPage: (page) => {
                        this.setState({CurrentPage: this.checkPage(page)})
                    },
                    nextPage: () => {
                        this.setState({CurrentPage: this.checkPage(this.state.CurrentPage + 1)})
                    },
                    previousPage: () => {
                        this.setState({CurrentPage: this.checkPage(this.state.CurrentPage - 1)})
                    },
                    searchOn: () => {
                        this.setState({Search: true})
                    },
                    searchOff: () => {
                        this.setState({Search: false})
                    },
                    setSearch: (e) => {
                        this.setState({SearchRegex: e,Search:true,CurrentPage:0})
                    },
                    clearSelection: () => {
                        this.setState({Selected: {}})
                    },
                    setSelection: (e) => {
                        this.setState({Selected: e})
                    },
                    addSelection: (e) => {
                        this.setState({Selected: {...this.state.Selected, ...e}})
                    },
                    removeSelection: (e) => {
                        let temp = this.state.Selected;
                        for (let item in e) {
                            if (!e.hasOwnProperty(item)) {
                                continue;
                            }

                            delete temp[item];
                        }

                        this.setState({Selected: temp});

                    },
                    Questions: this.QueriedQuestions
                }

        }
    }

    componentWillMount() {
        // Called When is about to mount





    }

    componentDidMount() {
        // Called When it does mount

        /*******************************************************************/
        /* Handle Manual Questions                                         */
        /*******************************************************************/
        if(this.props.Questions){
            this.apiHook.close();
            let Questions=this.setNewKey(this.props.Questions,"QuestionID",true);
            this.setState({Questions:Questions,Loaded:true});
            return;
        }
        /*******************************************************************/
        this.apiHook.open();
        if(this.done){
            return;
        }
        QuestionsAPI.instance.initiate("get-all-questions");
        this.done=true;

        this.updateQuestions();
    }

    componentWillUnmount() {
        // Called When it unmounts
        this.apiHook.close();
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context

        /*******************************************************************/
        /* Handle Manual Questions                                         */
        /*******************************************************************/
        if(props.Questions){
            this.apiHook.close();
            let Questions=this.setNewKey(props.Questions,"QuestionID",true);
            this.setState({Questions:Questions,Loaded:true});
            return;
        }


    }

    componentWillUpdate()
    {
        this.updateQuestions();
    }
    updateQuestions(){
        // Right before rendering. Dont Do setStat here.

        if(!this.state.Loaded){
            return;
        }

        let Questions=Object.values(this.state.Questions);

        /*******************************************************************/
        /* Sort                                                            */
        /*******************************************************************/
        Questions.sort(function(a,b){
            if(a["QuestionID"]<b["QuestionID"]){
                return -1;
            }
            return 1;
        });

        /*******************************************************************/
        /* Filter                                                          */
        /*******************************************************************/
        Questions=this.state.Search?Questions.filter(item=>item["Question"].match(this.state.SearchRegex)):Questions;

        Questions=Questions.filter((item,index)=>index>=this.state.CurrentPage*this.state.ItemsPerPage && index<(this.state.CurrentPage+1)*this.state.ItemsPerPage);

        this.QueriedQuestions=Questions;
    }
    componentDidUpdate() {
        // Place to chech for dom stuff
    }
    checkPage(page){
        if(page<0){
            return 0;
        }
        if(this.state.ItemsPerPage*page > this.state.Questions.length){
            return Math.floor(this.state.Questions.length/this.state.ItemsPerPage);
        }
        return page;
    }
    render() {
        if(typeof this.QueriedQuestions == "undefined"){
            return <div className="full-screen">Loading Questions...<Loader/></div>;
        }

        return Array.isArray(this.props.children)?<div>{this.props.children}</div>:this.props.children
    }
}

export default QuestionsController;