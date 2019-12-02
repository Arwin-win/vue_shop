<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <div>
        请选择商品分类：
        <el-cascader
          v-model="selectedKeys"
          :options="cateList"
          :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' }"
          @change="handleChange"
        ></el-cascader>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态属性" name="many">
          <el-button type="primary" :disabled="isDisabled" @click="showAddDialog">添加属性</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                <!-- input和button同时只能显示一个，根据inputVisible值是true还是false来进行切换 -->
                <!-- v-if v-show  -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeAttrById(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" @click="showAddDialog">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeAttrById(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性对话框 -->
    <el-dialog
      :title="'添加'+currentTitle"
      :visible.sync="addAttrDialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form :model="attrForm" :rules="attrFormRules" ref="attrFormRef" label-width="100px">
        <el-form-item :label="currentTitle" prop="attr_name">
          <el-input v-model="attrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAttrs">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改属性对话框 -->
    <el-dialog
      :title="'修改'+currentTitle"
      :visible.sync="editAttrDialogVisible"
      width="50%"
      @close="resetEditForm"
    >
      <el-form
        :model="editAttrForm"
        :rules="attrFormRules"
        ref="editAttrFormRef"
        label-width="100px"
      >
        <el-form-item :label="currentTitle" prop="attr_name">
          <el-input v-model="editAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditAttrs">确 定</el-button>
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
      cateList: [], //分类的列表数据
      selectedKeys: [],
      activeName: "many",
      onlyTableData: [],
      manyTableData: [],
      addAttrDialogVisible: false,
      attrForm: {
        attr_name: ""
      },
      attrFormRules: {
        attr_name: [
          { required: true, message: "属性名不能为空", trigger: "blur" },
          { min: 2, max: 15, message: "长度必须在2到15之间", trigger: "blur" }
        ]
      },
      editAttrDialogVisible: false,
      editAttrForm: {
        attr_name: ""
      },
      inputVisible:false,
      inputValue:''
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200)
        return this.$message.error("获取分类列表失败");
      this.cateList = res.data;
      console.log(this.cateList);
    },
    async handleChange() {
      this.getParamsData();
    },
    handleClick() {
      this.getParamsData();
    },
    async getParamsData() {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length <= 2) return (this.selectedKeys = []);
      console.log("选的是三级分类");
      //如果用户选的是三级分类，我们就需要去请求当前选中的三级分类对应的参数列表数据 渲染出来
      // var catid = this.selectedKeys[2]
      // await this.$http.get(`categories/${catid}/attributes`)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      //res.data是一个数组，数组每一项是一个属性，属性中都有一个attr_vals，这是一个字符串，用,号进行分割，我们要把它变成一个数组
      //因为我们打印的是一个引用类型的数据(数组或者对象)
      // console.log(res.data)
      // console.log(res.data[0].attr_vals)
      res.data.forEach(item => {
        if (item.attr_vals == "") {
          item.attr_vals = []; //如果不这样写，得到的是 [""]
        } else {
          item.attr_vals = item.attr_vals.split(",");
        }
        item.inputVisible = false
        item.inputValue = ''
      });
      // console.log(res.data)
      // console.log(res.data[0].attr_vals)
      if (this.activeName == "only") {
        this.onlyTableData = res.data; //赋值静态属性
      } else {
        this.manyTableData = res.data; //动态属性
      }
      console.log(res.data);
    },
    showAddDialog() {
      console.log(123);
      this.addAttrDialogVisible = true;
    },
    resetForm() {
      this.$refs.attrFormRef.resetFields();
    },
    saveAttrs() {
      //表单校验
      this.$refs.attrFormRef.validate(async valid => {
        console.log(valid);
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { attr_name: this.attrForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status != 201) return this.$message.error("添加属性失败");
        this.addAttrDialogVisible = false; //隐藏对话框
        this.getParamsData(); //重新获取参数数据列表
      });
    },
    async showEditDialog(id) {
      console.log(id);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } }
      );
      console.log(res);
      this.editAttrForm = res.data;
      this.editAttrDialogVisible = true;
    },
    resetEditForm() {
      this.$refs.editAttrFormRef.resetFields();
    },
    async saveEditAttrs() {
      // console.log(this.editAttrForm)
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editAttrForm.attr_id}`,
        { attr_name: this.editAttrForm.attr_name, attr_sel: this.activeName }
      );
      if (res.meta.status != 200) return this.$message.error("修改属性失败");
      this.getParamsData();
      this.editAttrDialogVisible = false;
    },
    removeAttrById(id) {
      this.$confirm("此操作将永久删除当前属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${id}`
          );
          if (res.meta.status == 200) {
            this.getParamsData();
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleInputConfirm(row){
      if(row.inputValue.trim() == ""){
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue)//把用户输入的最新的值追加到attr_vals数组当中
      row.inputVisible = false
      row.inputValue = ''
    },
    showInput(row){
      //这块获取的是element ui的el-input组件，它不是原生的input
      // this.$refs.saveTagInput.focus()
      row.inputVisible = true
      console.log(this.$refs.saveTagInput)//这样得到的是一个undefined,因为数据更新，DOM不是直接立马同步，而是异步更新 我们应该把操作DOM的逻辑全部写在nextTick里面
      // Vue.set 数组用索引改值或对象的新添加的属性
      //nextTick
      this.$nextTick(()=>{
        console.log(this.$refs.saveTagInput)
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isDisabled: function() {
      //如果是true,按钮就禁用，如果是false就启用
      // return this.selectedKeys.length != 3;
      if (this.selectedKeys.length != 3) {
        return true;
      } else {
        return false;
      }
    },
    cateId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2];
      } else {
        return null;
      }
    },
    currentTitle() {
      if (this.activeName == "only") {
        return "静态属性";
      } else {
        return "动态属性";
      }
    }
  }
};
</script>
<style scoped lang="less">
.el-tag {
  margin: 10px;
}
.el-input{
  width:120px;
}
</style>
