function Lim_Theater() {
    this.initialize.apply(this, arguments);
}
Lim_Theater.prototype = Object.create(Stage.prototype);
Lim_Theater.prototype.constructor = Lim_Theater;
Lim_Theater.prototype.initialize = function () {
    Stage.prototype.initialize.call(this)
    new LIMScene_theater(this)
}
function LIMScene_theater(){this.initialize.apply(this, arguments);}
LIMScene_theater.prototype = Object.create(Weaver.prototype);
LIMScene_theater.prototype.constructor = LIMScene_theater;
LIMScene_theater.prototype.initialize = function(orgin) {
    Weaver.prototype.initialize.call(this,orgin)
}
LIMScene_theater.prototype.install = function (){
    Weaver.prototype.install.call(this)

    this._window["t1"]=new LIMScene_theater_window(this)
    this._window["t1"].start()
}
LIMScene_theater.prototype.execute=function (){
    Weaver.prototype.execute.call(this)
}
