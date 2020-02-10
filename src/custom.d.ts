type RecordItem = {
  tags: string[];
  notes: string;
  type: string;
  amount: number;
  createAt?: Date; // TS 还可以写类(构造函数)
};