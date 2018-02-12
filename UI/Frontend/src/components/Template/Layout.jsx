import React from 'react';
import {Link} from 'react-router';
import CELOLink from '../Tools/CELOLink.jsx';


const LayoutHeader=(props)=>
{
    let {className,Fixed,children,Header,Body,LeftSidePanel,RightSidePanel,Footer,...rest}=props;
    return <div className={"header"+(props.Fixed?"fixed ":"")+(props.className || "")}>
        {props.children?React.Children.map(props.children,function(child,index){
           return React.cloneElement(child,{...rest,key:index});
        }.bind(this)):null}
    </div>
};
const LayoutLeftSidePanel=(props)=>
{
    let {className,Fixed,children,Header,Body,LeftSidePanel,RightSidePanel,Footer,...rest}=props;
    return <div className={"left-side-panel "+(props.Fixed?"fixed ":"")+(props.className || "")} >
        {props.children?React.Children.map(props.children,function(child,index){
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null}
    </div>
};
const LayoutRightSidePanel=(props)=>
{
    let {className,Fixed,children,Header,Body,LeftSidePanel,RightSidePanel,Footer,...rest}=props;
    return <div className={"right-side-panel "+(props.Fixed?"fixed ":"")+(props.className || "")}>
        {props.children?React.Children.map(props.children,function(child,index){
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null}
    </div>
};
const LayoutFooter=(props)=>
{
    let {className,Fixed,children,Header,Body,LeftSidePanel,RightSidePanel,Footer,...rest}=props;
    return <div className={"footer"+(props.Fixed?"fixed ":"")+(props.className || "")}>
        {props.children?React.Children.map(props.children,function(child,index){
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null}
    </div>
};
const LayoutBody=(props)=>
{
    let {className,Fixed,children,Header,Body,LeftSidePanel,RightSidePanel,Footer,...rest}=props;
    return <div className={"body "+(props.className || "")} >
        {props.children?React.Children.map(props.children,function(child,index){
                return React.cloneElement(child,{...rest,key:index});
            }.bind(this)):null}
    </div>
};


export class Layout extends React.Component
{
    static Header=LayoutHeader;
    static Body=LayoutBody;
    static LeftSidePanel=LayoutLeftSidePanel;
    static RightSidePanel=LayoutRightSidePanel;
    static Footer=LayoutFooter;

    

    

    static propTypes={
        PageTitle:React.PropTypes.any,

    };


    render()
    {
        let Header=React.Children.toArray(this.props.children).find(child=>
            child.type==Layout.Header);

        let Body=React.Children.toArray(this.props.children).find(child=>
            child.type==Layout.Body) ;

        let LeftSidePanel=React.Children.toArray(this.props.children).find(child=>
            child.type==Layout.LeftSidePanel);

        let RightSidePanel=React.Children.toArray(this.props.children).find(child=>
            child.type==Layout.RightSidePanel)  ;

        let Footer=React.Children.toArray(this.props.children).find(child=>
            child.type==Layout.Footer)  ;

        let {children,PageTitle,className,Template,...rest}=this.props;

        if(Template)
        {
            let Components={};
            if(typeof Header !="undefined"){Components.Header=Header}
            if(typeof Body !="undefined"){Components.Body=Body}
            if(typeof LeftSidePanel !="undefined"){Components.LeftSidePanel=LeftSidePanel}
            if(typeof RightSidePanel !="undefined"){Components.RightSidePanel=RightSidePanel}
            if(typeof Footer !="undefined"){Components.Footer=Footer}

            let {children, Template, ...rest}=this.props;
            return <Template {...rest} {...Components} >
                        {this.props.children?React.cloneElement(this.props.children,{...rest,
                            Header:Header,
                            Body:Body,
                            LeftSidePanel:LeftSidePanel,
                            RightSidePanel:RightSidePanel,
                            Footer:Footer}):null}
                   </Template>
        }

        return <div className={"main-layout-root "+(window.scrollY!=0?"scrolled":"")}>
                 {Header?React.cloneElement(Header,rest):null}
                  <div className="main-body-container">
                      {LeftSidePanel?React.cloneElement(LeftSidePanel,rest):null}
                      {Body?React.cloneElement(Body,rest):null}
                      {RightSidePanel?React.cloneElement(RightSidePanel,rest):null}
                  </div>
                 {Footer?React.cloneElement(Footer,rest):null}
               </div>
    }
}


export const LayoutLink =(props)=>{
    return <div className="layout-link">
              <CELOLink {...props}/>
           </div>
};
export default Layout;