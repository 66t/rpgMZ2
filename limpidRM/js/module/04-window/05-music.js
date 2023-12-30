function LIMScene_music_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_music_window.prototype = Object.create(Cotton.prototype);
LIMScene_music_window.prototype.constructor = LIMScene_music_window;
LIMScene_music_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
};
LIMScene_music_window.prototype.initImage = function() {
    this.img = {
        "window":["ui/windows","window"+Config.window],
        "pointer":["ui/windows"],
        "播放":["ui/data"],
        "暂停":["ui/data"],
        "静音":["ui/data"],
        "音量":["ui/data"]
    }
}
LIMScene_music_window.prototype.initColor=function (){
    this._color={}
    this.setColor("window","#fffb")
    this.setColor("select","#4444")
    this.setColor("val1","#39f")
    this.setColor("val2","#222")
    this.setColor("w","#fff")
    this.setColor("w3","#fff3")
    this.setColor("b","#000")
}
LIMScene_music_window.prototype.initAdorn=function () {
    this.setNineTile("music_list","window",World.canvasWidth*0.4,World.canvasHeight-140,this.getColor("window"))
    this.setNineTile("music_data","window",World.canvasWidth*0.6,World.canvasHeight-240,this.getColor("window"))
    this.setNineTile("music_tool","window",World.canvasWidth,140,this.getColor("window"))
    
    const bgm=new Bitmap(World.canvasWidth*0.4-36,36)
    bgm.fillAll(this.getColor("select"))
    this.addBit(bgm,"list")

    const data=new Bitmap(World.canvasWidth,World.canvasHeight)
    this.addBit(data,"bgmdata")
    
    this.setAdorn("bgmdata","bgmdata","",{},"100%","100%",0,0,0,5,0,0)
    this.setAdorn("win1","music_list","",{},"0","100%",0,0,0,7,0,0)
    this.setAdorn("win2","music_tool","",{},"100%","0",0,0,0,2,0,0)
    this.setAdorn("win3","music_data","",{},"0","100%",0,100,0,9,0,0)
}
LIMScene_music_window.prototype.initWork=function (){
    this.setWork("开始","initStart","condStart","endStart")
    this.setWork("关闭","","condEnd","endEnd")
    this.setWork("播放","","condPlay","endPlay")
}
LIMScene_music_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.setInput(["up","down","a","b"])
    this.getBgm()
    if(!Config.opmemory) {
        LIM.Cache["音乐标签"] = LIM.Cache["音乐标签"] || 1
        LIM.Cache["音乐顶序"] = LIM.Cache["音乐顶序"]||0
        LIM.Cache["原音量"]=Config.bgmVolume
        LIM.Cache["音乐音量"] = LIM.Cache["音乐音量"]||(Config.bgmVolume*100)
    }
    else {
        LIM.Cache["音乐标签"]=1
        LIM.Cache["音乐顶序"]=0
        LIM.Cache["原音量"]=Config.bgmVolume
        LIM.Cache["音乐音量"]=100
    }
    this.drawToolAdorn()
    this.drawBgmAdorn()
    this.drawAdorn()
}
/////////////////////////////////////////////////////////////
//工作
/////////////////////////////////////////////////////////////
LIMScene_music_window.prototype.initStart=function (){
    this.drawPage()
    this.BGM_T({index:LIM.Cache["音乐标签"],mute:true})
    this.grabBit("bgmdata").clear()
}
LIMScene_music_window.prototype.condStart=function (){
    if(this.run.time<=80) {
        const time = Utils.sinNum(80, this.run.time)
        this.moveAdorn("win1", {w: (time * 100) + "%", alpha: time})
        this.moveAdorn("win2", {h: (time * 100) + "%", alpha: time})
        this.moveAdorn("win3", {w: (time * 100) + "%", alpha: time})
        for (let i = 0; i < 10; i++) {
            this.moveAdorn("bgm" + (1 + i), {w: (time * 100) + "%", h: (time * 100) + "%", y: 28 + (38 * i) * time})
            this.setStyle("bgm" + (1 + i), {ox: time, alpha: time})
        }
    }
    else{
        const time = Utils.sinNum(20, this.run.time-80)
        this.setStyle("txt1", {alpha:time})
        this.setStyle("txt2", {alpha:time})
        this.setStyle("txt3", {alpha:time})
        
        this.moveAdorn("play", {alpha:time})
        this.moveAdorn("vol", {alpha:time})
        this.moveAdorn("time1", {alpha:time})
        this.moveAdorn("time2", {alpha:time})
        this.moveAdorn("wane1", {alpha:time})
        this.moveAdorn("vol1", {alpha:time})
        this.moveAdorn("vol2", {alpha:time})
        this.moveAdorn("wane2", {alpha:time})
        this.moveAdorn("bgmdata", {alpha:time})
    }
    if(this.run.time>=(this.getNote("播放")?100:80)) return true
}
LIMScene_music_window.prototype.endStart=function (){
    this._page=1
}

