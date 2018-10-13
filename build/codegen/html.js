"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function collidesVertically(node1, node2) {
    return !((node1.y < node2.y && node1.y + node1.height < node2.y) ||
        (node1.y > node2.y + node2.height && node1.y + node1.height > node2.y + node2.height));
}
function collidesHorizontally(node1, node2) {
    return !((node1.x < node2.x && node1.x + node1.width < node2.x) ||
        (node1.x > node2.x + node2.width && node1.x + node1.width > node2.x + node2.width));
}
function splitHorizontal(nodes, parentX, parentWidth) {
    const subNodes = [];
    const subNodes2 = [];
    let prevNode = nodes[0];
    let splitted = false;
    let minY = Infinity;
    let maxY = 0;
    let minY2 = Infinity;
    let maxY2 = 0;
    if (nodes.length === 1) {
        return {
            x: nodes[0].x,
            y: nodes[0].y,
            width: nodes[0].width,
            height: nodes[0].height,
            children: []
        };
    }
    for (let nI in nodes) {
        if (!splitted && collidesVertically(prevNode, nodes[nI])) {
            subNodes.push(nodes[nI]);
            minY = Math.min(nodes[nI].y, minY);
            maxY = Math.max(nodes[nI].y + nodes[nI].height, maxY);
        }
        else {
            splitted = true;
            subNodes2.push(nodes[nI]);
            minY2 = Math.min(nodes[nI].y, minY2);
            maxY2 = Math.max(nodes[nI].y + nodes[nI].height, maxY2);
        }
        prevNode = nodes[nI];
    }
    if (!splitted) {
        return splitVertical(subNodes, minY, maxY - minY);
    }
    return {
        x: parentX,
        y: minY,
        width: parentWidth,
        height: maxY2,
        percentages: [(maxY2 - minY2) / (maxY2 - minY), (maxY - minY) / (maxY2 - minY)],
        children: [
            splitVertical(subNodes, minY, maxY - minY),
            splitHorizontal(subNodes2, parentX, parentWidth)
        ]
    };
}
function splitVertical(nodes, parentY, parentHeight) {
    const subNodes = [];
    const subNodes2 = [];
    let prevNode = nodes[0];
    let splitted = false;
    let minX = Infinity;
    let maxX = 0;
    let minX2 = Infinity;
    let maxX2 = 0;
    if (nodes.length === 1) {
        return {
            x: nodes[0].x,
            y: nodes[0].y,
            width: nodes[0].width,
            height: nodes[0].height,
            children: []
        };
    }
    for (let nI in nodes) {
        if (!splitted && collidesHorizontally(prevNode, nodes[nI])) {
            subNodes.push(nodes[nI]);
            minX = Math.min(nodes[nI].x, minX);
            maxX = Math.max(nodes[nI].x + nodes[nI].width, maxX);
        }
        else {
            splitted = true;
            subNodes2.push(nodes[nI]);
            minX2 = Math.min(nodes[nI].x, minX2);
            maxX2 = Math.max(nodes[nI].x + nodes[nI].width, maxX2);
        }
        prevNode = nodes[nI];
    }
    if (!splitted) {
        return splitHorizontal(subNodes, minX, maxX2 - minX);
    }
    return {
        x: minX,
        y: parentY,
        width: maxX2,
        height: parentHeight,
        percentages: [(maxX2 - minX2) / (maxX2 - minX), (maxX - minX) / (maxX2 - minX)],
        children: [
            splitHorizontal(subNodes, minX, maxX - minX),
            splitVertical(subNodes2, parentY, parentHeight)
        ]
    };
}
function simplify(nodes) {
    let retNode = nodes;
    while (retNode.children.length === 1) {
        retNode = retNode.children[0];
    }
    retNode.children = retNode.children.map(element => {
        const newEl = simplify(element);
        delete element.parent;
        return newEl;
    }).sort((a, b) => {
        return a.x + a.y * 3000 - b.x + b.y * 3000;
    });
    delete retNode.parent;
    return retNode;
}
function generateHtml(nodes) {
    const simpleNodes = simplify(nodes);
    console.log(simpleNodes);
    const layout = splitHorizontal(simpleNodes.children, simpleNodes.x, simpleNodes.x + simpleNodes.width);
    console.log(layout);
}
exports.generateHtml = generateHtml;
//# sourceMappingURL=html.js.map