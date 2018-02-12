import React from 'react';
import Simple from '../Tools/Simple.jsx';
class FileUpload extends React.Component
{
    static contextTypes={
        isFormValid:React.PropTypes.bool,
        setFormValid:React.PropTypes.func,
        validFields:React.PropTypes.object
    };

    static propTypes={
        Name:React.PropTypes.string.isRequired,
        onChanged:React.PropTypes.func,
        isRequired:React.PropTypes.bool

    };
    static defaultProps={
        isRequired:true,
        onChanged:function(){}
    }
    state={
        file:false,
        fileName:false
    };
    constructor(props){
        super(props);

        this.onChanged=this.onChanged.bind(this);
        this.onClick=this.onClick.bind(this);
    }
    componentWillMount(){
        this.context.setFormValid(this.props.Name, !this.props.isRequired);
    }
    onChanged(e){

        this.context.setFormValid(this.props.Name, true);
        e.preventDefault();

        let finalData={[this.props.Name]:e.target.data};

        this.props.onChanged(finalData);


        this.setState({
            file:e.target.files[0],
            fileName:e.target.value.replace(/.*\\([^\\]+)$/,"$1")
        });
    }
    onClick(){
        $(this.input).click();
    }
    render(){
        return <div className="file-upload" onClick={this.onClick}>
                    <div className="container">
                        {this.state.file?<div className="container-text">{this.state.fileName}</div>:<div className="container-text">Upload</div> }
                    </div>


                    <input name={this.props.Name} onChange={this.onChanged} style={{display:"none"}} type="file" ref={(input)=>{this.input=input}}/>
               </div>
    }
}

export default FileUpload