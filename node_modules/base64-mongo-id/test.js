var convertId = require("./index");
var expect = require("expect.js");

var data = [
  {hex: "521fc843178a921652000007", base64: 'Uh-IQxeKkhZSAAAH'},
  {hex: "521fc843178a921652000060", base64: 'Uh-IQxeKkhZSAABg'},
  {hex: "52336be5b74a7a0000000015", base64: 'UjNr5bdKegAAAAAV'},
  {hex: "53c5d28ca62be0a940000002", base64: 'U8XSjKYr4KlAAAAC'},
  {hex: "521fc86d178a92165200001d", base64: 'Uh-IbReKkhZSAAAd'},
  {hex: "52af5b7913d8e99f41136d4c", base64: 'Uq9beRPY6Z9BE21M'},
  {hex: "5397b40c7232ef916a000967", base64: 'U5e0DHIy75FqAAln'},
  {hex: "000000000000000000000000", base64: 'AAAAAAAAAAAAAAAA'},
  {hex: "000000000000000000000003", base64: 'AAAAAAAAAAAAAAAD'},
  {hex: "ffffffffffffffffffffffff", base64: '----------------'},
];

describe("base64-mongo-id", function() {

  it("throws on bad input for hex to base64", function() {
    expect(function() {
      convertId.toBase64(data[0].base64);
    }).to.throwError();
  });

  it("throws on bad input for base64 to hex", function() {
    expect(function() {
      convertId.toHex(data[0].hex);
    }).to.throwError();
  });

  data.forEach(function(pair, i) {
    
    it("converts hex to base64 properly - test " + (i + 1), function() {
      expect(convertId.toBase64(pair.hex)).to.be(pair.base64);
    });

    it("converts base64 to hex properly - test " + (i + 1), function() {
      expect(convertId.toHex(pair.base64)).to.be(pair.hex);
    });

  });

});

