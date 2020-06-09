<template>
  <div>
    <input-modal
      @hideModal="toggleModalShow"
      @saveRecord="saveRecord"
      v-if="isShowModal"
      :categorys="categorys"
    />
    <div class="search_forms">
      <el-date-picker
        style="width:130px;"
        :picker-options="pickerOptions"
        v-model="date"
        type="month"
        placeholder="选择月份"
      ></el-date-picker>

      <el-select style="width:130px;margin-left:20px" v-model="category" placeholder="请选择">
        <el-option :key="0" label="全部" value></el-option>
        <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>

      <el-button
        style="margin-left:20px"
        @click="toggleModalShow"
        type="primary"
        icon="el-icon-plus"
        circle
      ></el-button>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="收支明细" name="first">
        <el-row :gutter="12" style="margin-bottom:15px" v-if="!category">
          <el-col :span="12">
            <el-card shadow="always">总支出:{{totalObj.expend}}</el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="always">总收入:{{totalObj.income}}</el-card>
          </el-col>
        </el-row>
        <el-table :data="showData" style="width: 100%">
          <el-table-column prop="type" label="类型">
            <template slot-scope="scope">
              <span :style="{color:scope.row.type==1?'green':'red'}">{{scope.row.type==1?'收入':'支出'}}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="amount" prop="amount" label="金额"></el-table-column>
          <el-table-column prop="name" label="类别"></el-table-column>
          <el-table-column :formatter="timeformat" prop="time" label="时间"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="支出统计" name="second">
        <el-table :data="piedata" style="width: 100%">
          <el-table-column width="80" type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="支出类别"></el-table-column>
          <el-table-column class-name="amount" prop="amount" label="支出汇总"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import ajax from "./utils/ajax.js";
import inputModal from "./components/InputModal.vue";
import dayjs from "dayjs";
import excute from "./utils/websql";
import CONSTANT from "./const/index";
var db;
try {
  db = openDatabase("XJ", "1.0", "xmind job", 200 * 1024 * 1024);
} catch (err) {
  alert(
    "抱歉，您的浏览器不支持WebSQL，因为应用的数据存储依赖WebSQL,所以推荐您更换浏览器尝试"
  );
}

