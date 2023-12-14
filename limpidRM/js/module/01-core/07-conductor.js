function Conductor() {throw new Error("static class");}
//路径
Conductor.path = 'audio';
//整体音量
Conductor.volVolume = 1;
//每个音轨的音量
Conductor.trajeVolume = [1,1,1,1]
//音轨
Conductor.trajeBuffer = {}
Conductor.trajeIndex = []

//全部音频
Conductor.buffer = []
//自增
Conductor.id = 0
//总体的淡入淡出
Conductor.fadeIn=[0,0]
Conductor.fadeOut=[0,0]

//全局淡入淡出
Conductor.hide =function (time){
    this.fadeOut = [performance.now() + time, performance.now()]
    this.fadeIn[0] = 0;
    this.fadeIn[1] = 0;
}
Conductor.acti =function (time){
    this.fadeIn = [performance.now() + time, performance.now()]
    this.fadeOut[0] = 0;
    this.fadeOut[1] = 0;
    Tone.Master.mute = false
}
Conductor.update=function (){
    const currentTime = performance.now();
    this.updateFadeOut(currentTime)
    this.updateFadeIn(currentTime)
    for(let item of Conductor.buffer) item.update(currentTime)
    setTimeout(()=>{this.update()},10)
}
Conductor.updateFadeIn=function (currentTime){
    if (this.fadeIn[0] > this.fadeIn[1]) {
        const deltaTime = currentTime - this.fadeIn[1];
        const vol = Math.floor((Utils.sinNum(this.fadeIn[0] - this.fadeIn[1], deltaTime)) * 10000) / 10000;
        this.setMastertVol(vol);
        if (currentTime >= this.fadeIn[0]||vol===1) {
            this.fadeIn[0] = 0;
            this.fadeIn[1] = 0;
            this.setMastertVol(1);
        }
    }
}
Conductor.updateFadeOut=function (currentTime){
    if (this.fadeOut[0] > this.fadeOut[1]) {
        const deltaTime = currentTime - this.fadeOut[1];
        const vol = (10000 - Math.ceil((Utils.sinNum(this.fadeOut[0] - this.fadeOut[1], deltaTime)) * 10000)) / 10000;
        this.setMastertVol(vol);
        if (currentTime >= this.fadeOut[0]||vol===0) {
            this.fadeOut[0] = 0;
            this.fadeOut[1] = 0;
            Tone.Master.mute = true;
        }
    }
}
Conductor.setMastertVol = function(val) {
    Tone.Master.volume.value = 12 * Math.log10(val);
};
//播放
Conductor.play = function (id){
    let data = LIM.$audio[id];
    if (data) new Near(data)
}
//暂停
Conductor.pause = function (traje){
    if(Conductor.trajeBuffer[traje]) {
        let audio = Conductor.trajeBuffer[traje][Conductor.trajeIndex]
        if (audio) audio.pause()
    }
}
Conductor.stop = function (traje){
    if(Conductor.trajeBuffer[traje]) {
        let audio = Conductor.trajeBuffer[traje][Conductor.trajeIndex]
        if (audio) audio.stop()
    }
}

//实例
function Near() {
    this.initialize.apply(this, arguments);
}
Near.prototype = Object.create(Near.prototype);
Near.prototype.constructor = Near;
Near.prototype.initialize = function (data) {
    this.audio= new Tone.Player().toDestination()
    this.data=data
    this.mark=0
    this.traje=data.traje
    this.setBuffer()
    this.setVol(this.data.volume)
    if (data.rate) this.setRate(data.rate);
    if (data.rever) this.setRever(data.rever);
    const src = `${Conductor.path}/${data.type}/${data.name}.ogg`;
    this.audio.load(src).then(()=>{this.start()});
    if (data.pan) this.setPan(data.pan);
    if (data.pitch)this.setPitch(data.pitch);
    if (data.chorus)this.setChorus(data.chorus);
    ///////
    if(data.type==="bgm")
        this.globalBgm(data.name)
}
Near.prototype.globalBgm =function (name){
    const bgm=DataBase._globalInfo.bgm
    if(bgm.indexOf(name)===-1) bgm.push(name)
    LIM.$Identity.save(0)
}
    
Near.prototype.start = function() {
    this.start_time=(this.data.time*this.audio.playbackRate)%this.audio.buffer.duration
    this.play() 
    this.setLoop(this.data.loop)
}
Near.prototype.play = function() {
    this.start_time=(this.start_time*this.audio.playbackRate)%this.audio.buffer.duration
    this.play_time=performance.now()
    this.audio.start("+0",this.start_time);
    this.mark=1
    this.startFadeIn(this.data.fade[0])
}
Near.prototype.pause=function (){
    if(this.mark===1){
      this.startFadeOut(this.data.fade[1])
      this.mark=2
    }
    else if(this.fadeOut) this.corrFadeIn()
    else {
        this.play()
    }
}
Near.prototype.stop=function (){
    if(this.mark===1){
        this.startFadeOut(this.data.fade[1])
        if(Conductor.trajeBuffer[this.traje]&&Conductor.trajeBuffer[this.traje][Conductor.trajeIndex]===this) {
            Conductor.trajeBuffer[this.traje].splice(Conductor.trajeIndex,1)
            if(Conductor.trajeBuffer[this.traje][--Conductor.trajeIndex])
                Conductor.trajeBuffer[this.traje][Conductor.trajeIndex].pause()
        }
        this.mark=4
    }
}
Near.prototype.update=function (time){
    if(this.mark) {
        this.vol = true
        this.updateFadeIn(time)
        this.updateFadeOut(time)
        if (this.vol) this.setVol(this.data.volume)
        if (this.mark === 1 && this.audio.state === "stopped") this.dispose()
    }
}

