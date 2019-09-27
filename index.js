var { rgb2lab, deltaE } = require("rgb-lab");
var tinycolor2 = require("tinycolor2");
const permutations = require("./permutations");

module.exports.calculateColorMods = function calculateColorMods(
  originalColor,
  newColor
) {
  return new Promise(resolve => {
    let deltaValue = Infinity;
    let brightenMod = 0;
    let darkenMod = 0;
    let lightenMod = 0;
    let desaturateMod = 0;
    let saturateMod = 0;
    let spinMod = 0;
    let operations = [];
    const desired = tinycolor2(newColor).toRgb();
    const desiredLab = rgb2lab([desired.r, desired.g, desired.b]);

    let n = 0;
    while (n < 10000) {
      const values = {
        brighten: brightenMod + Math.random() - 0.5,
        darken: darkenMod + Math.random() - 0.5,
        lighten: lightenMod + Math.random() - 0.5,
        desaturate: desaturateMod + Math.random() - 0.5,
        saturate: saturateMod + Math.random() - 0.5,
        spin: spinMod + Math.random() - 0.5
      };

      const results = permutations
        .map(p => {
          return [
            p,
            tinycolor2(originalColor)
              [p[0]](values[p[0]])
              [p[1]](values[p[1]])
              [p[2]](values[p[2]])
              [p[3]](values[p[3]])
              [p[4]](values[p[4]])
              [p[5]](values[p[5]])
              .toHex()
          ];
        })
        .reduce((acc, [p, color]) => {
          if (acc[color]) {
            acc[color].push(p);
          } else {
            acc[color] = [p];
          }
          return acc;
        }, {});

      const deltaEs = Object.keys(results)
        .map(c => tinycolor2(c).toRgb())
        .map(c => rgb2lab([c.r, c.g, c.b]))
        .map(c => deltaE(c, desiredLab));

      const { e, i } = deltaEs.reduce(
        (acc, e, i) => {
          if (acc.e > e) return { e, i };
          return acc;
        },
        { e: Infinity, i: -1 }
      );

      if (deltaValue > e) {
        brightenMod = values.brighten;
        darkenMod = values.darken;
        lightenMod = values.lighten;
        desaturateMod = values.desaturate;
        saturateMod = values.saturate;
        spinMod = values.spin;
        operations = results[Object.keys(results)[i]];
        deltaValue = e;
      }
      if (e <= 1) break;
      n++;
    }
    const values = {
      brighten: brightenMod,
      darken: darkenMod,
      lighten: lightenMod,
      desaturate: desaturateMod,
      saturate: saturateMod,
      spin: spinMod
    };
    const output = operations[0].map(o => [o, values[o]]);
    resolve(output);
  });
};

module.exports.applyColorMods = function applyColorMods(originalColor, p) {
  return `#${tinycolor2(originalColor)
    [p[0][0]](p[0][1])
    [p[1][0]](p[1][1])
    [p[2][0]](p[2][1])
    [p[3][0]](p[3][1])
    [p[4][0]](p[4][1])
    [p[5][0]](p[5][1])
    .toHex()}`;
};
