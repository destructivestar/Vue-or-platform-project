<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--搜索与添加区域-->
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>

export default {
  data () {
    return {
      queryInfo: {
        keyword: '',
        pageNum: 1,
        pageSize: 2
      },
      userList: [],
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users/list', { params: this.queryInfo })
      if (res.code !== '000000') {
        return this.$message.error('用户列表获取失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
