import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,totals,scenario,plannedValue,currentPlanBaseline,validPortfolio,securityReturn,accountReturn,withLatestClose,allocationPlan} from '../dist/assets/model.js';

const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} differs from ${b}`);

test('portfolio total equals securities plus cash',()=>{
  const p=fresh(),t=totals(p);
  near(t.securities,p.holdings.reduce((sum,h)=>sum+h.shares*h.price,0));
  near(t.total,t.securities+p.cash);
});

test('changing a price changes total while cash stays fixed',()=>{
  const p=fresh(),before=totals(p).total,holding=p.holdings[0],cash=p.cash;
  holding.price+=100;
  near(totals(p).total,before+holding.shares*100);
  near(p.cash,cash);
});

test('scenario affects selected securities and never cash',()=>{
  const p=fresh(),t=totals(p),holding=p.holdings[0],holdingValue=holding.shares*holding.price;
  near(scenario(p,0,'all'),t.total);
  near(scenario(p,-.4,'all'),t.cash+t.securities*.6);
  near(scenario(p,-.5,holding.ticker),t.total-holdingValue*.5);
});

test('10% annual plan compounds mathematically',()=>{
  near(plannedValue(10000,0),10000);
  near(plannedValue(10000,365),11000);
  assert.ok(plannedValue(10000,1)>10000);
});

test('plan baseline uses the latest principal-reset point',()=>{
  const history=[
    {date:'2026-01-01',total:10000,label:'start'},
    {date:'2026-01-05',total:12000,label:'deposit',planReset:true},
    {date:'2026-01-07',total:12100,label:'close'}
  ];
  const plan=currentPlanBaseline(history);
  assert.equal(plan.baseDate,'2026-01-05');
  near(plan.baseValue,12000);
  near(plan.target,plannedValue(12000,2));
});

test('invalid, negative and corrupted persisted input are rejected',()=>{
  assert.ok(validPortfolio(fresh()));
  const p=fresh();p.cash=-1;
  assert.equal(validPortfolio(p),false);
  p.cash=NaN;
  assert.equal(validPortfolio(p),false);
  assert.equal(validPortfolio(null),false);
});

test('return curves normalize each security to its first available close',()=>{
  const history=[{date:'2026-01-01',checkedAt:'',source:'test',prices:{AAA:100}},{date:'2026-01-02',checkedAt:'',source:'test',prices:{AAA:110,BBB:200}},{date:'2026-01-03',checkedAt:'',source:'test',prices:{AAA:105,BBB:220}}];
  assert.deepEqual(securityReturn(history,'AAA'),[{date:'2026-01-01',value:0},{date:'2026-01-02',value:10.000000000000009},{date:'2026-01-03',value:5.000000000000004}]);
  assert.deepEqual(securityReturn(history,'BBB'),[{date:'2026-01-02',value:0},{date:'2026-01-03',value:10.000000000000009}]);
});

test('account return keeps cash fixed and applies the latest close',()=>{
  const p=fresh(),base=Object.fromEntries(p.holdings.map(h=>[h.ticker,h.price])),first=p.holdings[0],next={...base,[first.ticker]:base[first.ticker]*1.1};
  const history=[{date:'2026-01-01',checkedAt:'',source:'test',prices:base},{date:'2026-01-02',checkedAt:'',source:'test',prices:next}];
  const series=accountReturn(history,p.holdings,p.cash);
  near(series[0].value,0);
  near(series[1].total,totals(p).total+first.shares*first.price*.1);
  const updated=withLatestClose(p,history);
  near(updated.holdings.find(h=>h.ticker===first.ticker).price,next[first.ticker]);
  near(updated.cash,p.cash);
});

test('allocation plan preserves the complete account value',()=>{
  const p=fresh(),plan=allocationPlan(p,{voo:.6,nasdaq:.2,stocks:.15,cash:.05});
  near(plan.buyV+plan.buyN,plan.deployable);
  near(Object.values(plan.post).reduce((a,b)=>a+b,0),totals(p).total);
});
