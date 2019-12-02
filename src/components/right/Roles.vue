<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary">添加角色</el-button>
    <el-table :data="rolesList" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row class="level_one" v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="5">
              <el-tag>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="5">
                  <el-tag type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-tag
                    closable
                    @close="removeRightsById(scope.row.id,item3.id)"
                    type="danger"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%" >
      <!-- <pre>
        {{rightsList}}
      </pre> -->
      <el-tree node-key="id" :default-checked-keys="defKeys" show-checkbox default-expand-all :data="rightsList" :props="defaultProps" ref="mytree"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allocateRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRolesList();
  },
  data() {
    return {
      rolesList: [],
      rightDialogVisible:false,//默认设置权限对话框是隐藏的
      rightsList:[],
      defaultProps:{
        children:'children',
        label:'authName'
      },
      defKeys:[],
      roleId:'',//角色id
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
    },
    removeRightsById(roleId, rightId) {
      // console.log(id)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //确定要删除的逻辑
          const { data: res } = await this.$http.delete(
            `roles/${roleId}/rights/${rightId}`
          );
          if (res.meta.status != 200)
            return this.$message.error("删除权限失败");
          this.getRolesList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async showSetDialog(role) {
      this.roleId = role.id
      // //三级权限
      // role.children.forEach(item1=>{
      //   //一级权限
      //   if(item1.children){//避免报错
      //     item1.children.forEach(item2=>{
      //       //二级权限
      //       if(item2.children){
      //         item2.children.forEach(item3=>{
      //           //三级权限
      //           keys.push(item3.id)
      //         })
      //       }
      //     })
      //   }
      // })
      // this.defKeys = keys

    var keys = []//用来收集三级权限的id值（最后一级权限的id值）

    //我们只需要收集最后一级的id值 层级不确定的情况
      function getId(obj){
        obj.children.forEach(item=>{
          //递归：自己调用自己 递归一定要有结束的条件 否则就会溢出的问题 max size
          if(item.children){
            getId(item)
          }else{
            keys.push(item.id)
          }
        })
      }

      getId(role)

      this.defKeys = keys



      const {data:res} = await this.$http.get(`rights/tree`)
      if(res.meta.status != 200)return this.$message.error('请求权限数据失败')
      this.rightsList = res.data
      this.rightDialogVisible = true
    },
    async allocateRights(){
      // console.log(this.$refs.mytree.getCheckedKeys())
      // console.log(this.$refs.mytree.getHalfCheckedKeys())
      var keys = [...this.$refs.mytree.getCheckedKeys(),...this.$refs.mytree.getHalfCheckedKeys()]
      var keysStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysStr})
      if(res.meta.status != 200)return this.$message.error('分配权限失败')
      this.getRolesList()
      this.rightDialogVisible = false
    }
  }
};
</script>
<style scoped lang="less">
.el-button {
  margin: 15px;
}
.el-tag {
  margin: 15px;
}
.level_one {
  border-bottom: 1px solid #ccc;
}
</style>



