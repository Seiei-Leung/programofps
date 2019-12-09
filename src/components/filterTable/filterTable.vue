/* FilterTable 组件 */
/* https://github.com/azhengyongqin/iview-filter-table */
<template>
  <div class="filterTable-component">
    <Table border :data="filters" :columns="tableColumnsFilters" stripe></Table>
    <Table
      :show-header="false"
      border
      :height="tableHeight"
      :data="data"
      :columns="columns"
      @on-row-dblclick="dblclickTable"
      stripe
    ></Table>
  </div>
</template>

<script>
import CONST from "../../common/const";
export default {
  name: "FilterTable",
  props: {
    columns: Array, //列描述数据对象
    data: Array, //表格数据
    height: Number, // 详细内容表格高度
  },
  data() {
    return {
      filters: [
        {
          title: ""
        }
      ],
      tableColumnsFilters: [],
      search: {} //过滤条件保存的对象,就是保存Input框和Select中值
    };
  },
  created() {
    for (let index in this.columns) {
      let filter = {};
      //将传入的列描述数据对象(columns) 的title和width 复制给 过滤表的列描述数据对象(tableColumnsFilters)
      this.$set(filter, "title", this.columns[index].title);
      this.$set(filter, "align", "center"); // 居中
      if (this.columns[index].width) {
        this.$set(filter, "width", this.columns[index].width);
      }
      let render = h => {};
      //如果存在 过滤选项
      if (this.columns[index].filter) {
        //过滤为 下拉选择框
        if (
          this.columns[index].filter.type &&
          this.columns[index].filter.type === "Select"
        ) {
          render = h => {
            return h(
              this.columns[index].filter.type,
              {
                props: {
                  value: 0 //Select选项列表一般 0 为全部
                },
                on: {
                  "on-change": val => {
                    if (val === 0) {
                      //当选项是全部的时候删除 search中该字段的过滤条件
                      this.$delete(this.search, this.columns[index].key);
                      this.load();
                      return;
                    }
                    //添加字段过滤条件
                    this.$set(this.search, this.columns[index].key, val);
                    this.load();
                  }
                }
              },
              this.createOptionsRender(index, h)
            );
          };
        } else {
          //如果是输入框
          render = h => {
            let inputValue = {};
            return h(this.columns[index].filter.type, {
              props: {
                placeholder: "输入" + this.columns[index].title
              },
              on: {
                input: val => {
                  inputValue = val;
                  this.validInputValue(index, inputValue);
                }
              }
            });
          };
        }
      }
      this.$set(filter, "render", render);
      this.tableColumnsFilters.push(filter);
    }
  },
  methods: {
    createOptionsRender(index, h) {
      //选项渲染
      let optionRender = [];
      if (this.columns[index].filter.option) {
        let option = this.columns[index].filter.option;
        for (let i in option) {
          optionRender.push(
            h(
              "Option",
              {
                props: {
                  value: option[i].value
                }
              },
              option[i].name
            )
          );
        }
      }
      return optionRender;
    },
    //重新加载数据
    load() {
      // 提交，激活父组件事件
      this.$emit("on-search", this.search);
    },
    //验证输入框的值
    validInputValue(index, inputValue) {
      if (!inputValue) {
        this.$delete(this.search, this.columns[index].key);
        this.load();
        return;
      }
      this.$set(this.search, this.columns[index].key, inputValue);
      this.load();
    },
    // 双击表格，激活父组件绑定事件
    dblclickTable(data, index) {
      var obj = {};
      obj.data = data;
      obj.index = index;
      // 提交，激活父组件事件
      this.$emit("on-row-dblclick", obj);
    }
  },
  computed: {
    tableHeight: function() {
      if (this.height != 0) {
        return this.height;
      }
      return (
        window.innerHeight -
        CONST.STYLEOFFILTERTABLE.height -
        2 * CONST.STYLEOFWINDOW.titleHeight
      );
    }
  }
};
</script>

<style scoped>
</style>