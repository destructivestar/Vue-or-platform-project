<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!--面包屑导航-->
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card class="box-card">
        <el-row>
          <el-col>
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <el-table :data="rolesList" border stripe>
          <!--展开列-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcenter']" v-for="(item1,
              // eslint-disable-next-line vue/no-unused-vars
              i1
              ) in scope.row.children" :key="item1.id">
                <!--渲染一级-->
                <el-col :span="5">
                  <el-tag>{{item1.psName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--渲染二级-->
                <el-col :span="19">
                  <el-row :class="[i2===0 ? '':'bdtop','vcenter']" v-for="(item2,
                  // eslint-disable-next-line vue/no-unused-vars
                  i2
                  ) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success">{{item2.psName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <!--渲染三级菜单-->
                      <el-tag type="warning" v-for="(item3,
                      // eslint-disable-next-line vue/no-unused-vars
                      i3
                      ) in item2.children" :key="item3.id" closable @close="removeRightById(item3.psId,scope.row.roleId)">{{item3.psName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">搜索</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">修改权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--分配权限对话框-->
      <el-dialog
        title="提示"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="showSetRightDialogClosed">
        <!--树形控件-->
        <el-tree :data="rightTree"
                 :props="treeProps"
                 ref="treeRef"
                 show-checkbox
                 node-key="psId"
                 default-expand-all
                 :default-checked-keys="defKeys" >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      rightTree: [],
      treeProps: {
        children: 'children',
        label: 'psName'
      },
      defKeys: [],
      roleId: []
    }
  },
  mounted () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('power/tree')
      this.rolesList = res.data
    },
    // 根据Id移除角色权限
    async removeRightById (psId, roleId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // roleId: 角色Id, psId: 权限Id 一个角色对应多个权限
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      await this.$http.put(`power/removeAuth/${psId}/${roleId}`)
      this.$message.warning('已删除')
      this.getRolesList()
    },
    // 显示树形结构
    async showSetRightDialog (role) {
      this.roleId = role.roleId
      this.setRightDialogVisible = !this.setRightDialogVisible
      const { data: res } = await this.$http.get('power/role')
      if (res.code !== '000000') {
        return this.$message.error('获取权限树失败')
      }
      // this.$message.success('获取成功')
      this.rightTree = res.data
      // 递归三级节点
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 用递归的形式，获取角色下三级权限id，并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前node节点为null,表示就必然是三级节点
      if (node.children === null) {
        return arr.push(node.psId)
      }
      node.children.forEach(item =>
        this.getLeafKeys(item, arr)
      )
    },
    // 重置数组
    showSetRightDialogClosed () {
      this.defKeys = []
    },
    // 分配权限操作
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const ids = keys.join(',')
      const { data: res } = await this.$http.post(`power/AssignPermissions/${this.roleId}/${ids}`)
      if (res.code !== '000000') {
        this.$message.error('分配权限失败')
      }
      // console.log(keys)
      this.$message.success('分配权限成功')
      this.setRightDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eeeeee;
}
.bdbottom{
  border-bottom: 1px solid #eeeeee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
