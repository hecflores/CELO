/**
 * Created by Hector on 5/12/2017.
 */

import React from 'react';


class QuestionsPoolSelector extends React.Component {

    static childContextTypes = {
        QuestionsPoolSelector:React.PropTypes.shape({
            setSelectedQuestionPool:React.PropTypes.func,
            selectQuestionPools:React.PropTypes.func,
            unSelectQuestionPools:React.PropTypes.func,
            SelectedQuestionPool:React.PropTypes.oneOfType([
                React.PropTypes.bool,
                React.PropTypes.number
            ]),
            SelectedQuestionPools:React.PropTypes.oneOfType([
                React.PropTypes.bool,
                React.PropTypes.arrayOf(React.PropTypes.number)
                ])
        })
    };
    static contextTypes = {
        QuestionPoolsLoader:React.PropTypes.shape({
            Refresh:React.PropTypes.func,
            Loaded:React.PropTypes.bool,
            QuestionsPoolID:React.PropTypes.number,
            CreateQuestionPool:React.PropTypes.func,
            AddQuestion:React.PropTypes.func,
            QuestionPools:React.PropTypes.arrayOf(React.PropTypes.shape({
                QuestionsPoolID:React.PropTypes.number,
                ParentQuestionPool:React.PropTypes.number,
                Name:React.PropTypes.string,
                Description:React.PropTypes.string,
                Parameters:React.PropTypes.any,
                User:React.PropTypes.shape({
                    UserID:React.PropTypes.string,
                    FirstName:React.PropTypes.string,
                    LastName:React.PropTypes.string,
                    Email:React.PropTypes.string,
                    PhoneNumber:React.PropTypes.string,
                    UserName:React.PropTypes.string,
                    Role:React.PropTypes.string,
                    UHID:React.PropTypes.number
                }),
                Children:React.PropTypes.arrayOf(React.PropTypes.shape({
                    QuestionsPoolID: React.PropTypes.number,
                    ParentQuestionPool: React.PropTypes.number,
                    Name: React.PropTypes.string,
                    Description: React.PropTypes.string,
                    Parameters: React.PropTypes.any,
                    User: React.PropTypes.shape({
                        UserID: React.PropTypes.string,
                        FirstName: React.PropTypes.string,
                        LastName: React.PropTypes.string,
                        Email: React.PropTypes.string,
                        PhoneNumber: React.PropTypes.string,
                        UserName: React.PropTypes.string,
                        Role: React.PropTypes.string,
                        UHID: React.PropTypes.number
                    })
                })),
                Questions:React.PropTypes.array

            }))
        })
    };
    static defaultProps = {
        onSelectionChanged:function(){}
    };
    static propTypes = {
        onSelectionChanged:React.PropTypes.func,


    };

    state = {
        SelectedQuestionPools:[]
    };



    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {
            QuestionsPoolSelector:{
                setSelectedQuestionPool:this.setSelectedQuestionPool.bind(this),
                selectQuestionPools:this.selectQuestionPools.bind(this),
                unSelectQuestionPools:this.unSelectQuestionPools.bind(this),
                SelectedQuestionPool:this.state.SelectedQuestionPools.length==0?false:this.state.SelectedQuestionPools[0],
                SelectedQuestionPools:this.state.SelectedQuestionPools.length==0?false:this.state.SelectedQuestionPools
            }
        };
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context

        this.AnyIncomingUpdate(props, context); // To Put updates in one place
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    AnyIncomingUpdate(props, context) {
        // Both the componentWillMount and componentWillReceiveProps will go here
    }
    setSelectedQuestionPool(selectedObjects){
        if(Array.isArray(selectedObjects)){
            this.setState({
                SelectedQuestionPools:selectedObjects
            },()=>{
                this.props.onSelectionChanged(this.getChildContext().QuestionsPoolSelector.SelectedQuestionPool);
            });
            return;
        }

        this.setSelectedQuestionPool([selectedObjects]);
    }

    /**
     *
     * @param questionPool object
     */
    selectQuestionPools(questionPool){
        this.setSelectedQuestionPool(
            [...this.state.SelectedQuestionPools.filter((item)=>item.QuestionsPoolID!=questionPool), questionPool]
        );
    }

    /**
     *
     * @param questionPool object
     */
    unSelectQuestionPools(questionPool){
        this.setSelectedQuestionPool(
            [...this.state.SelectedQuestionPools.filter((item)=>item.QuestionsPoolID!=questionPool)]
        );
    }
    render() {
        return ( <div className="questions-pool-selector">{this.props.children}</div>);
    }
}

export default QuestionsPoolSelector;