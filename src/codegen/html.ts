import { Node } from "../detectRectangles";
import { generateLayout, Layout, HSplit, VSplit, LayoutType } from "./layout";

function generateCss(): string {
    return `
div: {
    margin: 0;
    padding: 0;
}

.box {
    background-color: red;
    display: inline-block;
    float: left;
}

.hsplit {
    background-color: green;
    float: left;
}

.vsplit {
    background-color: blue;
    float: left;
}
`;
}

function generateBox(layout: Layout): string {
    let childrenCode: string = "";
    layout.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="box" style="width: ${layout.width}px; height: ${layout.height}px; margin-left: ${layout.marginLeft}px; margin-top: ${layout.marginTop}px">
${childrenCode}
</div>
`
}

function generateHSplit(layout: HSplit): string {
    let childrenCode: string = "";
    layout.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="hsplit" style="width: ${layout.width}px; height: ${layout.height}px; margin-left: ${layout.marginLeft}px; margin-top: ${layout.marginTop}px">
${childrenCode}
</div>
`
}

function generateVSplit(layout: VSplit): string {
    let childrenCode: string = "";
    layout.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="vsplit" style="width: ${layout.width}px; height: ${layout.height}px; margin-left: ${layout.marginLeft}px; margin-top: ${layout.marginTop}px">
${childrenCode}
</div>
`
}

function generateCode(layout: Layout): string {
    if(layout.type === LayoutType.LAYOUT) {
        return generateBox(layout);
    } else if(layout.type === LayoutType.VSPLIT) {
        return generateVSplit(layout as VSplit);
    } else if(layout.type === LayoutType.HSPLIT) {
        return generateHSplit(layout as HSplit);
    }
}

export function generateHtml(nodes: Node): string {
    const layout = generateLayout(nodes);

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