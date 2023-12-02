function Lim_Scene() {
    this.initialize.apply(this, arguments);
}
Lim_Scene.prototype = Object.create(Stage.prototype);
Lim_Scene.prototype.constructor = Lim_Scene;
Lim_Scene.prototype.initialize = function () {
    Stage.prototype.initialize.call(this)
    new Test(this)
}


function Test(){this.initialize.apply(this, arguments);}
Test.prototype = Object.create(Weaver.prototype);
Test.prototype.constructor = Test;
Test.prototype.initialize = function(orgin) {
    Weaver.prototype.initialize.call(this,orgin)
}
Test.prototype.install = function (){
    Weaver.prototype.install.call(this)
    this._window["t1"]=new Test_window(this)
    this._window["t1"].start()
}
Test.prototype.execute=function (){
    Weaver.prototype.execute.call(this)
}


function Test_window() {
    this.initialize.apply(this, arguments);
}
Test_window.prototype = Object.create(Cotton.prototype);
Test_window.prototype.constructor = Test_window;
Test_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
};

Test_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    //声明该窗口监听的按键
    this.setInput(["up","left","right","down"])
}
////////
//声明
////////
//声明该窗口用到的图片
Test_window.prototype.initImage = function() {
    this.img = {
        "back3":["ui"],
        "back2":["ui"],
        "back1":["ui"]
    }
}
//声明精灵
Test_window.prototype.initAdorn=function (){
    this.setAdorn("q","back3","",null,"50%","100%","0%",0,2,5,1,0)
    this.moveAdorn("q",{x:-300})
    this.addText("111",{txt:111,anch:"q",adso:3,fontFamily:"magic"})
    this.setText("111","原神 启动！")
    this.setStyle("111",{x:-200})
}