Near.prototype.startFadeIn = function (time){
    if(this.fadeOut){
        this.fadeOut = 0
        this.start_time += (performance.now() - this.play_time) / 1000
        if (this.mark  === 3) Conductor.restBuffer[this.traje] = this
    }
    else {
        this.fadeInTime = performance.now()
        this.fadeIn = time * 1000
        this.fadeInCorr = 0
    }
}
Near.prototype.corrFadeIn=function (){
    const t=(this.fadeOut-(performance.now() - this.fadeOutTime))/this.fadeOut*(this.data.fade[0]*1000)
    this.fadeOut = 0
    this.fadeInTime = performance.now()
    this.fadeInCorr=t
    this.fadeIn = this.data.fade[0] * 1000
    this.mark=1
}
Near.prototype.updateFadeIn=function (time){
    if(this.fadeIn){
        if(this.fadeIn>=time-this.fadeInTime+this.fadeInCorr){
            const vol = Math.floor(this.data.volume*Math.pow(Utils.sinNum(this.fadeIn,time-this.fadeInTime+this.fadeInCorr),4) * 10000);
            this.setVol(vol / 10000)
        }
        else this.FadeInEnd()
    }
}
Near.prototype.FadeInEnd=function (){
    this.fadeIn = 0
}

Near.prototype.startFadeOut = function (time){
    if(this.fadeIn) {
        const t=(this.fadeIn-(performance.now() - this.fadeInTime))/this.fadeIn*(time*1000)
        this.fadeIn = 0
        this.fadeOutTime = performance.now()
        this.fadeOut = time * 1000
        this.fadeOutCorr=t
    }
    else {
        this.fadeIn = 0
        this.fadeOutTime = performance.now()
        this.fadeOut = time * 1000
        this.fadeOutCorr = 0
    }
}
Near.prototype.updateFadeOut=function (time){
    if(this.fadeOut) {
        if (this.fadeOut >= time - this.fadeOutTime+this.fadeOutCorr) {
            const vol = Math.floor((this.data.volume * (1 - Utils.sinNum(this.fadeOut,time-this.fadeOutTime+this.fadeOutCorr))) * 10000) 
            this.setVol(vol/ 10000)
        }
        else this.FadeOutEnd()
    }
}
Near.prototype.FadeOutEnd=function (){
    this.fadeOut = 0
    this.setVol(0)
    this.audio.stop()
    if(this.mark===4){this.dispose()}
    else {
        this.start_time += (performance.now() - this.play_time) / 1000   //播放的时间
        if (this.mark  === 3) Conductor.restBuffer[this.traje] = this
        this.mark = 0
    }
}


Near.prototype.dispose=function (){
    this.audio.dispose()
    for(let i=0;i<Conductor.buffer.length;i++){
        if(Conductor.buffer[i]===this){
            Conductor.buffer.splice(i,1)
            delete this
            return
        }
    }
}


Near.prototype.setBuffer=function () {
    if(this.traje) {
        //如果正在播放
        if(Conductor.trajeBuffer[this.traje]) {
            Conductor.trajeBuffer[this.traje][Conductor.trajeIndex].pause()
            Conductor.trajeBuffer[this.traje].splice(++Conductor.trajeIndex,0,this)
        }
        else {
            Conductor.trajeBuffer[this.traje]=[this]
            Conductor.trajeIndex=0
        }
    }
    Conductor.buffer.push(this)
}
Near.prototype.setVol = function(val) {
    const trajeVal=Conductor.trajeVolume[this.traje]!==undefined?Conductor.trajeVolume[this.traje]:1
    this.audio.volume.value = 12 * Math.log10(val * Conductor.volVolume * trajeVal);
    this.audio.mute=val * Conductor.volVolume * trajeVal===0
    this.vol=false
};
Near.prototype.setRate = function(val) {this.audio.playbackRate = val;};
Near.prototype.setRever = function(val) {this.audio.reverse = val;};
Near.prototype.setPan = function(val) {
     const panner = new Tone.Panner().toDestination();
     panner.pan.value = val;
     this.audio.connect(panner);
};
Near.prototype.setLoop = function(val) {
    if(val) this.audio.loop = val
};
Near.prototype.setPitch=function (val){
    this.pitchShift = new Tone.PitchShift({pitch:val[0],windowSize:val[1]}).toDestination()
    const pitchGain = new Tone.Gain(0).toDestination()
    this.audio.connect(this.pitchShift)
    this.audio.connect(pitchGain)
}
Near.prototype.setChorus=function (val){
    const chorus = new Tone.Chorus(val[0],val[1],val[2]).toDestination().start();
    if(this.pitchShift) this.pitchShift.connect(chorus)
    else this.audio.connect(chorus)
}


