function LIMScene_config_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_config_window.prototype = Object.create(Cotton.prototype);
LIMScene_config_window.prototype.constructor = LIMScene_config_window;
LIMScene_config_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
};
LIMScene_config_window.prototype.initImage = function() {
    this.img = {
        "window":["ui/windows","window"+Config.window],
        "pointer":["ui/windows"]
    }
}
LIMScene_config_window.prototype.initColor=function (){
    this._color={}
    this.setColor("window","#fff8")
    this.setColor("select","#4444")
}
LIMScene_config_window.prototype.initAdorn=function (){
    const wh=World.canvasHeight-480
    const ww= World.canvasWidth*0.5
    this.setNineTile("config_select","window",ww,World.canvasHeight-140,this.getColor("window"))
    this.setNineTile("config_mes","window",World.canvasWidth,140,this.getColor("window"))
    this.setNineTile("config_val","window",ww/4*3,wh,this.getColor("window"))

    this.setAdorn("win1","config_select","",{},"100%","100%",0,0,0,9,1,0)
    this.setAdorn("win2","config_mes","",{},"100%","100%",0,0,0,2,1,0)
    this.setAdorn("win3","config_val","",{},"100%","100%",ww/8,-140,0,1,1,0)
    this.addText("cont", {anch: "win2",fontSize:30,fontFamily:"font",txt:"",adso:4,x:42})
    this.addText("val", {anch: "win3",fontSize:30,fontFamily:"font",txt:"",adso:5})

    this.setAdorn("right","pointer","right",{},"100%","100%",ww-48,-140-wh/2+12,0,1,1,0)
    this.setAdorn("left","pointer","left",{},"100%","100%",36,-140-wh/2+12,0,1,1,180)
    this.setAnime("left", ["x"], [-3], 120, 2)
    this.setAnime("right", ["x"], [3], 120, 2)
    this.evokeAdorn("left",true)
    this.evokeAdorn("right",true)

    const cw=World.canvasWidth*-0.5
    this.setAdorn("pointer", "pointer", "", {}, "100%", "100%", cw+40, 0, 0, 9, 0.2, 0)
    this.setAnime("pointer", ["alpha"], [80], 120, 2, "square")
    for (let i = 0; i < 6; i++) {
        const b = new Bitmap(cw*-1-25, 40)
        const name = "op" + (i + 1)
        this.addText(name, {anch:name,fontSize:20,fontFamily:"font",txt:this.getOpText(i+1),adso:4,x:45})
        this.addText(name+"txt", {anch:name,fontSize:20,fontFamily:"font",txt:this.getOpVal(i+1),adso:6,x:-10})

        this.addBit(b, name)
        this.setAdorn(name, name, "OP", {index:(i+1)}, "100%", "100%", -12.5, i*45+22, 0, 9, 1, 0)
        this.touchAdorn(name,true)
    }
}
LIMScene_config_window.prototype.initWork=function (){
    this.setWork("开始","init","condStart","endStart")
    this.setWork("关闭","","condEnd","endEnd")
}
LIMScene_config_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.setInput(["up","down","a","b","left","right"])
    this.OP_T({index:1,mute:true})
}
/////////////////////////////////////////////////////////////
//工作
/////////////////////////////////////////////////////////////
LIMScene_config_window.prototype.initStart=function (){}
LIMScene_config_window.prototype.condStart=function (){
    this.alpha=Utils.sinNum(5,this.run.time)
    if(this.run.time>=5) return true
}
LIMScene_config_window.prototype.endStart=function () {
   this._page=1
}

LIMScene_config_window.prototype.condEnd=function (){
    this.alpha=1-Utils.sinNum(5,this.run.time)
    if(this.run.time>=5) return true
}
LIMScene_config_window.prototype.endEnd=function (){
    this._page=0
}
/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_config_window.prototype.OP_E=function(data){
    this.evokeAdorn("op"+data.index,true)
}
LIMScene_config_window.prototype.OP_T=function(data){
    const index=this.getNote("op_index")
    if(index!==data.index) {
        this.reduction_OP(index,data)
        this.setNote("op_index", data.index)
        this.grabBit("op"+data.index).fillAll(this.getColor("select"))
        this.moveAdorn("pointer",{y:this.adorn.data["op"+data.index].y+7})
        this.setText("cont",this.getOpCont(data.index),true)
        this.setText("val",this.getOpVal(data.index))
        
        return true
    }
}
LIMScene_config_window.prototype.OP_Q=function(data){
    this.evokeAdorn("op"+data.index,false)
}
LIMScene_config_window.prototype.OP_K=function(data){
    if(this.getNote("op_index")===data.index) {
        this.Longkey_right_1()
    }
}

