import { Node } from "../detectRectangles";
import { generateLayout, Layout, HSplit, VSplit, LayoutType } from "./layout";

function generateCss(): string {
    return `
div: {
    margin: 0;
    padding: 0;
}

.box {
    display: inline-block;
    border: 2px solid black;
    padding: 10px;
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

function generateBox(layout: Layout): string {
    let childrenCode: string = "";
    layout.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="box" style="width: 100px; height: 100px">
${childrenCode}
</div>
`
}

function generateHSplit(split: HSplit): string {
    let childrenCode: string = "";
    split.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="hsplit">
${childrenCode}
</div>
`
}

function generateVSplit(split: VSplit): string {
    let childrenCode: string = "";
    split.children.forEach(val => {
        childrenCode += generateCode(val);
    });
    return `
<div class="vsplit">
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