<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!--面包屑导航-->
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--搜索与添加区域-->
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible">添加用户</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!--表单区-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column prop="username" label="姓名" ></el-table-column>
        <el-table-column prop="userSex" label="性别" ></el-table-column>
        <el-table-column prop="userEmail" label="邮箱" ></el-table-column>
        <el-table-column prop="userTel" label="电话" ></el-table-column>
        <el-table-column prop="userRoleName" label="角色" ></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="changeState(scope.row)"
              v-model="scope.row.activeStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.userId)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.userId)"></el-button>
            <!--角色分配按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1,2, 4, 8, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--添加用户对话框-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="45%" @close="addDialogClosed">
        <!--内容主体-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="userSex">
            <el-select v-model="addForm.userSex" placeholder="请选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input v-model="addForm.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="qq" prop="userQq">
            <el-input v-model="addForm.userQq"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="userTel">
            <el-input v-model="addForm.userTel"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改用户对话框-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
      @close="editDialogClosed">
          <el-form ref="editFormRef" :model="editForm" label-width="70px" :rules="editFormRules">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled="disabled"></el-input>
            </el-form-item>
            <!--prop中的绑定属性名必须要和editForm中的一致否则无法验证-->
            <el-form-item label="qq" prop="userQq">
              <el-input v-model="editForm.userQq"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="editForm.userEmail"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="userTel">
              <el-input v-model="editForm.userTel"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
      </el-dialog>
      <!--分配角色对话框-->
      <el-dialog
        title="提示"
        :visible.sync="setDialogVisible"
        width="40%" @close="setDialogVisibleClosed">
        <div>
          <p>当前用户: {{userInfo.username}}</p>
          <p>当前角色: {{userInfo.userRoleName}}</p>
        </div>
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>

export default {
  data () {
    // 校验邮箱 ---自定义校验规则
    let checkEmail = (rule, value, callback) => {
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (emailReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    // 校验qq
    let checkQq = (rule, value, callback) => {
      const qqReg = /^[1-9]\d{4,8}$/
      if (qqReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的qq号'))
    }
    // 校验密码格式
    let checkPassword = (rule, value, callback) => {
      const passwordReg = /^[a-zA-Z]\w{5,17}$/
      if (passwordReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入以字母开头，长度在6-18之间，只能包含字符、数字和下划线'))
    }
    // 校验手机号
    let checkTel = (rule, value, callback) => {
      // 手机号正则
      const phoneReg = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/
      if (phoneReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      queryInfo: {
        keyword: '',
        // 当前页
        pageNum: 1,
        // 每页总条数
        pageSize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        userSex: '',
        userEmail: '',
        userQq: '',
        userTel: ''
      },
      // 添加用户校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '请输入3-5个字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        userSex: [
          { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
        ],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        userQq: [
          { required: true, message: '请输入qq', trigger: 'blur' },
          { validator: checkQq, trigger: 'blur' }
        ],
        userTel: [
          { required: true, message: '请输入电话号', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
      },
      // 编辑用户校验规则
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        userQq: [
          { required: true, message: '请输入qq', trigger: 'blur' },
          { validator: checkQq, trigger: 'blur' }],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        userTel: [
          { required: true, message: '请输入电话号', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }]
      },
      // 分配角色对话框的显示与隐藏
      setDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectRoleId: ''
    }
  },
  // 初始化
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('/users/list', { params: this.queryInfo })
      if (res.code !== '000000') {
        return this.$message.error('用户列表获取失败')
      }
      this.userList = res.data.records
      this.total = res.data.total
    },
    // 页长
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 切换当前页
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    // 修改状态
    changeState (userObj) {
      this.$http.put(`users/update/id/${userObj.userId}/state/${userObj.activeStatus}`)
    },
    // 对话框可视标识
    dialogVisible () {
      this.addDialogVisible = true
    },
    // 重置添加用户对话框
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users/add', this.addForm)
        if (res.code !== '000000') {
          this.$message.error('添加用户失败')
        }
        this.$message.success(res.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 修改用户
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/user/' + id)
      this.editForm = res.data
      // console.log(this.editForm.username)
    },
    // 重置编辑
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        let user = { 'userTel': this.editForm.userTel, 'userQq': this.editForm.userQq, 'userEmail': this.editForm.userEmail }
        const { data: res } = await this.$http.put('users/edit/' + this.editForm.userId, user)
        if (res.code !== '000000') {
          this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 删除用户
    async removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除已取消')
      }
      const { data: res } = await this.$http.delete(`users/delete/${id}`)
      if (res.code !== '000000') {
        return this.$message.success('删除失败')
      }
      this.$message.success('该用户已删除')
      this.getUserList()
    },
    // 展开分配权限对话框
    async setRole (userInfo) {
      this.setDialogVisible = !this.setDialogVisible
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('power/roles')
      this.roleList = res.data
    },
    async saveRoleInfo () {
      if (!this.selectRoleId) {
        this.setDialogVisible = false
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/setRole/${this.userInfo.userId}/${this.selectRoleId}`)
      if (res.code !== '000000') {
        return this.$message.warning('没有分配或分配失败')
      }
      this.$message.success('分配角色成功')
      this.setDialogVisible = false
      this.getUserList()
    },
    setDialogVisibleClosed () {
      this.selectRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
