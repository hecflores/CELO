import React from 'react';
import $ from 'jquery';


class DataContainer extends React.Component {


    constructor(props)
    {
        super(props);
        this.state={
            data:props.defaultData
        };

        /*******************************************************************/
        this.onChangedTrigger=function(data)
        {
            //console.debug("DataContainer: onChangedTrigger("+")");
            let attr=this.state.data;
            attr=$.extend(true,attr,data);

            this.onSetDataTrigger(attr);
        }.bind(this);

        /*******************************************************************/
        this.onSubmitTrigger=function(attribute, value){

           //console.debug("DataContainer: onSubmitTrigger('"+attribute+"', '"+value+"')");
           this.props.onSubmit(this.state.data);

        }.bind(this);

        /*******************************************************************/
        this.onSetDataTrigger=function(data)
        {
            //console.debug("DataContainer: onSetDataTrigger(data:"+")");
            this.setState({data:data},function()
            {
                this.props.onChange(this.state.data);
            }.bind(this));

        }.bind(this);
    }
    componentWillReceiveProps(props){
        //console.debug("DataContainer: componentWillUpdate: defaultData: ");
        this.setState({data:$.extend(this.state.data,props.defaultData)});
    }
    componentDidMount()
    {
        //console.debug("DataContainer: componentDidMount");
        /* his.api.getListener().initiate(this.props.Event,this.state.data.input); */
    }
    render() {
        //console.debug("DataContainer: render: data:");
        return (
            <div className="data-container">
                {this.props.children(this.state.data,this.onChangedTrigger,this.onSubmitTrigger,this.onSetDataTrigger)}
            </div>);
    }
}
DataContainer.propTypes = {
    defaultData:React.PropTypes.object,
    onChange:React.PropTypes.func,
    onSubmit:React.PropTypes.func,
    onSetData:React.PropTypes.func,
    children: React.PropTypes.func,
};

DataContainer.defaultProps = {
    defaultData:{},
    children:function(data, onChange, onSubmit)
    {
        return (<div className="text-danger">No Data Entries Found</div> );
    },
    onSetData:function(data, onChange, onSubmit)
    {
        return (<div className="text-danger">No Data Entries Found</div> );
    },
    onSubmit:function(data, attribute, valueChanged)
    {
        return (<div className="text-danger">No Data Entries Found</div> );
    },
    onChange:function(data, onChange, onSubmit)
    {
        return (<div className="text-danger">No Data Entries Found</div> );
    },

};

export default DataContainer;