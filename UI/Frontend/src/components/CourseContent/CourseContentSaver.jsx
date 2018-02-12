import React from 'react';
import APIComponent from 'components/Containers/APIComponent.jsx';
import CourseContentAPI from "../../libaries/APIs/CourseContentAPI.jsx";
import CourseContentLoader from './CourseContentLoader.jsx';
import $ from "jquery";
class CourseContentSaver extends React.Component{
    static propTypes={
        CourseContentID:React.PropTypes.number.isRequired

    };

    constructor(props){
        super(props);
    }

    render()
    {
        let $this=this;

        return  <CourseContentLoader {...this.props} CourseContentID={this.props.CourseContentID} >
                        {function(loadedData2) {
                            var loadedData=loadedData2;
                            return <APIComponent Message="Saving Course Content..."  onSubmit={loadedData2.onRefresh}  initialInput={{id:this.props.CourseContentID}}  APIListener={CourseContentAPI.instance} Event="update-course-content">
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
                                        Loader: loadedData, // We want all of it just incase
                                        Saver: $.extend(
                                            {
                                                CourseContent: data,
                                                onChange: change,
                                                onRefresh: send,
                                                isLoading: isLoading,
                                            },
                                            $this.props,
                                            $this.state
                                        ),

                                        /***************************************/
                                        /* Data Merged with Loader and Saver   */
                                        /***************************************/
                                        CourseContent:$.extend(true,CourseContent,inputData), // Any Input will replace content set
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
                                        Data:CourseContent,

                                        ...wantedParams

                                    };

                                    return React.Children.map($this.props.children, (child, index) => {
                                        return React.cloneElement(child, FinalData);
                                    });
                                }.bind(this)}
                            </APIComponent>;
                        }.bind(this)}
                    </CourseContentLoader>


    }
}



export default CourseContentSaver