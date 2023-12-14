function Weaver() {
    this.initialize.apply(this, arguments);
}
Weaver.prototype = Object.create(Sprite.prototype);
Weaver.prototype.constructor = Weaver;
Weaver.prototype.initialize = function (orgin) {
    Sprite.prototype.initialize.call(this)
    this.alpha =0
    this._orgin=orgin
    this._load = 0
    this._mode = 0
    this.install()
    this.hatch()
}
Weaver.prototype.install = function (){this._window={}}
Weaver.prototype.update=function (){
    if(this._load) return
    switch (this._mode){
        case 0: this.execute();break
        case 1:
            for (const child of this.children) {
                if (child.update) {
                    child.update();
                }
            }
    }
}
Weaver.prototype.execute = function() {
    this._mode =1
    this.alpha=1
    for(let key in this._window) 
        this._window[key].execute()
}
Weaver.prototype.hatch=function (){
    for (let key in this._window){
        let item=this._window[key]
        for(let img in item.img)
            item.loadBit(img,item.img[img])
    }
    this._orgin.addChild(this)
}
Weaver.prototype.death=function (){
    const children=this._orgin.children
    for(let i=0;i<children.length;i++){
        if(children[i]===this){
            children.splice(i,1)
            break
        }
    }
    this.removeChildren()
    this.destroy()
}
/////////////////////////////////////////////
function Cotton() {
    this.initialize.apply(this, arguments);
}
Cotton.prototype = Object.create(Sprite.prototype);
Cotton.prototype.constructor = Cotton;
Cotton.prototype.initialize = function (orgin) {
    Sprite.prototype.initialize.call(this)
    this._orgin=orgin
    this._bit = {"n":new Bitmap(1,1)}
    this._delay = 0
    this._stop = true
    this._input=[]
    this.initImage()
};
Cotton.prototype.execute = function () {
    this.threshold = 200
    this._page = 0
    this._note = {}
    this._data = {}
    this._sprite= []
    this._expel= new Set()
    this.run = new Runflow(this)
    this.adorn = new Adorn(this)
    this.text =new Writ(this)
    this.initColor()
    this.initWork()
    this.initAdorn()
    this.drawAdorn()
    this._orgin.addChild(this)
}
Cotton.prototype.initImage = function() {this.img={}}
Cotton.prototype.initWork=function (){}
Cotton.prototype.initColor=function (){this._color={}}
Cotton.prototype.stop=function (){this._stop=true}
Cotton.prototype.start=function (){this._stop=false}
Cotton.prototype.show=function (){this.alpha=1}
Cotton.prototype.hide=function (){this.alpha=0}
Cotton.prototype.setInput=function (arr){this._input = this._input.concat(arr);}

Cotton.prototype.setColor=function (key,color){this._color[key]=color}
Cotton.prototype.getColor=function (key){return this._color[key]}
Cotton.prototype.setData=function (key,color){this._data[key]=color}
Cotton.prototype.getData=function (key){return this._data[key]}

Cotton.prototype.setWork=function (key,init,cond,done){this.run.set(key,init,cond,done)}
Cotton.prototype.exeWork=function (work){this.run.install(work)}

Cotton.prototype.update = function () {
    if(this._stop) return
    else if(this.run.active) this.run.update()
    else {
        if(this._delay===0) {
             this.processTouch()
             if(this.processKey()||this.processWheel()){this._delay=Math.max(this._delay,4)}
        }
        else this._delay--
        this.innerListen()
    }
    this.adorn.update()
    this.text.update()
    this.outerListen()
}

Cotton.prototype.getWindow=function (key){
    if(this._orgin._window[key]) return this._orgin._window[key]
}

