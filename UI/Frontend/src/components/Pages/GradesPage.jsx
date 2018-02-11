import StudentLayoutTemplate from '../LayoutTemplates/StudentLayoutTemplate.jsx';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
import Layout  from '../Template/Layout.jsx';
import GradesLoader from '../Grades/GradesLoader.jsx';
import GradesContext from '../Grades/GradesContext.jsx';
import GradesTable from '../Grades/GradesTable.jsx';
import React from 'react';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
class GradesPage extends UserRenderChooser{
    render(){
        return <GradesLoader >
                    <GradesContext>
                        <GradesTable SectionID={this.props.SectionInfo.SectionID}/>
                    </GradesContext>
                </GradesLoader>
    }
}

export default GradesPage