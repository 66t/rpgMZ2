function LIMScene_photo_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_photo_window.prototype = Object.create(Cotton.prototype);
LIMScene_photo_window.prototype.constructor = LIMScene_photo_window;
LIMScene_photo_window.prototype.initialize = function (orgin) {
    this.initCg()
    Cotton.prototype.initialize.call(this,orgin)
};
LIMScene_photo_window.prototype.initImage = function() {
    this.img = {
        "window":["ui/windows","window"+Config.window],
        "文件夹":["ui/data"]
    }
    for(let key in this.cg) {
        for(let item of this.cg[key]){
            this.img[key + "_" + item] = ["cg"]
        }
    }
}
LIMScene_photo_window.prototype.initCg=function (){
    this.cg={}
    this.cgMap={}
    for(let txt of DataBase._globalInfo.image) {
        const arr=txt.split("_")
        if(this.cg[arr[0]]) this.cg[arr[0]].push(arr[1])
        else this.cg[arr[0]]=[arr[1]]
    }
    const image=LIM.$image
    for(let data in image)
            if(this.cg[image[data].name])
            this.cgMap[image[data].name]=data
}
LIMScene_photo_window.prototype.initColor=function (){
    this._color={}
    this.setColor("window","#fffb")
    this.setColor("select","#4444")
    this.setColor("val1","#39f")
    this.setColor("val2","#222")
    this.setColor("w","#fff")
    this.setColor("b","#000")
}
LIMScene_photo_window.prototype.initAdorn=function (){
    this.setNineTile("photo","window",World.canvasWidth,World.canvasHeight-90,this.getColor("window"))
    this.setAdorn("win1","photo","",null,"100%","0%",0,0,0,2,0,0)
    
    let bit=new Bitmap(140,140)
    bit.fillRoundedRect(0,0,140,140,20,this.getColor("select"))
    this.addBit(bit,"select")
    this.setAdorn("select","select","",null,128,128,-125,-128,2,7,0,0)
    let index=0
    const list =[]
    for(let item in this.cgMap){
      list.push(item)
      const name="file"+(index+1)
      this.setAdorn(name,"文件夹","FILE",{index:(index+1)},120,120,48+(128*(index%6)),128+128*Math.floor(index/6),2,7,0,0)
      this.addText(name,{anch:name,fontSize:20,fontFamily:"write",fontWeight:600,txt:this.cgMap[item],adso:2,alpha:0,y:5})
      this.touchAdorn(name,true)
      index++
    }
    
    this.setAdorn("back","null","PHOTO",null,"100%","100%",0,0,2,5,1,0)
    
    this.setNote("图片列表",list)
    LIM.Cache["相册索引"]=LIM.Cache["相册索引"]||1
}
LIMScene_photo_window.prototype.initWork=function (){
    this.setWork("开始","","condStart","endStart")
    this.setWork("图片","initPhoto","condPhoto","endPhoto")
    this.setWork("图片关闭","initPhotoEnd","condPhotoEnd","endPhotoEnd")
    this.setWork("关闭","initEnd","condEnd","endEnd")
}
LIMScene_photo_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.setInput(["up","down","left","right","a","b"])
    
    if(this.getNote("图片列表").length) {
        if (!Config.opmemory)
            this.FILE_T({index: LIM.Cache["相册索引"] || 1, mute: true})
        else
            this.FILE_T({index: 1, mute: true})
    }
}
/////////////////////////////////////////////////////////////
//工作
/////////////////////////////////////////////////////////////
LIMScene_photo_window.prototype.initStart=function (){
    this.stopAnime("select",["alpha"])
}
LIMScene_photo_window.prototype.condStart=function (){
    const time = Utils.sinNum(80, this.run.time)
    this.moveAdorn("win1", {h: (time * 100) + "%", alpha: time})
    this.moveAdorn("win2", {w: (time * 100) + "%", alpha: time})
    
    if(this.run.time>50){
        const time = Utils.sinNum(30, this.run.time-50)
        const list =this.getNote("图片列表")
        for(let i=1;i<=list.length;i++){
            const name="file"+i
            this.moveAdorn(name,{alpha:time})
            this.setStyle(name,{alpha:time})
        }
        this.moveAdorn("select",{alpha:time})
    }

    if(this.run.time>=80) return true
}
LIMScene_photo_window.prototype.endStart=function (){
    this._page=1
}