LIMScene_music_window.prototype.condEnd=function (){
    if(this.run.time<=20&&this.getNote("播放")){
        const time = 1 - Utils.sinNum(20, this.run.time)
        this.setStyle("txt1", {alpha:time})
        this.setStyle("txt2", {alpha:time})
        this.setStyle("txt3", {alpha:time})
        
        this.moveAdorn("play", {alpha:time})
        this.moveAdorn("vol", {alpha:time})
        this.moveAdorn("time1", {alpha:time})
        this.moveAdorn("time2", {alpha:time})
        this.moveAdorn("wane1", {alpha:time})
        this.moveAdorn("vol1", {alpha:time})
        this.moveAdorn("vol2", {alpha:time})
        this.moveAdorn("wane2", {alpha:time})
        this.moveAdorn("bgmdata", {alpha:time})
    }
    else{
        const time= 1 - Utils.sinNum(80,this.run.time-(this.getNote("播放")?20:0))
        this.moveAdorn("win1",{w:(time*100)+"%",alpha:time})
        this.moveAdorn("win2",{h:(time*100)+"%",alpha:time})
        this.moveAdorn("win3",{w:(time*100)+"%",alpha:time})
        for(let i=0;i<10;i++){
            this.moveAdorn("bgm"+(1+i),{w:(time*100)+"%",h:(time*100)+"%",y:28+(38*i)*time})
            this.setStyle("bgm"+(1+i),{ox:time,alpha:time})
        }
    }  
    if(this.run.time>=(this.getNote("播放")?100:80)) return true
}
LIMScene_music_window.prototype.endEnd=function (){
    this.setNote("播放",0)
    this.setNote("当前播放","")
    this.moveAdorn("wane1",{x:-375})
    this.moveAdorn("time2", {w:0, x: -180})
    this.setText("txt3","",false)
    Config.bgmVolume = LIM.Cache["原音量"]
    Conductor.clear(11)
    if(this.bitAdorn("play","暂停"))
        this.drawAdorn()
    
    this._page=0
    this.stop()
    this.hide()
}

LIMScene_music_window.prototype.condPlay=function (){
    const time = Utils.sinNum(20, this.run.time-80)
    this.setStyle("txt1", {alpha:time})
    this.setStyle("txt2", {alpha:time})
    this.setStyle("txt3", {alpha:time})
   
    this.moveAdorn("play", {alpha:time})
    this.moveAdorn("vol", {alpha:time})
    this.moveAdorn("time1", {alpha:time})
    this.moveAdorn("time2", {alpha:time})
    this.moveAdorn("wane1", {alpha:time})
    this.moveAdorn("vol1", {alpha:time})
    this.moveAdorn("vol2", {alpha:time})
    this.moveAdorn("wane2", {alpha:time})
    this.moveAdorn("bgmdata", {alpha:time})
    if(this.run.time>=20) return true
}
LIMScene_music_window.prototype.endPlay=function (){
    this.setNote("播放",1)
    this.playMusic()
}
/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_music_window.prototype.BGM_E=function(data){
    this.evokeAdorn("bgm"+data.index,true)
}
LIMScene_music_window.prototype.BGM_T=function(data){
    const index=this.getNote("bgm_index")
    if(index!==data.index) {
        this.reduction_OP(index,data)
        this.setNote("bgm_index", data.index)
        LIM.Cache["音乐标签"]=data.index
        this.moveAdorn("bgm"+(data.index),{alpha:1})
        return true
    }
}
LIMScene_music_window.prototype.BGM_K=function(data){
    if(this.getNote("bgm_index")===data.index) {
        const name=this.getBgmName()
        if(name[0]!=="?") {
            if (this.getNote("播放")) this.playMusic()
            else this.exeWork("播放")
        }
        else {
            Conductor.play("serect6",0,true) 
        }
    }
}
LIMScene_music_window.prototype.BGM_Q=function(data){
    this.evokeAdorn("bgm"+data.index,false)
}

