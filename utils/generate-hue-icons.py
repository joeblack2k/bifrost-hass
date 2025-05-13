#!/usr/bin/env python3

# utils/generate-hue-icons.py < hass-hue-icons/dist/hass-hue-icons.js | rustfmt > crates/bifrost-frontend/src/hue_icons.rs

import os
import sys
import json

def upcase(name):
    return name.upper().replace("-", "_")

def main():
    input = sys.stdin.read()
    body = input.split("};\n", 1)[0].split("{", 1)[1]
    body = body.replace("path:", '"path":').replace("keywords:", '"keywords":')

    js = f"{{ {body} }}"

    data = json.loads(js)

    for key, value in data.items():
        name = upcase(key)
        print(f"pub const {name}: &str = \"{value['path']}\";\n")

if __name__ == "__main__":
    sys.exit(main())