LIMScene_photo_window.prototype.condEnd=function (){
    if(this.run.time<=30){
        const time = 1-Utils.sinNum(30, this.run.time)
        const list =this.getNote("图片列表")
        for(let i=1;i<=list.length;i++){
            const name="file"+i
            this.moveAdorn(name,{alpha:time})
            this.setStyle(name,{alpha:time})
        }
        this.moveAdorn("select",{alpha:time})
    }
    const time = 1-Utils.sinNum(80, this.run.time)
    this.moveAdorn("win1", {h: (time * 100) + "%", alpha: time})
    this.moveAdorn("win2", {w: (time * 100) + "%", alpha: time})
    if(this.run.time>=80) return true
}
LIMScene_photo_window.prototype.endEnd=function (){
    this.hideHandler()
    this.stop()
    this.hide()
}

LIMScene_photo_window.prototype.initPhoto=function (){
    const list=this.getNote("图片列表")
    const id=list[this.getNote("p_index")]
    const name=id+"_"+this.cg[id][this.getNote("l_index")]
    this.bitAdorn("back",name)
    if(this._page===1) this.moveAdorn("back",{w:"0%",h:"0%",alpha:0})
    this.drawAdorn()
}
LIMScene_photo_window.prototype.condPhoto=function (){
    if(this._page===2) return true
    const time = Utils.sinNum(80, this.run.time)
    this.moveAdorn("back",{w:(time*100)+"%",h:(time*100)+"%",alpha:time})
    
    const list =this.getNote("图片列表")
    for(let i=1;i<=list.length;i++){
        const name="file"+i
        this.moveAdorn(name,{alpha:1-time})
        this.setStyle(name,{alpha:1-time})
    }
    
    
    if(this.run.time>=80) return true
}
LIMScene_photo_window.prototype.endPhoto=function (){
   if(this._page===1) {
       this._page = 2
       this.addExpel("FILE")
       this.evokeAdorn("back", true)
   }
}

LIMScene_photo_window.prototype.initPhotoEnd=function (){}
LIMScene_photo_window.prototype.condPhotoEnd=function (){
    const time = 1-Utils.sinNum(80, this.run.time)
    this.moveAdorn("back",{w:(time*100)+"%",h:(time*100)+"%",alpha:time})
    const list =this.getNote("图片列表")
    for(let i=1;i<=list.length;i++){
        const name="file"+i
        this.moveAdorn(name,{alpha:1-time})
        this.setStyle(name,{alpha:1-time})
    }
    if(this.run.time>=80) return true
}
LIMScene_photo_window.prototype.endPhotoEnd=function (){
    this._page=1
    this.delExpel("FILE")
    this.evokeAdorn("back",false)
}
/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_photo_window.prototype.Back_1=function (){
    this._page=0
    Conductor.play("serect3",0)
    this.exeWork("关闭")
    this.getWindow("t1").exeWork("退出图片视窗")
    return true
}
LIMScene_photo_window.prototype.Back_2=function (){
    this.exeWork("图片关闭")
    return true
}
LIMScene_photo_window.prototype.FILE_E=function(data){
    this.evokeAdorn("file"+data.index,true)
}
LIMScene_photo_window.prototype.FILE_T=function(data){
    if(this._page!==1) return 
    const index=this.getNote("file_index")
    if(index!==data.index) {
        if(!data||!data.mute) Conductor.play("cursor",0)
        this.setNote("file_index", data.index)
        this.moveAdorn("select",{x: 48+(128*((data.index-1)%6)),y:128+128*Math.floor((data.index-1)/6)})
        LIM.Cache["相册索引"]=data.index
        return true
    }
}
LIMScene_photo_window.prototype.FILE_Q=function(data){
    this.evokeAdorn("file"+data.index,false)
}
LIMScene_photo_window.prototype.FILE_K=function(data){
    if(this._page!==1) return
    let sp=this.getSp("file"+data.index)
    this.setNote("p_index",data.index-1)
    this.setNote("l_index",0)
    this.exeWork("图片")
    return true
}
LIMScene_photo_window.prototype.PHOTO_K=function (){
    if(this._page!==2) return
    this.Longkey_down_2()
}
/////////////////////////////////////////////////////////////
//按键
/////////////////////////////////////////////////////////////
LIMScene_photo_window.prototype.Trigger_up_1=function (){
    this.Longkey_up_1()
    this.setNote("TU",performance.now())
}
LIMScene_photo_window.prototype.Trigger_down_1=function (){
    this.Longkey_down_1()
    this.setNote("TD",performance.now())
}
LIMScene_photo_window.prototype.Trigger_left_1=function (){
    this.Longkey_left_1()
    this.setNote("TL",performance.now())
}
LIMScene_photo_window.prototype.Trigger_right_1=function (){
    this.Longkey_right_1()
    this.setNote("TR",performance.now())
}
LIMScene_photo_window.prototype.Longkey_up_1=function (){
    if(performance.now()-(this.getNote("TU")||0) < this._now) return
    const index=this.getNote("file_index")
    this.evokeAdorn("file"+index,false)
    if(index<=6)
        this.Longkey_left_1()
    else
        this.FILE_T({index:index-6});
}
LIMScene_photo_window.prototype.Longkey_down_1=function (){
    const list=this.getNote("图片列表")
    if(performance.now()-(this.getNote("TD")||0) < this._now) return
    const index=this.getNote("file_index")
    this.evokeAdorn("file"+index,false)
    if(index+6<list.length)
        this.FILE_T({index:index+6});
    else 
        this.Longkey_right_1()
}
LIMScene_photo_window.prototype.Longkey_left_1=function (){
    const list=this.getNote("图片列表")
    if(performance.now()-(this.getNote("TL")||0) < this._now) return
    const index=this.getNote("file_index")
    this.evokeAdorn("file"+index,false)
    switch (index){
        case 1:
            break
        default:
            this.FILE_T({index:index-1});
    }
}
LIMScene_photo_window.prototype.Longkey_right_1=function (){
    const list=this.getNote("图片列表")
    if(performance.now()-(this.getNote("TR")||0) < this._now) return
    const index=this.getNote("file_index")
    this.evokeAdorn("file"+index,false)
    switch (index){
        case list.length:
            break
        default:
            this.FILE_T({index:index+1});
    }
}

