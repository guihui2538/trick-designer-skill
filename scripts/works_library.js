#!/usr/bin/env node

/**
 * 作品库管理系统
 * 自动保存经典作品和设计的诡计
 */

const fs = require('fs');
const path = require('path');

const WORKS_DB_PATH = path.join(__dirname, '../data/works.json');
const TRICKS_DB_PATH = path.join(__dirname, '../data/tricks.json');

class WorksLibrary {
  constructor() {
    this.ensureDataDir();
  }

  ensureDataDir() {
    const dataDir = path.dirname(WORKS_DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(WORKS_DB_PATH)) {
      fs.writeFileSync(WORKS_DB_PATH, JSON.stringify({ classic: [], custom: [] }, null, 2));
    }
    if (!fs.existsSync(TRICKS_DB_PATH)) {
      fs.writeFileSync(TRICKS_DB_PATH, JSON.stringify([], null, 2));
    }
  }

  // 保存经典作品
  addClassicWork(work) {
    const db = JSON.parse(fs.readFileSync(WORKS_DB_PATH, 'utf-8'));
    
    const newWork = {
      id: Date.now(),
      title: work.title || '',
      author: work.author || '',
      type: work.type || '推理小说', // 推理小说/游戏/动画/其他
      trickType: work.trickType || '', // 密室/不在场证明/叙诡等
      coreTrick: work.coreTrick || '', // 核心诡计描述
      principle: work.principle || '', // 原理拆解
      inspiration: work.inspiration || '', // 借鉴要点
      source: work.source || 'manual', // manual/search
      addedAt: new Date().toISOString()
    };

    db.classic.push(newWork);
    fs.writeFileSync(WORKS_DB_PATH, JSON.stringify(db, null, 2));
    console.log(`✅ 已保存经典作品: ${newWork.title}`);
    return newWork;
  }

  // 批量保存搜索到的作品
  batchAddFromSearch(results) {
    const db = JSON.parse(fs.readFileSync(WORKS_DB_PATH, 'utf-8'));
    let count = 0;

    results.forEach(item => {
      // 检查是否已存在
      const exists = db.classic.some(w => w.title === item.title);
      if (!exists) {
        db.classic.push({
          id: Date.now() + count,
          title: item.title || '',
          author: item.author || '',
          type: item.type || '推理小说',
          trickType: item.trickType || '',
          coreTrick: item.coreTrick || item.snippet || '',
          source: 'search',
          addedAt: new Date().toISOString()
        });
        count++;
      }
    });

    fs.writeFileSync(WORKS_DB_PATH, JSON.stringify(db, null, 2));
    console.log(`✅ 已批量添加 ${count} 部作品`);
    return count;
  }

