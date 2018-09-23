function SHA1(s)
{
    function U(a, b, c)
    {
        while (0 < c--) {
            a.push(b)
        }
    }

    function L(a, b)
    {
        return (a << b) | (a >>> (32 - b))
    }

    function P(a, b, c)
    {
        return a ^ b ^ c
    }

    function A(a, b)
    {
        let c = (b & 0xFFFF) + (a & 0xFFFF), d = (b >>> 16) + (a >>> 16) + (c >>> 16);
        return ((d & 0xFFFF) << 16) | (c & 0xFFFF)
    }

    var B = '0123456789abcdef';
    return (function (a)
    {
        let c = [], d = a.length * 4, e;
        for (let i = 0; i < d; i++) {
            e = a[i >> 2] >> ((3 - (i % 4)) * 8);
            c.push(B.charAt((e >> 4) & 0xF) + B.charAt(e & 0xF))
        }
        return c.join('')
    }((function (a, b)
    {
        let c, d, e, f, g, h = a.length, v = 0x67452301, w = 0xefcdab89, x = 0x98badcfe, y = 0x10325476, z = 0xc3d2e1f0, M = [];
        U(M, 0x5a827999, 20);
        U(M, 0x6ed9eba1, 20);
        U(M, 0x8f1bbcdc, 20);
        U(M, 0xca62c1d6, 20);

        a[b >> 5]                     |= 0x80 << (24 - (b % 32));
        a[(((b + 65) >> 9) << 4) + 15] = b;

        for (let i = 0; i < h; i += 16) {
            c = v;
            d = w;
            e = x;
            f = y;
            g = z;

            for (let j = 0, O = []; j < 80; j++) {
                O[j] = j < 16 ? a[j + i] : L(O[j - 3] ^ O[j - 8] ^ O[j - 14] ^ O[j - 16], 1);
                let k = (function (a, b, c, d, e)
                {
                    let f = (e & 0xFFFF) + (a & 0xFFFF) + (b & 0xFFFF) + (c & 0xFFFF) + (d & 0xFFFF), g = (e >>> 16) + (a >>> 16) + (b >>> 16) + (c >>> 16) + (d >>> 16) + (f >>> 16);
                    return ((g & 0xFFFF) << 16) | (f & 0xFFFF)
                })(j < 20 ? (function (t, a, b)
                {
                    return (t & a) ^ (~t & b)
                }(d, e, f)) : j < 40 ? P(d, e, f) : j < 60 ? (function (t, a, b)
                {
                    return (t & a) ^ (t & b) ^ (a & b)
                }(d, e, f)) : P(d, e, f), g, M[j], O[j], L(c, 5));

                g = f;
                f = e;
                e = L(d, 30);
                d = c;
                c = k
            }

            v = A(v, c);
            w = A(w, d);
            x = A(x, e);
            y = A(y, f);
            z = A(z, g)
        }

        return [v, w, x, y, z]
    }((function (t)
    {
        let a = [], b = 255, c = t.length * 8;

        for (let i = 0; i < c; i += 8) {
            a[i >> 5] |= (t.charCodeAt(i / 8) & b) << (24 - (i % 32))
        }

        return a
    }(s)).slice(), s.length * 8))))
}
