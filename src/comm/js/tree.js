const exampleLineData = {
  left: [{
    tableIdName: '表1', // 表的名字
    tableId: 'table1', // 表的ID
    tableChunk: [ // 表的分块列表
      {
        ChunkId: 'chunk1-1', // 分块集合的id
        ChunkName: 'chunk1-1', // 分块集合的名字
        relationChunkId: ['chunk2-2', 'chunk3-2'], // 与分块相关联的分块Id,
        ChunkList: [ // 分块内容
          {
            columnId: 'column1-1',
            columnName: '字段1-1'
          }
        ]
      },
      {
        ChunkId: 'chunk1-2',
        ChunkName: 'chunk1-2',
        relationChunkId: ['chunk2-1', 'chunk3-1'],
        ChunkList: [
          {
            columnId: 'column1-2',
            columnName: '字段1-2'
          },
          {
            columnId: 'column1-3',
            columnName: '字段1-3'
          }
        ]
      }
    ]
  }],
  middle: [
    {
      tableIdName: '表2',
      tableId: 'table2',
      tableChunk: [
        {
          ChunkId: 'chunk2-1',
          ChunkName: 'chunk2-1',
          relationChunkId: ['chunk1-2', 'chunk3-1'],
          ChunkList: [
            {
              columnId: 'column2-1',
              columnName: '字段2-1'
            }
          ]
        },
        {
          ChunkId: 'chunk2-2',
          ChunkName: 'chunk2-2',
          relationChunkId: ['chunk1-1', 'chunk3-1'],
          ChunkList: [
            {
              columnId: 'column2-2',
              columnName: '字段2-2'
            },
            {
              columnId: 'column2-3',
              columnName: '字段2-3'
            }
          ]
        }
      ]
    }],
  right: [{
    tableIdName: '表3',
    tableId: 'table3',
    tableChunk: [
      {
        ChunkId: 'chunk3-1',
        ChunkName: 'chunk3-1',
        relationChunkId: ['chunk1-2', "chunk2-1"],
        ChunkList: [
          {
            columnId: 'column3-1',
            columnName: '字段3-1'
          }
        ]
      },
      {
        ChunkId: 'chunk3-2',
        ChunkName: 'chunk3-2',
        relationChunkId: ['chunk1-1'],
        ChunkList: [
          {
            columnId: 'column3-2',
            columnName: '字段3-2'
          },
          {
            columnId: 'column3-3',
            columnName: '字段3-3'
          }
        ]
      }
    ]
  }]
}

export default exampleLineData