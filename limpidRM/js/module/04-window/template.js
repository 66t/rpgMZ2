

function LIMScene_title_window() {
    this.initialize.apply(this, arguments);
}
LIMScene_title_window.prototype = Object.create(Cotton.prototype);
LIMScene_title_window.prototype.constructor = LIMScene_title_window;
LIMScene_title_window.prototype.initialize = function (orgin) {
    Cotton.prototype.initialize.call(this,orgin)
};

////////
//声明
////////
//声明该窗口用到的图片
LIMScene_title_window.prototype.initImage = function() {
    this.img = {
        "back":["ui/save"],
        "info":["ui/save"],
        "save":["ui/save"],
        "save-select":["ui/save"],
        "save-nodata":["ui/save"],
        "save-nodata-select":["ui/save"]
    }
}


//声明精灵
LIMScene_title_window.prototype.initAdorn=function (){
    this.setAdorn("back","back","",null,"100w","100h",0,0,0,1,1,0)
    this.setAdorn("text","text","",null,"90%","90%",20,-10,1,4,1,0)
    this.setAdorn("info","info","",null,"100%","100%",0,50,1,6,1,0)

    this.setAdorn("save1","save","D",{index:1},"90%","90%",-50,-330,1,6,1,0)
    this.setAdorn("save2","save","D",{index:2},"90%","90%",-50,-70,1,6,1,0)
    this.setAdorn("save3","save","D",{index:3},"90%","90%",-50,180,1,6,1,0)
    this.setAdorn("save4","save","D",{index:4},"90%","90%",-50,430,1,6,1,0)
}

LIMScene_title_window.prototype.execute=function (){
    Cotton.prototype.execute.call(this)
    //声明该窗口监听的按键
    this.setInput(["up"])
    this.evokeAdorn("save1",true)
    this.evokeAdorn("save2",true)
    this.evokeAdorn("save3",true)
    this.evokeAdorn("save4",true)
}

LIMScene_title_window.prototype.WheelDown_0=function (){
}
LIMScene_title_window.prototype.WheelUp_0=function (){}

LIMScene_title_window.prototype.Trigger_up_0=function (){}
LIMScene_title_window.prototype.Key_up_0=function (){}
LIMScene_title_window.prototype.Rele_up_0=function (){}
LIMScene_title_window.prototype.Longkey_up_0=function (){}


//进入
LIMScene_title_window.prototype.handler_E=function(){}
//离开
LIMScene_title_window.prototype.handler_Q=function(){}
//悬停
LIMScene_title_window.prototype.D_T=function(data){
    if(this.getNote("d_index")!==data.index) {
        this.setNote("d_index", data.index)
        Conductor.play("coin04",0)
    }
}
//内部释放
LIMScene_title_window.prototype.handler_K=function(){}
//释放
LIMScene_title_window.prototype.handler_G=function(){}
//左键
LIMScene_title_window.prototype.handler_L=function(){}
//右键
LIMScene_title_window.prototype.handler_R=function(){}
//拖拽
LIMScene_title_window.prototype.handler_C=function(){}
//按下内部
LIMScene_title_window.prototype.handler_D=function(){}



