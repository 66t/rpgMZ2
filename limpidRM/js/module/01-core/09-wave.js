function Wave() {
    this.initialize.apply(this, arguments);
}
Wave.prototype = Object.create(Wave.prototype);
Wave.prototype.constructor = Wave;
Wave.prototype.initialize = function () {
    this.data=[]
}
Wave.prototype.addWave=function (v1,v2,wave,max,count,sample=1,digit=false,phase=0,f=1,r=false){
    this.data.push({v1,v2,wave,max,sample,digit,count,phase,f,r})
}
Wave.prototype.count=function (p){
    let val=0
    for(let item of this.data){
        const r = this.compute(item.wave,item.max,p+item.phase,item.f,item.r)/item.sample
        let num= item.v1+(item.v2-item.v1) *r
        if(item.digit) num=Math.round(num)
        switch (item.count) {
            case "+":
                val += num;
                break;
        }
    }
    return val 
}
Wave.prototype.compute=function (mode,max,i,f,r){
    if(mode%5===0) i*=2
    let p=Math.round(i/(max/(1/f)))%2===1?-1:1
    let o=Math.round(i/(max/(1/f)))%4%2===1?-1:1
    let q=i%(max/f)
    let value;
    switch (mode) {
        //弦
        case 104://方波 
            value=(Math.sin((Math.PI * 2 / max * q)) >= 0 ? 1 : -1)*
                (Math.sin((Math.PI * 2 / (max/2) * q)) >= 0 ? 0 : 1)
            break;
        case 204://三角波
            value = (2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q));
            break;
        case 304://正弦波
            value = Math.sin((Math.PI * 2 / max* q));break
        case 404://平滑波
            value=Math.floor((2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q))*10+0.5)/10;
            break;
        case 105: //半圆波
            value= Math.sqrt(1 - Math.pow((q*2/max-1),4))*p;break
        case 205: //方根波
            value = Math.sqrt(Math.abs(Math.sin((Math.PI/max*q))))*p;
            break;
        case 305: //对数波
            let s = Math.E;
            value=(1-((q/max-1)*(q/max) * ((s+1)*(q/max)+s)+1))*p;break
        case 405: //弹跳波
            value= Math.exp(-Math.pow(q*2 - max,2) / (2 * Math.pow(max / 6, 2)))
            value=p>0?value:1-value
            value=o>0?value:(1-value)*-1;break
        case 505: //平方三角
            value =  Math.pow((2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q)),2)*p;break
        case 605: //平方正弦
            value = Math.pow(Math.sin((Math.PI * 2 / max* q)),2)*p;break
        case 705: //斐波那契
            let angle = 0.5 * Math.sqrt(p>0?q:max-q);
            let radius = Math.sqrt(q/ max);
            let x1 = radius * Math.cos(angle);
            let y1 = radius * Math.sin(angle);
            value=(Math.abs(x1)+Math.abs(y1))*p
            break


        //随机
        case 101: //振荡
            value= Math.sin(q);break
        case 201: //振荡余弦
            value= Math.cos(q)*Math.sin(q);break
        case 301: //振荡正切
            value= Math.tan(q);break
        case 401: //平均振荡
            value= (Math.sin(q) + Math.cos(q)) / 2;break


        //过渡
        case 102: //指数
            value = 1-Math.pow(1.03,-q)
            break
        case 202: //反比例
            value = 1 /(q+100)*q
            break
        case 302:  //弦反比例
            value = (0.14/(Math.abs(Math.sin((Math.PI * 2 / max* (max-q)/4)))+0.14))
            break
        case 402:  //方根
            value= Math.sqrt(q/max);break
        case 502:  //平方
            value= Math.pow(q/max,2);break
        case 602:  //正态
            value= Math.exp(-Math.pow(q - max,2) / (2 * Math.pow(max / 6, 2)));break
        case 702:  //弹性
            value=  Math.pow(2, -10 * q / max) * Math.sin((q / max - 0.1) * (2 * Math.PI) / 0.4) + 1;break
        case 802:  //贝塞尔
            value= 3 * (q/max) * Math.pow(1 -  (q/max) , 2) + 3 * Math.pow( (q/max) , 2) * (1 -  (q/max) ) + Math.pow( (q/max) , 3);break
        case 902:  //阻尼振荡
            let f = 0.3;
            let s1 = f / 4;
            value=  Math.pow( 2, -10 *  (q/max)) * Math.sin(( (q/max) - s1) * (2 * Math.PI)) + 1;
    }
    return value*(r?-1:1);
}
