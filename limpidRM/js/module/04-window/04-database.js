function LIMScene_database_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_database_window.prototype = Object.create(Cotton.prototype);
LIMScene_database_window.prototype.constructor = LIMScene_database_window;
LIMScene_database_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
    Conductor.play("shady",1)
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
    this.addBit(Scene.snapshot[1]||new Bitmap(1,1),"back0")
}
LIMScene_database_window.prototype.initColor=function (){
    this._color={}
    this.setColor("back0","#f0f0f0")
    this.setColor("back1","#afafaf")
    this.setColor("window","#fffb")
    this.setColor("select","#4444")
}
LIMScene_database_window.prototype.initAdorn=function (){
    this.drawBack()
    this.drawBack2()
    this.setAdorn("back","back","",{},"100%","100%",0,0,0,5,1,0)
    this.setAdorn("back1","back0","",{},"100%","100%","-25w","-25h",0,6,1,0)
    this.moveAdorn("back1",{fw:50,fh:50})
    this.setAdorn("back2","back0","",{},"100%","100%","-25w","25h",0,6,1,0)
    this.moveAdorn("back2",{fy:50,fw:50,fh:50})
    this.setAdorn("back3","back0","",{},"100%","100%","25w","-25h",0,6,1,0)
    this.moveAdorn("back3",{fx:50,fw:50,fh:50})
    this.setAdorn("back4","back0","",{},"100%","100%","25w","25h",0,6,1,0)
    this.moveAdorn("back4",{fx:50,fy:50,fw:50,fh:50})
    
    this.setNineTile("database_box","window",World.canvasWidth*0.8,100,this.getColor("window"))
    this.setNineTile("database_title","window",World.canvasWidth*0.3,80,this.getColor("window"))
}
LIMScene_database_window.prototype.initWork=function (){
    this.setWork("开始","initStart","condStart","endStart")
    this.setWork("打开音乐视窗","initMusic","condView","endMusic")
    this.setWork("退出音乐视窗","","condBackView","endBackView")
    
    this.setWork("打开图片视窗","initPhoto","condView","endPhoto")
    this.setWork("退出图片视窗","","condBackView","endBackView")

    this.setWork("打开通讯录视窗","initConta","condView","endConta")
    this.setWork("退出通讯录视窗","","condBackView","endBackView")
    
    this.setWork("退出","initExit","condExit","endExit")
}
LIMScene_database_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.setInput(["up","down","a","b","left","right"])
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
}
LIMScene_database_window.prototype.condStart=function (){
    if(this.run.time===200){
        this.delAdorn("back1")
        this.delAdorn("back2")
        this.delAdorn("back3")
        this.delAdorn("back4")
    }
    else if(this.run.time===50) 
        this.setAnime("back",["fw","fh"],[100,100],251,-1)
    else if(this.run.time>=270){
        const arr= this.getNote("列表")
        const time=Utils.sinNum(30,this.run.time-270)
        //出现选项
        if(this.run.time===270){
            this.drawRound()
            this.setAdorn("win1","database_box","",{},0,0,0,-10,0,2,0,0)
            this.setAdorn("win2","database_title","",{},0,0,-6,6,0,9,0,0)
            
            this.setAdorn("round","round","",{},0,0,-292,-24,0,2,0.20,0)
            this.setAnime("round",["alpha"],[15],80,2)
            for(let i=0;i<arr.length;i++)
                this.setAdorn("op"+(i+1), arr[i], "OP", {index: i + 1}, 64, 64, -292 + 72 * i, -28, 0, 2, 0, 0)
            this.drawAdorn()
        }
        this.moveAdorn("win1",{alpha:time,w:(100*time)+"%",h:(100*time)+"%"})
        this.moveAdorn("win2",{alpha:time,w:(100*time)+"%",h:(100*time)+"%"})
        if(this.run.time===300){
            this.addText("title", {anch: "win2",fontSize:30,fontFamily:"font",txt:"",adso:5})
            if(!Config.opmemory)
                this.OP_T({index:LIM.Cache["资料选项"]||1,mute:true})
            else
                this.OP_T({index:1,mute:true})
        }
    }
    if(this.run.time>=300) return true
}
LIMScene_database_window.prototype.endStart=function (){
    this.moveAdorn("back",{fw:100,fh:100})
    const arr= this.getNote("列表")
    for(let i=0;i<arr.length;i++)
        this.moveAdorn("op"+(i+1),{alpha:1})
    this._page=1
}


