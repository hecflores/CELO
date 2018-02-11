import React from 'react';
import FileUpload from '../Tools/FileUpload.jsx';
class FileCourseContentCreation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div>
                  <FileUpload Name={"Json[Properties][File]"} onChanged={this.props.onChange}/>
                </div>
    }
}

export default FileCourseContentCreation
