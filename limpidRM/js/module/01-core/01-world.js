function World() {throw new Error("static class");}
World.baseMark = 64
World.canvasWidth = 13.5*World.baseMark
World.canvasHeight = 9*World.baseMark
World.windowWidth = 0
World.windowHeight = 0
World.scale = 1

World.app = null
World.tick = null
//时钟
World.currentTime = 0
World.lastUpdateTime= 0
World.elapsedTime= 0
World.fpsCount= 0
World.deltaTime= 0
World.timeStamp= 0

World.cursor = {x:0,y:0}
World.canvas= {x:0,y:0,w:0,h:0}
World.showFps = false

World.initialize=function (){
    PIXI.utils.skipHello()
    PIXI.settings.GC_MAX_IDLE = 600
    this.initCanvas()
    this.initFps()
    this.initFont()
    this.updateFps()
    this.setupEventHandlers()
}
World.initCanvas=function () {
    try {
      this.app=new PIXI.Application({
          width: this.canvasWidth,
          height: this.canvasHeight,
          resolution: window.devicePixelRatio,
          antialias: true,
          autoStart: false
      })
      PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL;
      document.body.appendChild(this.app.view)
      this.app.view.style.display = "none"
      this.app.view.style.position = "absolute"

      this.app.ticker.remove(this.app.render,this.app)
      this.app.ticker.add(this.onTick,this)
      this.lastUpdateTime= performance.now() - 100
      this.elapsedTime= 100
    }
    catch (e){this.app = null;}
}
World.initFps=function () {
    this.fps = document.createElement("div")
    this.memory = document.createElement("div")
    this.xy = document.createElement("div")

    document.body.appendChild(this.fps)
    this.fps.style.width = "200px"
    this.fps.style.height = "30px"
    this.fps.style.top = "30px"
    this.fps.style.left = "10px"
    this.fps.style.lineHeight = "30px"
    this.fps.style.position = "absolute"
    this.fps.style.backgroundColor = "#000a"
    this.fps.style.color = "#fff"
    this.fps.style.fontSize = "18px"
    this.fps.style.fontWeight = "800"
    this.fps.style.textAlign = "left"
    this.fps.style.pointerEvents = "none"

    document.body.appendChild(this.memory)
    this.memory.style.width = "200px"
    this.memory.style.height = "30px"
    this.memory.style.left = "10px"
    this.memory.style.lineHeight = "30px"
    this.memory.style.position = "absolute"
    this.memory.style.backgroundColor = "#000a"
    this.memory.style.color = "#fff"
    this.memory.style.fontSize = "18px"
    this.memory.style.fontWeight = "800"
    this.memory.style.textAlign = "left"
    this.memory.style.pointerEvents = "none"

    document.body.appendChild(this.xy)
    this.xy.style.width = "200px"
    this.xy.style.height = "30px"
    this.xy.style.top = "60px"
    this.xy.style.left = "10px"
    this.xy.style.lineHeight = "30px"
    this.xy.style.position = "absolute"
    this.xy.style.backgroundColor = "#000a"
    this.xy.style.color = "#fff"
    this.xy.style.fontSize = "18px"
    this.xy.style.fontWeight = "800"
    this.xy.style.textAlign = "left"
    this.xy.style.pointerEvents = "none"
}
World.initFont=function () {
    FontManager.load("font","font.ttf")
    FontManager.load("write","write.ttf")
    FontManager.load("jua","jua.ttf")
    
}

World.startGame=function (){
    if(this.app) {
        this.app.start()
        this.app.view.style.display="block"
    }
}
World.stopGame=function (){
    if(this.app) {
        this.app.stop()
        this.app.view.style.display = "none"
    }
}

World.updateFps=function () {
   if(this.showFps){
     this.fps.style.display ='block'
     this.xy.style.display ='block'
     this.memory.style.display ='block'
   }
   else {
     this.fps.style.display ='none'
     this.xy.style.display ='none'
     this.memory.style.display ='none' 
   }
}
World.setTick=function (handler){this.tick = handler}
World.onTick=function(deltaTime){
    this.currentTime = performance.now()
    if(this.tick) this.tick(deltaTime)
    if(this.canRender()) this.app.render()

    let time = performance.now()
    let thisclockTime = time - this.lastUpdateTime
    
    this.elapsedTime +=  (thisclockTime - this.elapsedTime) / 12
    this.fpsCount = 1000 / this.elapsedTime
    this.deltaTime = Math.max(0, time - this.currentTime)
    this.lastUpdateTime=time
    if(this.timeStamp++ % 15 === 0) this.drawFps()
}

