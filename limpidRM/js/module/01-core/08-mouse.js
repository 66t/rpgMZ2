function Mouse() {
    this.initialize.apply(this, arguments);
}
Mouse.prototype = Object.create(Sprite.prototype);
Mouse.prototype.constructor = Mouse;
Mouse.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this)
    this.bitmap=new Bitmap(40,40)
    this.anchor.set(0.5, 0.5)
    this.zIndex=10
    this.xy=[]
    this.time=0
    for(let i=0;i<120;i++){
      this.xy.push([World.cursor.x,World.cursor.y])
      if(i<119) { 
          if(i%10===0) {
              const b = new Sprite(new Bitmap(36, 36))
              b.bitmap.strokeRect(9, 9, 18, 18, "#1118", 3)
              b.anchor.set(0.5, 0.5)
              this.addChild(b)
          }
      }
      else {
           let b=  new Sprite(new Bitmap(15,15))
           b.bitmap.drawCircle(7.5,7.5,7.5,"#111a")
           b.anchor.set(0.5, 0.5)
           this.addChild(b)
      }
    }
}
Mouse.prototype.update=function (){
    this.x= World.cursor.x
    this.y= World.cursor.y
    this.xy.shift()
    this.xy.push([this.x,this.y])
    this.time++
    for(let i=0;i<this.xy.length-1;i++){
        if(i%10===0) {
            this.children[i/10].x = this.xy[i][0] - this.x
            this.children[i/10].y = this.xy[i][1] - this.y
            this.children[i/10].rotation = Utils.sinNum(this.xy.length/100, i + this.time)
            this.children[i/10].scale.x = Utils.sinNum(this.xy.length, i)
            this.children[i/10].scale.y = Utils.sinNum(this.xy.length, i)
        }
    }
    this.children[12].scale.x=0.8+Utils.sinNum(this.xy.length,this.time)*0.2
    this.children[12].scale.y=0.8+Utils.sinNum(this.xy.length,this.time)*0.2
}