Cotton.prototype.addText=function (key,data){this.text.addText(key,data)}
Cotton.prototype.delText=function (key){this.text.delText(key)}
Cotton.prototype.setText=function (key,txt,bool){this.text.setText(key,txt,bool)}
Cotton.prototype.setAnch =function (key,anch) {this.text.setAnch(key,anch)}
Cotton.prototype.setStyle=function (key,data){this.text.setStyle(key,data)}
Cotton.prototype.setBlend =function (key,blend) {this.text.setBlend(key,blend)}
Cotton.prototype.clearText=function (key,data){this.text.clearText()}

Cotton.prototype.initAdorn=function (){}
Cotton.prototype.setAdorn=function (key,bit,handler,data,w,h,x,y,cover,adso,alpha,rota){
    this.adorn.set(key,bit,handler,data,w,h,x,y,cover,adso,alpha,rota)
}
Cotton.prototype.delAdorn=function (key){this.adorn.delete(key)}
Cotton.prototype.refAdorn=function (key){this.adorn.ref(key)}
Cotton.prototype.swapAdorn=function (key1,key2){this.adorn.swap(key1,key2)}
Cotton.prototype.evokeAdorn=function (key,bool){
    if(bool) this.adorn.on(key)
    else  this.adorn.off(key)
}
Cotton.prototype.touchAdorn=function (key,bool){this.adorn.setTouch(key,bool)}
Cotton.prototype.bitAdorn=function (key,bit){this.adorn.setBit(key,bit)}
Cotton.prototype.moveAdorn=function (key,data){this.adorn.move(key,data)}
Cotton.prototype.drawAdorn=function (){
    this.adorn.draw()
}

Cotton.prototype.setAnime =function (sp,key,val,time,mode,line) {
    this.adorn.setAnime(sp,key,val,time,mode,line)
}
Cotton.prototype.stopAnime =function (sp,key) {
    this.adorn.stopAnime(sp,key)
}

Cotton.prototype.spHandler=function (key,handler){this.adorn.spHandler(key,handler)}
Cotton.prototype.delHandler=function (key){this.adorn.delHandler(key)}
Cotton.prototype.getSp=function (key){
    return this.adorn.sp[key]
}

Cotton.prototype.getNote = function (key) {
    return this._note[key]
}
Cotton.prototype.setNote = function (key, val) {
    this._note[key] = val
}

Cotton.prototype.addExpel=function (handler){this._expel.add(handler)}
Cotton.prototype.delExpel=function (handler){this._expel.delete(handler)}
Cotton.prototype.setExpel=function (arr){
    this._expel=new Set()
    for(let item of arr) this._expel.add(item)
}

Cotton.prototype.addBit = function (bit,key) {
    this._bit[key] = bit
    if(this.adorn) this.adorn.refBit(key)
}
Cotton.prototype.getBit = function (key) {
    if (this._bit[key]) {
        let bit = new Bitmap(this._bit[key].width, this._bit[key].height)
        bit.blt(this._bit[key], 0, 0, this._bit[key].width, this._bit[key].height, 0, 0, this._bit[key].width, this._bit[key].height)
        return bit
    }
    return new Bitmap(1,1)
}
Cotton.prototype.grabBit = function (key) {
    if (this._bit[key]) return this._bit[key]
    return new Bitmap(1,1)
}
Cotton.prototype.loadBit = function (key, val) {
    this._orgin._load++
    this._bit[key] = ImageManager.loadBitmap(`img/${val[0]}/`, val[1]||key)
    this._bit[key].addLoadListener(() => { this._orgin._load-- })
}
Cotton.prototype.setNineTile=function (key,source,w,h,color){
    if(this._bit[source]){
        const bit=new Bitmap(w,h)
        const pic =this.getBit(source)
        const sw=pic.width
        const sh=pic.height
        if(color) bit.fillAll(color)
        for(let uw=sw/3;uw<w-sw/3;uw+=sw/3){
            bit.blt(pic,sw/3,0,sw/3,sh/3,uw,0,sw/3,sh/3)
            bit.blt(pic,sw/3,sh/3*2,sw/3,sh/3,uw,h-sh/3,sw/3,sh/3)
        }
        for(let uh=sh/3;uh<h-sh/3;uh+=sh/3){
            bit.blt(pic,0,sh/3,sw/3,sh/3,0,uh,         sw/3,sh/3)
            bit.blt(pic,sw/3*2,sh/3,sw/3,sh/3,w-sw/3,uh,sw/3,sh/3)
        }
        bit.blt(pic,0,0,sw/3,sh/3,0,0,sw/3,sh/3)
        bit.blt(pic,sw-sw/3,0,sw/3,sw/3,w-sw/3,0,sw/3,sh/3)
        bit.blt(pic,sw-sw/3,sh-sh/3,sw/3,sw/3,w-sw/3,h-sh/3,sw/3,sh/3)
        bit.blt(pic,0,sh-sh/3,sw/3,sw/3,0,h-sh/3,sw/3,sh/3)
      
        this.addBit(bit,key)
    }
}

