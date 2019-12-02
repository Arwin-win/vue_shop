<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 2 3 4
      栅格 bootstrap 12列
      element ui 栅格 24-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="14">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username" width="80px"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 如果是布尔值，显示不出来的 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="change(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteByUserId(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- size-change 设置每一页条数
      current-change 设置当前是第几页
      page-sizes 这个是一个显示列表，可以让设置每一页条数是几条
      page-size 当前页的数据条数
      layout-->
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

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="提示" :visible.sync="roleDialogVisible" width="50%">
      <p>用户名：{{userInfo.username}}</p>
      <p>当前的角色：{{userInfo.role_name}}</p>
      <p>
        切换新的角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    //校验邮箱的规则
    var checkEmail = (rule, value, callback) => {
      var regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!regEmail.test(value)) {
        return callback(new Error("邮箱不合法"));
      }
      callback();
    };

    var checkMobile = (rule, value, callback) => {
      var regMobile = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!regMobile.test(value)) {
        return callback(new Error("手机不合法"));
      }
      callback();
    };
    return {
      queryInfo: {
        query: "", //查询关键字
        pagenum: 1, //当前第几页
        pagesize: 2 //每一页数据条数
      },
      userslist: [],
      total: 0, //数据总条数
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在3到15之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在3到15之间", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在3到15之间", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      roleDialogVisible: false, //默认角色对话框是隐藏的
      userInfo: {}, //用户的信息
      rolesList: [],//所有的角色信息
      selectedRoleId:'',//选中的角色的id值
    };
  },
  methods: {
    async getUserList() {
      // get,delete this.$http.post('url',{params:数据对象})
      // put,post this.$http.post('url',{数据})
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status != 200)
        return this.$message.error("请求列表数据失败");
      console.log(res.data);
      this.total = res.data.total;
      this.userslist = res.data.users;
    },
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async change(info) {
      const { data: res } = await this.$http.put(
        `users/${info.id}/state/${info.mg_state}`
      );
      console.log(res);
      if (res.meta.status != 200) return this.$message.error("修改失败");
    },
    addFormClose() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      //表单预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return console.log("表单校验失败");
        console.log("表单校验成功");
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) return this.$message.error("添加失败");
        this.getUserList();
        this.addDialogVisible = false;
      });
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status != 200)
        return this.$message.error("获取用户信息失败");
      this.editForm = res.data;
      this.editDialogVisible = true; //让编辑对话框显示
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() {
      //预校验 --> ajax
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return console.log("验证失败");
        // console.log('验证通过')
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status != 200) return this.$message.error("修改失败");
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    deleteByUserId(id) {
      // console.log(id)
      this.$confirm("此操作将删除当前用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`);
          if (res.meta.status != 200) return this.$message.error("修改失败");
          this.$message.success("删除成功");
          this.queryInfo.pagenum = 1; //解决一个删除最后一页的小bug
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async setRole(userInfo) {
      console.log(userInfo);
      this.roleDialogVisible = true;
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
    },
    async saveRole(){
      if(this.selectedRoleId == ''){
        //说明用户没有选择角色
        return this.$message.error('请选择角色')
      }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status != 200)return this.$message.error('修改角色失败')
      this.getUserList()
      this.roleDialogVisible = false
      this.selectedRoleId = ''//重置选择器
      this.userInfo = {}
    }
  }
};

// 404 url地址写错
</script>
<style scoped lang="less">
</style>
