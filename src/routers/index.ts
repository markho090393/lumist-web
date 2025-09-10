import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

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
                    isMenu: true
                }
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/views/Profile/Profile.vue'),
                meta: {
                    title: '个人中心',
                    icon: 'profile',
                    isMenu: true
                },
                children:[
                    {
                        path: 'basic',
                        name: 'profile-basic',
                        component: () => import('@/views/Profile/ProfileBasic.vue'),
                        meta: {
                            title: '基本信息',
                            icon: 'profile-basic',
                            isMenu: true
                        }
                    }
                ]
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        component: () => import('@/views/Login.vue'),
    },
    {
        path: "/404",
        name: "404",
        component: () => import('@/views/404.vue'),
    },
    // 未匹配到的路由统一重定向到登录页
    {
        path: "/:pathMatch(.*)*",
        redirect: "/login",
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
