---
title: Area Chart
sources:
- orders_by_category: orders_by_category.sql
---

## Area

<AreaChart
data={orders_by_category.filter(d => d.category === "Sinister Toys")}
x=month
/>

## Area with Custom Line Color

<AreaChart
data={orders_by_category.filter(d => d.category === "Sinister Toys")}
x=month
lineColor=red
/>

## Area with Step Line

<AreaChart
data={orders_by_category.filter(d => d.category === "Sinister Toys")}
x=month
step=true
stepPosition=middle
/>

## Stacked Area

<AreaChart 
    data={orders_by_category} 
    x=month 
    y=sales_usd0k 
    series=category
/>

## 100% Stacked Area

<AreaChart 
    data={orders_by_category} 
    x=month 
    y=sales_usd0k 
    series=category
    type=stacked100
/>

## Stacked Area with Custom Height

<AreaChart 
    data={orders_by_category} 
    x=month 
    y=sales_usd0k 
    series=category
    chartAreaHeight=380
/>

## Area with Log Scale

<AreaChart
    data={orders_by_category.filter(d => d.category === "Sinister Toys")}
    x=month
    y=sales_usd0k 
    yFmt="$###"
    yLog=true
    yLogBase=2
/>

## Not allowed Log charts: No Y axis

<AreaChart
    data={orders_by_category.filter(d => d.category === "Sinister Toys")}
    x=month
    yLog=true
/>

## Not allowed Log charts: No stacked areas

<AreaChart 
    data={orders_by_category} 
    x=month 
    y=sales_usd0k 
    series=category
    yLog=true
/>