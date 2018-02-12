/**
 * Created by Hector on 5/6/2017.
 */

import React from 'react';
import DatePicker from 'react-bootstrap-date-picker';

class DateInput extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
        value:Date.now().toString()
    };
    static propTypes = {
        value:React.PropTypes.oneOfType([React.PropTypes.instanceOf(Date),React.PropTypes.string]),
        onChange:React.PropTypes.func.isRequired
    };

    state = {};


    constructor(props) {
        super(props);

        this.updateState=this.updateState.bind(this);

    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount

        this.updateMyDate(this.props);
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context

        this.updateMyDate(props);
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    updateMyDate(props){
        if(props.value instanceof Date){
            this.setState({
                value:props.value
            });
            return;
        }

        let date=Date.parse(props.value);
        if(date instanceof Date){
            this.updateMyDate({value:date});
        }

    }
    updateState(value){
        this.setState({
            value:value
        },()=>{
            this.props.onChange({target:{value:this.state.value}});
        })
    }
    render() {
        return (<DatePicker onBlur={()=>{this.onCommit()}} calendarContainer={document.body} autoFocus={false} id="date-picker"  value={this.state.value} onChange={this.updateState}/>);
    }
}

export default DateInput;