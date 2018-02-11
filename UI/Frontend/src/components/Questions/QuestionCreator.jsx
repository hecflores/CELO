/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import QuestionCreators from '../QuestionCreators/*.jsx';  //With the help of a library
import CELOButton from '../Tools/CELOButton.jsx';
import PopupForm from '../Tools/PopupForm.jsx';
import {DropdownButton,MenuItem}  from 'react-bootstrap';
class QuestionCreator extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
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
        }),
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
                Parameters:React.PropTypes.object,
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
                    Parameters: React.PropTypes.object,
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
        }),
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
    static defaultProps = {
    };
    static propTypes = {
        Show:React.PropTypes.bool
    };

    state = {
        Show:false
    };


    constructor(props) {
        super(props);

        this.openModal=this.openModal.bind(this);
        this.closeModal=this.closeModal.bind(this);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount
        if(typeof this.props.Show != "undefined" ) {
            this.setState({
                Show: this.props.Show
            })
        }
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
        if(typeof props.Show != "undefined" ){
            this.setState({
                Show:props.Show
            })
        }
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }
    openModal(QuestionType){
        this.setState({
            Show:true,
            QuestionType:QuestionType
        });
    }
    closeModal(){
        this.setState({
            Show:false
        });
    }

    render() {
        return <div className="question-creator-module">
                 <DropdownButton title="New Question" id="bg-nested-dropdown" >
                     {(function() {
                        let menuItems=[];
                         for (let key in QuestionCreators)
                         {
                             if (!QuestionCreators.hasOwnProperty(key)) {
                                 continue;
                             }

                             menuItems.push(<MenuItem onClick={()=>{this.openModal(QuestionCreators[key])}} eventKey={key} key={key}>{/*final-fix ADD AN IMAGE HERE */}{QuestionCreators[key].default.id}</MenuItem>);
                         }

                         return menuItems

                     }.bind(this))()}

                 </DropdownButton>

                <PopupForm Show={this.state.Show} action={"/api/questions/pools/"+this.context.QuestionsPoolSelector.SelectedQuestionPool.QuestionsPoolID} onClosed={this.closeModal} onSubmit={this.context.QuestionPoolsLoader.Refresh}>
                    <input type="hidden" value={"add-question"} name="__action__"/>
                        {(function() {
                            if(!this.state.Show){
                                return null;
                            }

                            let QuestionTypeFound = this.state.QuestionType["default"];

                            return  <div ref={this.props.onGetDom}>
                                        <QuestionTypeFound/>
                                    </div>
                        }.bind(this))()}
                </PopupForm></div>
    }
}

export default QuestionCreator;