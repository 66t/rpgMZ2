function Identity(){this.initialize.apply(this, arguments);}
Identity.prototype = Object.create(Identity.prototype);
Identity.prototype.constructor = Identity;
Identity.SEED_COUNT=32
Identity.SEED_LINK="-"
Identity.key=CryptoJS.enc.Hex.parse('123318efc4b6388888af51a6cd932b12');
Identity.prototype.initialize = function() {
    this.seed=[];
    this.key="";
    this._number=[]
    this._bool=[]
    this.initSeed()
    this.initKey()
}
Identity.prototype.initKey=function(){
    let t=Date.now().toString().split('').reverse().join('')
    while (t>0) {
        this.key+=(Utils.radixNum(t % 36,10,36))
        t = Math.floor(t / 36)
    }
}
Identity.prototype.initSeed=function(){
    for(let i=0;i<Identity.SEED_COUNT;i++)
       this.seed[i]=this.seedNext(Math.randomInt(65535))
}
Identity.prototype.pro=function(mode,promax){return this.getSeed(mode)%(promax||100)}
Identity.prototype.getSeed=function(mode){
    let index=mode%Identity.SEED_COUNT
    this.seed[index]=this.seedNext(this.seed[index],index)
    return this.seed[index]
}
Identity.prototype.seedNext=function(seed,mode){
    switch(mode%4){
        case 0:seed=(seed*3877+139968)%29573;break//;
        case 1:seed=(seed*421+259200)%54773;break//;
        case 2:seed=(seed*9301+49297)%233280;break//;
        case 3:seed=(seed*281+134456)%28411;break//;
    }
    return Math.round(seed)
}
Identity.prototype.value = function(Id) {return this._number[Id] || 0}
Identity.prototype.setValue = function(Id, value) {if (typeof value === 'number') {this._number[Id] = value}}
Identity.prototype.bool = function(Id) {return !!this._bool[Id]}
Identity.prototype.setBool = function(Id, value) {
    if (value) {this._bool[Id] = true} 
    else {delete this._bool[Id]}
}
Identity.prototype.makeSaveContents = function(savefileId,data) {
    let contents = {};
    if (savefileId < 0) contents=Config.makeData()
    else if (savefileId === 0) contents=DataBase._globalInfo
    else {
        contents.storage  = {
            seed:this.seed,
            key:this.key,
            number:this._number,
            bool:this._bool
        };
    }
    const s= pako.deflate(JSON.stringify(contents), {to: 'string',windowBits: -15})
    return CryptoJS.AES.encrypt(s, Identity.key, { mode: CryptoJS.mode.ECB }).toString()
}
Identity.prototype.loadSaveContents = function(savefileId,data) {
    if(!data) return false;
    const s = pako.inflate(CryptoJS.AES.decrypt(data, Identity.key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8), {to: 'string',windowBits: -15});
    if (savefileId < 0) {
        return JSON.parse(s);
    }
    else if(savefileId===0){
        return JSON.parse(s)
    }
    else {
        const contents = JSON.parse(s);
        this.seed=contents.storage.seed
        this.key=contents.storage.key
        this._number=contents.storage.number
        this._bool=contents.storage.bool
    }
    return false
}
Identity.prototype.save = function(savefileId) {
    if (Utils.isNwjs()) this.saveToLocalFile(savefileId,this.makeSaveContents(savefileId));
    else this.saveToWebStorage(savefileId,this.makeSaveContents(savefileId));
    
    if(savefileId>0) {
        DataBase._globalInfo.info[savefileId] = this.makeSavefileInfo();
        this.save(0);
    }
}
Identity.prototype.makeSavefileInfo = function() {
    const info = {};
    info.timestamp = Date.now();
    return info;
}
Identity.prototype.makeGlobalInfo = function() {
    const info = {};
    info.info=[]
    info.bgm=[]
    return info
}

Identity.prototype.load = function(savefileId) {
    if (Utils.isNwjs()) return this.loadSaveContents(savefileId,this.loadFromLocalFile(savefileId))
    else return this.loadSaveContents(savefileId,this.loadFromWebStorage(savefileId))
}
Identity.prototype.saveToLocalFile = function(savefileId, json) {
    let fs = require('fs');
    let dirPath = this.localFileDirectoryPath();
    let filePath = this.localFilePath(savefileId);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath,json);
    
}
Identity.prototype.loadFromLocalFile = function(savefileId) {
    let data = null;
    let fs = require('fs');
    let filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath,{encoding: 'utf8' });
    }
    return data;
}
Identity.prototype.saveToWebStorage = function(savefileId, json) {
    let key = this.webStorageKey(savefileId);
    localStorage.setItem(key,json);
}
Identity.prototype.loadFromWebStorage = function(savefileId) {
    let key = this.webStorageKey(savefileId);
    let data = localStorage.getItem(key);
    return data;
}
Identity.prototype.localFilePath = function(savefileId) {
    let name;
    if (savefileId < 0) name = 'config.lim';
    else if (savefileId === 0) name = 'global.lim';
    else name = 'save%1.lim'.format(savefileId);
    return this.localFileDirectoryPath() + name;
}
Identity.prototype.localFileDirectoryPath = function() {
    let path = require('path');
    let base = path.dirname(process.mainModule.filename);
    return path.join(base, 'save/');
}
Identity.prototype.webStorageKey = function(savefileId) {
    if (savefileId < 0) return 'RPG Config';
    else if (savefileId === 0) return 'RPG Global';
    else return 'RPG save%1'.format(savefileId);
}
LIM.$Identity=new Identity()
