

class Simple{
    static convertStringToObjectRep(id,value){
        let splited=id.split(".");
        let str="";
        splited=[...splited];
        let lastRoot="obj";
        splited.forEach(function(key,index){
            if(index==splited.length-1){
                str+=lastRoot+"."+key+"=value; ";
                return;
            }

            str+=lastRoot+"."+key+"={}; ";
            lastRoot=lastRoot+"."+key;
        });

        let obj={};
        eval(str);

        return obj;
    }
}

export default Simple