function ImageManager() {throw new Error("static class");}
ImageManager._cache = {};
ImageManager._system = {};
ImageManager._emptyBitmap = new Bitmap(1, 1);
ImageManager.loadBitmap = function(folder, filename) {
    if (filename) {
        const url = folder + Utils.encodeURI(filename) + ".png";
        if(folder==="img/cg/"){
            const image=DataBase._globalInfo.image
            if(image.indexOf(filename)===-1) {
                image.push(filename)
                LIM.$Identity.save(0)
            }
        }
      
        return this.loadBitmapFromUrl(url);
    } else {
        return this._emptyBitmap;
    }
};
ImageManager.loadBitmapFromUrl = function(url) {
    const cache = url.includes("/system/") ? this._system : this._cache;
    if (!cache[url]) {
        cache[url] = Bitmap.load(url);
    }
    return cache[url];
};
ImageManager.clear = function() {
    const cache = this._cache;
    for (const url in cache) {
        cache[url].destroy();
    }
    this._cache = {};
};
ImageManager.isReady = function() {
    for (const cache of [this._cache, this._system]) {
        for (const url in cache) {
            const bitmap = cache[url];
            if (bitmap.isError()) {
                this.throwLoadError(bitmap);
            }
            if (!bitmap.isReady()) {
                return false;
            }
        }
    }
    return true;
};
ImageManager.throwLoadError = function(bitmap) {
    const retry = bitmap.retry.bind(bitmap);
    throw ["LoadError", bitmap.url, retry];
};


function FontManager() {throw new Error("static class");}
FontManager._urls = {};
FontManager._states = {};
FontManager.load = function(family, filename) {
    if (this._states[family] !== "loaded") {
        if (filename) {
            const url = this.makeUrl(filename);
            this.startLoading(family, url);
        } else {
            this._urls[family] = "";
            this._states[family] = "loaded";
        }
    }
};
FontManager.startLoading = function(family, url) {
    const source = "url(" + url + ")";
    const font = new FontFace(family, source);
    this._urls[family] = url;
    this._states[family] = "loading";
    font.load()
        .then(() => {
            document.fonts.add(font);
            this._states[family] = "loaded";
            return 0;
        })
        .catch(() => {this._states[family] = "error";});
};
FontManager.isReady = function() {
    for (const family in this._states) {
        const state = this._states[family];
        if (state === "loading") {return false;}
        if (state === "error") {this.throwLoadError(family);}
    }
    return true;
};
FontManager.throwLoadError = function(family) {
    const url = this._urls[family];
    const retry = () => this.startLoading(family, url);
    throw ["LoadError", url, retry];
};
FontManager.makeUrl = function(filename) {return "fonts/" + Utils.encodeURI(filename);};
