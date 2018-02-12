/**
 * Created by Hector on 4/5/2017.
 */

if (typeof jQuery === 'undefined') {
    throw new Error('SpiderHouse\'s JavaScript requires jQuery')
}

+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
        throw new Error('SpiderHouse\'s JavaScript requires jQuery version 1.11.1 or higher, but lower than version 3')
    }
}(jQuery);

/***************************************************************************/
/* Spider House                                                            */
/***************************************************************************/
function SpiderHouse(){}


/**
 * Generates the Path that will be the section.
 * @param circleSize Size of the Circle creating
 * @param percentageFinished Percentage that has been completed
 * @param percentageOfWhole Percentage relative to the whole circle
 * @param angleOffset Angle to Start
 * @return {string} Which is the path to be used
 */
SpiderHouse.generatePath=function(circleSize,percentageFinished, percentageOfWhole, angleOffset)
{
    var percentage=percentageFinished;
    var angleSize=(Math.PI*2)*percentageOfWhole;

    /***************************************************************/
    /* Helpful Angles                                              */
    /***************************************************************/
    var angleAtCenterOfSection=angleOffset+(angleSize/2);
    var angleSizeOfEnd=angleSize*(1.0-percentage);

    /***************************************************************/
    /* Get points at the outer size of circle                      */
    /***************************************************************/
    var angle1=angleOffset;
    var angle2=angleOffset+angleSize;

    var x1=Math.cos(angle1)*circleSize + (circleSize);
    var y1=Math.sin(angle1)*circleSize + (circleSize);

    var x2=Math.cos(angle2)*circleSize + (circleSize);
    var y2=Math.sin(angle2)*circleSize + (circleSize);

    /***************************************************************/
    /* Get points on inner side of circle                          */
    /***************************************************************/
    var circleSizeInner=circleSize*(1.0-percentage);
    var angle_inner1=angleAtCenterOfSection-(angleSizeOfEnd/2);
    var angle_inner2=angleAtCenterOfSection+(angleSizeOfEnd/2);

    var xInner1=Math.cos(angle_inner1)*circleSizeInner + (circleSize);
    var yInner1=Math.sin(angle_inner1)*circleSizeInner + (circleSize);

    var xInner2=Math.cos(angle_inner2)*circleSizeInner + (circleSize);
    var yInner2=Math.sin(angle_inner2)*circleSizeInner + (circleSize);

    return "M "+x1+","+y1+" A "+circleSize     +", "+circleSize     +", "+angle1      +", "+0+", "+1+", "+x2     +", "+y2     +" L "+xInner2+", "+yInner2+
        " A "+circleSizeInner+", "+circleSizeInner+", "+angle_inner1+", "+0+", "+0+", "+xInner1+", "+yInner1+" L "+x1     +", "+y1;
};


/**
 * Generates the Path needed for the progresses.
 * @param circleSize
 * @param progresses
 * @return {*|jQuery|HTMLElement}
 */
SpiderHouse.cretePathDom=function(circleSize,progresses)
{

    var angle=0;
    var angleChange=(Math.PI*2)/progresses.length;
    var htmlPath="<svg xml:space=\"preserve\" preserveAspectRatio='xMinYMin' xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 "+(circleSize*2.1)+" "+(circleSize*2.1)+"\"  height='"+((circleSize*2))+"px' width='"+((circleSize*2))+"px'>";
    progresses.forEach(function(item,index){
        var pathStr=SpiderHouse.generatePath(
            circleSize,                 // circleSize
            item["Grade"]/100.0,              // percentageFinished
            (1/progresses.length),  // percentageOfWhole,
            angle                 // angleOffset
        );
        angle+=angleChange;
        htmlPath+="<path d='"+pathStr+"' class='spider-house-section' spider-house='"+index+"'></path>";
    });
    htmlPath+="</svg>";
    return htmlPath;

};

