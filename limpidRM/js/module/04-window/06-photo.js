function LIMScene_photo_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_photo_window.prototype = Object.create(Cotton.prototype);
LIMScene_photo_window.prototype.constructor = LIMScene_photo_window;
LIMScene_photo_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
};
LIMScene_photo_window.prototype.initImage = function() {
    this.img = {
        "window":["ui/windows","window"+Config.window]
    }
}

LIMScene_photo_window.prototype.initColor=function (){
    this._color={}
    this.setColor("window","#fff8")
    this.setColor("select","#4444")
    this.setColor("val1","#39f")
    this.setColor("val2","#222")
    this.setColor("w","#fff")
    this.setColor("b","#000")
}
LIMScene_photo_window.prototype.initAdorn=function (){
    this.setNineTile("photo","window",World.canvasWidth,World.canvasHeight-90,this.getColor("window"))
    this.setNineTile("tool","window",World.canvasWidth*0.7-10,80,this.getColor("window"))
    this.setAdorn("win1","photo","",null,"100%","0%",0,0,0,2,0,0)
    this.setAdorn("win2","tool","",null,"0%","100%",5,5,0,7,0,0)
}
LIMScene_photo_window.prototype.initWork=function (){
    this.setWork("开始","initStart","condStart","endStart")
    this.setWork("关闭","","condEnd","endEnd")
}
LIMScene_photo_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    //声明该窗口监听的按键
}


LIMScene_photo_window.prototype.initStart=function (){}
LIMScene_photo_window.prototype.condStart=function (){
    const time = Utils.sinNum(80, this.run.time)
    this.moveAdorn("win1", {h: (time * 100) + "%", alpha: time})
    this.moveAdorn("win2", {w: (time * 100) + "%", alpha: time})
    if(this.run.time>=80) return true
}
LIMScene_photo_window.prototype.endStart=function (){
    this._page=1
}

LIMScene_photo_window.prototype.condEnd=function (){
    const time = 1- Utils.sinNum(80, this.run.time)
    this.moveAdorn("win1", {h: (time * 100) + "%", alpha: time})
    this.moveAdorn("win2", {w: (time * 100) + "%", alpha: time})
    if(this.run.time>=80) return true
}
LIMScene_photo_window.prototype.endEnd=function (){
    this._page=0
    this.stop()
    this.hide()
}
/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_photo_window.prototype.Back_1=function (){
    Conductor.play("serect3",0)
    this.exeWork("关闭")
    this.getWindow("t1").exeWork("退出音乐视窗")
}