Cotton.prototype.processTouch = function () {
    const cancelled=Touch.get("right","rele")
    const pressed =Touch.get("left","key")
    if(cancelled&&this.cancelled()) return
    const x= Touch.cursor.x
    const y= Touch.cursor.y
    for (let key of this.adorn.list.slice().reverse()) {
        const item = this.adorn.sp[key];
        const data = this.adorn.data[key];
        const bound= this.adorn.handler[key]
        if(bound) {
            const handler =bound._handler
            if(!this._expel.has(handler)) {
                if(bound.expel) bound.restore()
                const res = bound.update(x, y, cancelled, pressed, item)
                const pos = [res.touch[0], res.touch[1], res.touch[4] - res.touch[2], res.touch[5] - res.touch[3]]
                const bool = res.data
                let region = 0
                if (bool[0] === bool[1]) {
                    region = 2;
                } else if (bool[1] > bool[2]) {
                    region = 1;
                } else if (bool[0] === bool[2]) {
                    region = 3;
                }
                if (bool[6] === 2 && data.touch) {
                    if (region === 1 && this.triggerHandler(handler, "K", data.data, pos)) return
                }
                if (region === 1 && data.touch) {
                    if (bool[0] === bool[5] && this.triggerHandler(handler, "R", data.data, pos)) return
                    if (bool[0] === bool[3] && this.triggerHandler(handler, "L", data.data, pos)) return
                }

                if (bool[0] === bool[4]) {
                    if (region === 1 || region === 2) {
                        if (this.triggerHandler(handler, "E", data.data, pos)) return
                    }
                    if (bool[6] === 2) if (this.triggerHandler(handler, "G", data.data, pos)) return
                } else if (bool[3] > bool[4]) {
                    if (data.touch && bool[6] === 1)
                        if (this.triggerHandler(handler, "C", data.data, pos)) return
                    if (data.touch && bool[6] === 1 && region)
                        if (this.triggerHandler(handler, "D", data.data, pos)) return
                } else {
                    if (region === 2) {
                        if (this.triggerHandler(handler, "E", data.data, pos)) return
                    } else if (region === 3) {
                        if (this.triggerHandler(handler, "Q", data.data, pos)) return
                    } else if (data.touch && region === 1) {
                        if (this.triggerHandler(handler, "T", data.data, pos)) return
                    }
                }
            }
            else {
               bound.expel=true  
            }
        }
    }
}
Cotton.prototype.processWheel = function() {
    if (this[`WheelDown_${this._page}`]&&Touch.wheel.y >= this.threshold) {
        Touch.wheel.y=0
        this[`WheelDown_${this._page}`]()
        return true
    }
    if (this[`WheelUp_${this._page}`]&&Touch.wheel.y <= -this.threshold) {
        Touch.wheel.y=0
        this[`WheelUp_${this._page}`]()
        return true
    }
    return false
}
Cotton.prototype.processKey = function () {
    for(let key of this._input) {
        if (this[`Rele_${key}_${this._page}`] && Keyboard.get(key,"rele")) {
            if(this[`Rele_${key}_${this._page}`]()) return true
        }
        if (this[`Trigger_${key}_${this._page}`]  && Keyboard.get(key,"trigger")) {
            if(this[`Trigger_${key}_${this._page}`]()) return true
        }
        if (this[`Longkey_${key}_${this._page}`]  && Keyboard.get(key,"long")) {
            if( this[`Longkey_${key}_${this._page}`]()) return true
        }
        if (this[`Key_${key}_${this._page}`] && Keyboard.get(key,"")) {
            if( this[`Key_${key}_${this._page}`]()) return true
        }
    }
    return  false
}

