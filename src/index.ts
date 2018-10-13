import { detectRectangles } from './detectRectangles';
import { generateHtml } from './codegen/html';

generateHtml(detectRectangles('image2.jpg'));