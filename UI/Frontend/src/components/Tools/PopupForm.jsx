import React from 'react';
import {Modal} from 'react-bootstrap';
import CELOButton from './CELOButton.jsx';
import AjaxForm from '../Tools/AjaxForm.jsx';
import SubmitButton from '../Tools/SubmitButton.jsx';
import Loader from '../Containers/Loader.jsx';
class PopupForm extends  React.Component
{
    static defaultProps={
        
        okText:"Ok",
        OkEnabled:true,
        Title:"Popup",
        onSubmit:function(){},
        onClosed:function(){},
        beforeSubmit:function(){}
    };

    static propTypes={


        okText:React.PropTypes.any,
        Title:React.PropTypes.string,
        Show:React.PropTypes.bool.isRequired,
        onClosed:React.PropTypes.func,
        OkEnabled:React.PropTypes.bool,

        onValidChanged:React.PropTypes.func,
        beforeSubmit:React.PropTypes.func,
        onSubmit:React.PropTypes.func

    };
    state={
        isLoading:false
    };
    constructor(props){
        super(props);
        
        this.close=this.close.bind(this);

        this.beforeSubmit=this.beforeSubmit.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
    }
    close(){
        this.props.onClosed();
    }
    beforeSubmit(){
        this.setState({
            isLoading:true
        },()=>
        {
            this.props.beforeSubmit();
        });
    }
    onSubmit(){
        this.setState({
            isLoading:false
        },()=>
        {
            this.props.onSubmit();
        })
    }
    render()
    {
        let {onValidChanged,
            action,method,encType,
            ...rest}= this.props;

        let beforeSubmit=this.beforeSubmit;
        let onSubmit=this.onSubmit;
        return <Modal contentLabel={this.props.Title.replace(" ","")}
                           show={this.props.Show}
                           onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title id={this.props.Title}>{this.props.Title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div>
                            <AjaxForm method={method} encType={encType} onValidChanged={onValidChanged}  beforeSubmit={beforeSubmit} onSubmit={onSubmit} action={action} >

                                {this.props.children}

                                <div className="modal-footer">
                                    <CELOButton Enabled={true} onClick={this.close} TooltipText={"No thanks..."} Text={"Close"}/>

                                    {this.state.isLoading?<div className="btn btn-primary  disabled"><span className="spinner"/></div>:
                                    <SubmitButton TooltipText={"Ok, Lets Create it!"} Text={this.props.okText}  Type="primary"/>}
                                </div>
                            </AjaxForm>
                        </div>
                    </Modal.Body>

                </Modal>

    }
}

export default PopupForm