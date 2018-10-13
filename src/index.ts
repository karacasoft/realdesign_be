import { detectRectangles } from './detectRectangles';
import { generateHtml } from './codegen/html';

console.log(generateHtml(detectRectangles('image.jpg')));