LIMScene_database_window.prototype.condBackView=function (){
    const time=1-Utils.sinNum(80,this.run.time)
    const arr=  this.getNote("列表")
    this.moveAdorn("win1",{y:(time*150)-10})
    this.moveAdorn("round",{alpha:0.2-time,y:(time*150)-24})
    for(let i=0;i<arr.length;i++) this.moveAdorn("op"+(i+1),{y:(time*150)-28})
    if(this.run.time>=80) return true
}
LIMScene_database_window.prototype.endBackView=function (){this.closeView()}

LIMScene_database_window.prototype.initMusic=function (){
    Conductor.pause(1)
    this.addExpel("OP")
}
LIMScene_database_window.prototype.condView=function (){
    const time=Utils.sinNum(80,this.run.time)
    const arr=  this.getNote("列表")
    this.moveAdorn("win1",{y:(time*150)-10})
    this.moveAdorn("round",{alpha:0.2-time,y:(time*150)-24})
    for(let i=0;i<arr.length;i++) this.moveAdorn("op"+(i+1),{y:(time*150)-28})
    if(this.run.time>=80) return true
}
LIMScene_database_window.prototype.endMusic=function (){this.openMusic()}

LIMScene_database_window.prototype.initPhoto=function (){
    this.addExpel("OP")
}
LIMScene_database_window.prototype.endPhoto=function (){this.openPhoto()}

LIMScene_database_window.prototype.initConta=function (){
    this.addExpel("OP")
}
LIMScene_database_window.prototype.endConta=function (){this.openConta()}


