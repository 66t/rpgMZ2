function Dialogue(){this.initialize.apply(this, arguments);}
Dialogue.prototype = Object.create(Dialogue.prototype);
Dialogue.prototype.constructor = Dialogue;
Dialogue.prototype.initialize = function() {
   this.lnk="_"
   this.list=[]
   this.flow=[]
}
Dialogue.prototype.update=function (){
    if(this.inkPointer()) {
      if(LIM["$"+DataBase.inkPath]&&this.list.length>0) this.exe()
    }
    else {
        const s=this.lnk.split("_")
        DataBase.loadInk(s[0],s[1])
    }
}
Dialogue.prototype.setWork=function (com){
    this.list.push(com.split("|"))
}
Dialogue.prototype.exe=function (){
   const work=this.list.shift()
   switch (work[0]){
       case "lnk":
          this.setSceneLnk(work[1],work[2]);break
       case "add":
          this.setFlow(parseInt(work[1]),work[2],work[3]==="0");break
   }
}
Dialogue.prototype.setFlow=function (traje,name,bool){
    const data=bool?LIM["$"+DataBase.inkPath]:LIM["$article"]
    if(data[name]){
        const mes=data[name][Config.language]
        if(this.flow[traje]) this.flow[traje].push(mes)
        else this.flow[traje]=[mes]
    }
}
Dialogue.prototype.getFlow=function (traje){
   if(this.flow[traje]&&this.flow[traje].length) return this.flow[traje].shift()
   else return false    
}
Dialogue.prototype.setSceneLnk=function (scene,lnk){
    this.lnk=`${scene}_${lnk}`
}
Dialogue.prototype.inkPointer=function (){
    return this.lnk===DataBase.inkPointer
}

LIM.$Dialogue=new Dialogue()