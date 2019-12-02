<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" @keyup.enter.native="getGoodsList" class="input-with-select" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="goGoodsAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" stripe border>
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-edit-icon">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-delete-icon" @click="remove(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[50,100,200,300]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getGoodsList();
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 50
      },
      goodslist: [],
      total: 0
    };
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    //切换每一页条数
    handleSizeChange(pagesize){
      this.queryInfo.pagesize = pagesize
      this.getGoodsList()
    },
    //切换当前页
    handleCurrentChange(pagenum){
      this.queryInfo.pagenum = pagenum
      this.getGoodsList()
    },
    remove(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} =  await this.$http.delete(`goods/${id}`)
          if(res.meta.status != 200)return this.$message.error('删除失败')
          this.getGoodsList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

    },
    goGoodsAdd(){
      this.$router.push('/goods/add')
    }
  },
  filters: {}
};
</script>
<style scoped lang="less">
</style>
