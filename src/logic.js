function LegacyAddr(sec_key) {
  var hash = Crypto.util.hexToBytes(sec_key);
  eckey = new Bitcoin.ECKey(hash);
  eckey_c = new Bitcoin.ECKey(hash);
  var curve = getSECCurveByName("secp256k1");
  var pt = curve.getG().multiply(eckey.priv);
  eckey_c.pub = getEncoded(pt, true);
  eckey_c.pubKeyHash = Bitcoin.Util.sha256ripe160(eckey_c.pub);
  var hash160 = eckey.getPubKeyHash();
  var hash160_c = eckey_c.getPubKeyHash();
  var addr_c = new Bitcoin.Address(hash160_c);
  return addr_c;
}

function getEncoded(pt, compressed) {
  var x = pt.getX().toBigInteger();
  var y = pt.getY().toBigInteger();
  var enc = integerToBytes(x, 32);
  if (compressed) {
      if (y.isEven()) {
      enc.unshift(0x02);
      } else {
      enc.unshift(0x03);
      }
  } else {
      enc.unshift(0x04);
      enc = enc.concat(integerToBytes(y, 32));
  }
  return enc;
}

function bitcoinaddress(privatekey)
{
  let addr = LegacyAddr(privatekey);
  return addr;
}