import * as cv from 'opencv4nodejs';

export interface Node {
    x: number;
    y: number;
    width: number;
    height: number;
    children: Node[];
    parent?: Node | null;
}

export function detectRectangles(imageFile) {
    const originalImg = cv.imread(imageFile, 0);
    const img = originalImg;
    
    const threshold = img.adaptiveThreshold(255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 3);
    //const threshold = new cv.Mat(img.rows, img.cols, 0, 255).sub(img.threshold(120, 255, cv.THRESH_BINARY));
    
    cv.imwrite('image.bin.jpg', threshold);
    
    const kernelLength = 20
    
    const verticalKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, kernelLength));
    
    const horizontalKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(kernelLength, 1));
    
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
    
    const temp_img = threshold.erode(verticalKernel, new cv.Point2(-1, -1), 2);
    const verticalLinesImg = temp_img.dilate(verticalKernel, new cv.Point2(-1, -1), 2);
    cv.imwrite('image.vertkernel.jpg', verticalLinesImg);
    
    const temp_img2 = threshold.erode(horizontalKernel, new cv.Point2(-1, -1), 2);
    const horizontalLinesImg = temp_img2.dilate(horizontalKernel, new cv.Point2(-1, -1), 2);
    cv.imwrite('image.horikernel.jpg', horizontalLinesImg);
    
    const alpha = 0.5;
    const beta = 1.0 - alpha;
    
    const img_temp_bin = verticalLinesImg.addWeighted(alpha, horizontalLinesImg, beta, 0.0);
    const img_final_bin = img_temp_bin.bitwiseNot().erode(kernel, new cv.Point2(-1, -1), 2)
        .threshold(0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
    
    cv.imwrite('image.final.jpg', img_final_bin);
    
    const contours = img_final_bin.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
        .filter(val => val.boundingRect().width > 30 && val.boundingRect().height > 30);

    //img.drawContours(contours, new cv.Vec3(255, 255, 0));

    const contoursStructured: Node[] = [];

    let i = 0;
    contours.forEach(val => {
        const rect = val.boundingRect();
        const hierarchy = val.hierarchy;
        img.drawRectangle(rect, new cv.Vec3(255, 255, 0), 3);
        img.putText(i + " : " + hierarchy.x + "," + hierarchy.y + "," + hierarchy.z + "," + hierarchy.w,
            new cv.Point2(rect.x + 10, rect.y + 30), cv.FONT_HERSHEY_PLAIN, 2, new cv.Vec3(0, 255, 0), cv.LINE_4, 3);
        contoursStructured.push({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            children: [],
            parent: null
        });
        i++;
        
    });

    i = 0;
    contours.forEach(val => {
        if(val.hierarchy.z !== -1) {
            contoursStructured[val.hierarchy.z].children.push(contoursStructured[i]);
            contoursStructured[i].parent = contoursStructured[val.hierarchy.z];
        }
        i++;
    });
    
    cv.imwrite('image.highlighted.jpg', img);
    
    return contoursStructured.find(val => val.parent === null);
}


