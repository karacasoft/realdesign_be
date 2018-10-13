export interface Node {
    x: number;
    y: number;
    width: number;
    height: number;
    children: Node[];
    parent?: Node | null;
}
export declare function detectRectangles(imageFile: any): Node;
