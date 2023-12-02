Array.prototype.clone = function() {
    return this.slice(0);
};
Array.prototype.contains = function(element) {
    return this.includes(element);
};
Array.prototype.equals = function(array) {
    if (!array || this.length !== array.length) {
        return false;
    }
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};
Array.prototype.remove = function(element) {
    for (;;) {
        const index = this.indexOf(element);
        if (index >= 0) {
            this.splice(index, 1);
        } else {
            return this;
        }
    }
};
Math.randomInt = function(max) {
    return Math.floor(max * Math.random());
};
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};
Number.prototype.padZero = function(length) {
    return String(this).padZero(length);
};
String.prototype.contains = function(string) {
    return this.includes(string);
};
String.prototype.format = function() {
    return this.replace(/%([0-9]+)/g, (s, n) => arguments[Number(n) - 1]);
};
String.prototype.replaceSymbol = function(arr) {
    return arr.reduce((result, value, i) => {return result.replace(new RegExp(`%\\[${i + 1}\\]`, 'g'), value);}, this);
};
String.prototype.getLen = function() {
    let len = 0;
    for (const char of this) {len += char.charCodeAt(0) > 255 ? 2 : 1;}
    return len;
};
String.prototype.splice = function(start, del, newStr) {
    return this.slice(0, start) + (newStr || "") + this.slice(start + del);
};
String.prototype.padZero = function(length) {
    return this.padStart(length, "0");
};

