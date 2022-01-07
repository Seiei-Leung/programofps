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
            olderBackgroundColor: "#eee",
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
            titleHeight: 35, // 标题高度
            lineWidth: 2, // 边线宽度
        }
    }

    // 右键菜单栏样式
    static get STYLEOFMENU() {
        return {
            width: 150,
            height: 170
        }
    }

    // 添加排产窗体样式
    static get STYLEOFWINDOWOFADDPROGRESSBAR() {
        return {
            width: 1000, // 窗口宽度
        }
    }

    // 筛选表格组件样式
    static get STYLEOFFILTERTABLE() {
        return {
            heightOfFilterTable: 88, // 筛选标题的高度
            heightOfRow: 48, // 行高
            widthOfScrollBar: 15// 滚动条高度
        }
    }

    // 排产进度上锁状态
    static get STATUSOFLOCK() {
        return {
            LOCK: -1,
            UNLOCK: -2
        }
    }

    // 用于保存时，辨识操作的 ID 前缀
    static get PREFIXOFPROGRESSBARID() {
        return {
            NEW: "NEW_",
            LOGICALLYDELETE: "LOGICALLY_DELETE_",
            PHYSICALLYDELETE: "PHYSICALLY_DELETE_"
        }
    }

    // 鼠标 ICON 信息
    static get MSGOFMOUSEICON() {
        return {
            width: 32,
            URLOFSCISSORSCLOSE: "static/img/scissorsClose.ico",
            URLOFSCISSORSOPEN: "static/img/scissorsOpen.ico"
        }
    }
}