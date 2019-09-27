# Color Mod Calc

Calculates the ordered color modifications necessary to transform one color into
another one using a very naïve regression model. The transforms can then be
applied arbitrarily to any color to achieve the same approximate change in
appearance. Definitely room for improvement.

## Usage

```javascript
import { calculateColorMods } from "color-mod-calc";

async function getColorMods() {
  const modifications = await calculateColorMods("#062458", "#010193");

  console.log(modifications);
  //  [
  //   [ 'spin', 10.078649177450805 ],
  //   [ 'brighten', -7.317283609750366 ],
  //   [ 'darken', -8.819807201497209 ],
  //   [ 'lighten', 5.4210112063441045 ],
  //   [ 'desaturate', -0.44429180259326095 ],
  //   [ 'saturate', 1.61338436541259 ]
  // ]
}
```

You can then take the ordered list of operations and apply it to any color using
`applyColorMods`

```javascript
import { applyColorMods } from "color-mod-calc";

const newColor = applyColorMods("#515621", modifications);

console.log(newColor);
// #658119
```
