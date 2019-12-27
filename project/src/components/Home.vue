<template>
  <div id="app">
    <!--头部区域-->
    <el-header>
      <div>
        <img class="header-image" src="../assets/manager.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--界面主体body-->
    <el-container class="home-container">
      <!--侧边区域-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!--下拉菜单名-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--左侧菜单-->
        <el-menu
          background-color="#323744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        :default-active="activeNavPath">
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!--菜单标题-->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.psName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.psApiPath + ''"
                          v-for="subItem in item.children"
                          :key="subItem.id" @click="saveNavState('/'+subItem.psApiPath)">
              <!--二级菜单标题-->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.psName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--中央区-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        '1': 'iconfont icon-user',
        '2': 'iconfont icon-tijikongjian',
        '3': 'iconfont icon-shangpin',
        '25': 'iconfont icon-danju',
        '45': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activeNavPath: ''
    }
  },
  mounted () {
    this.getMenus()
    this.activeNavPath = window.sessionStorage.getItem('path')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenus () {
      // eslint-disable-next-line no-unused-vars
      const { data: res } = await this.$http.get('menu/list')
      // console.log(res)
      if (res.code !== '000000') return this.$message.error(res.msg)
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (saveNavPath) {
      window.sessionStorage.setItem('path', saveNavPath)
      this.activeNavPath = saveNavPath
    }
  }
}
</script>

<style lang="less" scoped>
  .header-image{
    width: 15%;
    height: 70%;
    padding-left: 0px;
  }
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373C41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #dddddd;
    font-size: 30px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #323744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main{
    background-color: #EAEDF2;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #485164;
    font-size: 10px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
  }
</style>
