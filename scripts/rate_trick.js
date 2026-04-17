const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/tricks.json');

function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
  }
}

function loadDB() {
  ensureDir();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function calculateScore(trick) {
  let total = 0;
  const scores = {};
  
  const criteria = ['innovation', 'logic', 'fairness', 'feasibility'];
  
  criteria.forEach(c => {
    const score = parseInt(trick[c]) || 5;
    scores[c] = score;
    total += score;
  });
  
  scores.total = total;
  return scores;
}

function addTrick(trick) {
  const db = loadDB();
  trick.id = Date.now();
  trick.createdAt = new Date().toISOString();
  trick.scores = calculateScore(trick);
  db.push(trick);
  saveDB(db);
  console.log(`✅ 已保存诡计: ${trick.name}`);
  console.log(`   创新性:${trick.scores.innovation} 逻辑性:${trick.scores.logic} 公平性:${trick.scores.fairness} 可行性:${trick.scores.feasibility}`);
  console.log(`   总分: ${trick.scores.total}/40`);
  return trick;
}

function listTricks() {
  const db = loadDB();
  console.log('\n📚 已保存的诡计:\n');
  db.forEach(t => {
    console.log(`  ${t.id}. ${t.name} (${t.scores.total}/40)`);
  });
  console.log('');
}

function showStats() {
  const db = loadDB();
  if (db.length === 0) {
    console.log('暂无数据');
    return;
  }
  
  const totals = db.map(t => t.scores.total);
  const avg = totals.reduce((a, b) => a + b, 0) / db.length;
  const best = Math.max(...totals);
  
  console.log('\n📊 统计:');
  console.log(`   诡计总数: ${db.length}`);
  console.log(`   平均分: ${avg.toFixed(1)}`);
  console.log(`   最高分: ${best}`);
  console.log('');
}

const args = process.argv.slice(2);

if (args[0] === '--list') {
  listTricks();
} else if (args[0] === '--stats') {
  showStats();
} else if (args[0] === '--save') {
  const name = args[1] || '未命名';
  const trick = {
    name,
    innovation: args[2] || 5,
    logic: args[3] || 5,
    fairness: args[4] || 5,
    feasibility: args[5] || 5
  };
  addTrick(trick);
} else {
  console.log(`
🤖 诡计评分系统

用法:
  node rate_trick.js --save <名称> [创新性] [逻辑性] [公平性] [可行性]
  node rate_trick.js --list
  node rate_trick.js --stats

示例:
  node rate_trick.js --save "密室毒杀" 8 7 8 6
  `);
}