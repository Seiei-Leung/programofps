<template>
    <div class="dateBar-component">
        <!-- 日期标题 -->
        <div class="months zIndexTop" ref="monthsHook" v-bind:style="styleOfMonthsClass">
            <div v-for="(yearandmonth, index) in monthListOfShow" v-bind:key="index" class="month">
                <div class="monthTxt">
                    {{getDays(yearandmonth).length < 3 ? yearandmonth.split("-")[1] : yearandmonth}}
                </div>
                <div class="singleItem" v-for="(day, index2) in getDays(yearandmonth)" v-bind:key="index2" v-bind:class="{weekend:isHoliday(yearandmonth, day)}">
                    {{day}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateUtil from "../../common/dateUtil";
import CONST from "../../common/const";

export default {
    data: function() {
        return {
			monthListOfShow: DateUtil.monthListOfShow
        }
	},
	computed: {
		// css样式
		styleOfMonthsClass: function() {
			return this.$store.state.moduleOfDisplay.cssAboutScroll.styleOfMonthsClass;
		}
	},
	methods: {
		// 获取某年某月的总天数
		getDays: function(yearandmonth) {
            var year = yearandmonth.split("-")[0];
			var month = yearandmonth.split("-")[1];
			var firstDateOfShow = new Date(DateUtil.firstTimeStampOfShow);
			var dateList = [];
			var firstDate = 1;
			// 当前月份是显示的第一个月份
			if (year == firstDateOfShow.getFullYear() && month == DateUtil.zeroFillOfMonthOrDay(firstDateOfShow.getMonth() + 1)) {
				firstDate = firstDateOfShow.getDate();
			}
			for (var i=firstDate; i<=DateUtil.getDayCountOfMonth(year, month); i++) {
				dateList.push(i);
			}
			return dateList;
		},
		// 是否周末
		isHoliday: function(yearandmonth, day) {
            var year = yearandmonth.split("-")[0];
			var month = yearandmonth.split("-")[1];
			return this.$store.state.factoryCalendarObj.isHoliday(DateUtil.strToTimeStamp(year + "-" + month + "-" + day));
		}
	},
	created: function() {
		
	}
}
</script>

<style scoped>
.months {
	position: absolute;
	box-sizing: border-box;
	display: inline-block;
	white-space: nowrap;
	border-right: 1px solid #ddd;
	background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.months .month {
	display: inline-block;
}
.monthTxt {
	box-sizing: border-box;
	height: 24px;
	line-height: 24px;
	text-align: center;
	font-size: 12px;
	border: 1px solid #ddd;
	border-bottom: none;
	border-right: none;
	text-overflow: ellipsis;
	overflow: hidden;
}
.singleItem {
	box-sizing: border-box;
	display: inline-block;
	width: 24px;
	height: 24px;
	line-height: 24px;
	text-align: center;
	font-size: 12px;
	border: 1px solid #ddd;
	border-right: none;
	border-bottom: none
}
.weekend {
	background-color: #fffaf2
}
</style>