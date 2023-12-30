function LIMScene_mes_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_mes_window.prototype = Object.create(Cotton.prototype);
LIMScene_mes_window.prototype.constructor = LIMScene_mes_window;
LIMScene_mes_window.prototype.initialize = function (orgin,traje,pos,scroll) {
    Cotton.prototype.initialize.call(this,orgin)
    this.pos=pos
    this.pos.top=0
    this.pos.mh=0
    if(scroll)this.scroll=scroll
    this.traje=traje
    this.index=0
};
LIMScene_mes_window.prototype.initImage = function() {}
LIMScene_mes_window.prototype.initWork=function (){
    this.setWork("运行","initStart","condStart","endStart")
}
LIMScene_mes_window.prototype.initAdorn=function (){
    const b = new Bitmap(this.pos.w,this.pos.h)
    this.addBit(b,"mes")
    this.setAdorn("mes","mes","Mes",{},"100%","100%",this.pos.x,this.pos.y,0,this.pos.adso,1,0)
    this.evokeAdorn("mes",true)
    this.touchAdorn("mes",true)

    if(this.scroll) {
        this.scroll.sy=this.pos.y+this.scroll.y
        this.scroll.sh=this.pos.h+this.scroll.h
        const c = new Bitmap(this.scroll.w, this.scroll.sh)
        c.fillRoundedRect(0,0,this.scroll.w, this.scroll.sh,2,this.scroll.color1)
        this.addBit(c, "scrollb")
        this.setAdorn("scrollb", "scrollb", "", {}, "100%", "100%", this.pos.x+this.scroll.x, this.scroll.sy, 0, this.scroll.adso, 0, 0)


        const d = new Bitmap(this.scroll.w, this.scroll.sh)
        d.fillRoundedRect(0,0,this.scroll.w, this.scroll.sh,2,this.scroll.color2)
        this.addBit(d, "scrolla")
        this.setAdorn("scrolla", "scrolla", "", {}, "100%", "100%", this.pos.x+this.scroll.x, this.scroll.sy, 0, this.scroll.adso, 0, 0)
    }
}
LIMScene_mes_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    this.setInput(["pageup","pagedown"])
}
/////////////////////////////////////////////////////////////
//工作
/////////////////////////////////////////////////////////////
LIMScene_mes_window.prototype.initStart=function () {
    this.txtIndex=0
    this.txtData={
        x:0,y:0,
        fill:"",fontSize:15,fontFamily:"font",fontWeight:0,
        grad:0,letter:0,interval:0,fontStyle:0
    }
    this.title=[] //标签
}
LIMScene_mes_window.prototype.condStart=function () {
    const txt=LIM.$Dialogue.getFlow(this.traje)
    if(txt!==false){
        this.removeTxt()
        this.txt= this.txtSplit(txt)
        this.initStart()
        this.txtName=""
    }
    else
    {
        const data = this.txtData
        while (this.txtIndex < this.txt.length) {
            let item = this.txt[this.txtIndex++]
            if (item[0] === "<") {
                item = item.substring(1, item.length - 1).split(":")
                switch (item[0]) {
                    case "c": //颜色
                        data.fill = item[1].split("|")
                        break
                    case "s": //字体大小
                        data.fontSize = parseInt(item[1])
                        break
                    case "w": //字体粗
                        data.fontWeight = parseInt(item[1])
                        break
                    case "g": //渐变方式
                        data.grad = parseInt(item[1])
                        break
                    case "f": //字体
                        data.fontFamily = item[1]
                        break
                    case "bl": //描边样式
                        data.lineJoin = item[1]
                        break
                    case "bc": //描边颜色
                        data.stroke = item[1]
                        break
                    case "bw": //描边粗体
                        data.strokeThick = parseInt(item[1])
                        break
                    case "l": //字距
                        data.letter = parseInt(item[1])
                        break
                    case "i": //播放速度
                        data.interval = parseInt(item[1])
                        break
                    case "t": //播放速度
                        data.fontStyle = parseInt(item[1])
                        break
                    case "n": 
                        data.y += parseInt(item[1]||(data.fontSize))
                        data.x = 0
                        break
                    case "m": 
                        data.x += parseInt(item[1])
                        break
                    case "d":
                        data.drop = item[1]
                        break
                    case "da":
                        data.dropAngle =  parseFloat(item[1])
                        break
                    case "db":
                        data.dropBlur =  parseFloat(item[1])
                        break
                    case "dc":
                        data.dropColor =  item[1]
                        break
                    case "dd":
                        data.dropDistance =  parseFloat(item[1])
                        break
                    case "p":
                        data.title = item[1]||undefined
                        break
                    case "var":
                        this.txt.splice(this.txtIndex,0,LIM.$Identity.value(parseInt(item[1])))
                        break
                    case "note":
                        let v=this.getNote(item[1])||""
                        for(let i=2;i<item.length;i++) 
                            if(v[item[i]]) v=v[item[i]]
                        if(v) this.txt.splice(this.txtIndex,0,v)
                        break
                }
            }
            else {
                this.txtName = "txt" + this.index++
                data.interval=10
                data.x += this.addText(this.txtName, {
                        x: data.x,
                        title:data.title,
                        y: data.y,
                        fill: data.fill,
                        letterSpacing: data.letter,
                        fillGradientType: data.grad,
                        fontSize: data.fontSize,
                        fontFamily: data.fontFamily,
                        fontWeight: data.fontWeight,
                        lineJoin: data.lineJoin,
                        strokeThickness: data.strokeThick,
                        stroke: data.stroke,
                        fontStyle:data.fontStyle,
                        drop:data.drop,
                        dropAngle:data.dropAngle,
                        dropBlur:data.dropBlur,
                        dropColor:data.dropColor,
                        dropDistance:data.dropDistance,
                        txt: item,
                        anch: "mes",
                        adso: 7,
                    })
                if(data.title) this.title.push(this.txtName)
            }
        }
        return true
    }
}
LIMScene_mes_window.prototype.endStart=function () {
    this.pos.top=0
    this._page=1
}

