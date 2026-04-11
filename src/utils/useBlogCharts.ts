import { useEffect } from 'react';
import Chart from 'chart.js/auto';

export function useBlogCharts(deps: any[]) {
  useEffect(() => {
    const canvases = document.querySelectorAll('.blog-chart');
    const chartInstances: Chart[] = [];

    const initializeCharts = async () => {
      // Set global defaults for consistency with Patches page
      Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
      
      for (const canvasElem of Array.from(canvases)) {
        const canvas = canvasElem as HTMLCanvasElement;
        const chartUrlAttr = canvas.getAttribute('data-url') || '';
        const priceDeltaAttr = canvas.getAttribute('data-price-delta');
        const volDeltaAttr = canvas.getAttribute('data-vol-delta');
        const caseImageAttr = canvas.getAttribute('data-case-image') || '';
        
        const currentId = `${chartUrlAttr}-${canvas.getAttribute('data-markers')}-${canvas.getAttribute('data-ranges')}-${canvas.getAttribute('data-range')}-${canvas.getAttribute('data-year')}-${canvas.getAttribute('data-sma50')}-${canvas.getAttribute('data-sma200')}-${canvas.getAttribute('data-volsma50')}-${canvas.getAttribute('data-rsi')}-${priceDeltaAttr}-${volDeltaAttr}-${caseImageAttr}`;
        
        // Prevent redundant initialization if nothing changed
        if (canvas.getAttribute('data-inited') === currentId) continue;
        canvas.setAttribute('data-inited', currentId);
        
        // Load Case Image if any
        let caseImage: HTMLImageElement | null = null;
        if (caseImageAttr) {
          caseImage = new Image();
          caseImage.src = caseImageAttr;
          await new Promise((resolve) => {
            caseImage!.onload = resolve;
            caseImage!.onerror = resolve;
          });
        }
        
        const chartTitle = canvas.getAttribute('data-title') || '';
        const chartMarkersAttr = canvas.getAttribute('data-markers') || '';
        const chartRangesAttr = canvas.getAttribute('data-ranges') || '';
        const isHistory = canvas.getAttribute('data-history') === 'true';
        const is3Y = canvas.getAttribute('data-3y') === 'true';
        const chartType = canvas.getAttribute('data-type') || 'line';
        const chartYear = canvas.getAttribute('data-year');
        
        if (!chartUrlAttr) continue;

        // Support multiple URLs for comparison, separated by comma
        const urls = chartUrlAttr.split(',').map(u => u.trim());
        const isComparison = urls.length > 1;
        const chartMode = canvas.getAttribute('data-mode') || (isComparison ? 'percent' : 'price');

        try {
          const datasetsResponse = await Promise.all(
            urls.map(async (url) => {
              try {
                let finalUrl = url;
                // Handle private data proxy
                let apiPath = '/api/market-data';
                if (is3Y) {
                  apiPath = '/api/market-3y';
                } else if (isHistory) {
                  apiPath = '/api/market-history';
                } else if (canvas.getAttribute('data-tradingview') === 'true') {
                  apiPath = '/api/admin/tradingview-data';
                }
                
                if (!url.startsWith('/') && !url.startsWith('http')) {
                  finalUrl = `${apiPath}?url=${encodeURIComponent(url)}`;
                } else if (url.startsWith('/data/')) {
                  const filename = url.split('/').pop();
                  finalUrl = `${apiPath}?url=${encodeURIComponent(filename || '')}`;
                }

                if (chartYear) {
                  finalUrl += `&year=${chartYear}`;
                }
                
                const range = canvas.getAttribute('data-range');
                if (range) {
                  finalUrl += `&range=${range}`;
                }

                const res = await fetch(finalUrl);
                const json = await res.json();
                return Array.isArray(json) ? json : null;
              } catch (err) {
                console.error(`Failed to fetch ${url}:`, err);
                return null;
              }
            })
          );

          const validDatasets = datasetsResponse.filter(d => d !== null);
          if (validDatasets.length === 0) continue;

          // Cleanup previous instance if any
          const existingChart = Chart.getChart(canvas);
          if (existingChart) existingChart.destroy();

          // Unified date synchronization (fixes shifts when datasets have different start/end dates)
          const allDatesMap = new Map<string, number>();
          validDatasets.forEach(dataset => {
            dataset.forEach((d: any) => {
              if (!allDatesMap.has(d.date)) {
                allDatesMap.set(d.date, d.timestamp);
              }
            });
          });

          // Master labels sorted by timestamp
          const labels = Array.from(allDatesMap.entries())
            .sort((a, b) => a[1] - b[1])
            .map(entry => entry[0]);

          const colors = ['#45AAF2', '#A55EEA', '#26DE81', '#FC5C65', '#FD9644'];
          
          const calculateSMA = (data: number[], period: number) => {
            const sma = [];
            for (let i = 0; i < data.length; i++) {
              if (i < period - 1) {
                sma.push(null);
                continue;
              }
              const slice = data.slice(i - period + 1, i + 1);
              const sum = slice.reduce((a, b) => a + b, 0);
              sma.push(sum / period);
            }
            return sma;
          };

          const calculateRSI = (data: number[], period: number = 14) => {
            const rsi = new Array(data.length).fill(null);
            if (data.length <= period) return rsi;
            let avgGain = 0;
            let avgLoss = 0;
            for (let i = 1; i <= period; i++) {
              const change = data[i] - data[i - 1];
              if (change > 0) avgGain += change;
              else avgLoss += Math.abs(change);
            }
            avgGain /= period;
            avgLoss /= period;
            let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            rsi[period] = 100 - (100 / (1 + rs));
            for (let i = period + 1; i < data.length; i++) {
              const change = data[i] - data[i - 1];
              let gain = change > 0 ? change : 0;
              let loss = change < 0 ? Math.abs(change) : 0;
              avgGain = (avgGain * (period - 1) + gain) / period;
              avgLoss = (avgLoss * (period - 1) + loss) / period;
              rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
              rsi[i] = 100 - (100 / (1 + rs));
            }
            return rsi;
          };

          const sma50Attr = canvas.getAttribute('data-sma50') === 'true';
          const sma200Attr = canvas.getAttribute('data-sma200') === 'true';
          const volSma50Attr = canvas.getAttribute('data-volsma50') === 'true';
          const rsiAttr = canvas.getAttribute('data-rsi') === 'true';

          const datasets: any[] = [];

          validDatasets.forEach((data, index) => {
            const fileName = urls[index].replace('_1D.json', '').replace('.json', '');
            const isBTC = fileName.includes('Bitcoin (BTC)');
            
            // Map data by date for alignment
            const dateToPrice = new Map(data.map((d: any) => [d.date, d.price]));
            const dateToVolume = new Map(data.map((d: any) => [d.date, d.volume || 0]));
            
            // Find first available price for percent mode baseline
            const firstAvailablePrice = data[0]?.price || 0;
            
            const chartPoints = labels.map((date) => {
              const price = dateToPrice.get(date);
              if (price === undefined) return null;
              
              if (chartMode === 'percent' && firstAvailablePrice !== 0) {
                return ((price - firstAvailablePrice) / firstAvailablePrice) * 100;
              }
              return price;
            });

            const volumePoints = labels.map(date => dateToVolume.get(date) || 0);
            
            // Add Price Line
            datasets.push({
              label: isComparison ? fileName : 'Price',
              data: chartPoints,
              borderColor: isComparison ? colors[index % colors.length] : '#45AAF2',
              backgroundColor: isComparison ? colors[index % colors.length] : 'rgba(69, 170, 242, 0.1)',
              fill: !isComparison && chartMode !== 'percent',
              tension: 0.15, // Slightly lower tension for technical feel
              borderWidth: 2,
              pointRadius: 0,
              yAxisID: isBTC && isComparison ? 'yBTC' : 'y',
              spanGaps: true
            });

            // Add SMA 50 Price
            if (!isComparison && sma50Attr) {
              datasets.push({
                label: 'SMA 50',
                data: calculateSMA(chartPoints, 50),
                borderColor: '#EB3B5A',
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.1,
                yAxisID: 'y',
                spanGaps: true
              });
            }

            // Add SMA 200 Price
            if (!isComparison && sma200Attr) {
              datasets.push({
                label: 'SMA 200',
                data: calculateSMA(chartPoints, 200),
                borderColor: '#3867D6',
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.1,
                yAxisID: 'y',
                spanGaps: true
              });
            }

            // Add Volume Bar only if single symbol and price mode
            if (!isComparison && chartMode === 'price' && index === 0) {
              datasets.push({
                label: 'Volume',
                type: 'bar',
                data: volumePoints,
                backgroundColor: 'rgba(247, 183, 49, 0.3)',
                borderColor: 'rgba(247, 183, 49, 0.3)',
                borderWidth: 1,
                yAxisID: 'yVolume',
                order: 2,
                barPercentage: 0.8,
              });

              // Add Volume SMA 50
              if (volSma50Attr) {
                datasets.push({
                  label: 'Vol SMA 50',
                  type: 'line',
                  data: calculateSMA(volumePoints, 50),
                  borderColor: 'rgba(247, 183, 49, 0.8)',
                  borderWidth: 1.5,
                  pointRadius: 0,
                  tension: 0.1,
                  yAxisID: 'yVolume',
                  order: 1
                });
              }
            }

            // RSI Calculation
            if (!isComparison && rsiAttr && index === 0) {
              const rsiData = calculateRSI(chartPoints.filter(p => p !== null) as number[]);
              datasets.push({
                label: 'RSI',
                data: rsiData,
                borderColor: '#A55EEA',
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.3,
                yAxisID: 'yRSI',
                z: 10
              });

              // Overbought Level (70)
              datasets.push({
                label: 'Overbought',
                data: new Array(data.length).fill(70),
                borderColor: 'rgba(252, 92, 101, 0.3)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                yAxisID: 'yRSI',
                z: 0
              });

              // Oversold Level (30)
              datasets.push({
                label: 'Oversold',
                data: new Array(data.length).fill(30),
                borderColor: 'rgba(38, 222, 129, 0.3)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                yAxisID: 'yRSI',
                z: 0
              });
            }
          });

          const priceDeltaAttr = canvas.getAttribute('data-price-delta');
          const volDeltaAttr = canvas.getAttribute('data-vol-delta');

          const plugins: any[] = [
            {
              id: 'customCanvasBackgroundColor',
              beforeDraw: (chart: any) => {
                const {ctx} = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = '#1a1d26';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
              }
            },
            {
              id: 'statsOverlay',
              afterDraw: (chart: any) => {
                const { ctx, chartArea } = chart;
                if (!priceDeltaAttr || !volDeltaAttr) return;

                const pDelta = parseFloat(priceDeltaAttr);
                const vDelta = parseFloat(volDeltaAttr);

                ctx.save();

                const margin = 20; 
                let currentY = chartArea.top + margin;
                const currentX = chartArea.left + margin;

                // Draw Case Image if exists
                if (caseImage && caseImage.complete && caseImage.naturalWidth > 0) {
                   const imgWidth = caseImage.naturalWidth * 0.5; // Reduce by 50%
                   const imgHeight = caseImage.naturalHeight * 0.5; // Reduce by 50%
                   ctx.drawImage(caseImage, currentX, currentY, imgWidth, imgHeight);
                   currentY += imgHeight + 15;
                }

                ctx.font = 'bold 11px Inter, system-ui, -apple-system, sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';

                // Draw Price Delta
                ctx.fillStyle = '#f7b731'; // Patches Gold
                ctx.fillText('Price Δ:', currentX, currentY);
                ctx.fillStyle = pDelta >= 0 ? '#34d399' : '#fb7185';
                ctx.fillText(`${pDelta >= 0 ? '▲' : '▼'} ${Math.abs(pDelta).toFixed(2)}%`, currentX + 55, currentY);

                // Draw Vol Delta
                currentY += 20; // Improved line spacing
                ctx.fillStyle = '#f7b731'; // Patches Gold
                ctx.fillText('Vol Δ:', currentX, currentY);
                ctx.fillStyle = vDelta >= 0 ? '#34d399' : '#fb7185';
                ctx.fillText(`${vDelta >= 0 ? '▲' : '▼'} ${Math.abs(vDelta).toFixed(2)}%`, currentX + 55, currentY);

                ctx.restore();
              }
            },
            {
              id: 'watermark',
              beforeDraw: (chart: any) => {
                const { ctx, width, height } = chart;
                ctx.save();
                ctx.font = 'bold 40px Inter, system-ui, -apple-system, sans-serif';
                ctx.fillStyle = 'rgba(156, 163, 175, 0.08)';
                ctx.textAlign = 'center';
                ctx.translate(width / 2, height / 2);
                ctx.rotate(-Math.PI / 8);
                ctx.fillText('KANOCS', 0, 0);
                ctx.restore();
              },
            }
          ];

          // Add Event Markers
          if (chartMarkersAttr) {
            const markers = chartMarkersAttr.split(',').map(m => {
              const [date, code, ...descParts] = m.split(':').map(s => s.trim());
              return {
                date: date.toLowerCase(),
                code: code || 'E?',
                label: descParts.join(':') || code || 'EVENT',
                index: -1 // To be filled
              };
            });

            // PRE-INDEXING: Find data indices once outside the draw loop
            labels.forEach((label: string, idx: number) => {
              const labelLower = label.toLowerCase();
              markers.forEach(m => {
                if (labelLower === m.date || 
                    (chartYear && labelLower === `${m.date} ${chartYear}`) ||
                    labelLower === `${m.date} 2026` || 
                    labelLower === `${m.date} 2025` ||
                    (m.date.split(' ').length > 2 && labelLower.includes(m.date))) {
                  m.index = idx;
                }
              });
            });

            // Filter to only markers that were found in data
            const activeMarkers = markers.filter(m => m.index !== -1);
            
            plugins.push({
              id: 'markers',
              afterDraw: (chart: any) => {
                const { ctx, chartArea, scales, width, height } = chart;
                const x = scales.x;
                
                activeMarkers.forEach((m) => {
                  const xPos = x.getPixelForValue(m.index);
                  const isCaseMarker = m.code.startsWith('CR-') || m.code.startsWith('CD-') || m.code === 'CR' || m.code === 'CD';
                  const markerColor = isCaseMarker ? 'rgba(38, 222, 129, 0.5)' : 'rgba(252, 92, 101, 0.3)';
                  const textColor = isCaseMarker ? 'rgba(38, 222, 129, 0.8)' : 'rgba(252, 92, 101, 0.6)';
                  
                  ctx.save();
                  ctx.setLineDash([]); // Solid lines
                  ctx.strokeStyle = markerColor;
                  ctx.lineWidth = isCaseMarker ? 2 : 1;
                  ctx.beginPath();
                  ctx.moveTo(xPos, chartArea.top);
                  ctx.lineTo(xPos, chartArea.bottom);
                  ctx.stroke();
                  
                  // Draw Short Code
                  ctx.fillStyle = textColor;
                  ctx.font = 'bold 11px Inter';
                  ctx.textAlign = 'center';
                  ctx.fillText(m.code.toUpperCase(), xPos, chartArea.top - 8);
                  ctx.restore();
                });

                // DRAW LEGEND AT THE BOTTOM
                ctx.save();
                ctx.font = '10px Inter';
                ctx.fillStyle = '#9ca3af';
                ctx.textAlign = 'left';
                
                let legendX = 40;
                const legendY = height - 15;
                
                activeMarkers.forEach((m) => {
                    const isCaseMarker = m.code.startsWith('CR-') || m.code.startsWith('CD-') || m.code === 'CR' || m.code === 'CD';
                    const textColor = isCaseMarker ? '#26de81' : '#FC5C65';
                    const text = `${m.code.toUpperCase()}: ${m.label}`;
                    const textWidth = ctx.measureText(text).width;
                    
                    ctx.fillStyle = textColor;
                    ctx.beginPath();
                    ctx.arc(legendX - 8, legendY - 3, 3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = isCaseMarker ? textColor : '#9ca3af'; // Green text for cases
                    ctx.fillText(text, legendX, legendY);
                    legendX += textWidth + 30;
                });
                ctx.restore();
              }
            });
          }

          const activeRanges: { start: number, end: number, label: string, color?: string }[] = [];
          if (chartRangesAttr) {
            const rawRanges = chartRangesAttr.split(';').filter(r => r);
            rawRanges.forEach(r => {
                const parts = r.split('|');
                if (parts.length < 3) return;
                const [startRaw, endRaw, label, color] = parts.map(s => s.trim().toLowerCase());
                let startIndex = -1;
                let endIndex = -1;
                
                // Optimized matching
                for (let idx = 0; idx < labels.length; idx++) {
                    const lLower = labels[idx].toLowerCase();
                    if (startIndex === -1 && lLower.includes(startRaw)) startIndex = idx;
                    if (endIndex === -1 && lLower.includes(endRaw)) endIndex = idx;
                    if (startIndex !== -1 && endIndex !== -1) break;
                }
                
                if (startIndex !== -1 && endIndex !== -1) {
                    activeRanges.push({ start: startIndex, end: endIndex, label, color });
                }
            });
          }

          if (activeRanges.length > 0) {
            plugins.push({
                id: 'ranges',
                beforeDatasetsDraw: (chart: any) => {
                    const { ctx, chartArea, scales } = chart;
                    const x = scales.x;
                    ctx.save();
                    activeRanges.forEach(range => {
                        const startX = x.getPixelForValue(range.start);
                        const endX = x.getPixelForValue(range.end);
                        if (!isNaN(startX) && !isNaN(endX)) {
                            const isCaseRange = range.label.toLowerCase().includes('case') || range.color === 'blue' || range.color === 'green';
                            const primaryColor = isCaseRange ? 'rgba(38, 222, 129, 0.15)' : 'rgba(252, 92, 101, 0.3)';
                            const textColor = isCaseRange ? '#26de81' : '#FC5C65';

                            let fillColor = range.color || primaryColor;
                            if (fillColor === 'blue' || fillColor === 'green') fillColor = 'rgba(38, 222, 129, 0.15)';
                            if (fillColor === 'red') fillColor = 'rgba(252, 92, 101, 0.3)';

                            ctx.fillStyle = fillColor;
                            ctx.fillRect(startX, chartArea.top, endX - startX, chartArea.bottom - chartArea.top);
                            
                            // Draw Label (Vertical)
                            ctx.save();
                            ctx.fillStyle = textColor;
                            ctx.font = 'bold 9px Inter';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            const centerX = startX + (endX - startX) / 2;
                            
                            // Offset to center it nicely
                            ctx.translate(centerX, chartArea.top + 20);
                            ctx.rotate(Math.PI / 2); // Rotate 90 degrees (top down)
                            ctx.fillText(range.label.toUpperCase(), 0, 0);
                            ctx.restore();
                        }
                    });
                    ctx.restore();
                }
            });
          }

          const instance = new Chart(canvas, {
            type: chartType as any,
            data: { labels, datasets },
            plugins,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: false, // CRITICAL FOR CPU SAVINGS
              normalized: true, // TELLS CHART JS DATA IS ALREADY SORTED
              layout: {
                padding: {
                    bottom: chartMarkersAttr ? 50 : 10,
                    top: 20,
                    left: 10,
                    right: 10
                }
              },
              scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#9ca3af',
                        font: { size: 10, family: 'Inter', weight: '500' },
                        maxRotation: 0,
                        autoSkip: true,
                        padding: 10
                    }
                },
                y: {
                    type: 'logarithmic',
                    position: 'right',
                    grid: { color: 'rgba(156, 163, 175, 0.1)' },
                    ticks: {
                        color: '#9ca3af',
                        font: { size: 10, family: 'Inter', weight: '500' },
                        callback: function(value: any) {
                          const val = Number(value);
                          if (chartMode === 'percent') return val.toFixed(0) + '%';
                          if (val >= 1000000) return '$' + (val/1000000).toFixed(1) + 'M';
                          if (val >= 1000) return '$' + (val/1000).toFixed(0) + 'K';
                          return '$' + val.toLocaleString();
                        }
                    }
                },
                yVolume: {
                  display: !isComparison && chartMode === 'price',
                  position: 'right',
                  grid: { display: false },
                  ticks: { display: false },
                  min: 0,
                  max: isComparison ? 0 : Math.max(...datasetsResponse[0].map((d: any) => d.volume || 0)) * 4
                },
                yRSI: {
                  display: !isComparison && rsiAttr,
                  position: 'left',
                  min: 0,
                  max: 400, // Make it take bottom 25% of the chart
                  grid: { display: false },
                  ticks: {
                    display: true,
                    callback: function(value: any) {
                      if (value === 0 || value === 30 || value === 70 || value === 100) return value;
                      return '';
                    },
                    color: 'rgba(156, 163, 175, 0.61)',
                    font: { size: 9, family: 'Inter' }
                  }
                },
                yBTC: {
                  display: isComparison && urls.some(u => u.includes('Bitcoin (BTC)')),
                  position: 'left',
                  type: 'logarithmic',
                  grid: { display: false },
                  ticks: {
                    color: '#A55EEA',
                    font: { size: 10, family: 'Inter', weight: 'bold' },
                    callback: function(value: any) {
                        const val = Number(value);
                        if (val >= 1000) return '$' + (val/1000).toFixed(0) + 'K';
                        return '$' + val.toLocaleString();
                    }
                  }
                }
              },
              interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false,
              },
              hover: {
                mode: 'nearest',
                intersect: false
              },
              plugins: {
                legend: { 
                  display: isComparison,
                  position: 'top',
                  labels: {
                    color: '#9ca3af',
                    font: { family: 'Inter', size: 12 },
                    usePointStyle: true,
                    padding: 20
                  }
                },
                title: {
                  display: !!chartTitle,
                  text: chartTitle + (chartMode === 'percent' ? ' (%)' : ''),
                  color: '#f7b731', // Gold Yellow
                  font: { size: 16, weight: 'bold', family: 'Inter' },
                  padding: { bottom: 20 }
                },
                tooltip: {
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  padding: 12,
                  titleFont: { family: 'Inter' },
                  bodyFont: { family: 'Inter' },
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 1,
                  callbacks: {
                    label: (context: any) => {
                      let label = context.dataset.label || '';
                      if (label) label += ': ';
                      if (context.parsed.y !== null) {
                        if (chartMode === 'percent') {
                          label += (context.parsed.y >= 0 ? '+' : '') + context.parsed.y.toFixed(2) + '%';
                        } else {
                          label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        }
                      }
                      return label;
                    }
                  }
                }
              }
            }
          });

          chartInstances.push(instance);

          // Add Chart Controls
          const parent = canvas.parentElement;
          if (parent) {
            // Clean up old buttons
            parent.querySelectorAll('.chart-controls, .chart-download-btn').forEach(b => b.remove());
            
            const controls = document.createElement('div');
            controls.className = 'chart-controls absolute top-2 right-2 flex gap-2 z-10';
            
            // ZOOM BUTTON
            const zoomBtn = document.createElement('button');
            zoomBtn.className = 'bg-white/90 dark:bg-gray-800/90 p-1.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm';
            zoomBtn.innerHTML = `<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>`;
            zoomBtn.title = 'Fullscreen';
            zoomBtn.onclick = (e) => {
              e.preventDefault();
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else if (parent.requestFullscreen) {
                parent.requestFullscreen();
              }
            };

            // DOWNLOAD BUTTON
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'bg-white/90 dark:bg-gray-800/90 p-1.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm';
            downloadBtn.innerHTML = `<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>`;
            downloadBtn.title = 'Download JPG';
            downloadBtn.onclick = (e) => {
              e.preventDefault();
              const link = document.createElement('a');
              link.download = `${chartTitle || 'market-chart'}.jpg`;
              link.href = canvas.toDataURL('image/jpeg', 0.9);
              link.click();
            };
            
            controls.appendChild(zoomBtn);
            controls.appendChild(downloadBtn);
            parent.appendChild(controls);
          }
        } catch (e) {
          console.error('Failed to initialize chart:', e);
        }
      }
    };

    initializeCharts();

    const resizeObservers: ResizeObserver[] = [];
    
    // Use ResizeObserver for each chart parent to ensure perfect resizing
    canvases.forEach(canvas => {
      const parent = canvas.parentElement;
      if (parent) {
        const ro = new ResizeObserver(() => {
          // Use requestAnimationFrame to sync with browser layout frames
          requestAnimationFrame(() => {
            const instance = Chart.getChart(canvas as HTMLCanvasElement);
            if (instance) {
              instance.resize();
              instance.update('none');
            }
          });
        });
        ro.observe(parent);
        resizeObservers.push(ro);
      }
    });

    return () => {
      resizeObservers.forEach(ro => ro.disconnect());
      chartInstances.forEach(i => i.destroy());
    };
  }, deps);
}