LIMScene_photo_window.prototype.Trigger_up_2=function (){
    this.Longkey_up_2()
    this.setNote("TU",performance.now())
}
LIMScene_photo_window.prototype.Trigger_down_2=function (){
    this.Longkey_down_2()
    this.setNote("TD",performance.now())
}
LIMScene_photo_window.prototype.Trigger_left_2=function (){
    this.Longkey_left_2()
    this.setNote("TL",performance.now())
}
LIMScene_photo_window.prototype.Trigger_right_2=function (){
    this.Longkey_right_2()
    this.setNote("TR",performance.now())
}
LIMScene_photo_window.prototype.Longkey_up_2=function (){
    if(performance.now()-(this.getNote("TD")||0) < this._now) return
    const list=this.getNote("图片列表")
    const id=list[this.getNote("p_index")]
    const cg=this.cg[id]
    
    let index=this.getNote("l_index")
    if(index===0) index=cg.length-1
    else index=index-1
    this.setNote("l_index",index)
    
    const name=id+"_"+cg[this.getNote("l_index")%cg.length]
    this.bitAdorn("back",name)
    this.drawAdorn()
}
LIMScene_photo_window.prototype.Longkey_down_2=function (){
    if(performance.now()-(this.getNote("TD")||0) < this._now) return
    const list=this.getNote("图片列表")
    const id=list[this.getNote("p_index")]
    const cg=this.cg[id]
    this.setNote("l_index",this.getNote("l_index") - -1)
    const name=id+"_"+cg[this.getNote("l_index")%cg.length]
    this.bitAdorn("back",name)
    this.drawAdorn()
}
LIMScene_photo_window.prototype.Longkey_left_2=function (){
    if(performance.now()-(this.getNote("TR")||0) < this._now) return
   this.Longkey_left_1()
   this.FILE_K({index:this.getNote("file_index")}) 
}
LIMScene_photo_window.prototype.Longkey_right_2=function (){
    if(performance.now()-(this.getNote("TR")||0) < this._now) return
    this.Longkey_right_1()
    this.FILE_K({index:this.getNote("file_index")})
}

LIMScene_photo_window.prototype.Trigger_b_1=function (){return  this.Back_1()}
LIMScene_photo_window.prototype.Trigger_a_1=function (){this.FILE_K({index:this.getNote("file_index")})}
LIMScene_photo_window.prototype.Trigger_b_2=function (){return this.Back_2()}
///////////////////////////////////////////////////////
