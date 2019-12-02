<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- <pre>
        {{cateList}}
      </pre>-->
      <el-button type="primary" @click="addCate">添加分类</el-button>
      <tree-table
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        border
        stripe
        show-index
        index-text="#"
      >
        <template slot="isDeleted" slot-scope="scope">
          <i class="el-icon-success" style="color:green;" v-if="scope.row.cat_deleted==false"></i>
          <i class="el-icon-error" style="color:red;" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="info" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,3,4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="addCateDialogVisible" width="50%" @close="resetCateForm">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',checkStrictly:true }"
           clearable @change="cascaderChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2
      },
      cateList: [],
      total: 0, //总条数
      columns: [
        {
          prop: "cat_name",
          label: "分类名称"
        },
        {
          prop: "cat_deleted",
          label: "是否有效",
          type: "template", //表示当前这一列是自定义模板列
          template: "isDeleted" //具名slot
        },
        {
          prop: "cat_level",
          label: "排序",
          type: "template", //表示当前这一列是自定义模板列
          template: "level" //具名slot
        },
        {
          label: "操作",
          type: "template", //表示当前这一列是自定义模板列
          template: "option" //具名slot
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0, //parent id父级的id
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
          { min: 3, max: 15, message: "长度在3到15之间", trigger: "blur" }
        ]
      },
      parentCateList: [],
      selectedKeys:[],//接收用户选择好的级联值
    };
  },
  methods: {
    async getCateList() {
      // get,delete - axios语法
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) return this.$message.error("获取列表失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(pagesize) {
      console.log(pagesize);
      this.queryInfo.pagesize = pagesize;
      this.getCateList();
    },
    handleCurrentChange(pagenum) {
      console.log(pagenum);
      this.queryInfo.pagenum = pagenum;
      this.getCateList();
    },
    addCate() {
      this.addCateDialogVisible = true;
      this.getParentsCateList();
    },
    //请求父级分类的数据
    async getParentsCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.parentCateList = res.data;
      console.log(this.parentCateList);
    },
    cascaderChange(){
      // 3种情况
      // 1. 什么也没选
      // console.log(this.selectedKeys)
      if(this.selectedKeys.length == 0){
        //当前要添加的是一级分类
        this.addCateForm.cat_pid = 0
      }else{
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
      }
      this.addCateForm.cat_level = this.selectedKeys.length
    },
    resetCateForm(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async saveCate(){
      const {data:res} = await this.$http.post('categories',this.addCateForm)
      //响应拦截器
      if(res.meta.status != 201)return this.$message.error('添加失败')
      this.getCateList()
      this.addCateDialogVisible = false
    }
  }
};
</script>
<style scoped lang="less">
</style>

<style lang="less">

</style>
