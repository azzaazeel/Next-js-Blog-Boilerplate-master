---
title: "Market Insight: CS2 Asset Correlation & Growth Analysis"
description: "A comprehensive performance audit of major CS2 assets, featuring comparative growth metrics and individual liquidity analysis."
date: "2026-04-07"
modified_date: "2026-04-07"
image: "/assets/images/posts/random-img.jpg"
---

## Executive Summary: Market Correlation

This report identifies the relative performance and correlation between key CS2 liquidity drivers: **Revolution**, **Kilowatt**, **Dreams & Nightmares**, and the **Sealed Genesis Terminal**. By normalizing their price data to a cumulative growth percentage, we can pinpoint leading indicators and market outliers.

<div className="relative w-full h-96 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-8">
  <canvas 
    className="blog-chart" 
    height="350" 
    data-url="Revolution Case_1D.json, Kilowatt Case_1D.json, Dreams & Nightmares Case_1D.json, Sealed Genesis Terminal_1D.json" 
    data-title="Multi-Asset Performance Correlation (%)" 
    data-type="line"
    data-mode="percent"
  ></canvas>
</div>

### Performance Analysis
Global market trends show a high degree of correlation between the newer **Kilowatt** and **Revolution** cases, often moving in tandem during liquidity injections. Conversely, the **Sealed Genesis Terminal** exhibits more institutional-like stability, with lower volatility compared to the speculative nature of item cases.

---

## Individual Asset Deep-Dives

### 1. Revolution Case Analysis
The Revolution Case remains the primary benchmark for current market liquidity. Its high volume suggests deep trader engagement and sustainable price action.

<div className="relative w-full h-80 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
  <canvas 
    className="blog-chart" 
    height="300" 
    data-url="Revolution Case_1D.json" 
    data-title="Revolution Case: Price & Volume (1D)" 
    data-mode="price"
  ></canvas>
</div>

### Yearly Performance Table

| Year | Start Date | End Date | Start Price | End Price | Return (%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2023 | Feb 10 2023 | Dec 31 2023 | 355.105 ₫ | 15.673 ₫ | -96% |
| 2024 | Jan 01 2024 | Dec 31 2024 | 15.776 ₫ | 13.545 ₫ | -14% |
| 2025 | Jan 01 2025 | Dec 31 2025 | 13.007 ₫ | 10.953 ₫ | -16% |
| 2026 | Jan 01 2026 | Apr 06 2026 | 11.040 ₫ | 13.978 ₫ | +27% |


### 2. Kilowatt Case Analysis
As a newer entry, Kilowatt is currently in its price-discovery phase. Monitor the volume spikes as they often precede localized volatility breakouts.

<div className="relative w-full h-80 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
  <canvas 
    className="blog-chart" 
    height="300" 
    data-url="Kilowatt Case_1D.json" 
    data-title="Kilowatt Case: Price & Volume (1D)" 
    data-mode="price"
  ></canvas>
</div>

### Yearly Performance Table

| Year | Start Date | End Date | Start Price | End Price | Return (%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2024 | Feb 07 2024 | Dec 31 2024 | 376.361 ₫ | 19.919 ₫ | -95% |
| 2025 | Jan 01 2025 | Dec 31 2025 | 18.852 ₫ | 9.168 ₫ | -51% |
| 2026 | Jan 01 2026 | Apr 06 2026 | 9.181 ₫ | 12.382 ₫ | +35% |


### 3. Dreams & Nightmares Case Analysis
This case represents the mid-tier speculative segment. Its performance is often influenced by broader market sentiment shifts rather than individual asset news.

<div className="relative w-full h-80 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
  <canvas 
    className="blog-chart" 
    height="300" 
    data-url="Dreams & Nightmares Case_1D.json" 
    data-title="Dreams & Nightmares: Price & Volume (1D)" 
    data-mode="price"
  ></canvas>
</div>

### Yearly Performance Table

| Year | Start Date | End Date | Start Price | End Price | Return (%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2022 | Jan 21 2022 | Dec 31 2022 | 281.576 ₫ | 14.310 ₫ | -95% |
| 2023 | Jan 01 2023 | Dec 31 2023 | 15.115 ₫ | 27.081 ₫ | +79% |
| 2024 | Jan 01 2024 | Dec 31 2024 | 27.448 ₫ | 46.547 ₫ | +70% |
| 2025 | Jan 01 2025 | Dec 31 2025 | 45.106 ₫ | 48.986 ₫ | +9% |
| 2026 | Jan 01 2026 | Apr 06 2026 | 48.886 ₫ | 59.894 ₫ | +23% |


### 4. Sealed Genesis Terminal Analysis
The Genesis Terminal acts as a "flight-to-quality" asset. During periods of case volatility, liquidity often rotates into terminals due to their perceived scarcity and lower supply velocity.

<div className="relative w-full h-80 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
  <canvas 
    className="blog-chart" 
    height="300" 
    data-url="Sealed Genesis Terminal_1D.json" 
    data-title="Sealed Genesis Terminal: Price & Volume (1D)" 
    data-mode="price"
  ></canvas>
</div>

### Yearly Performance Table

| Year | Start Date | End Date | Start Price | End Price | Return (%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2025 | Sep 16 2025 | Dec 31 2025 | 861.532 ₫ | 11.771 ₫ | -99% |
| 2026 | Jan 01 2026 | Apr 06 2026 | 11.824 ₫ | 11.601 ₫ | -2% |


> [!IMPORTANT]
> All visualizations are powered by KANOCS Real-Time Snapshots. Use the "Download" button on any chart to save the current view for offline analysis.

<Insight theme="light" />
