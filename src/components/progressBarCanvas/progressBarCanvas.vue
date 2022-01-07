<template>
    <div class="progressBarCanvas-component" v-bind:style="{top: msgOfCanvas.top + 'px', left: msgOfCanvas.left + 'px'}">
        <!-- 源画布 -->
        <canvas 
            class="sourceCanvas"
            ref="sourceCanvas"
            v-bind:width="msgOfCanvas.width"
            v-bind:height="msgOfCanvas.height"
            @dblclick="dblclickOfSourceCanvas($event)"
            @mousedown="mousedownOfSourceCanvas($event)"
            @mousemove="mousemoveOfSourceCavnas($event)"
            @mouseup="mouseupOfSourceCavnas($event)"
            @ctrlDown="clickDownCtrlOfSourceCanvas($event)"
            @ctrlUp="clickUpCtrlOfSourceCanvas($event)"
            @contextmenu.prevent="showWindowOfMenu($event)"
        ></canvas>
        <!-- 移动画布 -->
        <canvas
            v-show="isShowCtxOfTmp"
            class="tempCanvas zIndexTop"
            ref="tempCanvas"
            v-bind:width="msgOfCanvas.width"
            v-bind:height="msgOfCanvas.height"
            @mousemove="mousemoveOfTempCanvas($event)"
            @click="mouseupOfTempCanvas($event)"
        ></canvas>
        <!-- 鼠标icon -->
        <img v-bind:width="msgOfMouseIcon.width" v-bind:height="msgOfMouseIcon.height" ref="mouseIcon" class="mouseIcon" :src="mouseIconUrl">
    </div>
</template>

<script>
import CONST from "../../common/const";
import DateUtil from "../../common/dateUtil";
import V2M from "../../common/V2M";
import ProgressBar from "../../vo/progressBar";

var tOfMouseIcon; // 源画布悬浮计时器

