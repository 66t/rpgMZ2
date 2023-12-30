function LIMScene_theater_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_theater_window.prototype = Object.create(Cotton.prototype);
LIMScene_theater_window.prototype.constructor = LIMScene_theater_window;
LIMScene_theater_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
};
LIMScene_theater_window.prototype.initImage = function() {
    this.img = {
        "window":["ui/windows","window"+Config.window],
        "pointer":["ui/windows"],
        "normal":["ui"]
    }
    this.addBit(Scene.snapshot[1]||new Bitmap(1,1),"back")
}
LIMScene_theater_window.prototype.initColor=function (){
    this._color={}
    this.setColor("window","#fffb")
    this.setColor("select","#4444")
}
LIMScene_theater_window.prototype.initAdorn=function (){
    this.setNineTile("theater_mes","window",World.canvasWidth,World.canvasHeight/7*2,this.getColor("window"))
    this.setNineTile("theater_ac","window",World.canvasWidth/4,World.canvasHeight/7*4,this.getColor("window"))
    this.setAdorn("back","back","",{},"100%","100%",0,0,0,5,1,0)
}
LIMScene_theater_window.prototype.initWork=function (){
    this.setWork("开始","initStart","condStart","endStart")
    this.setWork("读取","initLoad","condLoad","endLoad")
    this.setWork("关闭","","condEnd","endEnd")
}
LIMScene_theater_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.exeWork("开始")
}
/////////////////////////////////////////////////////////////
//工作
/////////////////////////////////////////////////////////////
LIMScene_theater_window.prototype.initStart=function (){
    let b=new Bitmap(10,10)
    b.fillAll("#000")
    this.addBit(b,"box")
    let id=0
    let iw=0
    let ih=0
    let w2=World.canvasWidth/2
    let h2=World.canvasHeight/2
    
    while (iw<=World.canvasWidth){
        let w=Math.randomInt(10)+10
        if(id%2===0) w+= Math.randomInt(20)
        if(id%3===0) w+= 40
        let y=Math.randomInt(h2)
        const name="box"+(++id)
        this.setAdorn(name,"box","",{},w,h2,iw,-y-h2,1,7,0.3,0)
        this.setAnime(name,["y"],[(y+h2)*Math.random()],300,-1)
        iw+=w
    }
    iw=0
    while (iw<=World.canvasWidth){
        let w=Math.randomInt(10)+10
        if(id%2===0) w+= Math.randomInt(20)
        if(id%3===0) w+= 40
        let y=Math.randomInt(h2)
        const name="box"+(++id)
        this.setAdorn(name,"box","",{},w,h2,iw,y+h2,1,1,0.3,0)
        this.setAnime(name,["y"],[(y+h2)*-1*Math.random()],300,-1)
        iw+=w
    }
    
    while (ih<=World.canvasHeight){
        let h=Math.randomInt(10)+10
        if(id%2===0) h+= Math.randomInt(20)
        if(id%3===0) h+= 40
        let w=Math.randomInt(w2)
        const name="box"+(++id)
        this.setAdorn(name,"box","",{},w2,h,-w-w2,ih,1,7,0.3,0)
        this.setAnime(name,["x"],[(w+w2)*Math.random()],300,-1)
        ih+=h
    }
    ih=0
    while (ih<=World.canvasHeight){
        let h=Math.randomInt(10)+10
        if(id%2===0) h+= Math.randomInt(20)
        if(id%3===0) h+= 40
        let w=Math.randomInt(w2)
        const name="box"+(++id)
        this.setAdorn(name,"box","",{},w2,h,w+w2,ih,1,9,0.3,0)
        this.setAnime(name,["x"],[(w+w2)*-1*Math.random()],300,-1)
        ih+=h
    }
    
    let c=new Bitmap(100,100)
    c.drawCircle(50,50,50,"#fff")
    this.addBit(c,"c")
    this.setAdorn("box0","c","",{},w2*2,h2*2,0,0,1,5,0,0)
    this.moveAdorn("box0",{ox:0,oy:0})
    this.drawAdorn()
    this.boxid=id
}
LIMScene_theater_window.prototype.condStart=function (){
    if(this.run.time===100) {
        this.setAnime("back",["alpha","sx","sy","rota"],[-100,180,180,90],201,-1) 
    }
    else if(this.run.time===200) {
        this.setAnime("box0",["alpha","ox","oy"],[100,200,200],201,-1)
    }
    else if(this.run.time===300)  this.moveAdorn("back",{alpha:0})
    else if(this.run.time===400)  this.moveAdorn("box0",{ox:2,oy:2,alpha:1})
    if(this.run.time>=400) return true
}
LIMScene_theater_window.prototype.endStart=function () {
    this.exeWork("读取")
    for(let i=1;i<=this.boxid;i++)  this.delAdorn("box"+i,i!==this.boxid)
}

LIMScene_theater_window.prototype.initLoad=function () {
    const w=World.canvasWidth/4
    this.setAdorn("mes","theater_mes","",{},"100%","100%",0,World.canvasHeight/7*2,0,2,1,0)
    this.setAdorn("normal","normal","",{},"100%","100%",0,0,0,5,1,0)
  
    this.drawAdorn()
    this.moveAdorn("back",{alpha:0})
    const sp=this.getSp("normal")
    sp.filters=[new PIXI.filters.CRTFilter(),new PIXI.filters.PixelateFilter]

    sp.filters[0].lineContrast=0
    sp.filters[0].lineWidth=0
    sp.filters[0].vignetting=0
    sp.filters[0].vignettingAlpha=0
    sp.filters[0].vignettingBlur=0
    
    sp.filters[0].noiseSize=16
    sp.filters[0].noise=8
    sp.filters[1].size[0]=10
    sp.filters[1].size[1]=10
    
}
LIMScene_theater_window.prototype.condLoad=function (){
    const sp=this.getSp("normal")
    const f1=sp.filters[0]
    const f2=sp.filters[1]
    f1.seed=Math.random()
    if(this.run.time>=200){
        const v=Utils.sinNum(240,this.run.time-200)
        f1.noiseSize=2-2*v
        f1.noise=2-v*2
    }
    else {
        const v=Utils.sinNum(200,this.run.time)
        f1.noiseSize=16-14*v
        f1.noise=8-6*v
        f2.size[0]=10-10*v
        f2.size[1]=10-10*v
    }
    if(this.run.time>=440) {
        sp.filters=[]
        return true
    }
}