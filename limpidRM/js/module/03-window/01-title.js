function LIMScene_title_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_title_window.prototype = Object.create(Cotton.prototype);
LIMScene_title_window.prototype.constructor = LIMScene_title_window;
LIMScene_title_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
};
LIMScene_title_window.prototype.initImage = function() {
    this.img = {
        "window":["ui/windows","window"+Config.window],
        "pointer":["ui/windows"]
    }
}
LIMScene_title_window.prototype.initColor=function (){
    this._color={}
    this.setColor("back0","#f0f0f0")
    this.setColor("back1","#afafaf")
    this.setColor("window","#fff8")
    this.setColor("select","#4444")
}
LIMScene_title_window.prototype.initAdorn=function (){
    //绘制
    this.setNineTile("title_mes","window",World.canvasWidth,140,this.getColor("window"))
    this.setNineTile("title_select","window",World.canvasWidth*0.35,DataBase.isSave()?330:270,this.getColor("window"))
    this.setNineTile("text","window",140,140,this.getColor("window"))
    
    this.drawBack()
    
    this.setAdorn("back","back","",{},"100%","100%",0,0,0,5,1,0)
    this.setAdorn("win1","title_mes","",{},0,0,0,0,0,2,0,0)
    this.setAdorn("win2","title_select","",{},"100%","0",0,12,0,7,0,0)
    this.addText("cont", {anch: "win1",fontSize:30,fontFamily:"font",txt:"",adso:4,x:42})
}
LIMScene_title_window.prototype.initWork=function (){
    this.setWork("检查帧率","initFps","condFps","endFps")
    this.setWork("开始","initStart","condStart","endStart")
    this.setWork("新游戏","initNewgame","condNewgame","endNewgame")
    this.setWork("打开资料","initData","condData","endData")
}
LIMScene_title_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.setInput(["up","down","a"])
    
    
    if(LIM.Cache["显示标题"]) this.exeWork("开始")
    else this.exeWork("检查帧率")
}
/////////////////////////////////////////////////////////////
//工作
/////////////////////////////////////////////////////////////
LIMScene_title_window.prototype.initNewgame=function (){
    Scene.snapForBackground()
}
LIMScene_title_window.prototype.condNewgame=function (){
    if(Scene.snapshot) return true
}
LIMScene_title_window.prototype.endNewgame=function (){
    Scene.push(Lim_Theater)
}

LIMScene_title_window.prototype.initData=function (){
    Scene.snapForBackground()
}
LIMScene_title_window.prototype.condData=function (){
    if(Scene.snapshot) return true
}
LIMScene_title_window.prototype.endData=function (){
    Scene.push(Lim_Database)
}

