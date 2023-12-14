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
}
LIMScene_database.prototype.install = function (){
    Weaver.prototype.install.call(this)

    this._window["t1"]=new LIMScene_database_window(this)
    this._window["t1"].start()
    this._window["t1"].show()
}
LIMScene_database.prototype.execute=function (){
    Weaver.prototype.execute.call(this)
}