Cotton.prototype.triggerHandler = function (handler,name,data,pos) {
    if(this[handler+"_"+name]) return this[handler+"_"+name](data,pos)
    return false;
};
Cotton.prototype.cancelled = function () {
    if(this[`Back_${this._page}`]) return this[`Back_${this._page}`]()
    return false;
};
Cotton.prototype.innerListen =function (){}
Cotton.prototype.outerListen =function (){}
/////////////////////////////////////////////
function Runflow() {
    this.initialize.apply(this, arguments);
}
Runflow.prototype = Object.create(Runflow.prototype);
Runflow.prototype.constructor = Runflow;
Runflow.prototype.initialize = function (orgin) {
    this._orgin=orgin
    this.active=false
    this.time=0
    this.arr=[]
    this.work={}
    this.init=""
    this.cond=""
    this.done=""
}
Runflow.prototype.set=function (key,init,cond,done){
    this.work[key] = {init: init || "",cond: cond || "", done: done || "",}
}
Runflow.prototype.install = function (work) {
    if (this.work[work]) {
        if(!this.active) {
            this.time=0
            this.active=true
            this.init=this.work[work].init
            this.cond=this.work[work].cond
            this.done=this.work[work].done
            return true
        }
        else this.arr.push(work)
    }
    return false
}
Runflow.prototype.update=function (){
    if (this.time === 0) {
        this.time++;
        if (this.init && this._orgin[this.init]) this._orgin[this.init](); // 执行初始化方法
    }
    else {
        if (!this.cond||(this._orgin[this.cond]&&this._orgin[this.cond]())){
            this.active = false;
            if(this.done&&this._orgin[this.done]){
                this._orgin[this.done]()
                let bool=true
                while (bool&&this.arr.length)
                    if(this.install(this.arr.shift()))
                        bool=false
            }
        }
        else this.time++
    }
}
/////////////////////////////////////////////
function Adorn() {
    this.initialize.apply(this, arguments);
}
Adorn.prototype = Object.create(Adorn.prototype);
Adorn.prototype.constructor = Adorn;
Adorn.prototype.initialize = function (orgin) {
    this._orgin=orgin
    this.data={}
    this.list=[]
    this.map={}
    this.sp={}
    this.anime={}
    this.handler={}
}
Adorn.prototype.set=function (key,bit,handler,data,w,h,x,y,cover,adso,alpha,rota){
    this.data[key]={
        bit:bit,
        data:data||{},
        w:w||0,
        h:h||0,
        x:x||0,
        y:y||0,
        cover: cover||0,
        adso: adso!==undefined?adso:7,
        alpha: alpha!==undefined?alpha:1,
        rota: rota || 0,
        ox:1, //缩放
        oy:1,
        sx:0,
        sy:0,
        fx:0,
        fy:0,
        fw:100,
        fh:100,
        touch:false,
        trans:true,
        refresh:true,
    }
    this.connectBit(bit,key)
    if(handler) this.spHandler(key,handler)
    this.list.push(key)
}
Adorn.prototype.delete =function (key,bool){
    if(this.data[key]){
        this.breakBit(this.data[key].bit,key)
        delete this.data[key]
        if(this.list.indexOf(key)>-1){
            this.list.splice(this.list.indexOf(key),1)
        }
        if(!bool) this.draw()
    }
}
Adorn.prototype.ref=function (key){if(this.data[key]) this.data[key].refresh=true}
Adorn.prototype.update=function (){
    for(let sp in this.anime){
        let item=this.anime[sp]
        for(let key in item){
            let data=item[key]
            if(!data.run&&data.count===data.time*data.mode)
                this.delAnime(sp,key)
            data.count++
        }
    }
    for (let key of this.list) {
        if (this.anime[key] || this.data[key].trans)
            this.trans(key)
    }
}
Adorn.prototype.swap=function (v1,v2){
    const i1 = this.list.indexOf(v1);
    const i2 = this.list.indexOf(v2);
    if (i1 === -1 || i2 === -1) return
    this.list.splice(i1, 1);
    this.list.splice(i2, 0, v1);
}
Adorn.prototype.off=function (key){if(this.data[key]) this.data[key].touch=false}
Adorn.prototype.on=function (key) {if(this.data[key]) this.data[key].touch=true }
Adorn.prototype.setBit=function (key,bit){
    if(this.data[key]&&this.data[key].bit){
        let index=this.map[key].indexOf(this.data[key].bit)
        if(index>-1) this.map[key].splice(index,1)
    }
    this.data[key].bit=bit
    this.connectBit(bit,key)
    this.data[key].refresh=true
}
Adorn.prototype.connectBit=function (bit,key){
    if(this.map[bit]) this.map[bit].push(key)
    else  this.map[bit]=[key]
}
Adorn.prototype.breakBit=function (bit,key){
    if(this.map[bit]) {
        let index=this.map[bit].indexOf(key)
        if(index>-1) this.map[bit].splice(index,1)
        if(this.map[bit].length===0) delete this.map[bit]
    }
   
}
Adorn.prototype.refBit=function (bit){
    if(this.map[bit])
        for(let key of this.map[bit])
            if(this.data[key]) this.data[key].refresh=true
}

