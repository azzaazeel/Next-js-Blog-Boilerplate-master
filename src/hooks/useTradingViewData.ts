import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '../lib/auth-client';

export type TradingViewItem = {
  name: string;
  resolutions: string[];
};

export type PatchMetadata = {
  date: string;
  title: string;
  buildId: string;
  filename: string;
};

export type MajorMetadata = {
  name: string;
  dateRange: string;
  startDateStr: string;
  endDateStr: string;
  prize: string;
  location: string;
  teams: string;
  winner: string;
  runnerUp: string;
};

export type CaseMetadata = {
  name: string;
  releasedDate: string;
  discontinuedDate: string;
  startDateStr: string;
  endDateStr: string;
  image?: string;
};

export const useTradingViewData = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [items, setItems] = useState<TradingViewItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [resolution, setResolution] = useState<string>('1D');
  const [range, setRange] = useState<string>('1Y');
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [allPatches, setAllPatches] = useState<PatchMetadata[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());
  
  const [allMajors, setAllMajors] = useState<MajorMetadata[]>([]);
  const [selectedMajorNames, setSelectedMajorNames] = useState<Set<string>>(new Set());
  
  const [allCases, setAllCases] = useState<CaseMetadata[]>([]);
  const [selectedCaseNames, setSelectedCaseNames] = useState<Set<string>>(new Set());
  const [allAgents, setAllAgents] = useState<CaseMetadata[]>([]);
  const [showDiscontinued, setShowDiscontinued] = useState(false);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  const [hideGenericUpdates, setHideGenericUpdates] = useState<boolean>(true);
  const [hideReleaseNotes, setHideReleaseNotes] = useState<boolean>(true);
  const [showSMA50, setShowSMA50] = useState<boolean>(true);
  const [showSMA200, setShowSMA200] = useState<boolean>(true);
  const [showVolSMA50, setShowVolSMA50] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [compareBTC, setCompareBTC] = useState<boolean>(false);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [selectedCompareItems, setSelectedCompareItems] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [dropdownCategoryOpen, setDropdownCategoryOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownCategoryRef = useRef<HTMLDivElement>(null);
  
  const [stats, setStats] = useState<{
    startPrice: number;
    endPrice: number;
    high: number;
    low: number;
    priceChange: number;
    volumeChange: number;
    avgVolume: number;
  } | null>(null);

  // Derive sorted watchlist based on items order (which is sorted by recordCount increasing)
  const sortedWatchlist = useMemo(() => {
    return [...watchlist].sort((a, b) => {
      const indexA = items.findIndex(i => i.name === a);
      const indexB = items.findIndex(i => i.name === b);
      // If item not found (maybe changed category), put at end
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [watchlist, items]);

  // Load categories and initial items
  useEffect(() => {
    if (!session) return;
    
    fetch(`/api/admin/tradingview-files${selectedCategory ? `?category=${selectedCategory}` : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
        if (data.selectedCategory && !selectedCategory) setSelectedCategory(data.selectedCategory);
        
        if (data.items) {
          setItems(data.items);
          if (data.items.length > 0 && !selectedItem && !compareMode) {
            const firstItem = data.items[0];
            setSelectedItem(firstItem.name);
            if (firstItem.resolutions.includes('1D')) setResolution('1D');
            else if (firstItem.resolutions.length > 0) setResolution(firstItem.resolutions[0]);
          }
        }
      });
  }, [session, selectedCategory]);

  // Load static data
  useEffect(() => {
    if (!session) return;

    fetch('/api/admin/patches')
      .then(res => res.json())
      .then(data => {
        if (data.patches) setAllPatches(data.patches);
      });

    fetch('/api/admin/majors')
      .then(res => res.json())
      .then(data => {
        if (data.majors) setAllMajors(data.majors);
      });

    fetch('/api/admin/cases')
      .then(res => res.json())
      .then(data => {
        if (data.cases) setAllCases(data.cases);
      });

    fetch('/api/admin/agents')
      .then(res => res.json())
      .then(data => {
        if (data.agents) setAllAgents(data.agents);
      });

    const savedWatchlist = localStorage.getItem('tradingview_watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (e) {
        console.error('Failed to parse watchlist', e);
      }
    }
  }, [session]);

  const toggleWatchlist = (e: React.MouseEvent, itemName: string) => {
    e.stopPropagation();
    setWatchlist(prev => {
      const next = prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName];
      localStorage.setItem('tradingview_watchlist', JSON.stringify(next));
      return next;
    });
  };

  const toggleCompareItem = (itemName: string) => {
    const next = new Set(selectedCompareItems);
    if (next.has(itemName)) next.delete(itemName);
    else next.add(itemName);
    setSelectedCompareItems(next);
  };

  const handleYearToggle = (year: string) => {
    if (year === 'All') {
      setSelectedYear([]);
      setRange('All');
      return;
    }
    if (selectedYear.length === 0) {
      setSelectedYear([year]);
      setRange('Custom');
      return;
    }
    if (selectedYear.includes(year)) {
      const next = selectedYear.filter(y => y !== year);
      if (next.length === 0) {
        setSelectedYear([]);
        setRange('All');
      } else {
        setSelectedYear(next);
      }
      return;
    }
    const yearNum = parseInt(year);
    const selectedNums = selectedYear.map(y => parseInt(y)).sort((a, b) => a - b);
    const minSelected = selectedNums[0];
    const maxSelected = selectedNums[selectedNums.length - 1];

    if (yearNum === minSelected - 1 || yearNum === maxSelected + 1) {
      setSelectedYear(prev => [...prev, year].sort((a, b) => parseInt(a) - parseInt(b)));
    } else {
      setSelectedYear([year]);
    }
    setRange('Custom');
  };

  useEffect(() => {
    if (!selectedItem || !resolution) return;
    const filename = `${selectedItem}_${resolution}.json`;
    
    fetch(`/api/admin/tradingview-data?url=${encodeURIComponent(filename)}&range=All&category=${selectedCategory}&startDate=${customStartDate}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const years = new Set<string>();
          data.forEach((item: any) => {
            if (item.date) {
              const parts = item.date.split(' ');
              const year = parts[parts.length - 1];
              if (year && /^\d{4}$/.test(year)) years.add(year);
            }
          });
          setAvailableYears(Array.from(years).sort().reverse());
        }
      });

    const fetchPerformance = async () => {
      try {
        const res = await fetch(`/api/admin/tradingview-performance?url=${encodeURIComponent(filename)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPerformanceData(data);
            return;
          }
        }
        throw new Error('Static performance data missing');
      } catch (err) {
        fetch(`/api/admin/tradingview-data?url=${encodeURIComponent(filename)}&range=All&category=${selectedCategory}&startDate=${customStartDate}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              const yearsMap: Record<string, any> = {};
              data.forEach((item: any) => {
                const year = item.date?.split(' ').pop();
                if (year && /^\d{4}$/.test(year)) {
                  if (!yearsMap[year]) {
                    yearsMap[year] = { year, startDate: item.date, startPrice: item.price, endDate: item.date, endPrice: item.price };
                  } else {
                    yearsMap[year].endDate = item.date;
                    yearsMap[year].endPrice = item.price;
                  }
                }
              });
              const perf = Object.keys(yearsMap).sort().map(y => ({
                ...yearsMap[y],
                return: ((yearsMap[y].endPrice - yearsMap[y].startPrice) / yearsMap[y].startPrice) * 100
              }));
              setPerformanceData(perf);
            }
          });
      }
    };
    fetchPerformance();
  }, [selectedItem, resolution, selectedCategory, customStartDate]);

  useEffect(() => {
    if (!selectedItem || !resolution) return;
    const filename = `${selectedItem}_${resolution}.json`;
    const selectedYearString = selectedYear.join(',');
    
    fetch(`/api/admin/tradingview-data?url=${encodeURIComponent(filename)}&range=${range}&year=${selectedYearString}&category=${selectedCategory}&startDate=${customStartDate}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const prices = data.map(d => d.price);
          const volumes = data.map(d => d.volume || 0);
          const startPrice = prices.slice(0, Math.min(7, prices.length)).reduce((a, b) => a + b, 0) / Math.min(7, prices.length);
          const endPrice = prices.slice(-Math.min(7, prices.length)).reduce((a, b) => a + b, 0) / Math.min(7, prices.length);
          const high = Math.max(...prices);
          const low = Math.min(...prices);
          const startVol = volumes.slice(0, Math.min(7, volumes.length)).reduce((a, b) => a + b, 0) / Math.min(7, volumes.length);
          const endVol = volumes.slice(-Math.min(7, volumes.length)).reduce((a, b) => a + b, 0) / Math.min(7, volumes.length);

          setStats({
            startPrice,
            endPrice,
            high,
            low,
            priceChange: ((endPrice - startPrice) / startPrice) * 100,
            volumeChange: startVol > 0 ? ((endVol - startVol) / startVol) * 100 : 0,
            avgVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length
          });
        }
      });
  }, [selectedItem, resolution, range, selectedYear, selectedCategory, customStartDate]);

  const filename = useMemo(() => {
    if (compareMode) {
      if (selectedCompareItems.size === 0) return '';
      return Array.from(selectedCompareItems).map(item => `${item}_${resolution}.json`).join(',');
    }
    return selectedItem ? `${selectedItem}_${resolution}.json` : '';
  }, [selectedItem, resolution, compareMode, selectedCompareItems]);

  const yearPatches = useMemo(() => {
    let list = allPatches;
    if (selectedYear.length > 0) {
      list = allPatches.filter(p => selectedYear.some(y => p.date.includes(y)));
    } else {
      list = allPatches.slice(0, 100);
    }
    if (hideGenericUpdates) list = list.filter(p => p.title !== 'Counter-Strike 2 Update');
    if (hideReleaseNotes) list = list.filter(p => !p.title.toLowerCase().startsWith('release note'));
    return list;
  }, [allPatches, selectedYear, hideGenericUpdates, hideReleaseNotes]);

  const markersString = useMemo(() => {
    const monthMap: Record<string, string> = {
      'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
      'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
      'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
    };
    const activePatches = allPatches.filter(p => selectedEventIds.has(p.buildId));
    const patchMarkers = activePatches.map(p => {
      const parts = p.date.split(' ');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const monthShort = monthMap[month] || month;
        const dayPadded = day.padStart(2, '0');
        const normalizedDate = `${monthShort} ${dayPadded} ${year}`;
        return `${normalizedDate}:${p.buildId.slice(0, 2)}:${p.title}`;
      }
      return `${p.date}:${p.buildId.slice(0, 2)}:${p.title}`;
    });

    const caseMarkers: string[] = [];
    allCases.filter(c => selectedCaseNames.has(c.name)).forEach(c => {
      const abbreviation = c.name.replace(/Case/g, '').trim().split(' ').map(word => word[0]).join('').toUpperCase();
      if (c.startDateStr) caseMarkers.push(`${c.startDateStr}:CR-${abbreviation}:Released: ${c.name}`);
      if (showDiscontinued && c.endDateStr && c.discontinuedDate !== 'TBD') caseMarkers.push(`${c.endDateStr}:CD-${abbreviation}:Discontinued: ${c.name}`);
    });

    return [...patchMarkers, ...caseMarkers].join(',');
  }, [allPatches, selectedEventIds, allCases, selectedCaseNames, showDiscontinued]);
  
  const rangesString = useMemo(() => {
    return allMajors.filter(m => selectedMajorNames.has(m.name)).map(m => `${m.startDateStr}|${m.endDateStr}|${m.name}`).join(';');
  }, [allMajors, selectedMajorNames]);

  const selectedCaseImages = useMemo(() => {
    const normalize = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const sourceList = selectedCategory === 'Agents' ? allAgents : allCases;
    if (compareMode) {
      return Array.from(selectedCompareItems).map(name => sourceList.find(c => normalize(c.name) === normalize(name))?.image).filter(img => !!img).join(',');
    }
    const selectedCase = sourceList.find(c => normalize(c.name) === normalize(selectedItem));
    return selectedCase?.image || '';
  }, [compareMode, selectedCompareItems, selectedItem, allCases, allAgents, selectedCategory]);

  return {
    items, setItems, selectedItem, setSelectedItem, resolution, setResolution, range, setRange,
    selectedYear, setSelectedYear, availableYears, allPatches, selectedEventIds, setSelectedEventIds,
    allMajors, selectedMajorNames, setSelectedMajorNames, allCases, selectedCaseNames, setSelectedCaseNames,
    allAgents, showDiscontinued, setShowDiscontinued, dropdownOpen, setDropdownOpen, searchQuery, setSearchQuery,
    watchlist: sortedWatchlist, hideGenericUpdates, setHideGenericUpdates, hideReleaseNotes, setHideReleaseNotes,
    showSMA50, setShowSMA50, showSMA200, setShowSMA200, showVolSMA50, setShowVolSMA50,
    showRSI, setShowRSI, compareBTC, setCompareBTC, compareMode, setCompareMode,
    selectedCompareItems, setSelectedCompareItems, categories, setCategories,
    selectedCategory, setSelectedCategory, customStartDate, setCustomStartDate,
    dropdownCategoryOpen, setDropdownCategoryOpen, performanceData, stats,
    dropdownRef, dropdownCategoryRef, filename, yearPatches, markersString, rangesString, selectedCaseImages,
    toggleWatchlist, toggleCompareItem, handleYearToggle, session, isPending
  };
};
