window.onload =  function () {
    //ConsoleBan.init({})
    DataBase.loadDatabase()
    Config.applyData(LIM.$Identity.load(-1))
    DataBase._globalInfo=LIM.$Identity.load(0)||LIM.$Identity.makeGlobalInfo()
    LIM.Mouse= new Mouse()
    dataLoad()
    function dataLoad(){
       if(DataBase.isDataLoad()&&DataBase.isGlobalLoad()&&Config._isLoaded) gameStart()
       else setTimeout(()=>{dataLoad()},10)
    }
    function gameStart(){
        Conductor.update()
        Scene.run(Lim_Title)
        World.resize()
        DataBase.addActors("rirei")
        new Wave().addWave(10,20,2,30,1,1,1,2)
    }
}