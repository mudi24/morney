type RecordItem = {
  tags: string[];
  notes: string;
  type: string;
  amount: number;
  createAt?: Date; // TS 还可以写类(构造函数)
};
type Tag = {
  id: string,
  name: string
}
type TagListModel = {
  data: Tag[]
  fetch: () => Tag[]
  create: (name: string) => 'success' | 'duplicated' | 'label cannot be empty'  // 联合类型
  update: (id: string, name: string) => 'success' | 'duplicated' | 'not found'
  save: () => void
  remove: (id: string) => boolean
}

interface Window {

}