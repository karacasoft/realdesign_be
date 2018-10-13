import { Node } from '../detectRectangles';

export enum LayoutType {
    LAYOUT,
    HSPLIT,
    VSPLIT
}

export interface Layout {
    type: LayoutType;
    x: number;
    y: number;
    width: number;
    height: number;
    marginLeft: number;
    marginTop: number;
    children: Layout[];
}

export interface HSplit extends Layout {
    percentages: number[];
}

export interface VSplit extends Layout {
    percentages: number[];
}

function collidesVertically(node1: Node, node2: Node): boolean {
    return !((node1.y < node2.y && node1.y + node1.height < node2.y) ||
        (node1.y > node2.y + node2.height && node1.y + node1.height > node2.y + node2.height));
}

function collidesHorizontally(node1: Node, node2: Node): boolean {
    return !((node1.x < node2.x && node1.x + node1.width < node2.x) ||
        (node1.x > node2.x + node2.width && node1.x + node1.width > node2.x + node2.width));
}

function splitHorizontal(nodes: Node[], parentX: number, parentY: number, parentWidth: number, parentHeight: number): HSplit | Layout {
    const subNodes: Node[] = [];
    const subNodes2: Node[] = [];
    let prevNode = nodes[0];
    let splitted: boolean = false;
    
    let minY: number = Infinity;
    let maxY: number = 0;
    let minY2: number = Infinity;
    let maxY2: number = 0;

    if(nodes.length === 1) {
        return {
            type: LayoutType.LAYOUT,
            x: nodes[0].x,
            y: nodes[0].y,
            width: nodes[0].width,
            height: nodes[0].height,
            marginLeft: nodes[0].x - parentX,
            marginTop: nodes[0].y - parentY,
            children: []
        };
    }

    for(let nI in nodes) {
        if(!splitted && collidesVertically(prevNode, nodes[nI])) {
            subNodes.push(nodes[nI]);
            minY = Math.min(nodes[nI].y, minY);
            maxY = Math.max(nodes[nI].y + nodes[nI].height, maxY);
        } else {
            splitted = true;
            subNodes2.push(nodes[nI]);
            minY2 = Math.min(nodes[nI].y, minY2);
            maxY2 = Math.max(nodes[nI].y + nodes[nI].height, maxY2);
        }
        prevNode = nodes[nI];
    }
    if(!splitted) {
        return splitVertical(subNodes, parentX, parentY, parentWidth, parentHeight);
    }
    
    return {
        type: LayoutType.HSPLIT,
        x: parentX,
        y: parentY,
        width: parentWidth,
        height: parentHeight,
        marginLeft: 0,
        marginTop: 0,
        percentages: [ (maxY2 - minY2) / (maxY2 - minY), (maxY - minY) / (maxY2 - minY) ],
        children: [
            splitVertical(subNodes, parentX, parentY, parentWidth, maxY - parentY),
            splitHorizontal(subNodes2, parentX, maxY, parentWidth, parentHeight - (maxY - parentY))
        ]
    };
}

function splitVertical(nodes: Node[], parentX: number, parentY: number, parentWidth: number, parentHeight: number): VSplit | Layout {
    const subNodes: Node[] = [];
    const subNodes2: Node[] = [];
    let prevNode = nodes[0];
    let splitted: boolean = false;

    let minX: number = Infinity;
    let maxX: number = 0;
    let minX2: number = Infinity;
    let maxX2: number = 0;

    if(nodes.length === 1) {
        return {
            type: LayoutType.LAYOUT,
            x: nodes[0].x,
            y: nodes[0].y,
            width: nodes[0].width,
            height: nodes[0].height,
            marginLeft: nodes[0].x - parentX,
            marginTop: nodes[0].y - parentY,
            children: []
        };
    }

    for(let nI in nodes) {
        if(!splitted && collidesHorizontally(prevNode, nodes[nI])) {
            subNodes.push(nodes[nI]);
            minX = Math.min(nodes[nI].x, minX);
            maxX = Math.max(nodes[nI].x + nodes[nI].width, maxX);
        } else {
            splitted = true;
            subNodes2.push(nodes[nI]);
            minX2 = Math.min(nodes[nI].x, minX2);
            maxX2 = Math.max(nodes[nI].x + nodes[nI].width, maxX2);
        }
        prevNode = nodes[nI];
    }
    if(!splitted) {
        return splitHorizontal(subNodes, parentX, parentY, parentWidth, parentHeight);
    }
    
    return {
        type: LayoutType.VSPLIT,
        x: parentX,
        y: parentY,
        width: parentWidth,
        height: parentHeight,
        percentages: [ (maxX2 - minX2) / (maxX2 - minX), (maxX - minX) / (maxX2 - minX) ],
        marginLeft: 0,
        marginTop: 0,
        children: [
            splitHorizontal(subNodes, parentX, parentY, maxX - parentX, parentHeight),
            splitVertical(subNodes2, maxX, parentY, parentWidth - (maxX - parentX), parentHeight)
        ]
    };
}

function simplify(nodes: Node) {
    let retNode: Node = nodes;
    while(retNode.children.length === 1) {
        retNode = retNode.children[0];
    }
    retNode.children = retNode.children.map(element => {
        const newEl = simplify(element);
        delete element.parent;
        return newEl;
    }).sort((a, b) => {
        return a.x * 3 + a.y - b.x * 3 + b.y;
    });
    delete retNode.parent;
    return retNode;
}

export function generateLayout(rootNode: Node): Layout {
    const simpleNodes = simplify(rootNode);

    const layout = splitVertical(simpleNodes.children, simpleNodes.x, simpleNodes.y, simpleNodes.width, simpleNodes.height);

    console.log(JSON.stringify(layout));

    return layout;
}