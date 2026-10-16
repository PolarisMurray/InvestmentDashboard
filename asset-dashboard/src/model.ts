import { dashboardData } from './local-data.js';

export type Holding = { ticker: string; name: string; kind: 'ETF' | '个股'; shares: number; price: number; color: string };
export type Snapshot = {
  date: string;
  total: number;
  label: string;
  settledPnl?: number;
  unrealizedPnl?: number;
  realizedPnl?: number;
  planReset?: boolean;
};
export type Portfolio = { holdings: Holding[]; cash: number; edited: boolean; history: Snapshot[] };
export type MarketClose = { date: string; checkedAt: string; source: string; prices: Record<string, number> };
export type WeeklyObservation = { asOf: string; title: string; notes: string[] };
export type DashboardLocalData = {
  portfolio: Portfolio;
  snapshotDate: string;
  snapshotUnrealized: number;
  snapshotRealized: number;
  sourceHtml: string;
  defaultReturnTickers: string[];
  weeklyObservation: WeeklyObservation;
};
export type AllocationTarget = { voo:number; nasdaq:number; stocks:number; cash:number };
export const original: Portfolio = dashboardData.portfolio;
export const fresh = (): Portfolio => JSON.parse(JSON.stringify(original)) as Portfolio;
export const value = (h: Holding): number => h.shares * h.price;
export function totals(p: Portfolio) {
  const securities = p.holdings.reduce((s,h)=>s+value(h),0);
  return { securities, cash:p.cash, total:securities+p.cash };
}
export function scenario(p: Portfolio, change: number, scope: string): number {
  const affected = p.holdings.filter(h=>scope==='all'||h.ticker===scope).reduce((s,h)=>s+value(h),0);
  return totals(p).total + affected * change;
}
export function plannedValue(startValue:number,days:number,annualRate=.10):number {
  return startValue*Math.pow(1+annualRate,days/365);
}
export function currentPlanBaseline(history:Snapshot[]){const sorted=[...history].sort((a,b)=>a.date.localeCompare(b.date));if(!sorted.length)return null;let base=sorted[0];for(const point of sorted.slice(1))if(point.planReset)base=point;const latest=sorted.at(-1)!;const days=Math.max(0,(Date.parse(latest.date+'T00:00:00Z')-Date.parse(base.date+'T00:00:00Z'))/86400000);return {baseDate:base.date,baseValue:base.total,latestDate:latest.date,days,target:plannedValue(base.total,days)};}
export function securityReturn(history: MarketClose[], ticker: string) {
  if (!history.length) return [];
  const base=history.find(point=>Number.isFinite(point.prices[ticker])&&point.prices[ticker]>0)?.prices[ticker];
  if (base===undefined||!Number.isFinite(base)||base<=0) return [];
  return history.flatMap(point=>Number.isFinite(point.prices[ticker])?[{date:point.date,value:(point.prices[ticker]/base-1)*100}]:[]);
}
export function accountReturn(history: MarketClose[], holdings: Holding[], cash: number) {
  if (!history.length) return [];
  const totalAt=(point:MarketClose)=>cash+holdings.reduce((sum,h)=>sum+h.shares*(point.prices[h.ticker]??h.price),0);
  const base=totalAt(history[0]);
  return history.map(point=>({date:point.date,value:base?(totalAt(point)/base-1)*100:0,total:totalAt(point)}));
}
export function withLatestClose(p:Portfolio, history:MarketClose[]):Portfolio {
  const latest=history[history.length-1];
  if(!latest) return p;
  return {...p,holdings:p.holdings.map(h=>Number.isFinite(latest.prices[h.ticker])?{...h,price:latest.prices[h.ticker]}:h)};
}
export function allocationPlan(p:Portfolio,target:AllocationTarget){const t=totals(p),voo=p.holdings.find(h=>h.ticker==='VOO'),nasdaqHoldings=p.holdings.filter(h=>h.ticker==='QQQ'||h.ticker==='QQQM');if(!voo||!nasdaqHoldings.length)throw new Error('VOO and Nasdaq-100 holdings are required');const current={voo:value(voo),nasdaq:nasdaqHoldings.reduce((sum,h)=>sum+value(h),0),stocks:p.holdings.filter(h=>h.kind==='个股').reduce((sum,h)=>sum+value(h),0),cash:t.cash},reserve=t.total*target.cash,deployable=Math.max(0,t.cash-reserve),gapV=Math.max(0,t.total*target.voo-current.voo),gapN=Math.max(0,t.total*target.nasdaq-current.nasdaq),gapTotal=gapV+gapN,buyV=gapTotal?deployable*gapV/gapTotal:deployable*.75,buyN=deployable-buyV,post={voo:current.voo+buyV,nasdaq:current.nasdaq+buyN,stocks:current.stocks,cash:t.cash-deployable};return {total:t.total,current,post,reserve,deployable,buyV,buyN};}
export function validPortfolio(p: unknown): p is Portfolio {
  if (!p || typeof p !== 'object') return false;
  const x=p as Portfolio;
  return Array.isArray(x.holdings) && x.holdings.length===original.holdings.length && x.holdings.every((h,i)=>
    h.ticker===original.holdings[i].ticker && Number.isFinite(h.shares)&&h.shares>=0 && Number.isFinite(h.price)&&h.price>=0
  ) && Number.isFinite(x.cash)&&x.cash>=0 && typeof x.edited==='boolean' && Array.isArray(x.history) && x.history.length>0 && new Set(x.history.map(h=>h.date)).size===x.history.length && x.history.every(h=>
    /^\d{4}-\d{2}-\d{2}$/.test(h.date)&&Number.isFinite(h.total)&&h.total>=0&&typeof h.label==='string'&&
    [h.settledPnl,h.unrealizedPnl,h.realizedPnl].every(n=>n===undefined||Number.isFinite(n))&&(h.planReset===undefined||typeof h.planReset==='boolean'));
}