export default {
    data: function() {
        return {
            factoryCalendar: null, // 工厂日历
            dayCountOfShow: DateUtil.dayCountOfShow, // 显示总天数
            ctxOfSource: null, // 源画布的上下文
            ctxOfTemp: null, // 移动画布的上下文
            beforeProductLineIndex: null, // 激活进度条的原来生产线的索引
            afterProductLineIndex: null, // 激活进度条移动后的生产线索引
            colorSetting: null, // 颜色设置
            isCtrlActived: false, // 当前是否一直按着 ctrl 键
            numOfSeparateBill: 0, // 拆单的制单数量（分配到新增进度条的制单数）
            mouseIcon: null, // 鼠标 icon
            mouseIconUrl: CONST.MSGOFMOUSEICON.URLOFSCISSORSOPEN, // 默认剪刀Icon
        }
    },
    computed: {
        // 画布位置，大小信息
        msgOfCanvas: function() {
            return {
                width: this.dayCountOfShow * (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth),
                height: this.productLineList.length * (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth) + CONST.STYLEOFCELL.lineWidth,
                top: CONST.STYLEOFPRODUCTLINESBAR.height + CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFPRODUCTLINESBAR.lineWidth,
                left: CONST.STYLEOFPRODUCTLINESBAR.width - CONST.STYLEOFPRODUCTLINESBAR.lineWidth
            }
        },
        // 鼠标信息
        msgOfMouseIcon: function() {
            return {
                width: CONST.MSGOFMOUSEICON.width,
                height: CONST.MSGOFMOUSEICON.width
            }
        },
        // 是否显示移动画布
        isShowCtxOfTmp: function() {
            return this.$store.state.moduleOfDisplay.isShowCtxOfTmp;
        },
        productLineList: function() {
            return this.$store.state.productLineList;
        }
    },
    mounted: function() {
        // 画布渲染
        var sourceCanvas = this.$refs.sourceCanvas;
        var ctxOfSource = sourceCanvas.getContext("2d"); //设置2D渲染区
        var tempCanvas = this.$refs.tempCanvas;
        var ctxOfTemp = tempCanvas.getContext("2d");
        this.$store.commit('setCtxOfSource', ctxOfSource);
        this.ctxOfSource = ctxOfSource;
        this.$store.commit('setCtxOfTemp', ctxOfTemp);
        this.ctxOfTemp = ctxOfTemp;
        this.productLineList.forEach((item) => {
            item.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
        });
        // 向画布绑定点击 ctrl 事件
        // 先在 window 上监听键盘事件
        window.addEventListener("keydown", function(event) {
            //收到标准键盘事件keydown后，判断是否点击了ctrl键，创建一个自定义事件 ctrlDown, 并使用 dispatchEvent(发送)
            //Vue绑定的 @ctrlDown 就会收到这个自定义事件
            if(event.key == "Control"){
                var myEvent = new Event('ctrlDown'); // 创建 ctrl 事件
                sourceCanvas.dispatchEvent(myEvent); // 发送到源画布
            }
        });
        // 向画布绑定松开 ctrl 事件
        // 先在 window 上监听键盘事件
        window.addEventListener("keyup", function(event) {
            //收到标准键盘事件keyup后，判断是否松开了ctrl键，创建一个自定义事件 ctrlUp, 并使用 dispatchEvent(发送)
            //Vue绑定的 @ctrlUp 就会收到这个自定义事件
            if(event.key == "Control"){
                var myEvent = new Event('ctrlUp'); // 创建 ctrl 事件
                sourceCanvas.dispatchEvent(myEvent); // 发送到源画布
            }
        });
        this.mouseIcon = this.$refs.mouseIcon;
    },
    created: function() {
        this.factoryCalendar = this.$store.state.factoryCalendarObj;
        this.colorSetting = this.$store.state.colorSetting;
    },
    methods: {
        /*
            源数据画布事件
        */
        // 点击 ctrl 事件
        clickDownCtrlOfSourceCanvas: function(e) {
            this.isCtrlActived = true;
        },
        // 松开 ctrl 事件
        clickUpCtrlOfSourceCanvas: function(e) {
            this.isCtrlActived = false;
            document.querySelector('body').style.cursor = "default";
            this.mouseIcon.style.left = -100 + 'px';
        },
        // 在源数据画布中点击
        dblclickOfSourceCanvas: function(e) {
            if (this.isCtrlActived) {
                return;
            }

            // 获取当前激活的进度条
            var activedProgressBar =this.getProgressBarByXY(e);
            if (activedProgressBar == null) {
                return;
            }
            // 拖动前，进度条所在的生产线
            this.beforeProductLineIndex = activedProgressBar.getProductLineIndex;
            var activedProductLine = this.productLineList[activedProgressBar.getProductLineIndex];

            /**
             * 检查是否上锁
             */
            var idOfLock = activedProductLine.getIdOfLock;
            // 全部上锁
            if (idOfLock == CONST.STATUSOFLOCK.LOCK) {
                return;
            }
            // 未上锁
            else if (idOfLock == CONST.STATUSOFLOCK.UNLOCK) {
                // do nothing
            }
            // 部分上锁
            else {
                var progressBarOfLock = activedProductLine.getProgressById(idOfLock); // 上锁的进度条
                // 排产进度比锁要前
                if (progressBarOfLock.getStartTime >= activedProgressBar.getStartTime) {
                    return; 
                }
            }
            
            this.$store.commit("toggleIsShowCtxOfTmp");

            // 清除源画布
            activedProductLine.clear(this.ctxOfSource);
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, [activedProgressBar.getId], null);

            // 渲染移动画布
            activedProgressBar.render(this.ctxOfTemp, this.colorSetting, false, true, false);
            this.$store.commit("setActivedProgressBar", activedProgressBar);
        },
        // 在源数据画布移动
        mousemoveOfSourceCavnas: function(e) {
            //clearTimeout(tOfMouseIcon);
            var that = this;
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset; // 相对于整个画布中的鼠标当前对应的 X 坐标
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset; // 相对于整个画布中的鼠标当前对应的 Y 坐标
            // 是否一直点击 ctrl 键
            if (!that.isCtrlActived) {
                // 还原鼠标图标及关闭 toast
                that.hideMouseIcon();
                that.$store.commit("hideToast");
                return;
            }
            var activedProgressBar =that.getProgressBarByXY(e); // 获取当前鼠标悬浮对应的进度条
            if (activedProgressBar == null) 
            {
                // 还原鼠标图标及关闭 toast
                that.hideMouseIcon();
                that.$store.commit("hideToast");
                return;
            }

            var activedProductLine = that.productLineList[activedProgressBar.getProductLineIndex]; // 当前进度条对应的生产线
            /**
             * 检查上锁状态，判断是否继续操作
             */
            var canGoOnByLockStatus = activedProductLine.checkLockStatusByTimeStamp(activedProgressBar.getStartTime);
            if (canGoOnByLockStatus == false) {
                // 还原鼠标图标及关闭 toast
                that.hideMouseIcon();
                that.$store.commit("hideToast");
                return;
            }
            // 把鼠标图标改成剪刀
            document.querySelector('body').style.cursor = 'none';
            this.mouseIcon.style.left = e.clientX - CONST.MSGOFMOUSEICON.width/2 + 'px';
            this.mouseIcon.style.top = e.clientY + 'px';
            
            // 计算当前鼠标所在的位置，其视图长度转化为该进度条所占制单数量
            var xOfActivedProgressBarStartTime = activedProgressBar.msgOfCSS.left; // 当前激活进度条相对于整个画布的 LEFT 数值
            var widthOfActivedProgressBar = activedProgressBar.msgOfCSS.width; // 当前激活进度条的长度
            // 计算比例从而算出所占的制单数量
            var numOfSeparateBill = (((x-xOfActivedProgressBarStartTime)/widthOfActivedProgressBar)*activedProgressBar.getQtyofbatcheddelivery).toFixed(0);
            that.$store.commit("showToast", "拆分件数：" + numOfSeparateBill);
            that.numOfSeparateBill = numOfSeparateBill;
        },
        // 源画布鼠标点击事件
        mousedownOfSourceCanvas: function(e) {
            // 清空激活进度条，关闭 menu 菜单
            this.clearActivedProgressBar();
            this.$store.commit("setIsShowWindowOfMenu", false);
            var activedProgressBar = this.getProgressBarByXY(e); // 获取当前鼠标悬浮对应的进度条
            /**
             * 按着 ctrl 键确认拆单
             */
            this.separateBill(activedProgressBar);
        },
        // 源画布鼠标松开事件
        mouseupOfSourceCavnas: function(e) {
            if (this.isCtrlActived) {
                this.mouseIconUrl = CONST.MSGOFMOUSEICON.URLOFSCISSORSOPEN;
            }
        },
        // 右键显示菜单
        showWindowOfMenu: function(e) {
            // 获取当前激活的进度条
            var progressBar = this.getProgressBarByXY(e);
            // 如果没有激活进度条则不显示
            if (progressBar == null) {
                this.clearActivedProgressBar();
                this.$store.commit("setIsShowWindowOfMenu", false);
                return;
            }
            // 清除旧选中颜色
            this.clearActivedProgressBar();

            this.$store.commit("setActivedProgressBar", progressBar);
            
            // 渲染新的选中计划的边框颜色
            var activedProductLine = this.productLineList[progressBar.getProductLineIndex];
            activedProductLine.clear(this.ctxOfSource);
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, activedProductLine.getProgressIndexById(progressBar.getId));

            // 调整位置
            var left = e.clientX;
            var top = e.clientY;
            if (e.clientX + CONST.STYLEOFMENU.width > window.innerWidth) {
                left = e.clientX - CONST.STYLEOFMENU.width;
            }
            if (e.clientY + CONST.STYLEOFMENU.height > window.innerHeight) {
                top = e.clientY - CONST.STYLEOFMENU.height;
            }

            // 设置窗口位置
            var obj = {
                left: left + "px",
                top: top + "px",
                width: CONST.STYLEOFMENU.width + "px"
            }
            this.$store.commit("setMsgOfWindowOfMenu", obj);
            this.$store.commit("closeAllWindow");
            this.$store.commit("setIsShowWindowOfMenu", true);
        },

        /*
            临时画布绑定事件
        */
        // 鼠标拖动
        mousemoveOfTempCanvas: function(e) {
            var activedProgressBar = this.$store.state.activedProgressBar;
            var totalWidth = this.msgOfCanvas.width + CONST.STYLEOFPRODUCTLINESBAR.width; // 整个排产器的总宽度
            var totalHeight = this.msgOfCanvas.height + this.msgOfCanvas.top; // 整个排产器的总高度
            var widthOfWindow = document.body.clientWidth; // 浏览器窗口的宽度
            var heightOfWindow = document.body.clientHeight; // 浏览器窗口的长度
            
            /**
             * 拖动时的自行滚动
             */
            // 左右移动
            // 拖动时，鼠标的位置在最右侧的四个单元格之类
            if (widthOfWindow - e.clientX < (4*CONST.STYLEOFCELL.width)) {
                // 滚动条离最右的差值
                var differenceX = totalWidth - (window.pageXOffset + widthOfWindow);
                // 且滚动条还能向右滚动 50 px
                if (differenceX > 50) {
                    window.scroll(window.pageXOffset + 50, window.pageYOffset);
                }
                // 已经不能在向右移动 50 px，但还有多余数值，所以默认移动到最右
                else if (0<differenceX && differenceX <= 50) {
                    window.scroll(totalWidth - widthOfWindow, window.pageYOffset);
                }
            } 
            // 拖动时，鼠标的位置在最左的两个单元格之类
            else if (e.clientX < (2*CONST.STYLEOFCELL.width + CONST.STYLEOFPRODUCTLINESBAR.width)) {
                // 滚动条还能向左滚动 50 px
                if (window.pageXOffset > 50) {
                    window.scroll(window.pageXOffset - 50, window.pageYOffset);
                }
                // 已经不能在向左移动 50 px，但还有多余数值，所以默认移动到最左
                else if (0<window.pageXOffset && window.pageXOffset <= 50) {
                    window.scroll(0, window.pageYOffset);
                }
            }
            // 上下移动
            // 拖动时，鼠标的位置在最底侧的四个单元格之类
            if (heightOfWindow - e.clientY < (4*CONST.STYLEOFCELL.height)) {
                // 滚动条离最底侧的差值
                var differenceY = totalHeight - (window.pageYOffset + heightOfWindow);
                // 且滚动条还能向下滚动 50 px
                if (differenceY > 50) {
                    window.scroll(window.pageXOffset, window.pageYOffset + 50);
                }
                // 已经不能在向下移动 50 px，但还有多余数值，所以默认移动到最低
                else if (0<differenceY && differenceY <= 50) {
                    window.scroll(window.pageXOffset, totalHeight - heightOfWindow);
                }
            }
            // 拖动时，鼠标的位置在最上的两个单元格之类
            else if (e.clientY < (2*CONST.STYLEOFCELL.height + this.msgOfCanvas.top)) {

                // 滚动条还能向上移动 50 px
                if (window.pageYOffset > 50) {
                    window.scroll(window.pageXOffset, window.pageYOffset - 50);
                }
                // 已经不能在向上移动 50 px，但还有多余数值，所以默认移动到最上
                else if (0<window.pageYOffset && window.pageYOffset <= 50) {
                    window.scroll(window.pageXOffset, 0);
                }
            }

            // 移动渲染图层
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset;  // 相对于整个画布中的鼠标当前对应的 X 坐标
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset; // 相对于整个画布中的鼠标当前对应的 Y 坐标
            activedProgressBar.move(this.ctxOfTemp, x, y);
        },
        // 松开鼠标键
        mouseupOfTempCanvas: function(e) {
            // 检测有没有点击 ctrl
            // 没有点击，进度条正常移动
            if (!this.isCtrlActived) {
                this.normalMoveProgressBar(e);
            }
            // 合并进度条
            else {
                this.combineProgressBar(e);
            }
        },
        // 进度条移动事件
        normalMoveProgressBar: function(e) {
            /**
             * 一系列变量的赋值
             */
            var activedProgressBar = this.$store.state.activedProgressBar;
            var productLineList = this.productLineList;
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset; //  相对于整个画布中的鼠标当前对应的 X 坐标
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset; // 相对于整个画布中的鼠标当前对应的 Y 坐标
            this.afterProductLineIndex = V2M.yToProductLineIndex(productLineList, y); // 移动后所在生产线的索引
            var activedProductLine = productLineList[this.afterProductLineIndex]; // 移动后所在的生产线
            var beforeProductLine = null; // 移动前所在的生产线

            // 如果不是新增的进度条，赋值 beforeProductLine
            if (activedProgressBar.getProductLineIndex != null) {
                beforeProductLine = productLineList[this.beforeProductLineIndex]; // 赋值 beforeProductLine
            }
            var startTimeStamp = activedProductLine.ractifyStartTime(V2M.xToTimeStamp(x)); // 开启时间戳
            console.log("鼠标松开按键时的所在生产生产线：" + activedProductLine.fullName);

            /**
             * 清空临时画布，及隐藏它
             */
            this.ctxOfTemp.clearRect(0, 0, this.ctxOfTemp.canvas.offsetWidth, this.ctxOfTemp.canvas.offsetHeight);
            this.$store.commit("toggleIsShowCtxOfTmp");
            
            /**
             * 生产线没有对应的效率
             */
            if (activedProductLine.getEfficiency(activedProgressBar.getProductStyleName) == null) {
                this.showToast("生产线没有相对应的效率");
                // 还原数据
                if (beforeProductLine) {
                    // 该排产计划已经排产，则恢复旧生产线数据渲染
                    beforeProductLine.clear(this.ctxOfSource);
                    beforeProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
                }
                return;
            }

            /**
             * 检查上锁情况
             */
            var idOfLock = activedProductLine.getIdOfLock;
            // 全部上锁
            if (idOfLock == CONST.STATUSOFLOCK.LOCK) {
                // 生产线为空
                if (activedProductLine.getProgressList.length == 0) {
                    activedProductLine.unLock(CONST.STATUSOFLOCK.UNLOCK);
                }
                // 不是新增到生产线的末端
                else if (activedProductLine.getProgressList[activedProductLine.getProgressList.length - 1].getStartTime >= startTimeStamp) {
                    this.showToast("该生产线尚未解锁");
                    // 该排产计划已经排产，则恢复旧生产线数据渲染
                    if (beforeProductLine) {
                        // 该排产计划已经排产，则恢复旧生产线数据渲染
                        beforeProductLine.clear(this.ctxOfSource);
                        beforeProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
                    }
                    return;
                }
                // 新增到生产线的末端
                else {
                    activedProductLine.unLock(activedProductLine.getProgressList[activedProductLine.getProgressList.length - 1].getId);
                }
            }
            // 生产线未上锁
            else if (idOfLock == CONST.STATUSOFLOCK.UNLOCK) {
                // do nothing
            }
            // 部分上锁
            else {
                var progressBarOfLock = activedProductLine.getProgressById(idOfLock); // 上锁的进度条
                // 排产进度比锁要前
                if (progressBarOfLock.getStartTime > startTimeStamp) {
                    this.showToast("该生产线尚未解锁");
                    // 该排产计划已经排产，则恢复旧生产线数据渲染
                    if (beforeProductLine) {
                        // 该排产计划已经排产，则恢复旧生产线数据渲染
                        beforeProductLine.clear(this.ctxOfSource);
                        beforeProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
                    }
                   return;
                }
            }

            /**
             * 记录历史操作（之前没有记录过历史操作，则初始化历史记录快照）
             */
            // 判断是否还要存储待排产表的信息
            if (beforeProductLine) {
                this.initHistoryObjList(productLineList, null);
            } else {
                // 如果是从排产表新增，则还要修改上一个历史版本对象，把排产表数据设置过去
                var dataOfWaitingAddProgressList = [...this.$store.state.waitingAddProgressList];
                if (!this.initHistoryObjList(productLineList, dataOfWaitingAddProgressList)) {
                    this.$store.state.historyObjList[this.$store.state.activedIndexOfHistoryObjList].setDataOfWaitingAddProgressList(dataOfWaitingAddProgressList);
                }
            }

            /**
             * 删除旧数据
             */
            if (beforeProductLine) {
                // 该排产计划已经排产，则从源生产线中删除该数据
                beforeProductLine.removeProgressById(activedProgressBar.getId);
            } else {
                // 该排产计划尚未排产，从 等待排产的列表中删除该元素
                this.$store.commit("removeWaitingAddProgressList", activedProgressBar.getId);
            }

            /**
             * 设置数据
             */
            // 松开鼠标后，激活进度条的初步更新数据，初步渲染
            activedProgressBar.reload(activedProductLine, this.factoryCalendar, startTimeStamp);
            // console.log(DateUtil.timeStampToDate(activedProgressBar.getStartTime));
            // console.log(DateUtil.timeStampToDate(activedProgressBar.getEndTime));
            // 移动后，激活进度条移出了原来的生产线
            if (this.beforeProductLineIndex != this.afterProductLineIndex) {
                // console.log("进度条移出了原来的生产线");
            }
            else {
                // 移动后，激活进度条没有移出原来的生产线
                // console.log("进度条没有移出原来的生产线");
            }

            /**
             * 生产线重新刷新数据，并渲染图层
             */
            activedProductLine.clear(this.ctxOfSource); // 清空图层
            var activedProgressIndex = activedProductLine.addProgress(activedProgressBar, this.factoryCalendar); // 激活生产线添加进度条
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null); // 渲染生产线

            /**
             * 记录历史操作
             */
            
            this.pushHistoryObjList(productLineList, null, null);
            
            /**
             * 记录激活的生产线索引对象
             */
            this.$store.commit("addActivedObjListOfProductLine", {
                productLineIndex: activedProductLine.getIndex,
                progressBarIndex: Number(activedProgressIndex)
            });
            if (beforeProductLine) {
                this.$store.commit("addActivedObjListOfProductLine", {
                    productLineIndex: beforeProductLine.getIndex,
                    progressBarIndex: null
                });
            }
        },
        // 在数据画布悬浮，获取对应的激活的进度条
        getProgressBarByXY: function(e) {
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset;  // 相对于整个画布中的鼠标当前对应的 X 坐标
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset; // 相对于整个画布中的鼠标当前对应的 Y 坐标
            // 获取当前激活生产线
            var productLineIndex = V2M.yToProductLineIndex(this.productLineList, y);
            var progressBarList = this.productLineList[productLineIndex].getProgressList;
            var result = null;
            // 循环当前激活的生产线的进度条，检测是否在点击范围内
            for (var progressIndex=0; progressIndex<progressBarList.length; progressIndex++) {
                if (progressBarList[progressIndex].isInArea(x, y)) {
                    result = progressBarList[progressIndex];
                }
            }
            // 循环完都没有，返回 null
            return result;
        },
        // 设置鼠标图标
        hideMouseIcon() {
            document.querySelector('body').style.cursor = 'default';
            this.mouseIcon.style.left = -100 + 'px';
        },
        // 按着 ctrl 键拆单
        separateBill: function(activedProgressBar) {
            // 按着 ctrl 点击，确认拆单
            if (this.isCtrlActived && activedProgressBar != null) {
                var productLineList = this.productLineList;
                var activedProductLine = productLineList[activedProgressBar.getProductLineIndex]; // 激活进度条所在的生产线
                /**
                 * 检查上锁状态，判断是否继续操作
                 */
                var canGoOnByLockStatus = activedProductLine.checkLockStatusByTimeStamp(activedProgressBar.getStartTime);
                if (canGoOnByLockStatus == false) {
                    // 还原鼠标图标及关闭 toast
                    this.hideMouseIcon();
                    this.$store.commit("hideToast");
                    return;
                }
                // 检查拆分数量
                var numOfSeparateBill = this.numOfSeparateBill;
                if (numOfSeparateBill == 0) {
                    this.$Message.error("拆分数量不能为零");
                    return;
                }

                this.mouseIconUrl = CONST.MSGOFMOUSEICON.URLOFSCISSORSCLOSE;
                this.$store.commit("hideToast");
                // 生产线数据
                /**
                 * 记录历史操作（之前没有记录过历史操作，则初始化历史记录快照）
                 */
                this.initHistoryObjList(productLineList, null);
                /**
                 * 拆单操作
                 */
                // 分配到新进度条的制单数量
                var qtyofbatcheddeliveryForNewMsgOfProgressBar = activedProgressBar.getQtyofbatcheddelivery - numOfSeparateBill;
                // 原排产减数
                activedProgressBar.setQtyofbatcheddelivery(productLineList[activedProgressBar.getProductLineIndex], this.factoryCalendar, numOfSeparateBill, activedProgressBar.getStartTime);
                // 创建新增进度条对象
                var newMsgOfProgressBar = {...activedProgressBar.getMsgOfProgressBar};
                newMsgOfProgressBar.id = CONST.PREFIXOFPROGRESSBARID.NEW + (new Date()).getTime();
                newMsgOfProgressBar.qtyFinish = 0;
                newMsgOfProgressBar.qtyofbatcheddelivery = qtyofbatcheddeliveryForNewMsgOfProgressBar;
                var newProgressBar = new ProgressBar(activedProductLine.getIndex, activedProductLine.getId, newMsgOfProgressBar);
                // 赋值 parentId
                if (activedProgressBar.getParentId) {
                    // 如果被拆单的进度条本身就是一个由拆单而生成的进度条（未点击保存）
                    newProgressBar.setParentId(activedProgressBar.getParentId);
                } else {
                    newProgressBar.setParentId(activedProgressBar.getId);
                }
                // 设置新增进度条对象的开始时间为源拆单的进度条的结束时间
                newProgressBar.reload(activedProductLine, this.factoryCalendar, activedProgressBar.getEndTime);
                // 新增进度条添加到生产线
                activedProductLine.addProgress(newProgressBar, this.factoryCalendar);
                // 重新渲染
                activedProductLine.clear(this.ctxOfSource);
                activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);

                /**
                 * 记录历史操作
                 */
                this.pushHistoryObjList(productLineList, null, null);
                
                /**
                 * 记录激活的生产线索引对象
                 */
                this.$store.commit("addActivedObjListOfProductLine", {
                    productLineIndex: activedProgressBar.getProductLineIndex,
                    progressBarIndex: activedProductLine.getProgressIndexById(activedProgressBar.getId)
                });
            } else {
                // 还原鼠标图标及关闭 toast
                this.hideMouseIcon();
                this.$store.commit("hideToast");
            }
        },
        // 合并进度条事件
        combineProgressBar: function(e) {
            /**
             * 清空临时画布，及隐藏它
             */
            this.ctxOfTemp.clearRect(0, 0, this.ctxOfTemp.canvas.offsetWidth, this.ctxOfTemp.canvas.offsetHeight);
            this.$store.commit("toggleIsShowCtxOfTmp");

            /**
             * 一系列变量的赋值
             */
            var progressBarForCombine = this.getProgressBarByXY(e); // 获取合并的进度条(静止的)
            var activedProgressBar = this.$store.state.activedProgressBar; // 拖动中的进度条
            var productLineList = this.productLineList; // 生产线数据
            var beforeProductLine = null; // 移动前，拖动进度条所在的生产线
            // 如果不是新增的进度条，赋值 beforeProductLine
            if (activedProgressBar.getProductLineIndex != null) {
                beforeProductLine = productLineList[this.beforeProductLineIndex]; // 赋值 beforeProductLine
            }
            // 没有对应的要合并的进度条
            if (progressBarForCombine == null) {
                if (beforeProductLine) {
                    // 该排产计划已经排产，则恢复旧生产线数据渲染
                    beforeProductLine.clear(this.ctxOfSource);
                    beforeProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
                }
                return;
            }
            var activedProductLine = productLineList[progressBarForCombine.getProductLineIndex]; // 移动后所在的生产线

            // 判断二者的款号是否一致
            if (progressBarForCombine.getMsgOfProgressBar.styleno != activedProgressBar.getMsgOfProgressBar.styleno) {
                this.showToast("二者款号不一致，无法合并！");
                // 该排产计划已经排产，则恢复旧生产线数据渲染
                if (beforeProductLine) {
                    // 该排产计划已经排产，则恢复旧生产线数据渲染
                    beforeProductLine.clear(this.ctxOfSource);
                    beforeProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
                }
                return;
            }

            /**
             * 记录历史操作（之前没有记录过历史操作，则初始化历史记录快照）
             */
            // 判断是否还要存储待排产表的信息
            if (beforeProductLine) {
                this.initHistoryObjList(productLineList, null);
            } else {
                // 如果是从排产表新增，则还要修改上一个历史版本对象，把排产表数据设置过去
                var dataOfWaitingAddProgressList = [...this.$store.state.waitingAddProgressList];
                if (!this.initHistoryObjList(productLineList, dataOfWaitingAddProgressList)) {
                    this.$store.state.historyObjList[this.$store.state.activedIndexOfHistoryObjList].setDataOfWaitingAddProgressList(dataOfWaitingAddProgressList);
                }
            }

            /**
             * 删除旧数据
             */
            if (beforeProductLine) {
                // 该排产计划已经排产，则从源生产线中删除该数据
                beforeProductLine.removeProgressById(activedProgressBar.getId);
            } else {
                // 该排产计划尚未排产，从 等待排产的列表中删除该元素
                this.$store.commit("removeWaitingAddProgressList", activedProgressBar.getId);
            }

            /**
             * 设置数据
             */
            // 松开鼠标后，激活进度条的初步更新数据，初步渲染
            var comebinedQty = Number(progressBarForCombine.getQtyofbatcheddelivery) + Number(activedProgressBar.getQtyofbatcheddelivery);
            progressBarForCombine.setQtyofbatcheddelivery(activedProductLine, this.factoryCalendar, comebinedQty, progressBarForCombine.getStartTime);
            // 合并制单号
            if (progressBarForCombine.getMsgOfProgressBar.orderno != activedProgressBar.getMsgOfProgressBar.orderno) {
                progressBarForCombine.setOrderno(progressBarForCombine.getMsgOfProgressBar.orderno + "/" + activedProgressBar.getMsgOfProgressBar.orderno);
            }

            /**
             * 生产线重新刷新数据，并渲染图层
             */
            activedProductLine.clear(this.ctxOfSource); // 清空图层
            activedProductLine.removeProgressById(progressBarForCombine.getId); // 删除合并进度条，为的是再次添加，这样合并进度条的后续进度条就会自动后移
            var activedProgressIndex = activedProductLine.addProgress(progressBarForCombine, this.factoryCalendar); // 激活生产线添加进度条
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null); // 渲染生产线

            /**
             * 记录历史操作
             */
            // 这里需要删除拖动进度条，这个删除是物理删除，这里问题在于删除id的录入
            // 1、拖动的进度条是待排产的进度条，可以等同于正常已排产进度条的逻辑，即直接根据id物理删除
            // 2、拖动的进度条是拆单生成的进度条，这里可以无视这删除id
            if ((activedProgressBar.getId + "").indexOf(CONST.PREFIXOFPROGRESSBARID.NEW) != -1) {
                // 拖动的进度条是拆单生成的进度条
                // 无需录入删除 ID
                this.pushHistoryObjList(productLineList, null, null);
            } else {
                // 需要录入删除 ID
                this.pushHistoryObjList(productLineList, null, CONST.PREFIXOFPROGRESSBARID.PHYSICALLYDELETE + activedProgressBar.getId);
            }
            
            /**
             * 记录激活的生产线索引对象
             */
            this.$store.commit("addActivedObjListOfProductLine", {
                productLineIndex: activedProductLine.getIndex,
                progressBarIndex: Number(activedProgressIndex)
            });
            if (beforeProductLine) {
                this.$store.commit("addActivedObjListOfProductLine", {
                    productLineIndex: beforeProductLine.getIndex,
                    progressBarIndex: null
                });
            }
        }
    }
}
</script>

<style scoped>
.progressBarCanvas-component {
    position: absolute;
}
.tempCanvas {
    position: absolute;
    top: 0;
    left: 0;
}
.mouseIcon {
    position: fixed;
    left: -200px;
    z-index: 1000;
    pointer-events: none;
}
</style>