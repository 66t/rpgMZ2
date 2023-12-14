﻿function DataBase() {throw new Error("static class");}
DataBase.path = 'fact';
DataBase.dataFile=[
    {name:"audio",src:"Audio"},
    {name:"text",src:"Text"},
    {name:"actors",src:"Actors"}
]
DataBase._globalInfo = null
DataBase._errors = [];
DataBase.loadDatabase = function() {
    for (const databaseFile of this.dataFile) {
        this.loadDataFile("$"+databaseFile.name, databaseFile.src);
    }
};
DataBase.loadDataFile = function(name, src) {
    const xhr = new XMLHttpRequest();
    const url = DataBase.path+"/"+src+".json";
    LIM[name] = null;
    xhr.open("GET", url);
    xhr.overrideMimeType("application/json");
    xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
    xhr.onerror = () => this.onXhrError(name, src, url);
    xhr.send();
};
DataBase.onXhrLoad = function(xhr, name, src, url) {
    if (xhr.status < 400) {LIM[name] = JSON.parse(xhr.responseText);}
    return true;
};
DataBase.isDataLoad = function() {
    for (const databaseFile of this.dataFile) {
        if (!LIM["$"+databaseFile.name]) 
            return false;
    }
    return true;
};
DataBase.onXhrError = function(name, src, url) {
    const error = {name:name,src:src,url:url };
    this._errors.push(error);
};
DataBase.checkError = function() {
    this.checkError();
    if (this._errors.length > 0) {
        const error = this._errors.shift();
        const retry = () => {this.loadDataFile(error.name, error.src);};
        throw ["LoadError", error.url, retry];
    }
};
DataBase.isGlobalLoad = function() {return !!this._globalInfo;};
DataBase.isSave = function() {
    return this._globalInfo.info.some(x => x);
};
