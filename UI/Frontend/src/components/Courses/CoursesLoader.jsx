import React from 'react';
import APIComponent from '../Containers/APIComponent.jsx';
import CoursesAPI from '../../libaries/APIs/CoursesAPI.jsx';
import Loader from '../Containers/Loader.jsx';
class CoursesLoader extends React.Component
{
    componentDidMount(){
        CoursesAPI.instance.initiate("get");
    }
    render()
    {
        return <APIComponent Message="Loading Courses..." APIListener={CoursesAPI.instance} Event="get" >

                    {function(data,change,refresh,setData,isLoading){
                        if(!data){
                            return <div><Loader/>Loading Courses...</div>;
                        }
                        let {children,...rest}=this.props;

                        return this.props.children?(
                            React.Children.map(this.props.children,function(child,index){
                                let {children,...childRest}=child.props;
                                return React.cloneElement(child,{
                                    ...childRest,
                                    Courses:data,
                                    Refresh:refresh,
                                    ...rest
                                })
                            }.bind(this))):null
                    }.bind(this)}
               </APIComponent>;
    }
}

export default CoursesLoader