Adorn.prototype.setAnime =function (sp,key,val,time,mode,line) {
    if (this.data[sp]) {
        if (!this.anime[sp]) {
            this.anime[sp] = {}
        }
        let data = this.anime[sp]
        for (let i = 0; i < key.length; i++) {
            data[key[i]] = {val: val[i], run: mode > 0, time: time, count: 0, mode: Math.abs(mode), line: line}
        }
    }
}
Adorn.prototype.stopAnime=function (sp,key){
    if(this.anime[sp]) {
        for (let i = 0; i < key.length; i++) {
            if (this.anime[sp][key[i]])
                this.anime[sp][key[i]].run = false
        }
    }
}
Adorn.prototype.delAnime=function (sp,key){
    if(this.anime[sp]) {
        if (this.anime[sp][key])
            delete this.anime[sp][key]
        if (Object.keys(this.anime[sp]).length < 1)
            delete this.anime[sp]
    }
}
Adorn.prototype.getAnime=function (sp){
    const correct={}
    if(this.anime[sp]) {
        const item = this.anime[sp]
        for (let key in item) {
            const data = item[key]
            switch (data.line){
                case "line":
                    correct[key] =
                        (data.count % (data.time * data.mode))/data.time * data.val
                    break
                case "square":
                    correct[key] = 
                        Math.round((data.count % (data.time))/data.time*data.mode) * (data.val/data.mode)
                    break
                default:
                    correct[key] =
                        Utils.sinNum(data.time,data.count % (data.time * data.mode)) * data.val
            }
        }
    }
    return correct
}
Adorn.prototype.getRef = function() {
    return this.list.filter(function(key) {return this.data[key].refresh;}, this);
};
Adorn.prototype.getLapse = function() {
    let spKeys = Object.keys(this.sp);
    let dataKeys = Object.keys(this.data);
    return spKeys.filter(function(key) { return !dataKeys.includes(key);}, this);
};
Adorn.prototype.draw = function () {
    const ref=Utils.union(this.getRef(),this.getLapse())
    for(let i=0;i<this._orgin.children.length;i++){
        if (this._orgin.children[i].adorn){
            const adorn= this._orgin.children[i].adorn
            if(ref.indexOf(adorn)>-1&&this.sp[adorn]){
                this._orgin.children.splice(i--, 1)
                this.sp[adorn].destroy()
                delete this.sp[adorn]
            }
        }
    }
    for (let key of this.list) {
        if (this.data[key]){
            if(this.data[key].refresh){
                this.data[key].refresh=false
                const bit = this._orgin.grabBit(this.data[key].bit);
                if(bit){
                    const sp = new Sprite(bit);
                    sp.adorn=key
                    this.sp[key]=sp
                    sp.blendMode=0
                    this.trans(key)
                }
            }
            this.sp[key].z=this.list.indexOf(key)
            this._orgin.addChildAt(this.sp[key])
        }
    }
    this._sortChildren()
}
Adorn.prototype._sortChildren = function() {this._orgin.children.sort(this._compareChildOrder.bind(this));};
Adorn.prototype._compareChildOrder = function(a, b) {
    if (a.z !== b.z) {return a.z - b.z;} 
    else if (a.y !== b.y) {return a.y - b.y;} 
    else {return a.spriteId - b.spriteId;}
};
Adorn.prototype.setBlend =function (key,blend) {if(this.sp[key]) this.sp[key].blendMode=blend}
Adorn.prototype.trans =function (key) {
    this.data[key].trans=false
    if(this.data[key]&&this.sp[key]){
        let correct=this.getAnime(key)
        const sp=this.sp[key]
        const data=this.data[key]
        sp.anchor.set(0.5, 0.5);
        //缩放
        let w= 1
        let h= 1
        if(String(data.w).indexOf("%")>-1)  w=parseFloat(data.w.replace('%', '')) / 100 || 1
        else w= Utils.lengthNum(data.w)/sp.bitmap.width

        if(String(data.h).indexOf("%")>-1)  h=parseFloat(data.h.replace('%', '')) / 100 || 1
        else h= Utils.lengthNum(data.h)/sp.bitmap.height
        switch (data.cover) {
            case 1:
                sp.scale.x = Math.max(w,h)
                sp.scale.y = sp.scale.x
                break
            case 2:
                sp.scale.x = Math.min(w,h)
                sp.scale.y = sp.scale.x
                break
            default:
                sp.scale.x = w
                sp.scale.y = h
                break
        }
        //定位
        let qx= sp.scale.x
        let qy= sp.scale.y
        w=sp.bitmap.width
        h=sp.bitmap.height
        let sx=data.adso % 3 === 1 ? w * qx * 0.5 :
            data.adso % 3 === 2 ? World.canvasWidth * 0.5 :
                World.canvasWidth - w * qx * 0.5;
        let sy=data.adso > 6 ? h * qy * 0.5 :
            data.adso < 4 ? World.canvasHeight - h * qy * 0.5 :
                World.canvasHeight * 0.5;

        //设定值
        sp.rx= Utils.lengthNum(data.x)
        sp.x = sp.rx+sx+(correct.x||0);
        sp.ry= Utils.lengthNum(data.y)
        sp.y = sp.ry+sy+(correct.y||0);
        sp.alpha = data.alpha + (correct.alpha||0)/100;
        sp.rotation = ((data.rota+(correct.rota||0))/180) * Math.PI;
        sp.scale.x *=data.ox + (correct.ox||0)/100
        sp.scale.y *=data.oy + (correct.oy||0)/100
        sp.skew.x =(data.sx + (correct.sx||0))/180 * Math.PI;
        sp.skew.y =(data.sy + (correct.sy||0))/180 * Math.PI;
        
        //裁剪
        let fx= data.fx+(correct.fx||0)
        let fy= data.fy+(correct.fy||0)
        let fw= data.fw+(correct.fw||0)
        let fh= data.fh+(correct.fh||0)
        sp.setFrame(w*fx/100,h*fy/100,w*fw/100,h*fh/100)
    }
}
Adorn.prototype.move=function (key,data){
    if(this.data[key]) {
        for (let k of Object.keys(data)) this.data[key][k] = data[k]
        this.data[key].trans = true
    }
}
Adorn.prototype.setTouch =function (key,bool){
    if(this.handler[key]) this.handler[key]._alpha=bool||false
}
Adorn.prototype.spHandler=function (key,handler){
    this.delHandler(key)
    if(this.data[key]) this.handler[key]=new Handler(this,handler)
}
Adorn.prototype.delHandler=function (key){
    if(this.handler[key]) delete this.handler[key]
}
/////////////////////////////////////////////
function Writ() {
    this.initialize.apply(this, arguments);
}
Writ.prototype = Object.create(Sprite.prototype);
Writ.prototype.constructor = Writ;
Writ.prototype.initialize = function(orgin) {
    Sprite.prototype.initialize.call(this)
    this._orgin=orgin
    this._orgin.addChild(this)
    this._text={}
    this._sp={}
    this._style={}
    this.time=0
}
Writ.prototype.addText=function (key,data){
   this._text[key]=data
   this._style[key]=this.getStyle(data)
   this._sp[key]=new PIXI.Text(data.txt,this._style[key])
   this._sp[key].blendMode=0
   this._sp[key].anchor._x=0.5
   this._sp[key].anchor._y=0.5
   this.drawText()
}
Writ.prototype.setBlend =function (key,blend) {
    if(this._sp[key]) 
        this._sp[key].blendMode=blend
}

