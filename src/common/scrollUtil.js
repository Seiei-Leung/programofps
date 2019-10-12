
// 滚动条工具
export default class ScrollUtil {

    constructor() {
        this.scrollXY = { x: null, y: null};
        this.scrollDirection = null;
    }

    // 滚动
    scroll() {
        if (this.scrollXY.x == null) {
            this.scrollXY.x = window.pageXOffset;
            this.scrollXY.y = window.pageYOffset;
        }
        var diffX = this.scrollXY.x - window.pageXOffset;
        var diffY = this.scrollXY.y - window.pageYOffset;
        if (diffX < 0) {
            // Scroll right
            this.scrollDirection = 'right';
        } else if (diffX > 0) {
            // Scroll left
            this.scrollDirection = 'left';
        } else if (diffY < 0) {
            // Scroll down
            this.scrollDirection = 'down';
        } else if (diffY > 0) {
            // Scroll up
            this.scrollDirection = 'up';
        } else {
            // First scroll event
        }
        this.scrollXY.x = window.pageXOffset;
        this.scrollXY.y = window.pageYOffset;
    }

    // 获取滚动条坐标
    get getScrollXY() {
        return this.scrollXY;
    }

    // 获取滚动方向
    get getScrollDirection() {
        return this.scrollDirection;
    }
}