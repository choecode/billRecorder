<template>
  <div class="container">
    <el-form  label-width="80px" :style="{padding: '25px'}">
      <el-form-item label="金额">
        <el-input style="width:200px;" v-model="amount" placeholder="请输入金额" type="number"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select style="width:200px;" v-model="category" placeholder="请选择类型">
          <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveRecord">提交</el-button>
        <el-button type="success" @click="hideModal">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "inputModal",
  props: ["categorys"],
  data() {
    return {
      amount: null,
      category: ""
    };
  },
  methods: {
    hideModal() {
      this.$emit("hideModal");
    },
    saveRecord() {
        if(!this.amount){
          return  alert("金额不正确")
        }

        if(!this.category){
           return alert("类型必选")
        }

      this.$emit("saveRecord", {
        amount: this.amount,
        category: this.category
      });
    }
  }
};
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
}
</style>