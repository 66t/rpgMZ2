function Lim_Database() {
    this.initialize.apply(this, arguments);
}
Lim_Database.prototype = Object.create(Stage.prototype);
Lim_Database.prototype.constructor = Lim_Database;
Lim_Database.prototype.initialize = function () {
    Stage.prototype.initialize.call(this)
    new LIMScene_database(this)
}
function LIMScene_database(){this.initialize.apply(this, arguments);}
LIMScene_database.prototype = Object.create(Weaver.prototype);
LIMScene_database.prototype.constructor = LIMScene_database;
LIMScene_database.prototype.initialize = function(orgin) {
    Weaver.prototype.initialize.call(this,orgin)
    LIM.$Dialogue.setWork("lnk|1|1")
}
LIMScene_database.prototype.install = function (){
    Weaver.prototype.install.call(this)
    this._window["t1"]=new LIMScene_database_window(this)
    this._window["t1"].start()
    
    this._window["t2"]=new LIMScene_music_window(this)
    this._window["t2"].hide()

    this._window["t3"]=new LIMScene_photo_window(this)
    this._window["t3"].hide()

    this._window["t4"]=new LIMScene_contacts_window(this)
    this._window["t4"].hide()
    
    const pos={
       w: World.canvasWidth*0.6-40,
       h: World.canvasHeight-340,
       x:-20,y:160,adso:9,
    }
    const scroll={w:7,h:15,x:4,y:0,color1:"#0008",color2:"#fff8",adso:9}
    this._window["mes"]=new LIMScene_mes_window(this,5,pos,scroll)
    this._window["mes"].hide()
}
LIMScene_database.prototype.execute=function (){
    Weaver.prototype.execute.call(this)
}