LIMScene_title_window.prototype.initFps=function (){
    this.setAdorn("t1","text","",{},"1%","1%",-350,0,1,5,0,0)
    this.setAdorn("t2","text","",{},"1%","1%",-210,0,1,5,0,0)
    this.setAdorn("t3","text","",{},"1%","1%",-70,0,1,5,0,0)
    this.setAdorn("t4","text","",{},"1%","1%",70,0,1,5,0,0)
    this.setAdorn("t5","text","",{},"1%","1%",210,0,1,5,0,0)
    this.setAdorn("t6","text","",{},"1%","1%",350,0,1,5,0,0)
    this.drawAdorn()
    this.addText("t1", {anch: "t1",fontSize:112,fontFamily:"dot",txt:"L",adso:5,"fill":["#111","#333"]})
    this.addText("t2", {anch: "t2",fontSize:112,fontFamily:"dot",txt:"i",adso:5,"fill":["#222","#444"]})
    this.addText("t3", {anch: "t3",fontSize:112,fontFamily:"dot",txt:"m",adso:5,"fill":["#333","#666"]})
    this.addText("t4", {anch: "t4",fontSize:112,fontFamily:"dot",txt:"p",adso:5,"fill":["#666","#333"]})
    this.addText("t5", {anch: "t5",fontSize:112,fontFamily:"dot",txt:"i",adso:5,"fill":["#444","#222"]})
    this.addText("t6", {anch: "t6",fontSize:112,fontFamily:"dot",txt:"d",adso:5,"fill":["#333","#111"]})
}
LIMScene_title_window.prototype.condFps=function (){
    if(this.run.time<=180){
        const time=Utils.sinNum(180,this.run.time)
        this.moveAdorn("t1",{y:400*(1-time),h:(time*100)+"%",alpha:parseFloat(time)})
        this.moveAdorn("t2",{y:300*(1-time),h:(time*100)+"%",alpha:parseFloat(time)})
        this.moveAdorn("t3",{y:200*(1-time),h:(time*100)+"%",alpha:parseFloat(time)})
        this.moveAdorn("t4",{y:200*(1-time),h:(time*100)+"%",alpha:parseFloat(time)})
        this.moveAdorn("t5",{y:-300*(1-time),h:(time*100)+"%",alpha:parseFloat(time)})
        this.moveAdorn("t6",{y:-400*(1-time),h:(time*100)+"%",alpha:parseFloat(time)})
        
        this.setStyle("t1",{rota:360*time,sx:360*time,ox:time,oy:time})
        this.setStyle("t2",{rota:-360*time,sy:-360*time,ox:time,oy:time})
        this.setStyle("t3",{rota:360*time,sx:-360*time,ox:time,oy:time})
        this.setStyle("t4",{rota:-360*time,sy:360*time,ox:time,oy:time})
        this.setStyle("t5",{rota:360*time,sx:360*time,ox:time,oy:time})
        this.setStyle("t6",{rota:-360*time,sy:-360*time,ox:time,oy:time})
    }
    else if (this.run.time>=250&&this.run.time<=440){
        const time=Utils.sinNum(190,this.run.time-250)
        this.moveAdorn("t1",{rota:-360*time,alpha:parseFloat(1-time)})
        this.moveAdorn("t2",{rota:360*time,alpha:parseFloat(1-time)})
        this.moveAdorn("t3",{rota:-360*time,alpha:parseFloat(1-time)})
        this.moveAdorn("t4",{rota:360*time,alpha:parseFloat(1-time)})
        this.moveAdorn("t5",{rota:-360*time,alpha:parseFloat(1-time)})
        this.moveAdorn("t6",{rota:360*time,alpha:parseFloat(1-time)})

        this.setStyle("t1",{rota:360*time,ox:1-time,oy:1-time})
        this.setStyle("t2",{rota:-360*time,ox:1-time,oy:1-time})
        this.setStyle("t3",{rota:360*time,ox:1-time,oy:1-time})
        this.setStyle("t4",{rota:-360*time,ox:1-time,oy:1-time})
        this.setStyle("t5",{rota:360*time,ox:1-time,oy:1-time})
        this.setStyle("t6",{rota:-360*time,ox:1-time,oy:1-time})  
    }
    else if(this.run.time>440) {
        this.delText("t1")
        this.delText("t2")
        this.delText("t3")
        this.delText("t4")
        this.delText("t5")
        this.delText("t6")
    }
    if(this.run.time>440&&World.fpsCount>=60) return true
}
LIMScene_title_window.prototype.endFps=function (){
    this.exeWork("开始")
 
}

LIMScene_title_window.prototype.initStart=function (){
    if(!LIM.Cache["显示标题"])
        Conductor.play("flap")
    LIM.Cache["显示标题"]=true
}
LIMScene_title_window.prototype.condStart=function (){
    const time=Utils.sinNum(30,this.run.time)
    this.moveAdorn("win1",{w:(time*100)+"%",h:(time*100)+"%",alpha:parseFloat(time)})
    this.moveAdorn("win2",{h:(time*100)+"%",alpha:parseFloat(time)})
    if(this.run.time>=30) return true
}
LIMScene_title_window.prototype.endStart=function () {
    this.setAdorn("pointer", "pointer", "", {}, "100%", "100%", 25, 40, 0, 7, 0.2, 0)
    this.setAnime("pointer", ["alpha"], [80], 120, 2, "square")
    let y=35
    for (let i = 0; i < 5; i++) {
        if(i===1&&!DataBase.isSave()) continue
        const b = new Bitmap(World.canvasWidth * 0.35 - 25, 40)
        const name = "op" + (i + 1)
        this.addText(name, {anch:name,fontFamily:"font",txt: this.getOpText(i+1)})
        this.addBit(b, name)
        this.setAdorn(name, name, "OP", {index:(i+1)}, "100%", "100%", 12.5, y, 0, 7, 1, 0)
        y+=60
        this.touchAdorn(name,true)
    }
    this.drawAdorn()
    this._page=1
    this.OP_T({index:DataBase.isSave()?2:1,mute:true})
  
}
/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_title_window.prototype.OP_E=function(data){
    this.evokeAdorn("op"+data.index,true)
}
LIMScene_title_window.prototype.OP_T=function(data){
    const index=this.getNote("op_index")
    if(index!==data.index) {
        this.reduction_OP(index,data)
        this.setNote("op_index", data.index)
        this.grabBit("op"+data.index).fillAll(this.getColor("select"))
        this.moveAdorn("pointer",{y:this.adorn.data["op"+data.index].y+7})
        this.setText("cont",this.getOpCont(data.index),true)
        return true
    }
}
LIMScene_title_window.prototype.OP_Q=function(data){
    this.evokeAdorn("op"+data.index,false)
}
LIMScene_title_window.prototype.OP_K=function(data){
    if(this.getNote("op_index")===data.index) {
        Conductor.play("serect1")
        switch (data.index) {
            case 1:
                this.exeWork("新游戏")
                break
            case 3:
                this.openConf();
                break
            case 4:
                break
            case 5:
                this.exeWork("打开资料")
                break
        }
    }
}

