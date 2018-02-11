/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import Grid from '../Grid/Grid.jsx';
import GridCell from '../Grid/GridCell.jsx';
import GridColumn from '../Grid/GridColumn.jsx';
import GridRow from '../Grid/GridRow.jsx';
import GradeCell from './GradeCell.jsx';
import UserActionItem from '../Users/UserActionItem.jsx';
import CourseContentSimpleIconWidget from '../CourseContent/CourseContentSimpleIconWidget.jsx';
import CELOButton from '../Tools/CELOButton.jsx';
class GradesGrid extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        AnswerableItems:React.PropTypes.array
    };

    state = {
        ShowInRow:false
    };


    constructor(props) {
        super(props);

        this.toggle=this.toggle.bind(this);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }
    toggle(){
        this.setState({
            ShowInRow:!this.state.ShowInRow
        });
    }
    render() {

        if(this.state.ShowInRow){
            return <div className="grades-grid">
                <CELOButton onClick={this.toggle} Text={"Switch Back"} Enabled={true} TooltipText={"Flip It No"}/>
                <Grid>
                    <GridRow>
                        <GridColumn>
                            <GridCell><div/></GridCell>
                            {Object.values(this.props.AnswerableItems).map(function(item,index) {
                                return <GridCell><CourseContentSimpleIconWidget CourseContent={item.CourseContent} onHoverShowContent={true} TooltipDirection={"bottom"}/></GridCell>
                            }.bind(this))}
                        </GridColumn>
                        {(function(){
                            let Users=Object.keys(this.props.AnswerableItems[0].UserSubmissions);

                            return Users.map(function(user){

                                    return <GridColumn>
                                        <GridCell><UserActionItem User={this.props.AnswerableItems[0].UserSubmissions[user].User}/></GridCell>
                                        {this.props.AnswerableItems.map(function(item,index){
                                            return <GradeCell Grade={Math.round(item.UserSubmissions[user].Grade)} />
                                        }.bind(this))}

                                    </GridColumn>;
                            }.bind(this))
                        }.bind(this))()}
                    </GridRow>
                </Grid>
            </div>
        }

        return (
            <div className="grades-grid">
                <CELOButton onClick={this.toggle} Text={"Switch"} Enabled={true} TooltipText={"Flip It"}/>
                <Grid>
                    <GridRow>
                         <GridColumn>
                                    {Object.values(this.props.AnswerableItems[0].UserSubmissions).map(function(item,index) {
                                        return <GridCell key={index}><UserActionItem User={item.User}/></GridCell>
                                    }.bind(this))}
                          </GridColumn>

                        {this.props.AnswerableItems.map(function(item,index){
                            return <GridColumn key={index}>
                                {Object.values(item.UserSubmissions).map(function(item){
                                    return <GradeCell Grade={Math.round(item.Grade)} />
                                }.bind(this))}
                                <GridCell><CourseContentSimpleIconWidget CourseContent={item.CourseContent} onHoverShowContent={true} TooltipDirection={"bottom"}/></GridCell>
                            </GridColumn>
                        }.bind(this))}
                    </GridRow>
                </Grid>
            </div>
        );
    }
}

export default GradesGrid;