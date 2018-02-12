import React from 'react';

class CoursesSaver extends React.Component
{


    render(){
        return <APIComponent Message="Saving Course..."  onSubmit={loadedData2.onRefresh}  initialInput={{id:this.props.CourseContentID}}  APIListener={CourseContentAPI.instance} Event="update-course-content">
            {function (data, change, send, setData, isLoading, inputData) {
                let {
                    CourseContent,
                    CourseContentID,
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

                        /***************************************/
                        /* Data Merged with Loader and Saver   */
                        /***************************************/
                        Course:$.extend(true,CourseContent,inputData), // Any Input will replace content set
                        CourseContentID:$this.props.CourseContentID,

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
                        Output:CourseContent,

                        ...wantedParams

                    };

                return React.Children.map($this.props.children, (child, index) => {
                    return React.cloneElement(child, FinalData);
                });
            }.bind(this)}
        </APIComponent>;
    }
}


export default CoursesSaver