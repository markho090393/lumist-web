import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
import { routes as appRoutes } from '@/routers'

export type MenuNode = {
  path: string
  title: string
  icon?: string
  children?: MenuNode[]
}

const normalizePath = (parent: string, child: string) => {
  if (child.startsWith('/')) return child
  if (parent === '/') return `/${child}`
  return `${parent.replace(/\/$/, '')}/${child}`
}

const isMenuRoute = (r: RouteRecordRaw) => Boolean((r.meta as any)?.isMenu)

const buildMenu = (items: RouteRecordRaw[], parentPath = '/'): MenuNode[] => {
  return items.filter(isMenuRoute).map((r) => {
    const path = normalizePath(parentPath, r.path)
    const node: MenuNode = {
      path,
      title: ((r.meta as any)?.title as string) || (r.name as string) || path,
      icon: ((r.meta as any)?.icon as string) || undefined,
    }
    if (r.children && r.children.length) {
      const children = buildMenu(r.children, path)
      if (children.length) node.children = children
    }
    return node
  })
}

export function useMenu() {
  const router = useRouter()
  const route = useRoute()

  const rootChildren = computed(() => appRoutes.find((r) => r.path === '/')?.children ?? [])
  const menuTree = computed<MenuNode[]>(() => buildMenu(rootChildren.value))

  const openKeys = ref<string[]>([])
  const selectedKeys = ref<string[]>([])

  const allLeafKeys = computed<string[]>(() => {
    const res: string[] = []
    const walk = (nodes: MenuNode[]) => {
      nodes.forEach((n) => {
        if (n.children && n.children.length) walk(n.children)
        else res.push(n.path)
      })
    }
    walk(menuTree.value)
    return res
  })

  // 仅包含在菜单中作为分组存在的路径
  const allGroupKeys = computed<string[]>(() => {
    const res: string[] = []
    const walk = (nodes: MenuNode[]) => {
      nodes.forEach((n) => {
        if (n.children && n.children.length) {
          res.push(n.path)
          walk(n.children)
        }
      })
    }
    walk(menuTree.value)
    return res
  })

  const updateMenuState = () => {
    // 将 matched 记录转为绝对路径链（排除根 '/')
    const absChain: string[] = []
    let acc = ''
    route.matched.forEach((rec) => {
      const p = rec.path || ''
      acc = normalizePath(acc || '/', p)
      if (acc !== '/') absChain.push(acc)
    })

    const currentPath = route.path
    const isLeaf = allLeafKeys.value.includes(currentPath)

    const toLeafKey = (p: string) => `leaf:${p}`
    const toGroupKey = (p: string) => `group:${p}`

    // 仅展开真正存在的分组
    const groupChain = (isLeaf ? absChain.slice(0, -1) : absChain).filter((p) =>
      allGroupKeys.value.includes(p),
    )
    openKeys.value = groupChain.map(toGroupKey)

    // 子路由时，选择离当前最近的叶子（用于 /home/word-training 选中 /home）
    if (isLeaf) {
      selectedKeys.value = [toLeafKey(currentPath)]
    } else {
      // 1) 优先使用 matched 链中的最近叶子
      let nearest = [...absChain].reverse().find((p) => allLeafKeys.value.includes(p))

      // 2) 其次回退到路径前缀中最近的叶子（如 /home/word-training -> /home）
      if (!nearest) {
        const segments = route.path.split('/').filter(Boolean)
        const prefixes: string[] = []
        let acc = ''
        for (const seg of segments) {
          acc += '/' + seg
          prefixes.push(acc)
        }
        nearest = prefixes.reverse().find((p) => allLeafKeys.value.includes(p))
      }

      // 3) 最后如果路由定义提供了显式菜单激活路径，则按之选中
      if (!nearest) {
        const forced = ((route.meta as any)?.menuActivePath as string) || ''
        if (forced && allLeafKeys.value.includes(forced)) nearest = forced
      }

      selectedKeys.value = nearest ? [toLeafKey(nearest)] : []
    }
  }

  watch(() => route.fullPath, updateMenuState, { immediate: true })

  const onMenuItemClick = (key: string) => {
    // 只处理叶子项：key 形如 'leaf:/home'
    const m = key.match(/^leaf:(.+)$/)
    const path = m ? m[1] : ''
    if (path && path !== route.path) router.push(path)
  }

  return {
    menuTree,
    openKeys,
    selectedKeys,
    onMenuItemClick,
  }
}
