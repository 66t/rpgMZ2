function Keyboard() {throw new Error("static class");}
Keyboard.controlMapper = {};
Keyboard.down = new Array(256).fill(0);
Keyboard.up = new Array(256).fill(0);
Keyboard.state={}
Keyboard.time = 0;
Keyboard.repeatTime = 30;
Keyboard.install = function() {
    const data = this.controlMapper;
    data.tab = [9];
    data.start = [81];
    data.home = [87];
    data.select = [33];
    data.back = [34];
    data.a = [13, 32, 90];
    data.b = [88, 27, 45];
    data.x = [17, 18];
    data.y = [16];
    data.up = [38, 104];
    data.down = [40, 98];
    data.left = [37, 100];
    data.right = [39, 102];
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('blur', this.onBlur.bind(this));
}
Keyboard.onKeyDown = function(arg) {
    const keyCode = arg.keyCode;
    if (!this.down[keyCode] || this.down[keyCode] < this.up[keyCode]) {
        this.down[keyCode] = this.time;
        this.up[keyCode] = this.time - 1;
    }
};
Keyboard.onKeyUp = function(arg) {
    const keyCode = arg.keyCode;
    if (this.down[keyCode] > this.up[keyCode]) {
        this.up[keyCode] = this.time;
        this.down[keyCode] = this.time - 1;
    }
  
};
Keyboard.onBlur = function() {
    this.down = [];
    this.up = [];
};
Keyboard.update = function() {
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
Keyboard.get=function (key,code){
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
Keyboard.isPress = function(key) {
    const controlMapper = this.controlMapper[key];
    if (!controlMapper) return false;
    for (let i = 0, len = controlMapper.length; i < len; i++) {
        const item = controlMapper[i];
        if (this.down[item]+1 === this.time) return true;
    }
    return false;
};
Keyboard.isReleas = function(key) {
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
Keyboard.isPressed = function(key) {
    const controlMapper = this.controlMapper[key];
    if (!controlMapper) return false;
    for (let i = 0, len = controlMapper.length; i < len; i++) {
        const item = controlMapper[i];
        if (this.down[item] > this.up[item]) return true;
    }
    return false;
};
Keyboard.isLongPress = function(key) {
    const controlMapper = this.controlMapper[key];
    if (!controlMapper) return false;
    for (let i = 0, len = controlMapper.length; i < len; i++) {
        const item = controlMapper[i];
        if (this.down[item] > this.up[item] && (this.time - this.down[item]) % this.repeatTime === 0) return true;
    }
    return false;
};
Keyboard.install();