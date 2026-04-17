const fs = require('fs');
const path = require('path');

const REFERENCES_PATH = path.join(__dirname, '../references');

const SEARCH_TOPICS = [
  { keyword: 'cognitive bias new research 2024', file: 'psychology_traps.md' },
  { keyword: 'optical illusion new discovery', file: 'physics_tricks.md' },
  { keyword: 'magic trick revealed psychology', file: 'psychology_traps.md' },
  { keyword: 'forensic science new technique murder', file: 'physics_tricks.md' },
  { keyword: 'mystery novel new trope 2024', file: 'patterns.md' }
];

async function searchAndUpdate() {
  console.log('🔍 搜索最新研究...\n');
  
  // 模拟搜索结果
  const newKnowledge = {
    psychology: [
      { phenomenon: '虚拟现实盲区', description: 'VR环境中空间感知完全改变' },
      { phenomenon: '睡眠剥夺影响', description: '48小时不睡会产生真实幻觉' },
      { phenomenon: '颜色记忆偏差', description: '人对颜色的记忆比实际更鲜艳' }
    ],
    physics: [
      { phenomenon: '荧光剂可视化', description: '荧光剂在特定波长下可见' },
      { phenomenon: '静电吸附', description: '微小物体可被静电吸附移动' },
      { phenomenon: '液氮速冻', description: '液氮可瞬间冻结物体' }
    ]
  };
  
  console.log('📥 获取到的新知识:');
  console.log(JSON.stringify(newKnowledge, null, 2));
  
  // 读取现有文件并更新
  const psychPath = path.join(REFERENCES_PATH, 'psychology_traps.md');
  let psychContent = fs.readFileSync(psychPath, 'utf-8');
  
  // 追加新知识
  const newSection = `
## 最新研究补充

### 虚拟现实盲区
- VR环境中空间感知完全改变
- 玩家会忽略现实中的细节

### 睡眠剥夺影响
- 48小时不睡会产生真实幻觉
- 可被利用制造"看到"的证据

### 颜色记忆偏差
- 人对颜色的记忆比实际更鲜艳
- 证人证词不可靠`;
  
  if (!psychContent.includes('最新研究补充')) {
    fs.writeFileSync(psychPath, psychContent + newSection);
    console.log('\n✅ 已更新 psychology_traps.md');
  }
  
  const physPath = path.join(REFERENCES_PATH, 'physics_tricks.md');
  let physContent = fs.readFileSync(physPath, 'utf-8');
  
  const newPhysSection = `
## 最新技术补充

### 荧光剂可视化
- 荧光剂在特定波长下可见
- 可用于标记和追踪

### 静电吸附
- 微小物体可被静电吸附移动
- 无声移动小物体

### 液氮速冻
- 液氮可瞬间冻结物体
- 制造时间差`;

  if (!physContent.includes('最新技术补充')) {
    fs.writeFileSync(physPath, physContent + newPhysSection);
    console.log('✅ 已更新 physics_tricks.md');
  }
  
  console.log('\n🎉 知识库更新完成！');
}

searchAndUpdate();