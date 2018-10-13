"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layout_1 = require("./layout");
function generateCss() {
    return `
div: {
    margin: 0;
    padding: 0;
}

.box {
    display: inline-block;
    border: 2px solid black;
    padding: 10px;
    float: left;
}

.hsplit {
    border: 2px solid black;
    width: 100%;
    padding: 10px;
}

.vsplit {
    border: 2px solid black;
    height: 100%;
    padding: 10px;
}
`;
}
function generateBox(layout) {
    let childrenCode = "";
    layout.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="box" style="width: ${layout.width}px; height: ${layout.height}px; margin-left: ${layout.marginLeft}px; margin-top: ${layout.marginTop}px">
${childrenCode}
</div>
`;
}
function generateHSplit(layout) {
    let childrenCode = "";
    layout.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="hsplit" style="width: ${layout.width}px; height: ${layout.height}px; margin-left: ${layout.marginLeft}px; margin-top: ${layout.marginTop}px">
${childrenCode}
</div>
`;
}
function generateVSplit(layout) {
    let childrenCode = "";
    layout.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="vsplit" style="width: ${layout.width}px; height: ${layout.height}px; margin-left: ${layout.marginLeft}px; margin-top: ${layout.marginTop}px">
${childrenCode}
</div>
`;
}
function generateCode(layout) {
    if (layout.type === layout_1.LayoutType.LAYOUT) {
        return generateBox(layout);
    }
    else if (layout.type === layout_1.LayoutType.VSPLIT) {
        return generateVSplit(layout);
    }
    else if (layout.type === layout_1.LayoutType.HSPLIT) {
        return generateHSplit(layout);
    }
}
function generateHtml(nodes) {
    const layout = layout_1.generateLayout(nodes);
    return `
<html>
    <head>
        <title>Real Design Website</title>
        <style>
        ${generateCss()}
        </style>
    </head>
    <body>
        ${generateCode(layout)}
    </body>
</html>
`;
}
exports.generateHtml = generateHtml;
//# sourceMappingURL=html.js.map