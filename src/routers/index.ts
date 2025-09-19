import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        path: '',
        redirect: '/home',
      },
       {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: '首页',
          icon: 'home',
          isMenu: true,
        },
      },
      {
        path: 'my-study',
        name: 'my-study',
        component: () => import('@/views/MyStudy/index.vue'),
        meta: {
          title: '我的学习',
          icon: 'study',
          isMenu: true,
        },
      },
      // 与首页同级的隐藏页面：路径为 /home/word-training，但不作为菜单项
      {
        path: 'home/word-training',
        name: 'home-word-training',
        component: () => import('@/views/Home/WordTrainings.vue'),
        meta: {
          title: '单词训练',
          isMenu: false,
          // 指定菜单选中回退到首页
          menuActivePath: '/home',
        },
      },
      // 新增：单词筛选页（首页子路由，隐藏菜单）
      {
        path: 'home/word-select',
        name: 'home-word-select',
        component: () => import('@/views/Home/WordSelect.vue'),
        meta: {
          title: '单词筛选',
          isMenu: false,
          menuActivePath: '/home',
        },
      },
      // 新增：单词识记页（首页子路由，隐藏菜单）
      {
        path: 'home/word-memorize',
        name: 'home-word-memorize',
        component: () => import('@/views/Home/WordMemorize.vue'),
        meta: {
          title: '单词识记',
          isMenu: false,
          menuActivePath: '/home',
        },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/Profile/Profile.vue'),
        meta: {
          title: '个人中心',
          icon: 'profile',
          isMenu: true,
        },
        children: [
          {
            path: 'basic',
            name: 'profile-basic',
            component: () => import('@/views/Profile/ProfileBasic.vue'),
            meta: {
              title: '基本信息',
              icon: 'profile-basic',
              isMenu: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
  // 未匹配到的路由统一重定向到登录页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
