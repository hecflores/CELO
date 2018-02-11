import React from 'react';
import UnkownValueMatch from './UnkownValueMatch.jsx';

class ValueMatches extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentWillMount(){
        this.updateMatch(this.props);
    }
    componentWillReceiveProps(props){
        this.updateMatch(props);
    }
    updateMatch(props){

        /**
         * @var QuestionMatch
         */
        let match;

        /*******************************************************************/
        /* Find a Match                                                    */
        /*******************************************************************/
        React.Children.forEach(props.children,child=>{
            if(match){return;}

            if(child.props.match==props.__Value){
                match=child;
            }
        });

        /*******************************************************************/
        /* Properties that we will be using                                */
        /*******************************************************************/
        let Properties=props;
        let matchElement;
        /*******************************************************************/
        /* Found a Match                                                   */
        /*******************************************************************/
        if(match){
            matchElement = React.cloneElement(match, Properties);
        }
        else {
            /*******************************************************************/
            /* Unknown Question Type                                           */
            /*******************************************************************/
            matchElement = <UnkownValueMatch {...props}/>
        }
        this.setState({
            match:matchElement
        });
    }
    render()
    {
        return this.state.match || null;
    }
}

ValueMatches.propTypes={
    __Value:React.PropTypes.string  // Reason for __ it to make sure its not replaced
};


export default ValueMatches