LIMScene_config_window.prototype.reduction_OP=function (index,data) {
    if(!data||!data.mute) Conductor.play("cursor")
    this.grabBit("op"+index).clear()
}
LIMScene_config_window.prototype.left_K=function(data){
    this.Longkey_left_1()
}
LIMScene_config_window.prototype.right_K=function(data){
   this.Longkey_right_1()
}
LIMScene_config_window.prototype.Back_1=function (){
    Conductor.play("serect3")
    this.exeWork("关闭")
    this.getWindow("t1").closeConf()
}
/////////////////////////////////////////////////////////////
//按键
/////////////////////////////////////////////////////////////
LIMScene_config_window.prototype.Trigger_b_1=function (){
    this.Back_1()
}
LIMScene_config_window.prototype.Trigger_a_1=function (){
    this.Longkey_right_1()
}
LIMScene_config_window.prototype.Longkey_a_1=function (){
    this.Longkey_right_1()
}

LIMScene_config_window.prototype.Trigger_up_1=function (){this.Longkey_up_1()}
LIMScene_config_window.prototype.Trigger_down_1=function (){this.Longkey_down_1()}
LIMScene_config_window.prototype.Longkey_up_1=function (){
    const index=this.getNote("op_index")
    this.evokeAdorn("op"+index,false)
    switch (index){
        case 1:
            this.OP_T({index:6});
            break
        default:
            this.OP_T({index:index-1});
    }
}
LIMScene_config_window.prototype.Longkey_down_1=function (){
    const index=this.getNote("op_index")
    this.evokeAdorn("op"+index,false)
    switch (index){
        case 6:
            this.OP_T({index:1});
            break
        default:
            this.OP_T({index:index+1});
    }
}

