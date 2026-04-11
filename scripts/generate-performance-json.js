const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data', 'tradingview');
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'tradingview-other');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function calculateYearlyPerformance(jsonData) {
  const yearsMap = {};
  
  jsonData.forEach(item => {
    if (!item.date || !item.timestamp) return;
    const year = new Date(item.timestamp).getFullYear();
    if (!yearsMap[year]) {
      yearsMap[year] = {
        year,
        startDate: item.date,
        startPrice: item.price,
        endDate: item.date,
        endPrice: item.price
      };
    } else {
      yearsMap[year].endDate = item.date;
      yearsMap[year].endPrice = item.price;
    }
  });

  return Object.keys(yearsMap).sort().map(year => {
    const data = yearsMap[year];
    return {
      ...data,
      return: ((data.endPrice - data.startPrice) / data.startPrice) * 100
    };
  });
}

function processData() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  files.forEach(file => {
    // Bỏ qua các file copy hoặc tạm
    if (file.toLowerCase().includes('copy')) {
      console.log(`Skipping copy file: ${file}`);
      return;
    }

    try {
      const inputPath = path.join(DATA_DIR, file);
      const content = fs.readFileSync(inputPath, 'utf8');
      const jsonData = JSON.parse(content);
      
      if (!Array.isArray(jsonData)) return;

      // Chuyển đổi VND sang USD (tỉ giá 27000) trước khi xử lý
      jsonData.forEach(item => {
        if (item.price) {
          item.price = item.price / 27000;
        }
      });

      const performance = calculateYearlyPerformance(jsonData);
      
      // Chuẩn hóa tên file đầu ra: Loại bỏ khoảng trắng thừa nếu có
      const outputFilename = file.replace('.json', '_performance.json');
      const outputPath = path.join(OUTPUT_DIR, outputFilename);

      fs.writeFileSync(outputPath, JSON.stringify(performance, null, 2));
      console.log(`Generated performance for ${file} (Converted to USD)`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  });
}

processData();
