import recordStore from '@/store/recordStore'
import tagStore from '@/store/tagStore'

// 全局变量太多
// 严重依赖window
const store = {
  ...recordStore,
  ...tagStore

}

export default store