Writ.prototype.delText=function (key){
    delete  this._text[key]
    this.drawText()
}
Writ.prototype.setAnch =function (key,anch) {
    if(this._text[key])
        this._text[key].anch=anch
}
Writ.prototype.setText=function (key,txt,bool){
    if(this._text[key]&&txt){
        this._text[key].txt=txt
        if(bool) {
            this._sp[key].inTxt = ""
            this._sp[key].txtIn = true
        }
        else {
            this._sp[key].text=txt
        }
    }
}
Writ.prototype.drawText=function (){
    this.children=[]
    for(let index in this._sp){
        if(this._text[index]) {this.addChild(this._sp[index])}
        else {
            delete this._sp[index]
            delete this._style[index]
        }
    }
}
Writ.prototype.getStyle=function (data){
    return {
        fontFamily:data.fontFamily||"font",
        lineJoin:data.lineJoin|| "round",
        padding:data.padding||20,
        fill:data.fill||"#000",
        fillGradientType:data.fillGradientType||0,
        fontSize:data.fontSize||24,
        letterSpacing: data.letterSpacing||1,
        fontWeight:data.fontWeight||100,
        fontStyle:data.fontStyle||"normal",
        stroke: data.stroke||"#fff",
        strokeThickness: data.strokeThickness||7,
        interval:Math.round((data.interval||5))
    }
}
Writ.prototype.setStyle=function (key,data){
    for(let index in data){
        this._text[key][index]=data[index]
        this._style[key][index]=data[index]
        this._sp[key].style = this._style[key]
    }
}
Writ.prototype.clearText=function (){
    this._text={}
    this.drawText()
}
Writ.prototype.update=function (){
    for(let key in this._text){
        
        if(this._sp[key].txtIn){
            if(!Config.textspeed){
                this._sp[key].inTxt=this._text[key].txt
                this._sp[key].text=this._sp[key].inTxt
                this._sp[key].txtIn=false
            }
            else if(this.time%(Math.round(this._style[key].interval*(Config.textspeed)))===0){
                if(this._sp[key].inTxt!== this._text[key].txt){
                    this._sp[key].inTxt+=this._text[key].txt.charAt(this._sp[key].inTxt.length)
                    this._sp[key].text=this._sp[key].inTxt
                }
                else {this._sp[key].txtIn=false}
            }
        }
        
        let data=this._text[key]
        if(data.anch&&this._orgin.adorn.sp[data.anch]){
            let sp=this._orgin.adorn.sp[data.anch]
            switch (data.adso){
                case 9:
                case 6:
                case 3:
                    this._sp[key].x=sp.getX() + sp.width*sp.scale.x * 0.5 -  this._sp[key].width *0.5
                    break
                case 7:
                case 4:
                case 1:
                    this._sp[key].x=sp.getX() - sp.width*sp.scale.x * 0.5 +  this._sp[key].width *0.5
                    break
                default:
                    this._sp[key].x=sp.getX()
            }
            switch (data.adso){
                case 1:
                case 2:
                case 3:
                    this._sp[key].y=sp.getY() + sp.height*sp.scale.y * 0.5 -  this._sp[key].height *0.5
                    break
                case 7:
                case 8:
                case 9:
                    this._sp[key].y=sp.getY() - sp.height*sp.scale.y * 0.5 +  this._sp[key].height *0.5
                    break
                default:
                    this._sp[key].y=sp.getY()
            }
        }
        else {
            this._sp[key].x=0
            this._sp[key].y=0
        }
        this._sp[key].alpha= data.alpha===undefined?1:data.alpha
        this._sp[key].x+= data.x||0
        this._sp[key].y+= data.y||0
        this._sp[key].rotation= (data.rota||0) /180 * Math.PI;
        this._sp[key].scale.x= data.ox||1
        this._sp[key].scale.y= data.oy||1
        this._sp[key].skew.x= (data.sx|0)/180 * Math.PI
        this._sp[key].skew.y= (data.sy||0)/180 * Math.PI
    }
    this.time++
}
function Handler() {
    this.initialize.apply(this, arguments);
}
Handler.prototype = Object.create(Handler.prototype);
Handler.prototype.constructor = Handler;
Handler.prototype.initialize = function(orgin, handler) {
    this._orgin = orgin;
    this._handler = handler;
    this.create();
};
Handler.prototype.create = function() {
    this._alpha = false;
    this._touch = [-1, -1, -1, -1, -1, -1];
    this._data = [0, -1, 0, -1, 0, -1, 0];
    this._activa = true;
};
Handler.prototype.restore=function() {
    this._touch = [-1, -1, -1, -1, -1, -1];
    this._activa = true;
};


