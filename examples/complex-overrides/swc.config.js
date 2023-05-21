const tswig = require("../../lib");

const tsconfig = {
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "lib": ["es2019", "dom"],
    "sourceMap": true,
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "baseUrl": "./src",
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/__tests__/*"]
}


const swcOptions = {
    "jsc": {
      "target": "es2020",
      "parser": {
        "syntax": "typescript",
        "tsx": true
      },
      "transform": {
        "legacyDecorator": true
      }
    },
    "module": {
      "type": "commonjs"
    },
    "env": {
      "browser": true,
      "node": true
    },
    "sourceMaps": true,
    "minify": {
      "compress": {
        "global_defs": {
          "@swc/helpers/globalThis": "globalThis"
        }
      }
    }
  }
;

module.exports = tswig.Covert(tsconfig, swcOptions);
