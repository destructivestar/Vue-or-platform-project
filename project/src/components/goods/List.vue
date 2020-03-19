<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="searchGoods"/>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="goAddPage">添加商品</el-button>
          </el-col>
        </el-row>
        <!--表格渲染区-->
        <el-table border stripe :data="goodsList">
          <el-table-column label="#" type="index"/>
          <el-table-column label="商品名称" prop="goodsName"/>
          <el-table-column label="商品价格(元)" prop="goodsPrice" width="120px"/>
          <el-table-column label="创建时间" prop="addTime" width="200px" >
            <template slot-scope="scope">
              <!-- |: 过滤器的用法, 前面传的是参数，后面是处理函数,并且返回处理后的数据 -->
              {{scope.row.addTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220px" >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goodsId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页区-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" background>
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 5
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods/list', { params: this.queryInfo })
      if (res.code !== '000000') {
        return this.$message.error('获取失败')
      }
      // this.$message.success('获取成功')
      this.goodsList = res.data.records
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getGoodsList()
    },
    searchGoods () {
      this.getGoodsList()
    },
    async removeById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除已取消')
      }
      // 为了保存数据先不删除
      const { data: res } = await this.$http.delete(`goods/drop/${id}`)
      if (res.code !== '000000') {
        return this.$message.error('删除失败')
      }
      this.getGoodsList()
      console.log(confirmResult)
    },
    goAddPage () {
      this.$router.push('goods/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
