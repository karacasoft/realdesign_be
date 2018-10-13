import { Node } from '../detectRectangles';
export declare enum LayoutType {
    LAYOUT = 0,
    HSPLIT = 1,
    VSPLIT = 2
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
export declare function generateLayout(rootNode: Node): Layout;
