function LIMScene_database_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_database_window.prototype = Object.create(Cotton.prototype);
LIMScene_database_window.prototype.constructor = LIMScene_database_window;
LIMScene_database_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
    Conductor.play("shady")
   
};
LIMScene_database_window.prototype.initImage = function() {
    this.img = {
        "window":["ui/windows","window"+Config.window],
        "卡牌图鉴":["ui/data"],
        "图像":["ui/data"],
        "地图":["ui/data"],
        "消息":["ui/data"],
        "笔记":["ui/data"],
        "联系人":["ui/data"],
        "资料":["ui/data"],
        "邮件":["ui/data"],
        "音乐":["ui/data"]
    }
    this.addBit(Scene.snapshot||new Bitmap(1,1),"back0")
}
LIMScene_database_window.prototype.initColor=function (){
    this._color={}
    this.setColor("back0","#f0f0f0")
    this.setColor("back1","#afafaf")
    this.setColor("window","#fff8")
    this.setColor("select","#4444")
}
LIMScene_database_window.prototype.initAdorn=function (){
    this.drawBack()
    this.setAdorn("back","back","",{},"100%","100%",0,0,0,5,1,0)
    this.setAdorn("back1","back0","",{},"100%","100%","-25w","-25h",0,6,1,0)
    this.moveAdorn("back1",{fw:50,fh:50})
    this.setAdorn("back2","back0","",{},"100%","100%","-25w","25h",0,6,1,0)
    this.moveAdorn("back2",{fy:50,fw:50,fh:50})
    this.setAdorn("back3","back0","",{},"100%","100%","25w","-25h",0,6,1,0)
    this.moveAdorn("back3",{fx:50,fw:50,fh:50})
    this.setAdorn("back4","back0","",{},"100%","100%","25w","25h",0,6,1,0)
    this.moveAdorn("back4",{fx:50,fy:50,fw:50,fh:50})
    
    this.setNineTile("box","window",World.canvasWidth*0.8,100,this.getColor("window"))
}
LIMScene_database_window.prototype.initWork=function (){
    this.setWork("开始","initStart","condStart","endStart")
}
LIMScene_database_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.setNote("列表", ["音乐","图像","联系人","地图","卡牌图鉴","消息","资料","笔记","邮件"])
    this.exeWork("开始")
}
/////////////////////////////////////////////////////////////
//工作
/////////////////////////////////////////////////////////////
LIMScene_database_window.prototype.initStart=function (){
    this.moveAdorn("back",{fw:0,fh:0})
    this.setAnime("back1",["sx","sy","y","alpha"],[-45,-45,World.canvasHeight/-2,-100],200,-1)
    this.setAnime("back2",["sx","sy","y","alpha"],[45,45,World.canvasHeight/2,-100],200,-1)
    this.setAnime("back3",["sx","sy","y","alpha"],[45,45,World.canvasHeight/-2,-100],200,-1)
    this.setAnime("back4",["sx","sy","y","alpha"],[-45,-45,World.canvasHeight/2,-100],200,-1)
    this.setAdorn("win1","box","",{},0,0,0,-10,0,2,0,0)
   
}
LIMScene_database_window.prototype.condStart=function (){
    if(this.run.time===200){
        this.delAdorn("back1")
        this.delAdorn("back2")
        this.delAdorn("back3")
        this.delAdorn("back4")
    }
    else if(this.run.time===50) this.setAnime("back",["fw","fh"],[100,100],251,-1)
    else if(this.run.time>=270){
        const time=Utils.sinNum(30,this.run.time-270)
        this.moveAdorn("win1",{w:(time*100)+"%",h:(time*100)+"%",alpha:parseFloat(time)})
        const arr=  this.getNote("列表")
        if(this.run.time===270){
            for(let i=0;i<arr.length;i++)
                this.setAdorn("data"+(i+1),arr[i],"",{},64,64,-292+72*i,-28,0,2,0,0)
        }
        for(let i=0;i<arr.length;i++) this.moveAdorn("data"+(i+1),{alpha:time})
    }
    
    if(this.run.time>=300) return true
}
LIMScene_database_window.prototype.endStart=function (){
    this.moveAdorn("back",{fw:100,fh:100})
    this.drawAdorn()
    this._page=1
}
/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_database_window.prototype.Back_1=function (){
    Conductor.play("serect3")
    Conductor.stop(1)
    Scene.pop()
}
/////////////////////////////////////////////////////////////
//绘制
/////////////////////////////////////////////////////////////
LIMScene_database_window.prototype.drawBack=function (){
    const back = new Bitmap(World.canvasWidth,World.canvasWidth)
    back.fillLatticeRoundedRect(0,0,World.canvasWidth,World.canvasWidth,0,70,70,this.getColor("back0"),this.getColor("back1"))
    this.addBit(back,"back")
}
