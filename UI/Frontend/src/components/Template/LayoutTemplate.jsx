import React from 'react';
import Layout from './Layout.jsx';
class LayoutTemplate extends React.Component
{
    getHeader(){

        let {children,...rest}=this.props;

        return this.props.Header && this.props.Header.props.children?React.Children.map(this.props.Header.props.children,function(child,index){
                if(child==null){
                    return null;
                }
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null;

    }
    getBody(){
        let {children,...rest}=this.props;
        return this.props.Body && this.props.Body.props.children?React.Children.map(this.props.Body.props.children,function(child,index){
                if(child==null){
                    return null;
                }
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null;
    }
    getLeftSidePanel(){
        let {children,...rest}=this.props;
        return this.props.LeftSidePanel && this.props.LeftSidePanel.props.children?React.Children.map(this.props.LeftSidePanel.props.children,function(child,index){
                if(child==null){
                    return null;
                }
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null;
    }
    getRightSidePanel(){
        let {children,...rest}=this.props;
        return this.props.RightSidePanel && this.props.RightSidePanel.props.children?React.Children.map(this.props.RightSidePanel.props.children,function(child,index){
                if(child==null){
                    return null;
                }
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null;
    }
    getFooter(){
        let {children,...rest}=this.props;
        return this.props.Footer && this.props.Footer.props.children?React.Children.map(this.props.Footer.props.children,function(child,index){
                if(child==null){
                    return null;
                }
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null;
    }


}

export default LayoutTemplate;