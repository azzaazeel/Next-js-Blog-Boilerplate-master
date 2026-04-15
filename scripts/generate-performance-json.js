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

function getFilesRecursive(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const res = path.resolve(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getFilesRecursive(res));
    } else if (item.isFile() && item.name.endsWith('.json')) {
      results.push({ fullPath: res, filename: item.name });
    }
  }
  return results;
}

function processData() {
  const args = process.argv.slice(2);
  const categoryArg = args.find(a => a.startsWith('--category='));
  const category = categoryArg ? categoryArg.split('=')[1] : null;

  let filesToProcess = [];
  if (category) {
    const categoryDir = path.join(DATA_DIR, category);
    if (fs.existsSync(categoryDir)) {
      console.log(`Filtering by category: ${category}`);
      filesToProcess = getFilesRecursive(categoryDir);
    } else {
      console.error(`Category directory not found: ${category}`);
      return;
    }
  } else {
    filesToProcess = getFilesRecursive(DATA_DIR);
  }

  filesToProcess.forEach(({ fullPath, filename }) => {
    // Bỏ qua các file copy hoặc tạm
    if (filename.toLowerCase().includes('copy')) {
      console.log(`Skipping copy file: ${filename}`);
      return;
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf8');
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
      const outputFilename = filename.replace('.json', '_performance.json');
      const outputPath = path.join(OUTPUT_DIR, outputFilename);

      fs.writeFileSync(outputPath, JSON.stringify(performance, null, 2));
      console.log(`Generated performance for ${filename} (Converted to USD)`);
    } catch (err) {
      console.error(`Error processing ${filename}:`, err.message);
    }
  });
}

processData();