  // 保存设计的诡计
  addTrick(trick) {
    const db = JSON.parse(fs.readFileSync(TRICKS_DB_PATH, 'utf-8'));
    
    const newTrick = {
      id: Date.now(),
      name: trick.name || '未命名',
      type: trick.type || '', // 谜面类型
      difficulty: trick.difficulty || '入门',
      elements: trick.elements || [], // 使用的随机元素
      trick: trick.trick || '', // 诡计描述
      support: trick.support || {}, // 支撑条件
      scores: trick.scores || {}, // 评分
      status: trick.status || 'draft', // draft/passed/rejected
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 同时保存到作品库的自定义分类
    const worksDb = JSON.parse(fs.readFileSync(WORKS_DB_PATH, 'utf-8'));
    worksDb.custom.push({
      id: newTrick.id,
      name: newTrick.name,
      type: '自定义诡计',
      trickType: newTrick.type,
      coreTrick: newTrick.trick,
      scores: newTrick.scores,
      createdAt: newTrick.createdAt
    });
    fs.writeFileSync(WORKS_DB_PATH, JSON.stringify(worksDb, null, 2));

    db.push(newTrick);
    fs.writeFileSync(TRICKS_DB_PATH, JSON.stringify(db, null, 2));
    console.log(`✅ 已保存诡计: ${newTrick.name}`);
    return newTrick;
  }

  // 更新诡计状态
  updateTrickStatus(id, status) {
    const db = JSON.parse(fs.readFileSync(TRICKS_DB_PATH, 'utf-8'));
    const index = db.findIndex(t => t.id === id);
    if (index !== -1) {
      db[index].status = status;
      db[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(TRICKS_DB_PATH, JSON.stringify(db, null, 2));
      console.log(`✅ 已更新诡计状态: ${status}`);
    }
    return db[index];
  }

  // 搜索作品
  searchWorks(keyword) {
    const worksDb = JSON.parse(fs.readFileSync(WORKS_DB_PATH, 'utf-8'));
    const tricksDb = JSON.parse(fs.readFileSync(TRICKS_DB_PATH, 'utf-8'));

    const classicResults = worksDb.classic.filter(w => 
      w.title.includes(keyword) || 
      w.author.includes(keyword) || 
      w.trickType.includes(keyword) ||
      w.coreTrick.includes(keyword)
    );

    const customResults = worksDb.custom.filter(w => 
      w.name.includes(keyword) || 
      w.trickType.includes(keyword) ||
      w.coreTrick.includes(keyword)
    );

    return { classic: classicResults, custom: customResults };
  }

  // 获取所有作品
  getAllWorks() {
    return JSON.parse(fs.readFileSync(WORKS_DB_PATH, 'utf-8'));
  }

  // 获取所有诡计
  getAllTricks() {
    return JSON.parse(fs.readFileSync(TRICKS_DB_PATH, 'utf-8'));
  }

  // 统计
  getStats() {
    const worksDb = JSON.parse(fs.readFileSync(WORKS_DB_PATH, 'utf-8'));
    const tricksDb = JSON.parse(fs.readFileSync(TRICKS_DB_PATH, 'utf-8'));

    const passed = tricksDb.filter(t => t.status === 'passed');
    const rejected = tricksDb.filter(t => t.status === 'rejected');
    const draft = tricksDb.filter(t => t.status === 'draft');

    return {
      classicCount: worksDb.classic.length,
      customCount: worksDb.custom.length,
      totalTricks: tricksDb.length,
      passedCount: passed.length,
      rejectedCount: rejected.length,
      draftCount: draft.length
    };
  }

  // 展示
  showAll() {
    const worksDb = JSON.parse(fs.readFileSync(WORKS_DB_PATH, 'utf-8'));
    const tricksDb = JSON.parse(fs.readFileSync(TRICKS_DB_PATH, 'utf-8'));

    console.log('\n📚 经典作品库:');
    console.log(`  共 ${worksDb.classic.length} 部作品\n`);
    worksDb.classic.forEach(w => {
      console.log(`  • ${w.title} - ${w.author} [${w.trickType}]`);
    });

    console.log('\n🎭 已设计诡计:');
    console.log(`  共 ${tricksDb.length} 个诡计\n`);
    tricksDb.forEach(t => {
      const statusIcon = t.status === 'passed' ? '✅' : t.status === 'rejected' ? '❌' : '📝';
      console.log(`  ${statusIcon} ${t.name} [${t.type}] ${t.scores.total ? `(${t.scores.total}/50)` : ''}`);
    });

    const stats = this.getStats();
    console.log('\n📊 统计:');
    console.log(`  经典作品: ${stats.classicCount}`);
    console.log(`  通过的诡计: ${stats.passedCount}`);
    console.log(`  拒绝的诡计: ${stats.rejectedCount}`);
    console.log(`  草稿: ${stats.draftCount}`);
  }
}

// 运行
const args = process.argv.slice(2);
const lib = new WorksLibrary();

if (args[0] === '--add-work') {
  lib.addClassicWork({
    title: args[1] || '',
    author: args[2] || '',
    type: args[3] || '推理小说',
    trickType: args[4] || ''
  });
} else if (args[0] === '--add-trick') {
  lib.addTrick({
    name: args[1] || '未命名',
    type: args[2] || '',
    trick: args[3] || ''
  });
} else if (args[0] === '--search') {
  const results = lib.searchWorks(args[1] || '');
  console.log('🔍 搜索结果:');
  console.log('经典作品:', results.classic.length);
  console.log('自定义诡计:', results.custom.length);
} else if (args[0] === '--stats') {
  const stats = lib.getStats();
  console.log('📊 统计:', JSON.stringify(stats, null, 2));
} else if (args[0] === '--show') {
  lib.showAll();
} else {
  lib.showAll();
}

module.exports = WorksLibrary;