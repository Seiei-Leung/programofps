import DateUtil from "./dateUtil";

// 常量信息
export default class Const {
    constructor() {

    }

    // 工具栏样式
    static get STYLEOFTOOLBAR() {
        return {
            height: 37,
            lineWidth: 1,
        }
    }
    
    // 左侧生产线栏样式
    static get STYLEOFPRODUCTLINESBAR() {
        return {
            height: 49,
            width: 124,
            lineWidth: 1,
        }
    }

    // 静态 getter
    // 底层画布单元格子样式
    static get STYLEOFCELL() {
        return {
            width: 22,
            height: 34,
            lineWidth: 1,
            borderColor: "#ddd",
            activedBackgroundColor: "#fffaf2",
            fontStyle: "14px Arial",
            fillColor: "#ddd",
            paddingTop: 10,
            paddingLeft: 1,
        }
    }

    // 进度条样式
    static get STYLEOFPROGRESSBAR() {
        return {
            top: 3,
            height: 30,
            lineWidth: 1,
            fontStyle: "14px Arial",
            paddingLeft: 4
        }
    }

    // 窗口 CSS 样式
    static get STYLEOFWINDOW() {
        return {
            titleHeight: 35
        }
    }

    // 右键菜单栏样式
    static get STYLEOFMENU() {
        return {
            width: 150,
            height: 170
        }
    }

    // 排产进度上锁状态
    static get STATUSOFLOCK() {
        return {
            LOCK: -1,
            UNLOCK: -2
        }
    }
}