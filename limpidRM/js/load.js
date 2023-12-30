    function ModuleManager() {throw new Error("static class");}
    ModuleManager.module = [
        {src:'libs',
            data:[
              { src: "ban" },
              { src: "pixi" },
              { src: "crypto-js.min" },
              { src: "pako.min" },
              { src: "localforage.min" },
              { src: "tone" },
              { src: "pixi-filters" }
                
            ]},
        {src:'module',
            data:[
                { src: "util" },
                { src: "01-core",
                    data:[
                        { src: "01-world" } ,
                        { src: "02-scene" } ,
                        { src: "03-manager" },
                        { src: "04-weaver" },
                        { src: "05-keyboard" },
                        { src: "06-touch" },
                        { src: "07-conductor" },
                        { src: "08-mouse" },
                        { src: "09-wave" }
                    ]
                },
                { src: "03-scene",
                    data:[
                        { src: "01-title" },
                        { src: "02-theater" },
                        { src: "03-database" },
                    ]
                },
                { src: "02-storage",
                    data:[
                        { src: "01-identity" },
                        { src: "02-database" },
                        { src: "03-config" },
                        { src: "04-dialogue" }
                    ]
                },
                { src: "04-window",
                    data:[
                        { src: "01-title" },
                        { src: "02-config" },
                        { src: "03-theater" },
                        { src: "04-database" },
                        { src: "05-music" },
                        { src: "06-photo" },
                        { src: "07-mes" },
                        { src: "08-contacts" }
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
LIM.Cache={}
ModuleManager.load();
