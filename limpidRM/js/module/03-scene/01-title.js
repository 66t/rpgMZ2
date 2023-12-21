function Lim_Title() {
    this.initialize.apply(this, arguments);
}
Lim_Title.prototype = Object.create(Stage.prototype);
Lim_Title.prototype.constructor = Lim_Title;
Lim_Title.prototype.initialize = function () {
    Stage.prototype.initialize.call(this)
    new LIMScene_title(this)
}
function LIMScene_title(){this.initialize.apply(this, arguments);}
LIMScene_title.prototype = Object.create(Weaver.prototype);
LIMScene_title.prototype.constructor = LIMScene_title;
LIMScene_title.prototype.initialize = function(orgin) {
    Weaver.prototype.initialize.call(this,orgin)
}
LIMScene_title.prototype.install = function (){
    Weaver.prototype.install.call(this)
    
    this._window["t1"]=new LIMScene_title_window(this)
    this._window["t1"].start()

    this._window["t2"]=new LIMScene_config_window(this)
    this._window["t2"].hide()
}
LIMScene_title.prototype.execute=function (){
    Weaver.prototype.execute.call(this)
}