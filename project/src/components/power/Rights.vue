<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="权限名称" prop="psName"></el-table-column>
          <el-table-column label="权限路径" prop="psC"></el-table-column>
          <el-table-column label="权限等级" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.psLevel === '0'">一级</el-tag>
              <el-tag v-else-if="scope.row.psLevel === '1'" type="success">二级</el-tag>
              <el-tag v-else-if="scope.row.psLevel === '2'" type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('power/list')
      if (res.code !== '000000') {
        this.$message.error('获取失败')
      }
      this.$message.success('获取成功')
      this.rightsList = res.data
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