LIMScene_music_window.prototype.UP_K=function (){
    if(LIM.Cache["音乐顶序"]) {
        LIM.Cache["音乐顶序"]--
        this.drawPage()
        Conductor.play("cursor",0)
    }
}
LIMScene_music_window.prototype.DOWN_K=function (){
    if(LIM.Cache["音乐顶序"]+10<this.getNote("bgm列表").length) {
        LIM.Cache["音乐顶序"]++
        this.drawPage()
        Conductor.play("cursor",0)
    }
}


LIMScene_music_window.prototype.Time_C=function (data,pos){
    if(this.getNote("播放")) {
        const c = pos[0].clamp(0, 400) / 400
        this.moveAdorn("wane1", {x: -375 + (390 * c)})
        this.moveAdorn("time2", {w: (c * 400), x: -180 - (400 - c * 400) / 2})
    }
}
LIMScene_music_window.prototype.Time_G=function (data,pos){
    if(this.getNote("播放")) {
        const near=Conductor.trajeBuffer[11][0]
        if (near.duration) {
            const c = pos[0].clamp(0, 400) / 400
            Conductor.rope(11, near.duration * c)
        }
    }
}

LIMScene_music_window.prototype.Vol_C=function (data,pos){
    if(this.getNote("播放")) {
        this.setVol(pos[0].clamp(0, 200) / 200)
    }
}
LIMScene_music_window.prototype.Vol_G=function (){
    this.setAnime("wane2",['ox','oy'],[50,50],30,-1)
    if(this.bitAdorn("vol",Config.bgmVolume>0?"音量":"静音")) this.drawAdorn()
}
LIMScene_music_window.prototype.Play_K=function (data,pos){
    if(this.getNote("播放")===2) {
        this.setNote("播放",1)
        Conductor.pause(11,true)
    }
    else if(this.getNote("播放")===1) {
        this.setNote("播放",2)
        Conductor.pause(11,true)
    }
}
LIMScene_music_window.prototype.Back_1=function (){
    Conductor.play("serect3",0)
    this.moveAdorn("up",{alpha:0})
    this.moveAdorn("down",{alpha:0})
    this.exeWork("关闭")

    const mes= this.getWindow("mes")
    mes.removeTxt()
    mes.stop()
    mes.hide(50)
    
    this.getWindow("t1").exeWork("退出音乐视窗")
    Conductor.pause(1)
}

LIMScene_music_window.prototype.reduction_OP=function (index,data) {
    if(!data||!data.mute) Conductor.play("cursor",0)
    if(index) this.moveAdorn("bgm"+index,{alpha:0})
}
/////////////////////////////////////////////////////////////
//按键
/////////////////////////////////////////////////////////////
LIMScene_music_window.prototype.Trigger_a_1=function (){this.BGM_K({index:this.getNote("bgm_index")})}
LIMScene_music_window.prototype.Trigger_b_1=function (){this.Back_1()}

LIMScene_music_window.prototype.Trigger_up_1=function (){
    this.Longkey_up_1()
    this.setNote("TU",performance.now())
}
LIMScene_music_window.prototype.Trigger_down_1=function (){
    this.Longkey_down_1()
    this.setNote("TD",performance.now())
}
LIMScene_music_window.prototype.Longkey_up_1=function (){
    if(performance.now()-(this.getNote("TU")||0) < this._now) return
    const index=this.getNote("bgm_index")
    this.evokeAdorn("bgm"+index,false)
    switch (index){
        case 1:this.UP_K()
            break
        default:
            this.BGM_T({index:index-1});
    }
}
LIMScene_music_window.prototype.Longkey_down_1=function (){
    if(performance.now()-(this.getNote("TD")||0) < this._now) return
    const index=this.getNote("bgm_index")
    this.evokeAdorn("bgm"+index,false)
    switch (index){
        case 10:this.DOWN_K()
            break
        default:
            this.BGM_T({index:index+1});
    }
}
/////////////////////////////////////////////////////////////
//滚轮
/////////////////////////////////////////////////////////////
LIMScene_music_window.prototype.WheelUp_1=function (){
    if(!this.getWindow("mes").getNote("可滚动"))
    this.Longkey_up_1()}
