<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--提示信息-->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon>
      </el-alert>
      <!--进度条-->
      <!--js中字符串- 0等同于字符串转数字操作-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"/>
        <el-step title="商品参数"/>
        <el-step title="商品属性"/>
        <el-step title="商品图片"/>
        <el-step title="商品内容"/>
        <el-step title="完成"/>
      </el-steps>
      <!--tab栏区域-->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px"
               label-position="top"
               >
        <el-tabs tab-position="left"
                 v-model="activeIndex"
                 :before-leave="beforeTabLeave"
                 @tab-click="tabClicked"
                 >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="addForm.goodsName" />
            </el-form-item>
            <el-form-item label="商品价格" prop="goodsPrice">
              <el-input v-model="addForm.goodsPrice" type="number"/>
            </el-form-item>
            <el-form-item label="商品重量" prop="goodsWeight">
              <el-input v-model="addForm.goodsWeight" type="number"/>
            </el-form-item>
            <el-form-item label="商品数量" prop="goodsNumber">
              <el-input v-model="addForm.goodsNumber" type="number"/>
            </el-form-item>
            <el-form-item label="商品分类" prop="goodsCat">
              <el-cascader
                v-model="addForm.goodsCat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单的item项-->
            <el-form-item :label="item.attrName" :key="item.attrId" v-for="item in manyTabData">
              <el-checkbox-group v-model="item.attrVals">
                <el-checkbox :label="cb" :key="i" v-for="(cb, i) in item.attrVals" border/>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attrName" :key="item.attrId" v-for="item in onlyTabData">
              <el-input v-model="item.attrVals"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              name="image"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goodsIntroduce"
                          ref="myQuillEditorRef"
                          >
            </quill-editor>
            <!--商品添加的按钮-->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--图片预览对话框-->
    <el-dialog
      title="提示"
      :visible.sync="imgDialogVisible"
      width="50%"
     >
      <img :src="previewUrl" alt="图片丢失" class="preview-image"/>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      addForm: {
        goodsName: '',
        goodsPrice: '',
        goodsWeight: '',
        goodsNumber: '',
        goodsCat: [],
        pics: [],
        // 富文本编辑内容
        goodsIntroduce: ''
      },
      // 校验规则
      addFormRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个数字', trigger: 'blur' }
        ],
        goodsWeight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个数字', trigger: 'blur' }
        ],
        goodsNumber: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个数字', trigger: 'blur' }
        ],
        goodsCat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个数字', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        value: 'catId',
        label: 'catName',
        children: 'categoryRes',
        expandTrigger: 'hover'
      },
      // 动态参数数据，many
      manyTabData: [],
      // 动态参数数据，many
      onlyTabData: [],
      // 上传图片地址
      uploadURL: 'http://localhost:8090/goods/uploadImg',
      // 图片预览对话框
      imgDialogVisible: false,
      // 预览图片路径
      previewUrl: ''
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId () {
      if (this.addForm.goodsCat.length === 3) {
        return this.addForm.goodsCat[2]
      } return null
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('/cate/tree/list')
      this.cateList = res.data
      this.cateList = this.getTreeData(res.data)
      console.log(this.cateList)
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
    // 级联选择框切换触发
    handleChange () {
      if (this.addForm.goodsCat.length !== 3) {
        this.addForm.goodsCat = []
      }
      console.log(this.addForm.goodsCat)
    },
    // 切换之前的校验  将要切换过去的标签栏:ActiveName, 当前所在的标签栏:oldActiveName
    beforeTabLeave (ActiveName, oldActiveName) {
      console.log(oldActiveName + ' ' + ActiveName)
      if (oldActiveName === '0' && this.addForm.goodsCat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked () {
      console.log(this.cateId)
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get('/categories/params', { params: { catId: this.cateId, attrSel: 'many' } })
        if (res.code !== '000000') {
          return this.$message.error('参数获取失败')
        }
        res.data.forEach(item => {
          item.attrVals = item.attrVals.length === 0 ? [] : item.attrVals.split(' ')
        })
        this.manyTabData = res.data
        // console.log(res)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get('/categories/params', { params: { catId: this.cateId, attrSel: 'only' } })
        if (res.code !== '000000') {
          return this.$message.error('参数获取失败')
        }
        this.onlyTabData = res.data
        console.log(this.onlyTabData)
      }
    },
    // 点击图片名称有预览效果的函数
    handlePreview (response) {
      console.log(response)
      this.previewUrl = response.url
      this.imgDialogVisible = true
    },
    // 图片移除的函数
    handleRemove (filename) {
      const i = this.addForm.pics.findIndex(x => x.name === filename)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 成功回调函数
    handleSuccess (response) {
      const path = { pics: response.data.name }
      this.addForm.pics.push(path)
      console.log(this.addForm)
    },
    // 最终的添加商品
    add () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
      })
      // 形成form对象分离
      const form = _.cloneDeep(this.addForm)
      this.addForm.goodsCat = form.join(',')
      console.log(this.addForm)

      // 动态参数
      this.manyTabData.forEach(item => {
        const newInfo = {
          attrId: item.attrId,
          attrVals: item.attrVals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      // 静态属性
      this.onlyTabData.forEach(item => {
        const newInfo = {
          attrId: item.attrId,
          attrVals: item.attrVals
        }
        this.addForm.attrs.push(newInfo)
      })
      form.attrs = this.addForm.attrs
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  /*规则为 上:0 , 右:5 , 下:0 , 左:0 , 强置样式:!important*/
  margin: 0 5px 0 0 !important;
}
.preview-image{
  width: 100%;
}
.btnAdd {
  margin-top: 10px;
}
</style>
