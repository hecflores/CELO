import React from 'react';
import SectionLoader from './SectionLoader.jsx';
import SectionAPI from '../../libaries/APIs/SectionsAPI.jsx';
import APIComponent from '../Containers/APIComponent.jsx';
class SectionSaver extends  React.Component
{

    render(){
        let $this=this;
        let {children,...rest} =this.props.children;

        return <SectionLoader  {...rest} SectionID={this.props.SectionID} >
                    {function(loadedData){
                        return  <APIComponent Message="Saving Section Info..."  onSubmit={loadedData.onRefresh}  initialInput={{SectionID:this.props.SectionID,Course:{CourseUniqueID:loadedData["SectionInfo"]["Course"]["CourseUniqueID"]}}}  APIListener={SectionAPI.instance} Event="update">
                                {function (data, change, send, setData, isLoading, inputData) {
                                    let {
                                        SectionInfo,
                                        SectionID,
                                        APIListener,
                                        Event,
                                        Fetch,
                                        children,
                                        initialOutput,
                                        initialInput,
                                        isFetching,
                                        onChange,
                                        onFetching,
                                        onSubmit,
                                        ...wantedParams
                                    }=loadedData;

                                    let FinalData=
                                        {
                                            Loader: loadedData, // We want all of it just incase
                                            Saver: {
                                                CourseContent: data,
                                                onChange: change,
                                                onRefresh: send,
                                                isLoading: isLoading,
                                                ...rest,
                                                ...$this.state
                                            },



                                            /***************************************/
                                            /* Data Merged with Loader and Saver   */
                                            /***************************************/
                                            SectionInfo:$.extend(true,SectionInfo,inputData), // Any Input will replace content set
                                            SectionID:$this.props.SectionID,

                                            Load:Fetch,
                                            isLoading:isFetching,
                                            onLoading:onFetching,
                                            onLoaded:onSubmit,

                                            Save:data.Fetch,
                                            isSaving:data.isFetching,
                                            onSaving:data.onFetching,
                                            onSaved:data.onSubmit,
                                            onSave:send,

                                            onChange:change,
                                            setData:setData,

                                            Input:inputData,
                                            Data:SectionInfo,

                                            ...wantedParams

                                        };

                                    return React.Children.map($this.props.children, (child, index) => {
                                        return React.cloneElement(child, FinalData);
                                    });
                                }.bind(this)}
                        </APIComponent>
                    }.bind(this)}
               </SectionLoader>
    }
}

export default SectionSaver