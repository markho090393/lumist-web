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
  return items
    .filter(isMenuRoute)
    .map((r) => {
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

    // 叶子：仅展开父级；非叶子：自身也展开
    const groupChain = isLeaf ? absChain.slice(0, -1) : absChain
    openKeys.value = groupChain.map(toGroupKey)

    selectedKeys.value = isLeaf ? [toLeafKey(currentPath)] : []
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
