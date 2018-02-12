import React from 'react';
import $ from 'jquery';


class PopupUp extends React.Component {


    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div className="data-container">
                {this.props.children(this.state.data,this.onChangedTrigger,this.onSubmitTrigger,this.onSetDataTrigger)}
            </div>);
    }
}
PopupUp.propTypes = {
    Open:React.PropTypes.bool.isRequired,
    Closer:React.PropTypes.func.isRequired,
    Id:React.PropTypes.string.isRequired,
    Title:React.PropTypes.string.isRequired,
    children: React.PropTypes.element.isRequired,
    Buttons:React.PropTypes.array
};



export default DataContainer;