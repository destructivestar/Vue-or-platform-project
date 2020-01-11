<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card class="box-card">
        <!--警告提示框-->
        <el-alert title="注意: 只允许为第三级分类设置相关参数!" show-icon type="warning">
        </el-alert>
      <!--选择商品分类区,级联选择框-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            class="el_cascader"
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="cateChange"/>
        </el-col>
      </el-row>
      <!--页签区域-->
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand"/>
            <!--索引列-->
            <el-table-column label="#" type="index"/>
            <!--动态参数-->
            <el-table-column label="参数名称" prop="attrName"/>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attrId)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand"/>
            <!--索引列-->
            <el-table-column label="#" type="index"/>
            <!--静态属性-->
            <el-table-column label="属性名称" prop="attrName"/>
            <el-table-column label="操作">
              <template >
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      </el-card>
      <!--添加属性/参数对话框-->
      <el-dialog
        @close="addDialogClosed"
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="45%"
      >
        <el-form :model="addDataForm" :rules="addDataFormRules" ref="addDataFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="dataName">
            <el-input v-model="addDataForm.dataName"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改对话框-->
      <el-dialog
        @close="editDialogClosed"
        :title="'添加' + titleText"
        :visible.sync="editDialogVisible"
        width="45%"
      >
        <el-form :model="editDataForm" :rules="editDataFormRules" ref="editDataFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="editName">
            <el-input v-model="editDataForm.editName"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 三级分类数据树形列表
      cateList: [],
      // 分类数据级联对象
      cateProps: {
        value: 'catId',
        label: 'catName',
        children: 'categoryRes',
        expandTrigger: 'hover'
      },
      selectedKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 对话框的显示与隐藏
      addDialogVisible: false,
      // 添加数据对象
      addDataForm: {
        dataName: ''
      },
      // 校验数据对象
      addDataFormRules: {
        dataName: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 修改数据对象
      editDataForm: {
        editName: ''
      },
      // 修改数据校验
      editDataFormRules: {
        editName: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 修改数据对话框的显示与隐藏
      editDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  // 运算 实时监控选中框的状态
  computed: {
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 选中当前分类的三级id
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 动态获取对话框的标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } return '静态属性'
    }
  },
  methods: {
    // 获取级联选择框的数据
    async getCateList () {
      const { data: res } = await this.$http.get('cate/tree/list')
      if (res.code !== '000000') {
        return this.$message.error('获取列表失败')
      }
      this.cateList = this.getTreeData(res.data)
      // console.log(this.cateList)
    },
    // 递归方法去除空值
    getTreeData (data) {
      // 循环遍历json数据
      for (let i = 0; i < data.length; i++) {
        if (data[i].categoryRes.length < 1) {
          // children若为空数组，则将categoryRes设为undefined
          data[i].categoryRes = undefined
        } else {
          // categoryRes若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].categoryRes)
        }
      }
      return data
    },
    // 选择框改变时触发
    cateChange () {
      this.getParamsData()
    },
    // 页签点击事件
    handleTabClick () {
      this.getParamsData()
      console.log(this.activeName)
    },
    // 获取级联选择框的选中项
    async getParamsData () {
      // 如果等于3则是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return
      }
      // 根据所选id和所处面板获取分类参数
      const { data: res } = await this.$http.get('/categories/params', { params: { catId: this.cateId, attrSel: this.activeName } })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else {
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    // 添加数据
    addParams () {
      this.$refs.addDataFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/categories/add', { cateId: this.cateId, attrName: this.addDataForm.dataName, attrSel: this.activeName })
        if (res.code !== '000000') {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.getParamsData()
      })

      this.addDialogVisible = false
    },
    // 添加数据对话框的关闭事件
    addDialogClosed () {
      console.log(this.addDataForm.dataName)
      this.$refs.addDataFormRef.resetFields()
    },
    // 修改数据对话款
    async editDialog (attrId) {
      // 异步请求获取数据并回显
      const { data: res } = await this.$http.get('/categories/echo', { params: { attrId: attrId, catId: this.catId, attrSel: this.activeName } })
      this.editDataForm.editName = res.data
      this.editDialogVisible = true
    },
    // 修改数据关闭事件
    editDialogClosed () {
      this.$refs.editDataFormRef.resetFields()
    },
    // 修改操作
    editParams () {
      console.log(this.editDataForm.editName)
      console.log(this.activeName)
      console.log(this.cateId)
      // 异步请求修改参数, 待办
      // this.getCateList()
      this.editDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 2px;
}
.el_cascader{
  margin-left: 10px;
}
</style>
