import React from 'react';

class CourseContentChildren extends React.Component
{
    static propTypes={
        onChildClick:React.PropTypes.func,
        Children:React.PropTypes.array,
        children:React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount()
    {

    }
    render(){
        if(typeof this.props.Children == "undefined"){
            return null;
        }
        let children=this.props.Children.sort(function(a,b){
            if(a.Type==b.Type){
                if(a.ContentID<b.ContentID){
                    return -1;
                }
                return 1;

            }
            let folderTypes=["folder","section","topic","week"];
            if(folderTypes.indexOf(a.Type)>=0 && folderTypes.indexOf(b.Type)<0){
               return -1;
            }
            if(folderTypes.indexOf(a.Type)<0 && folderTypes.indexOf(b.Type)>=0){
                return 1;
            }
            if(a.Type<b.Type){
                return -1;
            }
            return 1;

        });

        return (
            <div className={"course-content-children "+(this.props.className || "")}>
                {children.map(function(child,index){
                    return (<div key={index} className="course-content-child">
                                {this.props.children(child,index,this.props.onChildClick)}
                            </div>)
                }.bind(this))}
            </div>
        );
    }
}
export default CourseContentChildren