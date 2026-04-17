#!/usr/bin/env node

/**
 * 推理诡计自动研究系统
 * 使用websearch工具进行在线研究
 */

const WebSearch = require('./web_search.cjs');

class TrickResearcher {
  constructor() {
    this.search = new WebSearch();
  }

  async research(trickType) {
    console.log(`🔍 正在研究: ${trickType}\n`);

    const queries = this.generateQueries(trickType);
    const results = [];

    for (const query of queries) {
      console.log(`📡 搜索: ${query}`);
      const searchResults = await this.search.search(query);
      results.push(...searchResults);
      await this.sleep(1000);
    }

    return this.analyzeResults(results, trickType);
  }

  generateQueries(trickType) {
    const baseQueries = {
      '密室': [
        '推理小说 密室诡计 经典',
        '不可能犯罪 密室设计 小说',
        '暴风雪山庄 推理小说 密室'
      ],
      '不在场证明': [
        '推理小说 不在场证明 诡计',
        '完美犯罪 不在场证明 设计'
      ],
      '身份替换': [
        '推理小说 身份替换 诡计',
        '双胞胎 推理小说 经典'
      ],
      '叙诡': [
        '叙述性诡计 推理小说 经典',
        'Ever17 叙事 诡计'
      ],
      '反转': [
        '推理小说 反转 经典',
        '命运石之门 世界线'
      ]
    };

    return baseQueries[trickType] || [
      `推理小说 诡计 ${trickType}`
    ];
  }

  analyzeResults(results, trickType) {
    const analysis = {
      trickType,
      searchCount: results.length,
      keyWorks: [],
      commonPatterns: [],
      designSuggestions: []
    };

    const works = results
      .filter(r => r.title && r.snippet)
      .slice(0, 10);

    works.forEach(work => {
      analysis.keyWorks.push({
        title: work.title,
        snippet: work.snippet.substring(0, 100)
      });
    });

    analysis.commonPatterns = this.identifyPatterns(trickType);
    analysis.designSuggestions = this.generateSuggestions(trickType);

    return analysis;
  }

  identifyPatterns(trickType) {
    const patterns = {
      '密室': [
        '物理密室：机械锁、门闩',
        '心理密室：门没锁、心理暗示',
        '时刻密室：特定时间密室',
        '密室重建：先进入后制造'
      ],
      '不在场证明': [
        '时间差：伪造死亡时间',
        '空间误导：远程制造证据',
        '心理误导：证人记忆偏差'
      ],
      '身份替换': [
        '双胞胎身份混淆',
        '变性/化妆改变外观',
        '叙诡视角转换'
      ],
      '叙诡': [
        '第一人称凶手视角',
        '性别认知错误',
        '角色身份转换'
      ],
      '反转': [
        '设定反转',
        '身份反转',
        '多重反转'
      ]
    };

    return patterns[trickType] || ['通用模式'];
  }

  generateSuggestions(trickType) {
    const suggestions = {
      '密室': [
        '尝试把物理密室改成心理密室',
        '加入密室重建元素',
        '利用建筑结构制造视觉盲区'
      ],
      '不在场证明': [
        '利用时钟做假制造时间差',
        '利用证人记忆偏差',
        '设计远程制造证据方案'
      ],
      '身份替换': [
        '利用双胞胎加入差异点',
        '结合叙诡制造身份盲区'
      ],
      '叙诡': [
        '利用第一人称视角隐瞒身份',
        '在性别描述上制造模糊'
      ],
      '反转': [
        '设计表面真相然后反转',
        '加入多重反转'
      ]
    };

    return suggestions[trickType] || ['待研究'];
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printReport(analysis) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 研究报告');
    console.log('='.repeat(50));

    console.log(`\n🔍 类型: ${analysis.trickType}`);
    console.log(`📚 搜索结果: ${analysis.searchCount}条`);

    console.log('\n📖 关键作品:');
    analysis.keyWorks.forEach((work, i) => {
      console.log(`  ${i + 1}. ${work.title}`);
    });

    console.log('\n🎯 常见模式:');
    analysis.commonPatterns.forEach(p => {
      console.log(`  • ${p}`);
    });

    console.log('\n💡 设计建议:');
    analysis.designSuggestions.forEach(s => {
      console.log(`  ✓ ${s}`);
    });
  }
}

// 直接运行
async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || '密室';
  
  const researcher = new TrickResearcher();
  const result = await researcher.research(type);
  researcher.printReport(result);
}

main();