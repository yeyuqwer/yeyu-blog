export type ScrollContainerSnapshot = {
  clientHeight: number
  layoutVersion: number
  scrollHeight: number
  scrollTop: number
}

type ScrollContainerStore = {
  container: HTMLElement
  frameId: number | null
  handleScroll: (() => void) | null
  hasPendingLayoutChange: boolean
  listeners: Set<(snapshot: ScrollContainerSnapshot) => void>
  resizeObserver: ResizeObserver | null
  snapshot: ScrollContainerSnapshot
}

const scrollContainerStores = new WeakMap<HTMLElement, ScrollContainerStore>()

function updateStore(store: ScrollContainerStore, hasLayoutChange: boolean) {
  const { container, snapshot } = store
  const scrollTop = Math.max(container.scrollTop, 0)

  if (!hasLayoutChange && snapshot.scrollTop === scrollTop) return

  store.snapshot = {
    clientHeight: hasLayoutChange ? container.clientHeight : snapshot.clientHeight,
    layoutVersion: snapshot.layoutVersion + (hasLayoutChange ? 1 : 0),
    scrollHeight: hasLayoutChange ? container.scrollHeight : snapshot.scrollHeight,
    scrollTop,
  }

  for (const listener of store.listeners) listener(store.snapshot)
}

function scheduleStoreUpdate(store: ScrollContainerStore, hasLayoutChange = false) {
  if (hasLayoutChange) store.hasPendingLayoutChange = true
  if (store.frameId != null) return

  store.frameId = requestAnimationFrame(() => {
    const shouldUpdateLayoutVersion = store.hasPendingLayoutChange

    store.frameId = null
    store.hasPendingLayoutChange = false
    updateStore(store, shouldUpdateLayoutVersion)
  })
}

function getStore(container: HTMLElement) {
  const existingStore = scrollContainerStores.get(container)
  if (existingStore != null) return existingStore

  const store: ScrollContainerStore = {
    container,
    frameId: null,
    handleScroll: null,
    hasPendingLayoutChange: false,
    listeners: new Set(),
    resizeObserver: null,
    snapshot: {
      clientHeight: container.clientHeight,
      layoutVersion: 0,
      scrollHeight: container.scrollHeight,
      scrollTop: Math.max(container.scrollTop, 0),
    },
  }

  scrollContainerStores.set(container, store)
  return store
}

export function subscribeScrollContainer(
  container: HTMLElement,
  listener: (snapshot: ScrollContainerSnapshot) => void,
) {
  const store = getStore(container)
  store.listeners.add(listener)

  if (store.listeners.size === 1) {
    const handleScroll = () => scheduleStoreUpdate(store)
    const resizeObserver = new ResizeObserver(() => scheduleStoreUpdate(store, true))
    const scrollContent = container.firstElementChild

    store.handleScroll = handleScroll
    store.resizeObserver = resizeObserver
    container.addEventListener('scroll', handleScroll, { passive: true })
    resizeObserver.observe(container)
    if (scrollContent instanceof HTMLElement) {
      resizeObserver.observe(scrollContent, { box: 'border-box' })
    }
    updateStore(store, true)
  } else {
    listener(store.snapshot)
  }

  return () => {
    store.listeners.delete(listener)

    if (store.listeners.size > 0) return

    if (store.handleScroll != null) {
      container.removeEventListener('scroll', store.handleScroll)
      store.handleScroll = null
    }
    store.resizeObserver?.disconnect()
    store.resizeObserver = null
    if (store.frameId != null) cancelAnimationFrame(store.frameId)
    store.frameId = null
    store.hasPendingLayoutChange = false
  }
}
