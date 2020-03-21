<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card class="box-card">
        <el-row>
          <el-col :span='8'>
            <!--搜索框-->
            <el-input placeholder="请输入内容" v-model='queryInfo.query'>
              <el-button slot="append" icon="el-icon-search" @click="getOrderList"/>
            </el-input>
          </el-col>
        </el-row>
        <!--table列表数据-->
        <el-table :data="orderList" border stripe>
          <el-table-column type="index" label="#" />
          <el-table-column label="订单编号" prop="orderNumber" />
          <el-table-column label="订单价格" prop="orderPrice" >
            <template slot-scope="scope">
              <div style="color: orangered; font-size: 16px;">
                ${{scope.row.orderPrice}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="是否付款" prop="payStatus" >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.payStatus==='1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="isSend" />
          <el-table-column label="下单时间" prop="createTime" >
            <template slot-scope="scope">
              {{scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template >
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox" />
              <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox" />
            </template>
          </el-table-column>
        </el-table>
        <!--分页区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!--修改地址对话框-->
      <el-dialog
        class="dialog-address"
        title="修改地址"
        :visible.sync="addressDialogVisible"
        width="50%" @closed="addressSelectClosed">
        <el-form ref="editAddressRef"
                 :model="addressForm"
                 :rules="addressFormRules"
                 label-width="100px" >
          <el-form-item label="省/市/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="citydata"
              :props="{ expandTrigger: 'hover' }"
            />
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </span>
      </el-dialog>
      <!--物流进度对话框-->
      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="50%">
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(activity, index) in progress"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>
</template>

<script>

import citydata from './citydata'
import express from './express'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省/市/区/县', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ]
      },
      // 省市区县
      citydata,
      // 物流测试数据
      progress: [],
      progressDialogVisible: false
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList () {
      const { data: res } = await this.$http.get('/orders', { params: this.queryInfo })
      if (res.code !== '200') return this.$message.error('获取失败')
      this.total = res.data.total
      this.orderList = res.data.records
      // console.log(this.orderList)
      this.$message.success('获取成功')
    },
    // 页长切换功能
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getOrderList()
    },
    // 当前页切换
    handleCurrentChange (current) {
      this.queryInfo.pagenum = current
      this.getOrderList()
    },
    // 修改对话框
    showBox () {
      this.addressDialogVisible = true
    },
    // 确认修改后的操作
    confirmEdit () {
      // .... //
      this.addressDialogVisible = false
    },
    // 级联选择器关闭事件,清空表单
    addressSelectClosed () {
      this.$refs.editAddressRef.resetFields()
    },
    // 物流对话框
    showProgressBox () {
      this.progress = express[0].data
      // console.log(this.progress)
      this.progressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
  .el-cascader{
    width: 100%;
  }
</style>