function Utils() {
    throw new Error("static class");
}
Utils.isNwjs = function() {
    return typeof require === "function" && typeof process === "object";
};
Utils.encodeURI = function(str) {
    return encodeURIComponent(str).replace(/%2F/g, "/");
};
Utils.escapeHtml = function(str) {
    const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    return String(str).replace(/[&<>"'/]/g, s => entityMap[s]);
};
Utils.radixNum = function(num, m, n) {
    num = String(num);
    m = m === 0 ? 10 : m;
    n = n === 0 ? 10 : (m && !n) ? 10 : n;
    return parseInt(num, m).toString(n);
};
Utils.rpgaReduce = function(r, g, b, a) {
    return [
        this.radixNum(Math.min(r || 255, 255), 10, 16),
        this.radixNum(Math.min(g || 255, 255), 10, 16),
        this.radixNum(Math.min(b || 255, 255), 10, 16),
        this.radixNum(Math.min(a || 255, 255), 10, 16)
    ].join('');
};
Utils.commonDiv = function(a, b) {return b === 0 ? a : this.commonDiv(b, a % b);};
Utils.commonMul = function(a, b) {return a * b / this.commonDiv(a, b);};
Utils.rooting = (a, b) => Math.pow(Math.abs(a), 1 / b);
Utils.bottnum = (a, b) => Math.log(a) / Math.log(b);
Utils.azimuth = function(dual, angle, d) {
    const x = dual.x + d * Math.cos(angle);
    const y = dual.y + d * Math.sin(angle);
    return { x, y };
};
Utils.calcAngle = function(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle < 0) ? angle + 360 : angle;
    return angle;
};
Utils.distanceEucle = function(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};
Utils.distanceManhattan = function(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};
Utils.fractionOth = function(son, mum) {
    let div = 100;
    while (div > 1) {
        div = this.commonDiv(son, mum);
        son /= div;
        mum /= div;
    }
    return [son, mum];
};
Utils.fractionExp = function(num) {return this.fractionOth(num, 10 ** num.toString().length);};
Utils.lerp = function(start, end, t) {return start * (1 - t) + end * t;};
Utils.dotProduct = function(x1, y1, x2, y2) {return x1 * x2 + y1 * y2;};
Utils.crossProduct = function(x1, y1, x2, y2) {return x1 * y2 - x2 * y1;};
Utils.angelPrime = function(num) {
    let arr = [2, 3];
    let i = 5;
    while (arr.length < num) {
        if (!arr.some(n => i % n === 0 && n * n <= i)) {
            arr.push(i);
        }
        i += i % 6 === 1 ? 4 : 2;
    }
    return arr;
};
Utils.getNormalRandom = function(base, d, b, sd, sb) {
    base += 1;
    d += 2;
    let t = Utils.normalRandom();
    let num = parseInt(
        base +
        t *
        (t > 0 ? (sd * 5 * d) / d : sb ? sb * 5 * b : (sd * 5 * b) / b)
    ).clamp(base - d, base + b);
    if (num <= base - d || num >= base + b) {
        return Utils.getNormalRandom(base - 1, d - 2, b, sd, sb);
    } else {
        return num;
    }
};
Utils.normalRandom = function() {
    let u = 0.0,
        v = 0.0,
        w = 0.0,
        c = 0.0;
    while (true) {
        u = Math.random() * 2 - 1;
        v = Math.random() * 2 - 1;
        w = u * u + v * v;
        if (w !== 0 && w <= 1) {
            break;
        }
    }
    c = Math.sqrt((-2 * Math.log(w)) / w);
    return u * c;
}
Utils.isNum = function(num) {return num !== null && num !== '' && !isNaN(num);};
Utils.D = function(s) {
    const [numDice, numSides] = s.match(/(\d+)d(\d+)/).slice(1, 3);
    let total = 0;
    for (let k = 1; k <= numDice; k++) {
        const roll = Math.floor(Math.random() * numSides) + 1;
        total += roll;
    }
    return total;
};
Utils.sinNum = function(max, i) {return Math.sin(Math.PI / 2 / max * i).toFixed(7);};
Utils.lengthNum=function(num){
    try {
        if(isNaN(num))
        {
            if(num.split("w").length>1) {
                let arr = num.split("w")
                let a = parseFloat(arr[0]) * 0.01 * World.windowWidth
                let b = arr[1] ? parseFloat(arr[1]) : 0
                return a + b
            }
            else if(num.split("h").length>1) {
                let arr = num.split("h")
                let a = parseFloat(arr[0]) * 0.01 * World.windowHeight
                let b = arr[1] ? parseFloat(arr[1]) : 0
                return a + b
            }
            else return 0
        }
        else return parseFloat(num)
    }
    catch (e) {
        return 0
    }
}
Utils.toRadians=function (degrees) {return degrees * Math.PI / 180;}
Utils.toDegrees=function (radians) {return radians * 180 / Math.PI;}
Utils.atBit = function(num, bit) {return num >> bit & 1;};
Utils.setBit = function(num, bit, bool) {return bool ? num | (1 << bit) : num & ~(1 << bit);};
Utils.combinations = function(array, s) {
    const combinations = [];
    const length = array.length;
    if (s <= 0 || s > length) {return combinations;}
    const sortedArray = [...array].sort((a, b) => a - b);
    const indices = Array.from({ length: s }, (_, i) => i);
    while (indices[0] <= length - s) {
        combinations.push(indices.map(i => sortedArray[i]));
        let i = s - 1;
        while (i >= 0 && indices[i] === i + length - s) {i--;}
        if (i < 0) {break;}
        indices[i]++;
        for (let j = i + 1; j < s; j++) {indices[j] = indices[j - 1] + 1;}
    }
    return combinations;
};
Utils.permute = function(array) {
    const result = [];
    const backtrack = function(current, remaining) {
        if (remaining.length === 0) {
            result.push(current.slice());
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            [remaining[i], remaining[0]] = [remaining[0], remaining[i]];
            current.push(remaining.shift());
            backtrack(current, remaining);
            remaining.unshift(current.pop());
        }
    };
    backtrack([], array);
    return result;
};
Utils.fillArray=function(num,item){return new Array(num).fill(item)}
Utils.stringReve=function(str){return str.split("").reverse().join("")}
Utils.vectorMagnitude = function(x, y) {return Math.sqrt(x * x + y * y);};
Utils.quickSort=function(arr) {
    if (arr.length <= 1) return arr;
    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIndex, 1)[0];
    let left = [],right = [];
    for (let i = 0; i < arr.length; i++)
        if (arr[i] < pivot) left.push(arr[i]);
        else right.push(arr[i]);
    return _.quickSort(left).concat([pivot], _.quickSort(right));
}
Utils.countingSort=function (arr) {
    if (arr.length <= 1) return arr;
    let min = Math.min(...arr)
    let count = [], result = [], index = 0;
    for (let num of arr) if (!count[num - min] || !count[num - min]++) count[num - min] = 1
    for (let i = 0; i < count.length; i++) while (count[i]-- > 0) result[index++] = i + min;
    return result;
}
Utils.shuffleArr=function (arr) {
    if (!Array.isArray(arr)) { return [] }
    let newArr=new Array()
    while (arr.length)
        newArr.push(arr.splice(Math.randomInt(arr.length),1)[0])
    return newArr
}
Utils.union=function(arr1,arr2) {return [...new Set([...arr1, ...arr2])]}
Utils.inter=function(arr1,arr2) {return new Set([...arr1].filter(x=>arr2.has(x)))}
Utils.diff=function(arr1,arr2) {return new Set([...arr1].filter(x=>!arr2.has(x)))}

window.document.oncontextmenu = function() {return false;};