LIMScene_title_window.prototype.reduction_OP=function (index,data) {
    if(!data||!data.mute) Conductor.play("cursor")
    this.grabBit("op"+index).clear()
}
/////////////////////////////////////////////////////////////
//按键
/////////////////////////////////////////////////////////////
LIMScene_title_window.prototype.Trigger_up_1=function (){this.Longkey_up_1()}
LIMScene_title_window.prototype.Trigger_down_1=function (){this.Longkey_down_1()}
LIMScene_title_window.prototype.Longkey_up_1=function (){
    const index=this.getNote("op_index")
    this.evokeAdorn("op"+index,false)
    switch (index){
        case 1:
            this.OP_T({index:5});
            break
        case 2:
        case 4:
        case 5:
            this.OP_T({index:index-1});
            break
        case 3:
            this.OP_T({index:index-(DataBase.isSave()?1:2)});

    }
}
LIMScene_title_window.prototype.Longkey_down_1=function (){
    const index=this.getNote("op_index")
    this.evokeAdorn("op"+index,false)
    switch (index){
        case 5:
            this.OP_T({index:1});break
        case 1:
            this.OP_T({index:index+(DataBase.isSave()?1:2)});
            break
        case 2:
        case 4:
        case 3:
            this.OP_T({index:index+1});
    }
}
LIMScene_title_window.prototype.WheelUp_1=function (){this.Longkey_up_1()}
LIMScene_title_window.prototype.WheelDown_1=function (){this.Longkey_down_1()}
LIMScene_title_window.prototype.Trigger_a_1=function (){this.OP_K({index:this.getNote("op_index")})}
/////////////////////////////////////////////////////////////
//翻页
/////////////////////////////////////////////////////////////
LIMScene_title_window.prototype.openConf=function (){
    this.setText("cont"," ",true)
    this.addExpel("OP")
    this.stopAnime("pointer", ["alpha"])
    this.moveAdorn("pointer",{alpha:1})
    this.moveAdorn("win1",{alpha:0})

    this._page=0

    const win= this.getWindow("t2")
    win.start()
    win.exeWork("开始")
}
LIMScene_title_window.prototype.closeConf=function (){
    this.setText("cont",this.getOpCont(this.getNote("op_index")),true)
    this.delExpel("OP")
    this.moveAdorn("pointer",{alpha:0.2})
    this.setAnime("pointer", ["alpha"], [80], 120, 2, "square")
    this.moveAdorn("win1",{alpha:1})
    this._page=1
}
/////////////////////////////////////////////////////////////
//绘制
/////////////////////////////////////////////////////////////
LIMScene_title_window.prototype.drawLanguage=function () {
    for (let i = 0; i < 5; i++) {
        if(i===1&&!DataBase.isSave()) continue
        const name = "op" + (i + 1)
        this.setText(name, this.getOpText(i+1))
    }
}
LIMScene_title_window.prototype.drawWindow=function () {
    let bit=ImageManager.loadBitmap("img/ui/windows/","window"+Config.window);
    bit.addLoadListener(()=>{
        this.addBit(bit,"window")
        this.setNineTile("title_mes","window",World.canvasWidth,140,this.getColor("window"))
        this.setNineTile("title_select","window",World.canvasWidth*0.35,DataBase.isSave()?330:270,this.getColor("window"))
        this.drawAdorn()
    })
}
LIMScene_title_window.prototype.drawBack=function (){
    const back = new Bitmap(World.canvasWidth,World.canvasHeight)
    back.fillStripedRoundedRect(0,0,World.canvasWidth,World.canvasHeight,0,5,this.getColor("back0"),this.getColor("back1"))
    this.addBit(back,"back")
}
/////////////////////////////////////////////////////////////
//数据
/////////////////////////////////////////////////////////////
LIMScene_title_window.prototype.getOpText=function (index){
    switch (index) {
        case 1:
            return Config.getText("新游戏")
        case 2:
            return Config.getText("继续游戏")
        case 3:
            return Config.getText("控制台")
        case 4:
            return Config.getText("网络空间")
        case 5:
            return Config.getText("资料集")
    }
}
LIMScene_title_window.prototype.getOpCont=function (index){
    switch (index) {
        case 1:
            return Config.getText("新游戏详细")
        case 2:
            return Config.getText("继续游戏详细")
        case 3:
            return Config.getText("控制台详细")
        case 4:
            return Config.getText("网络空间详细")
        case 5:
            return Config.getText("资料集详细")
    }
}