<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区-->
      <el-card>
        <el-row>
          <!--添加按钮区-->
          <el-col>
            <el-button type="primary" @click="addCateDialog">添加分类</el-button>
          </el-col>
        </el-row>
        <!--表格-->
        <tree-table
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          children-prop="categoryRes"
          border>
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.catDeleted === false" style="color: lightgreen;"/>
            <i class="el-icon-error" v-else style="color: red;"/>
          </template>
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.catLevel===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.catLevel===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <template slot="operation" >
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </tree-table>
        <!--分页区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[2, 4, 8, 10]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <!--添加分类对话框-->
        <el-dialog
          title="提示"
          :visible.sync="addCateDialogVisible"
          width="45%"
          ref="dialogRef"
          @close="closedDialog">
          <el-form
            :model="addCateForm"
            :rules="addCateFormRules"
            ref="addCateFormRef"
            label-width="100px" >
            <!--父级分类名称-->
            <el-form-item label="分类名称" prop="catName">
              <el-input v-model="addCateForm.catName" />
            </el-form-item>
            <!--级联选择框-->
            <el-form-item label="父级分类" >
              <el-cascader
                clearable
                :options="parentCateList"
                :props="cascaderProps"
                v-model="selectKeys"
                @change="parentCateChanged">
              </el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 8
      },
      cateList: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'catName'
      },
      {
        label: '是否有效',
        // 将这一列定义为模板
        type: 'template',
        // 当前这一列的模板名称
        template: 'isok'
      }, {
        label: '排序',
        // 将这一列定义为模板
        type: 'template',
        // 当前这一列的模板名称
        template: 'order'
      }, {
        label: '操作',
        // 将这一列定义为模板
        type: 'template',
        // 当前这一列的模板名称
        template: 'operation'
      }],
      addCateDialogVisible: false,
      addCateForm: {
        catName: '',
        catPid: 0,
        catLevel: 0
      },
      addCateFormRules: {
        catName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ] },
      parentCateList: [],
      cascaderProps: {
        value: 'catId',
        label: 'catName',
        children: 'categoryRes',
        expandTrigger: 'click',
        checkStrictly: true
      },
      selectKeys: []
    }
  },
  mounted () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('cate/tree', { params: this.queryInfo })
      if (res.code !== '000000') {
        return this.$message.warning('查询失败')
      }
      // this.$message.success('查询成功')
      this.cateList = res.data.records
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getCateList()
    },
    async addCateDialog () {
      this.addCateDialogVisible = true
      const { data: res } = await this.$http.get('cate/list')
      if (res.code !== '000000') {
        return this.$message.error('获取父级分类列表失败')
      }
      this.parentCateList = res.data
      // this.$message.success('获取父级分类列表成功')
    },
    // 级联选择框的触发事件
    parentCateChanged () {
      if (this.selectKeys.length > 0) {
        this.addCateForm.catPid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.catLevel = this.selectKeys.length
        return 0
      } else {
        this.addCateForm.catPid = 0
        this.addCateForm.catLevel = 0
      }
    },
    async addCate () {
      console.log(this.addCateForm)
      const { data: res } = await this.$http.post('/cate/add', this.addCateForm)
      if (res.code !== '000000') {
        return this.$message.error('添加失败')
      }
      this.getCateList()
      this.$message.success('添加成功')
      this.addCateDialogVisible = false
    },
    closedDialog () {
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.catPid = 0
      this.addCateForm.catLevel = 0
      this.selectKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table{
  margin-top: 10px;
}
.el-cascader{
  width: 100%;
}

</style>