LIMScene_config_window.prototype.Trigger_left_1=function (){this.Longkey_left_1()}
LIMScene_config_window.prototype.Trigger_right_1=function (){this.Longkey_right_1()}
LIMScene_config_window.prototype.Longkey_left_1=function (){
    const index=this.getNote("op_index")
    Conductor.play("cursor")
    this.setAnime("left", ["alpha"], [-100], 20, -1)
    let arr,num
    switch (index){
        case 1:
            arr=Config.select.language
            num=arr.indexOf(Config.language)-1
            Config.language=(arr[num<0?arr.length-1:num])
            this.getWindow("t1").drawLanguage()
            break
        case 2:
            arr=Config.select.window
            num=arr.indexOf(Config.window)-1
            Config.window=(arr[num<0?arr.length-1:num])
            this.drawWindow()
            break
        case 3:
            arr=Config.select.textspeed
            num=arr.indexOf(Config.textspeed)-1
            Config.textspeed=(arr[num<0?arr.length-1:num])
            break
        case 4:
            arr=Config.select.volume
            num=arr.indexOf(Config.Volume)-1
            Config.Volume=(arr[num<0?arr.length-1:num])
            Tone.Master.mute = false
            break
        case 5:
            arr=Config.select.seVolume
            num=arr.indexOf(Config.seVolume)-1
            Config.seVolume=(arr[num<0?arr.length-1:num])
            Tone.Master.mute = false
            break
        case 6:
            arr=Config.select.bgmVolume
            num=arr.indexOf(Config.bgmVolume)-1
            Config.bgmVolume=(arr[num<0?arr.length-1:num])
            Tone.Master.mute = false
            break
    }
    this.drawLanguage(index)
}
LIMScene_config_window.prototype.Longkey_right_1=function (){
    const index=this.getNote("op_index")
    Conductor.play("cursor")
    this.setAnime("right", ["alpha"], [-100], 20, -1)
    let arr
    switch (index){
        case 1:
            arr=Config.select.language
            Config.language=(arr[(arr.indexOf(Config.language)+1)%arr.length])
            this.getWindow("t1").drawLanguage()
            break
        case 2:
            arr=Config.select.window
            Config.window=(arr[(arr.indexOf(Config.window)+1)%arr.length])
            this.drawWindow()
            break
        case 3:
            arr=Config.select.textspeed
            Config.textspeed=(arr[(arr.indexOf(Config.textspeed)+1)%arr.length])
            break
        case 4:
            arr=Config.select.volume
            Config.Volume=(arr[(arr.indexOf(Config.Volume)+1)%arr.length])
            Tone.Master.mute = false
            break
        case 5:
            arr=Config.select.seVolume
            Config.seVolume=(arr[(arr.indexOf(Config.seVolume)+1)%arr.length])
            Tone.Master.mute = false
            break
        case 6:
            arr=Config.select.bgmVolume
            Config.bgmVolume=(arr[(arr.indexOf(Config.bgmVolume)+1)%arr.length])
            Tone.Master.mute = false
            break
    }
    this.drawLanguage(index)
}
/////////////////////////////////////////////////////////////
//滚轮
/////////////////////////////////////////////////////////////
LIMScene_config_window.prototype.WheelUp_1=function (){this.Longkey_up_1()}
LIMScene_config_window.prototype.WheelDown_1=function (){this.Longkey_down_1()}
/////////////////////////////////////////////////////////////
//绘制
/////////////////////////////////////////////////////////////
LIMScene_config_window.prototype.drawWindow=function () {
   let bit=ImageManager.loadBitmap("img/ui/windows/","window"+Config.window);
   bit.addLoadListener(()=>{
       this.addBit(bit,"window")
       const wh=World.canvasHeight-480
       const ww= World.canvasWidth*0.5
       this.setNineTile("config_select","window",ww,World.canvasHeight-140,this.getColor("window"))
       this.setNineTile("config_mes","window",World.canvasWidth,140,this.getColor("window"))
       this.setNineTile("config_val","window",ww/4*3,wh,this.getColor("window"))
       this.drawAdorn()
   })
    this.getWindow("t1").drawWindow()
}
LIMScene_config_window.prototype.drawLanguage=function (index) {
    for (let i = 0; i < 6; i++) {
        const name = "op" + (i + 1)
        this.setText(name, this.getOpText(i+1))
        this.setText(name+"txt", this.getOpVal(i+1))
    }
    this.setText("cont",this.getOpCont(index),false)
    this.setText("val",this.getOpVal(index))
    LIM.$Identity.save(-1)
}
/////////////////////////////////////////////////////////////
//数据
/////////////////////////////////////////////////////////////
LIMScene_config_window.prototype.getOpVal=function (index){
    switch (index) {
        case 1:
            return Config.getText(Config.language)
        case 2:
            return Config.getText("样式")+Config.window
        case 3:
            return Config.getText("textspeed_"+(Config.textspeed*100)+"%")
        case 4:
            return Math.round(Config.Volume*100)+"%"
        case 5:
            return Math.round(Config.seVolume*100)+"%"
        case 6:
            return Math.round(Config.bgmVolume*100)+"%"
    }
}
LIMScene_config_window.prototype.getOpText=function (index){
    switch (index) {
        case 1:
            return Config.getText("语言")
        case 2:
            return Config.getText("窗口样式")
        case 3:
            return Config.getText("文本速度")
        case 4:
            return Config.getText("游戏音量")
        case 5:
            return Config.getText("音效音量")
        case 6:
            return Config.getText("背景音量")
    }
}
LIMScene_config_window.prototype.getOpCont=function (index){
    switch (index) {
        case 1:
            return Config.getText("语言详细")
        case 2:
            return Config.getText("窗口样式详细")
        case 3:
            return Config.getText("文本速度详细")
        case 4:
            return Config.getText("游戏音量详细")
        case 5:
            return Config.getText("音效音量详细")
        case 6:
            return Config.getText("背景音量详细")
    }
}