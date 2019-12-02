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
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headers"
              :file-list="fileList"
              list-type="picture"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addForm.goods_introduce"
            ></quill-editor>
            <el-button type="primary" @click="add">添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
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
        goods_cat: [1, 3, 6],
        pics: [],
        goods_introduce:'',
        attrs:[],//动态属性和静态属性合集
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
      fileList: [],
      headers: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewVisible: false,
      previewPath: ""
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
    },
    handleSuccess(res) {
      if (res.meta.status == 200) {
        this.addForm.pics.push({ pic: res.data.tmp_path });
      }
    },
    handleRemove(file) {
      console.log(file);
      //根据文件路径找到这个文件在addForm中的pics数组中是属于哪一项（index索引) --> splice
      var path = file.response.data.tmp_path;
      var index = this.addForm.pics.findIndex(item => item.pic == path);
      this.addForm.pics.splice(index, 1);
    },
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
     add(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return this.$message.error('验证失败')
        var form = _.cloneDeep(this.addForm)//深拷贝
        form.goods_cat = this.addForm.goods_cat.join(',')
        // console.log(this.addForm)
        var arr = []//收集动态和静态属性
        console.log(this.manyTableData)
        this.manyTableData.forEach(item=>{
          var obj = {attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
          arr.push(obj)
        })
        console.log(this.onlyTableData)
        this.onlyTableData.forEach(item=>{
          var obj = {attr_id:item.attr_id,attr_value:item.attr_vals}
          arr.push(obj)
        })
        form.attrs = arr
        const {data:res} =  await this.$http.post('goods',form)
        this.$message.success('添加成功')
        //跳转到商品列表页面
        this.$router.push('/goods')
      })
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

.el-dialog {
  img{
    display: block;
    margin:0 auto;
  }
}
.ql-editor{
  height:300px !important;
}
</style>
