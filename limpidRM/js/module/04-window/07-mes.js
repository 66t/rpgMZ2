function LIMScene_mes_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_mes_window.prototype = Object.create(Cotton.prototype);
LIMScene_mes_window.prototype.constructor = LIMScene_mes_window;
LIMScene_mes_window.prototype.initialize = function (orgin,traje,pos,wait) {
    Cotton.prototype.initialize.call(this,orgin)
    this.pos=pos
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
    this.setAdorn("mes","mes","",{},"100%","100%",this.pos.x,this.pos.y,0,this.pos.adso,1,0)
}
LIMScene_mes_window.prototype.initStart=function () {
    this.txtIndex=0
    this.txtData={
        x:0,y:0,
        fill:"",fontSize:16,fontFamily:"",fontWeight:0,
        grad:0,stroke:"",strokeThick:0,
        letter:0,interval:0,fontStyle:0
    }
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
        if (this.txtName && this.isWritIn(this.txtName)) {
            return false
        }
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
                        data.y += parseInt(item[1])
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
                data.x += this.addText(
                    this.txtName,
                    {
                        x: data.x,
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
                        interval: data.interval,
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
                this.setText(this.txtName, item, true)
                this.txtIn = this.isWritIn(this.txtName)
                if (this.txtIn) return false
            }
        }
        return true
    }
}
LIMScene_mes_window.prototype.endStart=function () {
    this.txtName=""
}

LIMScene_mes_window.prototype.removeTxt = function() {
    for(let i=0;i<this.index;i++) this.delText("txt"+i)
    this.index=0
}
LIMScene_mes_window.prototype.innerListen=function () {
    const txt=LIM.$Dialogue.getFlow(this.traje)
    if(txt){
        this.removeTxt(0)
        this.txt= this.txtSplit(txt)
        this.exeWork("运行")
    }
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