World.canRender=function (){return !!this.app.stage}
World.changeResolution=function (w,h){
    this.scale = 1
    w *= window.devicePixelRatio
    h *= window.devicePixelRatio
    this.canvasWidth = w
    this.canvasHeight = h

    this.app.width = w
    this.app.height = h
    this.app.view.width = w
    this.app.view.height = h
    this.resize()
}
World.drawFps = function (){
    this.fps.innerHTML = `fps: ${this.fpsCount.toFixed(0)}`
    this.memory.innerHTML = `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`
    this.xy.innerHTML = `${this.cursor.x.toFixed(0)}/${this.cursor.y.toFixed(0)}`
}

World.setStage=function (stage){if(this.app) this.app.stage = stage}
World.setTick=function (handler){this.tick = handler}
World.setupEventHandlers=function (){
    document.addEventListener('mousemove',this.cursorMove.bind(this))
    document.addEventListener("touchmove",this.cursorMove.bind(this));
    document.addEventListener('keydown',this.onKeyDown.bind(this))
    window.addEventListener('resize',this.resize.bind(this))
    window.addEventListener('visibilitychange',this.change.bind(this))
    window.addEventListener("unload",this.unload.bind(this));
}
World.cursorMove=function (evnet) {
    let sx = event.clientX - World.canvas.x
    let sy = event.clientY - World.canvas.y
    this.cursor.x = sx / World.scale / window.devicePixelRatio
    this.cursor.y = sy / World.scale / window.devicePixelRatio
}

World.onKeyDown=function (evnet) {
    if(!(event.ctrlKey || event.altKey))
      switch (event.keyCode){
          case 113:
             this.showFps = !this.showFps
             this.updateFps()
             break
          case 115:
             if(this.isFull()) this.cancelFullScreen()
             else this.requestFullScreen()
             break
          case 116:
             if(Utils.isNwjs()) chrome.runtime.reload()
             break
      }
}
World.resize=function () {
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight
    let scale = Math.min(this.windowWidth / this.app.view.width, this.windowHeight / this.app.view.height)
    this.setScale(scale)
}
World.setScale=function (scale){
    if(this.app){
        this.scale = scale
        let canvasStyle = this.app.view.style
        let canvasOffsetWidth = this.app.view.offsetWidth
        let canvasOffsetHeight = this.app.view.offsetHeight
        this.canvas.w = canvasOffsetWidth * scale
        this.canvas.h = canvasOffsetHeight * scale
        this.canvas.x = (this.windowWidth - this.canvas.w) / 2
        this.canvas.y = (this.windowHeight - this.canvas.h) / 2
        canvasStyle.transform = `scale(${scale}, ${scale})`
        canvasStyle.left = `calc((-${canvasOffsetWidth}px * (1 - ${scale})) / 2 + (${this.windowWidth}px - ${canvasOffsetWidth}px * ${scale}) / 2)`
        canvasStyle.top = `calc((-${canvasOffsetHeight}px * (1 - ${scale})) / 2 + (${this.windowHeight}px - ${canvasOffsetHeight}px * ${scale}) / 2)`
        this.cursorActi=false
    }
}

World.change=function (){
    if(document.visibilityState === 'hidden') this.hide()
    else this.acti()
}
World.acti=function (){
    Conductor.acti(200)
}
World.hide=function (){
    Conductor.hide(200)
}
World.unload=function (){PIXI.utils.clearTextureCache();}
World.isFull = function (){return document.fullScreenElement || document.mozFullScreen || document.webkitFullscreenElement}
World.requestFullScreen=function (){
    let element = document.body
    if(element.requestFullScreen)
        element.requestFullScreen()
    else if(element.mozRequestFullScreen)
        element.mozRequestFullScreen()
    else if(element.webkitRequestFullScreen)
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
}
World.cancelFullScreen=function (){
    let element = document.body
    if(element.cancelFullScreen)
        element.cancelFullScreen()
    else if(document.mozCancelFullScreen)
        document.mozCancelFullScreen()
    else if(document.webkitCancelFullScreen)
        document.webkitCancelFullScreen()
}


