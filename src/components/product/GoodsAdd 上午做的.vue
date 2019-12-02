<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="warning"></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="动态属性"></el-step>
        <el-step title="静态属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input type="text" v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="动态属性" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 不是从蓝色变成灰色，而是直接没了 -->
                <el-checkbox
                  :label="item1"
                  border
                  v-for="(item1,index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="upload"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [1, 3, 6]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      cateList: [],
      manyTableData: [],
      onlyTableData: [],
      fileList:[]
    };
  },
  methods: {
    //约定 驼峰式
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      this.cateList = res.data;
      console.log(this.cateList);
    },
    handleChange() {
      //只能选择三级分类
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = [];
        this.$message.error("只能选择三级分类");
        return; //阻止代码往下执行
      }
    },
    beforeLeave(activeName, oldActiveName) {
      console.log(activeName, oldActiveName);
      //如果当前用户是从基本信息切换到其他标签页，并且分类长度不是3，阻止切换
      if (oldActiveName == "0" && this.addForm.goods_cat.length < 3) {
        this.$message.error("只能选择三级分类");
        return false; //文档上要求，用这个就可以阻止tab切换
      }
    },
    async tabClicked() {
      console.log(this.addForm.goods_cat);
      if (this.activeIndex == "1") {
        //请求动态属性对应的数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        res.data.forEach(item => {
          if (item.attr_vals == "") {
            item.attr_vals = [];
          } else {
            item.attr_vals = item.attr_vals.split(",");
          }
          // item.attr_vals = item.attr_vals == ""?[]:item.attr_vals.split(',')
        });
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      } else if (this.activeIndex == "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );

        this.onlyTableData = res.data; //静态属性不需要用split对attr_vals进行转换成数组
        console.log(this.onlyTableData);
      }
    }
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat[2];
    }
  }
};
</script>
<style scoped  lang="less">
.el-steps {
  margin-top: 15px;
}
</style>

<style scoped>
/* https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8 */
/* .el-steps >>> .el-step__title{
    font-size:12px !important;
} */

/* .el-steps /deep/ .el-step__title{
    font-size:12px !important;
} */
</style>

<style lang="less">
// 这块东西是属于el-steps子组件内部的东西 穿透
// .el-step__title{
//     font-size:12px !important;
// }
</style>