/////////////////////////////////////////////////////////////
//触碰
/////////////////////////////////////////////////////////////
LIMScene_mes_window.prototype.Mes_K=function (data,pos){
    if(this.title)
        for(let item of this.title){
            if(this.text._sp[item]){
                const sp=this.text._sp[item]
                const x=pos[4]
                const y=pos[5]
                if(x>=sp.x-20&&x<=sp.x+sp.width+20&&y>=sp.y-20&&y<=sp.y+sp.height+20){
                    if(this.getNote("tag")!==this.text._style[item].title){
                        this.setNote("tag",this.text._style[item].title)
                    }
                }
            }
        }
}
LIMScene_mes_window.prototype.Mes_C=function (data,pos){
   if(pos[3]>0)this.pos.top+=pos[3]*0.5
   if(pos[3]<0)this.pos.top+=pos[3]*0.5
   this.setNote("可滚动",true) 
}
LIMScene_mes_window.prototype.Mes_G=function () {
    this.setNote("可滚动",false)
}
//按键
/////////////////////////////////////////////////////////////
LIMScene_mes_window.prototype.Trigger_pageup_1=function (){
    this.Longkey_pageup_1()
    this.setNote("TU",performance.now())
}
LIMScene_mes_window.prototype.Trigger_pagedown_1=function (){
    this.Longkey_pagedown_1()
    this.setNote("TD",performance.now())
}
LIMScene_mes_window.prototype.Longkey_pageup_1=function (){
    if(performance.now()-(this.getNote("TU")||0) < this._now) return
    this.pos.top-=(this.pos.mh-this.pos.h)/40
}
LIMScene_mes_window.prototype.Longkey_pagedown_1=function (){
    if(performance.now()-(this.getNote("TD")||0) < this._now) return
    this.pos.top+=(this.pos.mh-this.pos.h)/40
}
/////////////////////////////////////////////////////////////
//滚轮
/////////////////////////////////////////////////////////////
LIMScene_mes_window.prototype.WheelUp_1=function (){
    if(this.getNote("可滚动"))
    this.pos.top+=(this.pos.mh-this.pos.h)/20
}
LIMScene_mes_window.prototype.WheelDown_1=function (){
    if(this.getNote("可滚动"))
    this.pos.top-=(this.pos.mh-this.pos.h)/20
}


/////////////////////////////////////////////////////////////
//方法
/////////////////////////////////////////////////////////////
LIMScene_mes_window.prototype.updateScroll=function (){
    if(this.pos.top<0)
        this.pos.top=0
    if(this.pos.top>this.pos.mh-this.pos.h&&this.pos.mh>this.pos.h)
        this.pos.top=(this.pos.mh-this.pos.h)
    if(this.scroll) {
        if (this.pos.mh > this.pos.h) {
            const r= 1/(this.pos.mh/this.pos.h)
            const h=this.scroll.sh*(1-r)
            const t=this.pos.mh-this.pos.h


            this.moveAdorn("scrolla",{alpha:1,h:(r*100)+"%",y:(this.pos.top/t)*h+this.scroll.sy})
            this.moveAdorn("scrollb",{alpha:1})
        }
        else {
            this.moveAdorn("scrolla",{alpha:0})
            this.moveAdorn("scrollb",{alpha:0})
        }
    }
}
LIMScene_mes_window.prototype.removeTxt = function() {
    for(let i=0;i<this.index;i++) this.delText("txt"+i)
    this.index=0
}
LIMScene_mes_window.prototype.txtSplit=function (text) {
    const splitArray = text.split(/<[^>]+>/g);
    const matches = text.match(/<[^>]+>/g) || [];
    const combinedArray = splitArray.reduce((acc, curr, index) => {
        acc.push(curr);
        if (index < matches.length) acc.push(matches[index]);
        return acc;
    }, []);
    return combinedArray.filter(item => item !== '');
}
/////////////////////////////////////////////////////////////
//监听
/////////////////////////////////////////////////////////////
LIMScene_mes_window.prototype.innerListen=function () {
    const txt=LIM.$Dialogue.getFlow(this.traje)
    if(txt){
        this.pos.top=0
        this.pos.mh=0
        this.removeTxt(0)
        this.txt= this.txtSplit(txt)
        this.exeWork("运行")
    }
    this.updateScroll()
}




