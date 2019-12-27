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
                      ) in item2.children" :key="item3.id">{{item3.psName}}</el-tag>
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
            <template >
              <el-button size="mini" type="primary" icon="el-icon-edit">搜索</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting">修改权限</el-button>
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
      rolesList: []
    }
  },
  mounted () {
    this.getRoles()
  },
  methods: {
    async getRoles () {
      const { data: res } = await this.$http.get('power/tree')
      this.rolesList = res.data
      console.log(res.data)
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
