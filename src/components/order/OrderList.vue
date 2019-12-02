<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="12">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px"></el-table-column>
        <el-table-column prop="order_number" label="是否付款">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.order_pay == 0?'danger':'primary'"
            >{{scope.row.order_pay == 0 ?'未付款':'已付款'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间" width="250px">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="order_number" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addDialogVisible=true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showAddressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加地址对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%">
      <el-cascader v-model="selectedArea" :options="citydata" :props="{ expandTrigger: 'hover'}"></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查询快递信息对话框 -->
    <el-dialog title="提示" :visible.sync="addressDialogVisible" width="40%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in kuaidiList"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
//当前这个有很多组件都要用的 尽量放在入口main.js
//模块化
import citydata from "../../assets/citydata.js";
export default {
  created() {
    this.getOrderList();
  },
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      addDialogVisible: false,
      citydata,
      selectedArea: [],
      addressDialogVisible: false,
      kuaidiList: []
    };
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      this.total = res.data.total;
      this.orderList = res.data.goods;
      console.log(this.orderList);
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getOrderList();
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getOrderList();
    },
    async showAddressDialog() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      this.kuaidiList = res.data;
      this.addressDialogVisible = true;
    }
  }
};
</script>
<style scoped lang="less">
</style>
