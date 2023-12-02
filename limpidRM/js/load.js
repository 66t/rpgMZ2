    function ModuleManager() {throw new Error("static class");}
    ModuleManager.module = [
        {src:'libs',
            data:[
              { src: "pixi" },
              { src: "crypto-js.min" },
              { src: "localforage.min" },
              { src: "tone" }
            ]},
        {src:'module',
            data:[
                { src: "util" },
                { src: "01-core",
                    data:[
                        { src: "01-world" } ,
                        { src: "02-scene" } ,
                        { src: "03-manager" },
                        { src: "04-weaver" }
                    ]
                },
                { src: "02-scene",
                    data:[
                        { src: "scene" }
                    ]
                },
            ]},
        {src:'main'},
    ];
    ModuleManager._path = '';
    ModuleManager._scripts = [];
    ModuleManager._errorUrls = [];
    ModuleManager.loadScript = function (url) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url
        script.async = false;
        script.dataset.url = url
        script.onerror = this.onError.bind(this);
        document.body.appendChild(script);
    };
    ModuleManager.onError = function (e) {
        let target = e.target;
        this._errorUrls.push(target.dataset.url);
    };
    ModuleManager.setup = function (modules, src) {
        for (const module of modules) {
            const moduleSrc = `${src}/${module.src}`;
            if (module.data) {this.setup(module.data, moduleSrc);}
            else {
                const name = `${moduleSrc}.js`;
                this.loadScript(name);
                this._scripts.push(name);
            }
        }
    };
    ModuleManager.load = function () {this.setup(this.module, "js");};
var LIM={}
ModuleManager.load();
