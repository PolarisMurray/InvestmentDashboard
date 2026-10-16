import type { MarketClose } from './model.js';

// Public demo market history. Real tracked symbols and closes belong in the
// ignored local-market-data.ts file.
export const marketHistory: MarketClose[] = [
  {
    date:'2026-01-02',
    checkedAt:'2026-01-02T16:30:00-05:00',
    source:'Public demo data',
    prices:{VOO:500,QQQM:200,AAPL:250}
  },
  {
    date:'2026-01-09',
    checkedAt:'2026-01-09T16:30:00-05:00',
    source:'Public demo data',
    prices:{VOO:503,QQQM:202,AAPL:248}
  }
];

export const marketScheduleLabel='美东工作日收盘后检查常规交易时段收盘价';
