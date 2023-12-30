function LIMScene_contacts_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_contacts_window.prototype = Object.create(Cotton.prototype);
LIMScene_contacts_window.prototype.constructor = LIMScene_contacts_window;
LIMScene_contacts_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
  
};
LIMScene_contacts_window.prototype.initImage = function() {
    this.img = {
        "window":["ui/windows","window"+Config.window],
        "pointer":["ui/windows"],
    }
}
LIMScene_contacts_window.prototype.initColor=function (){
    this._color={}
    this.setColor("window","#fffb")
    this.setColor("select","#4444")
    this.setColor("val1","#39f")
    this.setColor("val2","#222")
    this.setColor("w","#fff")
    this.setColor("b","#000")
}
LIMScene_contacts_window.prototype.initAdorn=function () {
    const bgm=new Bitmap(World.canvasWidth*0.4-36,36)
    bgm.fillAll(this.getColor("select"))
    this.addBit(bgm,"select")
    
    this.setNineTile("contacts_list", "window", World.canvasWidth*0.3, World.canvasHeight - 96, this.getColor("window"))
    this.setNineTile("contacts_box", "window", World.canvasWidth*0.7-12, World.canvasHeight-12, this.getColor("window"))
    this.setAdorn("win1","contacts_list","",null,"100%","0%",-6,-6,0,3,0,0)
    this.setAdorn("win2","contacts_box","",null,"0%","0%",3,-6,0,1,1,0)
}
LIMScene_contacts_window.prototype.initWork=function (){
    this.setWork("开始","initStart","condStart","endStart")
    this.setWork("关闭","","condEnd","endEnd")
}
LIMScene_contacts_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.setNote("通信录列表",Object.keys(LIM.$actors))
    this.setInput(["up","down","a","b"])
    if(!Config.opmemory) {
        LIM.Cache["通信录顶序"] = LIM.Cache["通信录顶序"]||0
    }
    else {
        LIM.Cache["通信录顶序"]=0
    }
    this.drawAcAdorn()
    this.drawAdorn()
}
/////////////////////////////////////////////////////////////
//工作
/////////////////////////////////////////////////////////////
LIMScene_contacts_window.prototype.initStart=function (){
    this.drawPage()
}
LIMScene_contacts_window.prototype.condStart=function (){
    const time = Utils.sinNum(80, this.run.time)
    this.moveAdorn("win1", {h: (time * 100) + "%", alpha: time})
    this.moveAdorn("win2", {w: (time * 100) + "%",h: (time * 100) + "%", alpha: time})
    
    if(this.run.time>60) {
        const time = Utils.sinNum(20, this.run.time-60)
        for (let i = 0; i < 10; i++) {
            this.setStyle("op" + (1 + i), {ox: time, alpha: time, oy: time})
        }
    }
    if(this.run.time>=80) return true
}
LIMScene_contacts_window.prototype.endStart=function (){
    this._page=1
}
LIMScene_contacts_window.prototype.condEnd=function (){
    const time = 1-Utils.sinNum(80, this.run.time)
    this.moveAdorn("win1", {h: (time * 100) + "%", alpha: time})
    this.moveAdorn("win2", {w: (time * 100) + "%",h: (time * 100) + "%", alpha: time})
    if(this.run.time<=20) {
        const time = 1-Utils.sinNum(20, this.run.time)
        for (let i = 0; i < 10; i++) {
            this.setStyle("op" + (1 + i), {ox: time, alpha: time, oy: time})
        }
    }
    if(this.run.time>=80) return true
}
LIMScene_contacts_window.prototype.endEnd=function (){
    this.hideHandler()
    this.stop()
    this.hide()
}
/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_contacts_window.prototype.Back_1=function (){
    this._page=0
    Conductor.play("serect3",0)
    this.moveAdorn("up",{alpha:0})
    this.moveAdorn("down",{alpha:0})
    this.exeWork("关闭")
    this.getWindow("t1").exeWork("退出通讯录视窗")
    return true
}
/////////////////////////////////////////////////////////////
//绘制
/////////////////////////////////////////////////////////////
LIMScene_contacts_window.prototype.drawPage=function (){
    const list=this.getNote("通信录列表")
    for(let i=0;i<10;i++) {
        const actors=list[i + LIM.Cache["通信录顶序"]]
        if(actors) {
            const name = LIM.$text[actors][Config.language]
            if(DataBase._globalInfo.actors.indexOf(actors)>-1)
               this.setText("op"+(1+i),name,false)
            else
               this.setText("op"+(1+i),name.replace(/./g, '?'),false)
        }
    }
    this.moveAdorn("up",{alpha:LIM.Cache["通信录顶序"]?1:0})
    this.moveAdorn("down",{alpha:LIM.Cache["通信录顶序"]+10>=list.length?0:1})
}
LIMScene_contacts_window.prototype.drawAcAdorn=function (){

    const bgm=new Bitmap(World.canvasWidth*0.3-24,40)
    bgm.fillAll(this.getColor("select"))
    this.addBit(bgm,"list")
    
    for (let i = 0; i < 10; i++) {
        const name = "op"+(i+1)
        this.setAdorn(name, "list", "OP", {index:(i+1)}, "100%", "100%", -18, i*44+112, 0, 9, 0, 0)
        this.addText(name, {anch: name,fontSize:22,fontFamily:"font",txt:"",adso:5})
        this.setStyle(name,{ox:0,alpha:0})
        this.touchAdorn(name,true)
    }
    this.setAdorn("up","pointer","UP",{},"100%","100%",World.canvasWidth*-0.15,90,0,9,1,270)
    this.setAdorn("down","pointer","DOWN",{},"100%","100%",World.canvasWidth*-0.15,-6,0,3,1,90)
    this.evokeAdorn("up",true)
    this.evokeAdorn("down",true)
}