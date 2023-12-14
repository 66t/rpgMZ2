function Touch() {throw new Error("static class");}
Touch.controlMapper = {};
Touch.down = [0,0,0]
Touch.up = [0,0,0]
Touch.state={}
Touch.time = 0;
Touch.repeatTime = 25;
Touch.cursor = World.cursor;
Touch.wheel = {x:0,y:0};
Touch.install = function() {
    const data = this.controlMapper;
    data.left = [0];
    data.whell = [1];
    data.right = [2];
    document.addEventListener('mouseup', this.onKeyUp.bind(this));
    document.addEventListener('mousedown', this.onKeyDown.bind(this));
    document.addEventListener('wheel', this.onWheel.bind(this));
}

Touch.onWheel = function(event) {
    this.wheel.x += event.deltaX;
    this.wheel.y += event.deltaY;
};
Touch.onKeyDown = function(arg) {
    const keyCode = arg.button;
    if (!this.down[keyCode] || this.down[keyCode] < this.up[keyCode]) {
        this.down[keyCode] = this.time;
        this.up[keyCode] = this.time - 1;
    }
};
Touch.onKeyUp = function(arg) {
    const keyCode = arg.button;
    if (this.down[keyCode] > this.up[keyCode]) {
        this.up[keyCode] = this.time;
        this.down[keyCode] = this.time - 1;
    }
};
Touch.onBlur = function() {
    this.down = [];
    this.up = [];
};
Touch.update = function() {
    this.time++;
    for(let key in this.controlMapper){
        this.state[key]=[
            this.isPress(key),
            this.isPressed(key),
            this.isLongPress(key),
            this.isReleas(key),
        ]
    }
};
Touch.get=function (key,code){
    switch (code){
        case "long":
            return this.state[key][2]
        case "trigger":
            return this.state[key][0]
        case "rele":
            return this.state[key][3]
        default:
            return this.state[key][1]
    }
}
Touch.isPress = function(key) {
    const controlMapper = this.controlMapper[key];
    if (!controlMapper) return false;
    for (let i = 0, len = controlMapper.length; i < len; i++) {
        const item = controlMapper[i];
        if (this.down[item]+1 === this.time) return true;
    }
    return false;
};
Touch.isReleas = function(key) {
    const controlMapper = this.controlMapper[key];
    if (!controlMapper) return false;
    let bool = false;
    for (let i = 0, len = controlMapper.length; i < len; i++) {
        const item = controlMapper[i];
        if (this.up[item] > this.down[item]) {
            this.down[item]=0
            this.up[item]=0
            bool= true;
        }
        if (this.down[item] > this.up[item]) return false;
    }
    return bool;
};
Touch.isPressed = function(key) {
    const controlMapper = this.controlMapper[key];
    if (!controlMapper) return false;
    for (let i = 0, len = controlMapper.length; i < len; i++) {
        const item = controlMapper[i];
        if (this.down[item] > this.up[item]) return true;
    }
    return false;
};
Touch.isLongPress = function(key) {
    const controlMapper = this.controlMapper[key];
    if (!controlMapper) return false;
    for (let i = 0, len = controlMapper.length; i < len; i++) {
        const item = controlMapper[i];
        if (this.down[item] > this.up[item] && (this.time - this.down[item]) % this.repeatTime === 0) return true;
    }
    return false;
};
Touch.install();