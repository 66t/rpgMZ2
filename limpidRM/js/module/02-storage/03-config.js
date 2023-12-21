function Config() {throw new Error("static class");}

Config.select={}
Config.select.language=["tc","zh","jp","en","ko"]
Config.select.window=[1,2,3,4,5,6]
Config.select.textspeed=[0,0.25,0.5,1,1.5,2]
Config.select.opmemory=[0,1]
Config.select.volume=[0,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1]
Config.select.seVolume=[0,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1]
Config.select.bgmVolume=[0,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1]
Config.language = "en";
Config.window = 1;
Config.textspeed = 1;
Config.opmemory = 1;
Config._isLoaded = false;
Config.getText=function (key){
    if(LIM.$text[key]) return LIM.$text[key][Config.language]
    else `[${key}]`
}
Object.defineProperty(Config, "Volume", {
    get: function() {return Conductor.volVolume;},
    set: function(value) {Conductor.volVolume = value;},
    configurable: true
});
Object.defineProperty(Config, "seVolume", {
    get: function() {return Conductor.trajeVolume[0];},
    set: function(value) {Conductor.trajeVolume[0] = value;},
    configurable: true
});
Object.defineProperty(Config, "bgmVolume", {
    get: function() {return Conductor.trajeVolume[1];},
    set: function(value) {Conductor.trajeVolume[1] = value;},
    configurable: true
});

Config.makeData = function() {
    const config = {};
    config.language = this.language;
    config.window = this.window;
    config.textspeed = this.textspeed;
    config.opmemory = this.opmemory;
    config.textspeed = this.textspeed;
    config.volume = this.Volume;
    config.seVolume = this.seVolume;
    config.bgmVolume = this.bgmVolume;
    return config;
};
Config.applyData = function(config) {
    Config._isLoaded = true
    if(config) {
        this.language = config.language
        this.window = config.window
        this.textspeed = config.textspeed.clamp(0,2)
        this.opmemory = config.opmemory.clamp(0,1)
        this.Volume = config.volume.clamp(0,1)
        this.seVolume = config.seVolume.clamp(0,1)
        this.bgmVolume = config.bgmVolume.clamp(0,1)
    }
    else {
        LIM.$Identity.save(-1)
    }
};