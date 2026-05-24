export function gravatarUrl(email: string | undefined, baseUrl: string | null | undefined, size = 48) {
  if (!email || !baseUrl) {
    return null;
  }
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedBaseUrl = baseUrl.trim();
  if (!normalizedEmail || !normalizedBaseUrl) {
    return null;
  }
  const separator = normalizedBaseUrl.includes("?") ? "&" : "?";
  const base = normalizedBaseUrl.endsWith("/") ? normalizedBaseUrl : `${normalizedBaseUrl}/`;
  return `${base}${md5(normalizedEmail)}${separator}s=${size}&d=mp&r=g`;
}

function md5(input: string) {
  function rotateLeft(value: number, amount: number) {
    return (value << amount) | (value >>> (32 - amount));
  }
  function addUnsigned(left: number, right: number) {
    const leftMsb = left & 0x80000000;
    const rightMsb = right & 0x80000000;
    const leftSecond = left & 0x40000000;
    const rightSecond = right & 0x40000000;
    const result = (left & 0x3fffffff) + (right & 0x3fffffff);
    if (leftSecond & rightSecond) return result ^ 0x80000000 ^ leftMsb ^ rightMsb;
    if (leftSecond | rightSecond) return result & 0x40000000 ? result ^ 0xc0000000 ^ leftMsb ^ rightMsb : result ^ 0x40000000 ^ leftMsb ^ rightMsb;
    return result ^ leftMsb ^ rightMsb;
  }
  function f(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function g(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function h(x: number, y: number, z: number) { return x ^ y ^ z; }
  function i(x: number, y: number, z: number) { return y ^ (x | ~z); }
  function step(fn: (x: number, y: number, z: number) => number, a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, fn(b, c, d)), addUnsigned(x, ac)), s), b);
  }
  function toWords(value: string) {
    const bytes = unescape(encodeURIComponent(value));
    const words: number[] = [];
    for (let index = 0; index < bytes.length; index += 1) {
      words[index >> 2] |= bytes.charCodeAt(index) << ((index % 4) * 8);
    }
    words[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
    words[(((bytes.length + 8) >> 6) + 1) * 16 - 2] = bytes.length * 8;
    return words;
  }
  function toHex(value: number) {
    let text = "";
    for (let index = 0; index <= 3; index += 1) {
      text += `0${((value >>> (index * 8)) & 255).toString(16)}`.slice(-2);
    }
    return text;
  }

  const x = toWords(input);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const aa = a;
    const bb = b;
    const cc = c;
    const dd = d;
    a = step(f, a, b, c, d, x[k + 0], 7, 0xd76aa478); d = step(f, d, a, b, c, x[k + 1], 12, 0xe8c7b756); c = step(f, c, d, a, b, x[k + 2], 17, 0x242070db); b = step(f, b, c, d, a, x[k + 3], 22, 0xc1bdceee);
    a = step(f, a, b, c, d, x[k + 4], 7, 0xf57c0faf); d = step(f, d, a, b, c, x[k + 5], 12, 0x4787c62a); c = step(f, c, d, a, b, x[k + 6], 17, 0xa8304613); b = step(f, b, c, d, a, x[k + 7], 22, 0xfd469501);
    a = step(f, a, b, c, d, x[k + 8], 7, 0x698098d8); d = step(f, d, a, b, c, x[k + 9], 12, 0x8b44f7af); c = step(f, c, d, a, b, x[k + 10], 17, 0xffff5bb1); b = step(f, b, c, d, a, x[k + 11], 22, 0x895cd7be);
    a = step(f, a, b, c, d, x[k + 12], 7, 0x6b901122); d = step(f, d, a, b, c, x[k + 13], 12, 0xfd987193); c = step(f, c, d, a, b, x[k + 14], 17, 0xa679438e); b = step(f, b, c, d, a, x[k + 15], 22, 0x49b40821);
    a = step(g, a, b, c, d, x[k + 1], 5, 0xf61e2562); d = step(g, d, a, b, c, x[k + 6], 9, 0xc040b340); c = step(g, c, d, a, b, x[k + 11], 14, 0x265e5a51); b = step(g, b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
    a = step(g, a, b, c, d, x[k + 5], 5, 0xd62f105d); d = step(g, d, a, b, c, x[k + 10], 9, 0x02441453); c = step(g, c, d, a, b, x[k + 15], 14, 0xd8a1e681); b = step(g, b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
    a = step(g, a, b, c, d, x[k + 9], 5, 0x21e1cde6); d = step(g, d, a, b, c, x[k + 14], 9, 0xc33707d6); c = step(g, c, d, a, b, x[k + 3], 14, 0xf4d50d87); b = step(g, b, c, d, a, x[k + 8], 20, 0x455a14ed);
    a = step(g, a, b, c, d, x[k + 13], 5, 0xa9e3e905); d = step(g, d, a, b, c, x[k + 2], 9, 0xfcefa3f8); c = step(g, c, d, a, b, x[k + 7], 14, 0x676f02d9); b = step(g, b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);
    a = step(h, a, b, c, d, x[k + 5], 4, 0xfffa3942); d = step(h, d, a, b, c, x[k + 8], 11, 0x8771f681); c = step(h, c, d, a, b, x[k + 11], 16, 0x6d9d6122); b = step(h, b, c, d, a, x[k + 14], 23, 0xfde5380c);
    a = step(h, a, b, c, d, x[k + 1], 4, 0xa4beea44); d = step(h, d, a, b, c, x[k + 4], 11, 0x4bdecfa9); c = step(h, c, d, a, b, x[k + 7], 16, 0xf6bb4b60); b = step(h, b, c, d, a, x[k + 10], 23, 0xbebfbc70);
    a = step(h, a, b, c, d, x[k + 13], 4, 0x289b7ec6); d = step(h, d, a, b, c, x[k + 0], 11, 0xeaa127fa); c = step(h, c, d, a, b, x[k + 3], 16, 0xd4ef3085); b = step(h, b, c, d, a, x[k + 6], 23, 0x04881d05);
    a = step(h, a, b, c, d, x[k + 9], 4, 0xd9d4d039); d = step(h, d, a, b, c, x[k + 12], 11, 0xe6db99e5); c = step(h, c, d, a, b, x[k + 15], 16, 0x1fa27cf8); b = step(h, b, c, d, a, x[k + 2], 23, 0xc4ac5665);
    a = step(i, a, b, c, d, x[k + 0], 6, 0xf4292244); d = step(i, d, a, b, c, x[k + 7], 10, 0x432aff97); c = step(i, c, d, a, b, x[k + 14], 15, 0xab9423a7); b = step(i, b, c, d, a, x[k + 5], 21, 0xfc93a039);
    a = step(i, a, b, c, d, x[k + 12], 6, 0x655b59c3); d = step(i, d, a, b, c, x[k + 3], 10, 0x8f0ccc92); c = step(i, c, d, a, b, x[k + 10], 15, 0xffeff47d); b = step(i, b, c, d, a, x[k + 1], 21, 0x85845dd1);
    a = step(i, a, b, c, d, x[k + 8], 6, 0x6fa87e4f); d = step(i, d, a, b, c, x[k + 15], 10, 0xfe2ce6e0); c = step(i, c, d, a, b, x[k + 6], 15, 0xa3014314); b = step(i, b, c, d, a, x[k + 13], 21, 0x4e0811a1);
    a = step(i, a, b, c, d, x[k + 4], 6, 0xf7537e82); d = step(i, d, a, b, c, x[k + 11], 10, 0xbd3af235); c = step(i, c, d, a, b, x[k + 2], 15, 0x2ad7d2bb); b = step(i, b, c, d, a, x[k + 9], 21, 0xeb86d391);
    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }
  return `${toHex(a)}${toHex(b)}${toHex(c)}${toHex(d)}`.toLowerCase();
}