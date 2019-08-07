var numsToChars64 = {0:"A",1:"B",2:"C",3:"D",4:"E",5:"F",6:"G",7:"H",8:"I",9:"J",10:"K",11:"L",12:"M",13:"N",14:"O",15:"P",16:"Q",17:"R",18:"S",19:"T",20:"U",21:"V",22:"W",23:"X",24:"Y",25:"Z",26:"a",27:"b",28:"c",29:"d",30:"e",31:"f",32:"g",33:"h",34:"i",35:"j",36:"k",37:"l",38:"m",39:"n",40:"o",41:"p",42:"q",43:"r",44:"s",45:"t",46:"u",47:"v",48:"w",49:"x",50:"y",51:"z",52:"0",53:"1",54:"2",55:"3",56:"4",57:"5",58:"6",59:"7",60:"8",61:"9",62:"_",63:"-"};
var numsToChars16 = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"a",11:"b",12:"c",13:"d",14:"e",15:"f"};
var charsToNums64 = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"_":62,"-":63};

function parse2DigitInt64 (str) {
  return 64 * charsToNums64[str[0]] + charsToNums64[str[1]];
}

var hexRegex24 = /^[0-9a-f]{24}$/;
var base64Regex16 = /^[0-9a-zA-Z-_]{16}$/;

module.exports = {
  
  toBase64: function (hex) {
    hex = String(hex);
    if (!hexRegex24.test(hex)) {
      throw new Error("`base64-mongo-id.toBase64` must receive an input matching " + hexRegex24.toString());
    }
    var output = [];
    for (var i = 0; i < hex.length; i += 3) {
      var slice = hex.slice(i, i + 3);
      var num = parseInt(slice, 16);
      var firstDigit = Math.floor(num / 64);
      var secondDigit = num % 64;
      output.push(numsToChars64[firstDigit], numsToChars64[secondDigit]);
    }
    return output.join("");
  },

  toHex: function (base64) {
    base64 = String(base64);
    if (!base64Regex16.test(base64)) {
      throw new Error("`base64-mongo-id.toHex` must receive an input matching " + base64Regex16.toString());
    }
    var output = [];
    for (var i = 0; i < base64.length; i += 2) {
      var slice = base64.slice(i, i + 2);
      var num = parse2DigitInt64(slice);
      var firstDigit = Math.floor(num / 256);
      var secondDigit = Math.floor(num / 16) % 16;
      var thirdDigit = num % 16;
      output.push(numsToChars16[firstDigit], numsToChars16[secondDigit], numsToChars16[thirdDigit]);
    }
    return output.join("");
  }
  
};