LIMScene_database_window.prototype.initExit=function (){
    this.setAdorn("back2","back2","",{},"100%","100%","0","0",0,5,0,0)
    this.drawAdorn()
}
LIMScene_database_window.prototype.condExit=function (){
    const time=Utils.sinNum(80,this.run.time)
    this.moveAdorn("win1",{y:(time*150)-10})
    this.moveAdorn("round",{alpha:0.2-time,y:(time*150)-24})
    const arr=  this.getNote("列表")
    for(let i=0;i<arr.length;i++) this.moveAdorn("op"+(i+1),{y:(time*150)-28})
    this.moveAdorn("win2",{x:time*World.canvasWidth*0.3})
    this.moveAdorn("back",{alpha:1-time})
    this.moveAdorn("back2",{alpha:time})
    if(this.run.time===80) Scene.snapForBackground(0)
    if(Scene.snapshot[0]) return true
}
LIMScene_database_window.prototype.endExit=function (){
    Conductor.stop(1)
    Scene.pop()
}
/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_database_window.prototype.OP_E=function(data){
    this.evokeAdorn("op"+data.index,true)
}
LIMScene_database_window.prototype.OP_T=function(data) {
    const index=this.getNote("op_index")
    if(index!==data.index) {
        if(!data||!data.mute) Conductor.play("cursor",0)
        this.setNote("op_index", data.index)
        this.setText("title",this.getOpText(data.index-1),true)
        LIM.Cache["资料选项"]=data.index
        this.moveAdorn("round",{x:-364+72*data.index,w:72,h:72})
        return true
    }
}
LIMScene_database_window.prototype.OP_K=function(data){
    if(this.getNote("op_index")===data.index) {
        Conductor.play("serect1",0)
        switch (data.index) {
            case 1:
                this.exeWork("打开音乐视窗")
                break
            case 2:
                this.exeWork("打开图片视窗")
                break
            case 3:
                this.exeWork("打开通讯录视窗")
                break
            case 4:
                Conductor.stop(1)
                break
            case 5:
                Conductor.clear(1)
                break
        }
    }
}
LIMScene_database_window.prototype.OP_Q=function(data){
    this.evokeAdorn("op"+data.index,false)
}
LIMScene_database_window.prototype.Back_1=function (){
    Conductor.play("serect3",0)
    this.exeWork("退出")
}
/////////////////////////////////////////////////////////////
//按键
/////////////////////////////////////////////////////////////
LIMScene_database_window.prototype.Trigger_b_1=function (){
    this.Back_1()
}
LIMScene_database_window.prototype.Trigger_a_1=function (){
    this.OP_K({index:this.getNote("op_index")})
}
LIMScene_database_window.prototype.Trigger_left_1=function (){
    this.Longkey_left_1()
    this.setNote("TL",performance.now())
}
LIMScene_database_window.prototype.Trigger_right_1=function (){
    this.Longkey_right_1()
    this.setNote("TR",performance.now())
}
LIMScene_database_window.prototype.Longkey_left_1=function (){
    if(performance.now()-(this.getNote("TL")||0) < this._now) return
    const index=this.getNote("op_index")
    this.evokeAdorn("op"+index,false)
    switch (index){
        case 1:
            this.OP_T({index:9});
            break
        default:
            this.OP_T({index:index-1});
    }
}
LIMScene_database_window.prototype.Longkey_right_1=function (){
    if(performance.now()-(this.getNote("TR")||0) < this._now) return
    const index=this.getNote("op_index")
    this.evokeAdorn("op"+index,false)
    switch (index){
        case 9:
            this.OP_T({index:1});
            break
        default:
            this.OP_T({index:index+1});
    }
}
/////////////////////////////////////////////////////////////
//翻页
/////////////////////////////////////////////////////////////
LIMScene_database_window.prototype.openMusic=function (){
    this._page=0
    const win= this.getWindow("t2")
    win.start()
    win.show()
    
    const mes= this.getWindow("mes")
    mes.start()
    mes.show(50)
    win.exeWork("开始")
}
LIMScene_database_window.prototype.openPhoto=function (){
    this._page=0
    const win= this.getWindow("t3")
    win.start()
    win.show()
    win.exeWork("开始")
}
LIMScene_database_window.prototype.openConta=function (){
    this._page=0
    const win= this.getWindow("t4")
    win.start()
    win.show()
    win.exeWork("开始")
}
LIMScene_database_window.prototype.closeView=function (){
    this.delExpel("OP")
    this.moveAdorn("round",{alpha:0.2})
    this._page=1
}

/////////////////////////////////////////////////////////////
//绘制
/////////////////////////////////////////////////////////////
LIMScene_database_window.prototype.drawBack=function (){
    const back = new Bitmap(World.canvasWidth,World.canvasWidth)
    back.fillLatticeRoundedRect(0,0,World.canvasWidth,World.canvasWidth,0,70,70,this.getColor("back0"),this.getColor("back1"))
    this.addBit(back,"back")
}
LIMScene_database_window.prototype.drawBack2=function (){
    const back = new Bitmap(World.canvasWidth,World.canvasHeight)
    back.fillStripedRoundedRect(0,0,World.canvasWidth,World.canvasHeight,0,5,this.getColor("back0"),this.getColor("back1"))
    this.addBit(back,"back2")
}
LIMScene_database_window.prototype.drawRound=function () {
    const b = new Bitmap(64,64)
    b.fillRoundedRect(0,0,64,64,4,"#000a")
    this.addBit(b,"round")
    const h=World.canvasHeight/2
}
/////////////////////////////////////////////////////////////
//数据
/////////////////////////////////////////////////////////////
LIMScene_database_window.prototype.getOpText=function (index){
    return this.getNote("列表")[index]
}

