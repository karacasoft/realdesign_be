export interface Layout {
    x: number;
    y: number;
    width: number;
    height: number;
    children: Layout[];
}
export interface HSplit extends Layout {
    percentages: number[];
}
export interface VSplit extends Layout {
    percentages: number[];
}