Handler.prototype.update = function(x, y, cancelled, pressed, item) {
   if (this._activa) {
        let itemWidth = item.width*item.scale.x;
        let itemHeight = item.height*item.scale.y;
        let itemX = item.getX()
        let itemY = item.getY()
        let alphaPixel = this._alpha||item.bitmap.getAlphaPixel(x - (itemX - itemWidth * 0.5), y - (itemY - itemHeight * 0.5))
        this._touch = [
            x - (itemX - itemWidth * 0.5),
            y - (itemY - itemHeight * 0.5),
            this._touch[2] > -1 ? this._touch[4] : x,
            this._touch[3] > -1 ? this._touch[5] : y,
            x,
            y
        ];
        
        if (cancelled) {
            this._data[5] = this._data[0]+1;
        }
        let insideItem = alphaPixel > 0 && this._touch[0] >= 0 && this._touch[0] <= itemWidth && this._touch[1] >= 0 && this._touch[1] <= itemHeight;
        if (pressed) {
            if(this._data[4]>this._data[3]) {
                this._data[3] = this._data[0] + 1
                if(insideItem){this._data[6]=1}
            }
        }
        else {
            if(this._data[3]>this._data[4]) {this._data[4]=this._data[0]+1}
            if(this._data[6]) this._data[6]=this._data[6]===1?2:0
        }

        if (insideItem) {
            if(this._data[2]>this._data[1]){this._data[1]=this._data[0]+1}
        }
        else {
            if(this._data[1]>this._data[2]){this._data[2]=this._data[0]+1}
        }
        
        this._data[0]++;  // 更新时间
        return {data:this._data,touch:this._touch}
    }
};