export default {
  name: "Home",
  components: {
    "input-modal": inputModal
  },
  data() {
    return {
      activeName: "first",
      isShowModal: false,
      tableData: [],
      category: "",
      date: "",
      categorys: []
    };
  },
  computed: {
    totalObj() {
      function getSum(total, num) {
        return total + +num.amount;
      }
      var list1 = this.showData
          .filter(item => item.type == 1);
      var list2 = this.showData
          .filter(item => item.type == 0); 
      var income = list1.length>0? list1.reduce(getSum,0):0
      var expend = list2.length>0? list2.reduce(getSum,0):0
      return {
        income,
        expend
      };
    },
    piedata() {
      var recordData = [];
      
      this.showData
        .filter(item => item.type == 0)
        .forEach(item => {
          var curtTypeIndex = recordData.findIndex(
            newItem => newItem.name == item.name
          );
          if (curtTypeIndex > -1) {
            recordData[curtTypeIndex] = {
              amount: +recordData[curtTypeIndex].amount + +item.amount,
              name: item.name
            };
          } else {
            recordData.push({
              amount: +item.amount,
              name: item.name
            });
          }
        });
      return recordData.sort((a, b) => b.amount - a.amount);
    },
    pickerOptions() {
      if (!this.tableData.length) {
        return {};
      }
      var lastMonth = dayjs.unix(this.tableData[0].time / 1000);
      var firstMouth = dayjs.unix(
        this.tableData[this.tableData.length - 1].time / 1000
      );
      return {
        disabledDate: item => {
          item = dayjs(item);
          return item.isAfter(lastMonth) || item.isBefore(firstMouth);
        }
      };
    },
    showData() {
      var data = this.tableData.concat([]);
      if (this.category) {
        data = data.filter(item => {
          return item.category == this.category;
        });
      }
      if (this.date) {
        data = data.filter(item => {
          return (
            dayjs.unix(item.time / 1000).format("YYYY-MM") ==
            dayjs(this.date).format("YYYY-MM")
          );
        });
      }
      return data;
    }
  },
  created() {
    Promise.all([this.initBill().then(), this.initCategory().then()])
      .then(result => {
        this.getAllData();
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    saveRecord(data) {
      var time = Date.parse(new Date());
      var id = time + "" + Math.abs(data.amount);
      var type = this.categorys.find(item => {
        return item.id == data.category;
      }).type;

      var valueStr = [id, type, time, data.category, data.amount]
        .map(item => `'${item}'`)
        .join(",");
      var sqlStr = `INSERT INTO BILL (id,type,time,category,amount) VALUES (${valueStr})`;

      excute(db, sqlStr)
        .then(data => {
          this.getAllData();
          this.toggleModalShow();
        })
        .catch(err => {
          console.log(err);
        });
    },
    toggleModalShow() {
      this.isShowModal = !this.isShowModal;
    },

    timeformat(row, column, cellValue, index) {
      return dayjs.unix(cellValue / 1000).format("YYYY-MM-DD HH:mm:ss");
    },

    getAllCatarogy() {
      const sqlStr = `SELECT * FROM  CATEGORY`;
      var list = [];
      excute(db, sqlStr).then(data => {
        var len = data.rows.length;
        for (let i = 0; i < data.rows.length; i++) {
          list.push(data.rows.item(i));
        }
        this.categorys = list;
      });
    },
    getAllData() {
      const sqlStr = `SELECT t1.id,t1.type,name,category,amount,time FROM BILL  t1 LEFT JOIN CATEGORY t2 ON t1.category=t2.id ORDER BY time DESC`;
      var list = [];
      excute(db, sqlStr)
        .then(data => {
          var len = data.rows.length;
          for (let i = 0; i < data.rows.length; i++) {
            list.push(data.rows.item(i));
          }
          this.tableData = list;
          this.getAllCatarogy();
        })
        .catch(err => {
          console.log("getAllData err", err);
        });
    },
    initBill() {
      const sqlstr = `CREATE TABLE IF NOT EXISTS BILL(id unique,type,time,category,amount)`;
      return ajax(CONSTANT.BILL_CSV_FILE_URL)
        .then(data => {
          const sourceList = data.split("\n");
          const datas = sourceList.slice(1);
          return excute(db, sqlstr).then(data => {
            return this.fullBill(datas);
          });
        })
        .catch(err => {
          console.log("initBill err", err);
        });
    },
    fullBill(datas) {
      var sqls = datas.map(element => {
        var valueList = element.split(",");
        let id = valueList[1] + "" + Math.abs(+valueList[3]);
        var valueStr = [id]
          .concat(valueList)
          .map(item => `'${item}'`)
          .join(",");
        var sqlStr = `INSERT INTO BILL (id,type,time,category,amount) VALUES (${valueStr})`;
        return sqlStr;
      });
      return excute(db, sqls)
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log("fullBill err", err);
        });
    },
    initCategory() {
      const sqlstr = `CREATE TABLE IF NOT EXISTS CATEGORY(id unique,type,name)`;
      return ajax(CONSTANT.CATEGORY_CSV_FILE_URL)
        .then(data => {
          const sourceList = data.split("\n");
          const datas = sourceList.slice(1);
          return excute(db, sqlstr).then(data => {
            return this.fullCategory(datas);
          });
        })
        .catch(err => {
          console.log("initCategory err", err);
        });
    },
    fullCategory(datas) {
      const sqllist = datas.map(element => {
        var value = element
          .split(",")
          .map(item => `'${item}'`)
          .join(",");
        return `INSERT INTO CATEGORY (id,type,name) VALUES (${value})`;
      });

      return excute(db, sqllist)
        .then(data => {
          console.log("sucess", data);
        })
        .catch(err => {
          console.log("fullCategory err", err);
        });
    }
  }
};
</script>
<style>
.amount {
  font-weight: bold;
}
</style>