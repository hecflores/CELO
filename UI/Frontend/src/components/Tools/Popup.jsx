import React from 'react';
import {Modal} from 'react-bootstrap';
import CELOButton from './CELOButton.jsx';
class Popup extends React.Component{

    static defaultProps={
        okText:"Ok",
        OkEnabled:true,
        Title:"Popup",
        onSubmit:function(){},
        onClosed:function(){},
    };
    static propTypes={
        okText:React.PropTypes.any,
        Title:React.PropTypes.string,
        Show:React.PropTypes.bool.isRequired,
        onClosed:React.PropTypes.func,
        onSubmit:React.PropTypes.func,
        OkEnabled:React.PropTypes.bool
    };


    constructor(props){
        super(props);

        this.close=this.close.bind(this);
    }
    close(){
        this.props.onClosed();
    }

    render(){
        return <div>
                    <Modal contentLabel={this.props.Title.replace(" ","")}
                        show={this.props.Show}
                        onHide={this.close}>
                        <Modal.Header>
                            <Modal.Title id={this.props.Title}>{this.props.Title}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {React.Children.only(this.props.children)}
                        </Modal.Body>

                        <Modal.Footer>
                            <CELOButton Enabled={true} onClick={this.close} TooltipText={"No thanks..."} Text={"Close"}/>
                            {(typeof this.props.okText == "string")?<CELOButton TooltipText={"Ok, Lets Create it!"} Enabled={this.props.OkEnabled} Text={this.props.okText} onClick={this.props.onSubmit} Type="primary"/>:
                                this.props.okText}
                        </Modal.Footer>


                    </Modal>
                </div>

    }
}

export default Popup