LIMScene_music_window.prototype.WheelDown_1=function (){
    if(!this.getWindow("mes").getNote("可滚动"))
    this.Longkey_down_1()}
/////////////////////////////////////////////////////////////
//绘制
/////////////////////////////////////////////////////////////
LIMScene_music_window.prototype.drawBgmAdorn=function (){
    for(let i=0;i<10;i++){
        const name ="bgm"+(1+i)
        this.setAdorn(name,"list","BGM",{index:1+i},0,0,18,28,0,7,0,0)
        this.addText(name, {anch: name,fontSize:22,fontFamily:"font",txt:"",adso:5})
        this.setStyle(name,{ox:0,alpha:0})
        this.touchAdorn(name,true)
    }
    this.setAdorn("up","pointer","UP",{},"100%","100%",World.canvasWidth*0.2,0,0,7,1,270)
    this.setAdorn("down","pointer","DOWN",{},"100%","100%",World.canvasWidth*0.2,-140,0,1,1,90)
    this.evokeAdorn("up",true)
    this.evokeAdorn("down",true)
}
LIMScene_music_window.prototype.drawToolAdorn=function(){
    const time1=new Bitmap(400,30)
    time1.fillRoundedRect(0,11,400,8,3,this.getColor("val2"))
    this.addBit(time1,"time1")
    const time2=new Bitmap(400,30)
    time2.fillRoundedRect(0,11,400,8,3,this.getColor("val1"))
    this.addBit(time2,"time2")
    const vol1=new Bitmap(200,30)
    vol1.fillRoundedRect(0,11,200,8,3,this.getColor("val2"))
    this.addBit(vol1,"vol1")
    const vol2=new Bitmap(200,30)
    vol2.fillRoundedRect(0,11,200,8,3,this.getColor("val1"))
    this.addBit(vol2,"vol2")
    const txt=new Bitmap(200,20)
    this.addBit(txt,"txt")
    const wane=new Bitmap(12,12)
    wane.drawCircle(6,6,5,this.getColor("w"),this.getColor("b"),1)
    this.addBit(wane,"wane")
    

    this.setAdorn("play","暂停","Play",{},32,32,-180,-65,0,2,0,0)
    this.setAdorn("vol",Config.bgmVolume>0?"音量":"静音","",{},32,32,160,-35,0,2,0,0)
    
    this.setAdorn("time1","time1","Time",{},"100%","100%",-180,-35,0,2,0,0)
    this.moveAdorn("vol1",{blendMode:2})
    this.setAdorn("time2","time2","",{},0,"100%",-180,-35,0,2,0,0)
    this.setAdorn("wane1","wane","",{},"100%","100%",-375,-44,0,2,0,0)

    this.setAdorn("vol1","vol1","Vol",{},"100%","100%",280,-35,0,2,0,0)
    this.moveAdorn("vol1",{blendMode:2})
    this.setAdorn("vol2","vol2","",{},0,"100%",280,-35,0,2,0,0)
    this.setAdorn("wane2","wane","",{},"100%","100%",185,-44,0,2,0,0)
    
    this.setAdorn("txt1","txt","",{},"100%","100%",-280,-55,0,2,0,0)
    this.addText("txt1",{anch: "txt1",fontSize:15,fontFamily:"jua",txt:"",adso:4,x:10,alpha:0})
    this.setAdorn("txt2","txt","",{},"100%","100%",-80,-55,0,2,0,0)
    this.addText("txt2", {anch: "txt2",fontSize:15,fontFamily:"jua",txt:"",adso:6,x:-10,alpha:0})
    this.setAdorn("txt3","txt","",{},"60w","100%",0,130,0,9,0,0)
    this.addText("txt3", {anch: "txt3",fontSize:25,fontFamily:"font",txt:"",adso:5,alpha:0})
    this.setVol(Config.bgmVolume)
    this.evokeAdorn("time1",true)
    this.evokeAdorn("vol1",true)
    this.evokeAdorn("play",true)
    this.touchAdorn("time1",true)
    this.touchAdorn("vol1",true)
}
LIMScene_music_window.prototype.drawPage=function (){
    const list=this.getNote("bgm列表")
    for(let i=0;i<10;i++) this.setText("bgm"+(1+i),list[i+LIM.Cache["音乐顶序"]],false)
    
    this.moveAdorn("up",{alpha:LIM.Cache["音乐顶序"]?1:0})
    this.moveAdorn("down",{alpha:LIM.Cache["音乐顶序"]+10>=list.length?0:1})
}
LIMScene_music_window.prototype.drawMusic=function (data){
    const bit=this.grabBit("bgmdata")
    bit.clear()
    let x=bit.width/2
    let y=bit.height/2
    for(let i=0;i<9600;i+=5){
        const angle=i/9600*720
        const q=Utils.azimuth({x:x,y:y},angle,Math.sqrt(data[i])*y)
        if(angle<360) bit.drawLine(x, y, q.x, q.y,"#3292ff11", 12)
        else  bit.drawCurve(x, y, q.x, q.y, "#ffffff08", 3)
    }
}
/////////////////////////////////////////////////////////////
//数据
/////////////////////////////////////////////////////////////
LIMScene_music_window.prototype.getBgm=function (){
    const bgm=[]
    this.setNote("bgm列表",bgm)
    for(let key in LIM.$audio) 
        if(LIM.$audio[key].type==="bgm") {
            const name=LIM.$audio[key].name
            if(DataBase._globalInfo.bgm.indexOf(name)>-1) 
                bgm.push(key)
            else 
                bgm.push(key.replace(/./g, '?'))
        }
}
LIMScene_music_window.prototype.getBgmName=function(){
    const list=this.getNote("bgm列表")
    return list[LIM.Cache["音乐顶序"]+this.getNote("bgm_index")-1]
}
/////////////////////////////////////////////////////////////
//方法
/////////////////////////////////////////////////////////////
LIMScene_music_window.prototype.setVol=function (c){
    this.moveAdorn("wane2", {x: 185 + (190 * c)})
    this.moveAdorn("vol2", {w: (c * 200), x: 280 - (200 - c * 200) / 2})
    Config.bgmVolume=c
}
LIMScene_music_window.prototype.playMusic=function (){
    const name=this.getBgmName()
    if(name[0]!=="?"&&this.getNote("当前播放")!==name) {
        Conductor.clear(11)
        this.setNote("当前播放",name)
        LIM.$Dialogue.setWork(`add|5|${name}_cont|1`)
        this.setText("txt3", name,false)
        Conductor.play(this.getBgmName(), 11)
        this.grabBit("bgmdata").clear()
    }
}
/////////////////////////////////////////////////////////////
//监听
/////////////////////////////////////////////////////////////
LIMScene_music_window.prototype.outerListen =function (){
    if(Conductor.trajeBuffer[11]){
        const near=Conductor.trajeBuffer[11][0]
        if(near.duration&&near.mark===1) {
            let time1=(performance.now() - near.play_time)/1000 + (near.realStart_time)
            let time2 =near.realDuration
            time1%=time2
            const c=time1/time2
            this.moveAdorn("wane1",{x:-375+(390*c)})
            this.moveAdorn("time2", {w: (c * 400), x: -180 - (400 - c * 400) / 2})

            const data=near.audio._buffer.getChannelData()
            const rate=near.audio._buffer.sampleRate
            const n1=Math.floor(time1*20)/20*rate
            const n2=Math.floor(time1*20)/20*rate+rate
            if(this.getNote("频谱")!==n1)
            this.drawMusic(data.slice(n1, n2))
            this.setNote("频谱",n1)
            time1=Math.floor(time1)
            time2=Math.floor(time2)
            this.setText("txt1",Math.floor(time1/60).padZero(2)+":"+Math.floor(time1%60).padZero(2))
            this.setText("txt2",Math.floor(time2/60).padZero(2)+":"+Math.floor(time2%60).padZero(2))
            if(this.bitAdorn("play","播放")) this.drawAdorn()
            
        }
        else if(this.bitAdorn("play","暂停"))this.drawAdorn()
    }
}