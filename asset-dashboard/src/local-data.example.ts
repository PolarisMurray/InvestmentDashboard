import type { DashboardLocalData } from './model.js';

// Public demo data. The setup script copies this file to local-data.ts only
// when a private local data file does not already exist.
export const dashboardData: DashboardLocalData = {
  portfolio: {
    holdings: [
      { ticker:'VOO',name:'S&P 500 ETF',kind:'ETF',shares:10,price:500,color:'#3c5fea' },
      { ticker:'QQQM',name:'Nasdaq-100 ETF',kind:'ETF',shares:5,price:200,color:'#6f86e8' },
      { ticker:'AAPL',name:'Sample stock',kind:'个股',shares:2,price:250,color:'#e0a563' }
    ],
    cash:1000,
    edited:false,
    history:[
      {date:'2026-01-02',total:7500,label:'演示数据',settledPnl:0,planReset:true},
      {date:'2026-01-09',total:7550,label:'演示数据',settledPnl:50}
    ]
  },
  snapshotDate:'2026-01-09',
  snapshotUnrealized:50,
  snapshotRealized:0,
  defaultReturnTickers:['VOO','QQQM','AAPL'],
  weeklyObservation:{
    asOf:'2026-01-09',
    title:'演示配置观察',
    notes:[
      '这里展示 ETF 核心占比的示例观察。',
      '这里展示最大单股集中度的示例观察。',
      '这里展示现金缓冲的示例观察。'
    ]
  },
  sourceHtml:'<h3>演示数据</h3><p>当前页面使用公开示例数据。请复制示例文件为 local-data.ts，并在本机填写自己的数据；该文件不会被 Git 跟踪。</p>'
};
