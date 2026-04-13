import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '../lib/auth-client';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { useBlogCharts } from '../utils/useBlogCharts';
import StatsPanel from '../components/tradingview/StatsPanel';
import YearSelector from '../components/tradingview/YearSelector';
import EventList from '../components/tradingview/EventList';
import MajorList from '../components/tradingview/MajorList';
import CaseList from '../components/tradingview/CaseList';

type TradingViewItem = {
  name: string;
  resolutions: string[];
};

type PatchMetadata = {
  date: string;
  title: string;
  buildId: string;
  filename: string;
};

type MajorMetadata = {
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

type CaseMetadata = {
  name: string;
  releasedDate: string;
  discontinuedDate: string;
  startDateStr: string;
  endDateStr: string;
  image?: string;
};

const TradingViewAdminPage = () => {
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
  
  // Auth guard
  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/auth/login');
    }
  }, [session, isPending, router]);

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
          // Only auto-select if nothing is selected yet
          if (data.items.length > 0 && !selectedItem && !compareMode) {
            const firstItem = data.items[0];
            setSelectedItem(firstItem.name);
            if (firstItem.resolutions.includes('1D')) setResolution('1D');
            else if (firstItem.resolutions.length > 0) setResolution(firstItem.resolutions[0]);
          }
        }
      });
  }, [session, selectedCategory]);

  // Load other static data
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

    // Load watchlist from localStorage
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

  // Extract available years & Fetch Pre-calculated Performance
  useEffect(() => {
    if (!selectedItem || !resolution) return;
    const filename = `${selectedItem}_${resolution}.json`;
    
    // Fetch available years from raw data
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

    // Fetch pre-calculated performance data with Fallback
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
        throw new Error('Static performance data missing or empty');
      } catch (err) {
        console.warn(`Fallback to client-side calculation for ${filename}`);
        // Fallback: Calculate from raw data since we are already fetching 'All' range above
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
  }, [selectedItem, resolution]);

  // Time range reset removed to satisfy "Keep state of other options" requirement

  // Fetch Stats
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
        } else {
          setStats(null);
        }
      });
  }, [selectedItem, resolution, range, selectedYear]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Create a ref or just use id-based logic if ref is complex
      // For simplicity, we'll check if target is within the dropdown element
      const target = event.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (dropdownCategoryRef.current && !dropdownCategoryRef.current.contains(target)) {
        setDropdownCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);




  const filename = useMemo(() => {
    if (compareMode) {
      if (selectedCompareItems.size === 0) return '';
      return Array.from(selectedCompareItems)
        .map(item => `${item}_${resolution}.json`)
        .join(',');
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
    
    if (hideGenericUpdates) {
      list = list.filter(p => p.title !== 'Counter-Strike 2 Update');
    }

    if (hideReleaseNotes) {
      list = list.filter(p => !p.title.toLowerCase().startsWith('release note'));
    }
    
    return list;
  }, [allPatches, selectedYear, hideGenericUpdates, hideReleaseNotes]);

  const markersString = useMemo(() => {
    const monthMap: Record<string, string> = {
      'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
      'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
      'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
    };

    const activePatches = allPatches.filter(p => selectedEventIds.has(p.buildId));
    const patchMarkers = activePatches
      .map(p => {
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
      const abbreviation = c.name
        .replace(/Case/g, '')
        .trim()
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();

      if (c.startDateStr) {
        caseMarkers.push(`${c.startDateStr}:CR-${abbreviation}:Released: ${c.name}`);
      }
      if (showDiscontinued && c.endDateStr && c.discontinuedDate !== 'TBD') {
        caseMarkers.push(`${c.endDateStr}:CD-${abbreviation}:Discontinued: ${c.name}`);
      }
    });

    return [...patchMarkers, ...caseMarkers].join(',');
  }, [allPatches, selectedEventIds, allCases, selectedCaseNames, showDiscontinued]);
  
  const rangesString = useMemo(() => {
    const majorsString = allMajors
      .filter(m => selectedMajorNames.has(m.name))
      .map(m => `${m.startDateStr}|${m.endDateStr}|${m.name}`)
      .join(';');

    return majorsString;
  }, [allMajors, selectedMajorNames]);

  const selectedYearString = selectedYear.join(',');
  const dynamicTitle = compareMode 
    ? `Comparison (${Array.from(selectedCompareItems).join(', ')}) ${resolution}` 
    : `${selectedItem ? selectedItem.replace(/_/g, ' ') : 'Market Chart'} ${resolution} (${selectedYear.length > 0 ? selectedYear.join(',') : range})`;

  const selectedCase = useMemo(() => {
    const normalize = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const sourceList = selectedCategory === 'Agents' ? allAgents : allCases;
    return sourceList.find(c => normalize(c.name) === normalize(selectedItem));
  }, [allCases, allAgents, selectedItem, selectedCategory]);

  const selectedCaseImages = useMemo(() => {
    const normalize = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const sourceList = selectedCategory === 'Agents' ? allAgents : allCases;
    
    if (compareMode) {
      return Array.from(selectedCompareItems)
        .map(name => sourceList.find(c => normalize(c.name) === normalize(name))?.image)
        .filter(img => !!img)
        .join(',');
    }
    return selectedCase?.image || '';
  }, [compareMode, selectedCompareItems, selectedCase, allCases, allAgents, selectedCategory]);

  useBlogCharts([filename, selectedCategory, customStartDate, resolution, range, selectedYearString, markersString, rangesString, showSMA50, showSMA200, showVolSMA50, showRSI, compareBTC, stats?.priceChange, stats?.volumeChange, selectedCaseImages]);

  const toggleEvent = (id: string) => {
    const next = new Set(selectedEventIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedEventIds(next);
  };

  const addAllYearEvents = () => {
    const next = new Set(selectedEventIds);
    yearPatches.forEach(p => next.add(p.buildId));
    setSelectedEventIds(next);
  };

  const clearAllEvents = () => {
    setSelectedEventIds(new Set());
  };

  const toggleMajor = (name: string) => {
    const next = new Set(selectedMajorNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedMajorNames(next);
  };

  const addAllMajors = () => {
    setSelectedMajorNames(new Set(allMajors.map(m => m.name)));
  };

  const clearAllMajors = () => {
    setSelectedMajorNames(new Set());
  };

  const toggleCase = (name: string) => {
    const next = new Set(selectedCaseNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedCaseNames(next);
  };

  const addAllCases = () => {
    setSelectedCaseNames(new Set(allCases.map(c => c.name)));
  };

  const clearAllCases = () => {
    setSelectedCaseNames(new Set());
  };

  const filteredItems = items.filter(i => 
    i.name !== 'Bitcoin (BTC)' && i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const benchmarkItems = items.filter(i => i.name === 'Bitcoin (BTC)');
  
  const currentItem = items.find(i => i.name === selectedItem);

  const handleItemSelect = (itemName: string) => {
    if (compareMode) {
      toggleCompareItem(itemName);
    } else {
      setSelectedItem(itemName);
      setDropdownOpen(false);
    }
  };

  const handlePrevItem = () => {
    if (watchlist.length < 2) return;
    const currentIndex = watchlist.indexOf(selectedItem);
    if (currentIndex === -1) {
      setSelectedItem(watchlist[watchlist.length - 1]);
    } else {
      const nextIndex = (currentIndex - 1 + watchlist.length) % watchlist.length;
      setSelectedItem(watchlist[nextIndex]);
    }
  };

  const handleNextItem = () => {
    if (watchlist.length < 2) return;
    const currentIndex = watchlist.indexOf(selectedItem);
    if (currentIndex === -1) {
      setSelectedItem(watchlist[0]);
    } else {
      const nextIndex = (currentIndex + 1) % watchlist.length;
      setSelectedItem(watchlist[nextIndex]);
    }
  };

  if (isPending || !session) return null;

  return (
    <Main meta={<Meta title="TradingView Admin - KANOCS" description="Market Data Visualizer" />}>
      <div className="flex flex-col gap-8">
        {/* ROW 1: HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-extrabold text-[#f7b731] mb-2">TradingView Visualizer</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Analyze and backtest market movements with integrated game updates.</p>
          </div>
        </div>

        {/* ROW 2: MAIN CONTROLS */}
        <div className="flex flex-col gap-6 bg-[#1a1d26]/50 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex flex-wrap items-end gap-6">

          {/* 1. Category */}
          <div className="relative w-full md:w-56" ref={dropdownCategoryRef}>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Category</label>
            <div 
              className="group relative flex items-center bg-[#1a1d26] border border-gray-800 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-500/50 transition-all shadow-lg"
              onClick={() => setDropdownCategoryOpen(!dropdownCategoryOpen)}
            >
              <span className="block truncate text-sm font-medium text-gray-200 flex-1">{selectedCategory.replace(/-/g, ' ') || 'Select Category...'}</span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {dropdownCategoryOpen && (
              <div className="absolute z-[60] w-full mt-2 bg-[#1a1d26] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className={`px-4 py-3 text-sm cursor-pointer border-b border-gray-800/30 last:border-0 hover:bg-gray-800 flex items-center ${selectedCategory === cat ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-gray-400'}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedItem('');
                        setSelectedCompareItems(new Set());
                        setDropdownCategoryOpen(false);
                      }}
                    >
                      {cat.replace(/-/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 1.5 Start Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Start Date</label>
            <div className="flex bg-[#1a1d26] p-1 rounded-xl border border-gray-800">
                <input 
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-300 outline-none px-2 py-1.5 focus:text-blue-400 transition-colors [color-scheme:dark]"
                />
                {customStartDate && (
                  <button 
                    onClick={() => setCustomStartDate('')}
                    className="p-1.5 text-gray-600 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
            </div>
          </div>

          {/* 2. Data Source */}
          <div className="relative w-full md:w-64" ref={dropdownRef}>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{compareMode ? `Symbols (${selectedCompareItems.size})` : 'Data Source'}</label>
              {compareMode && selectedCompareItems.size > 0 && (
                <button 
                  onClick={() => setSelectedCompareItems(new Set())}
                  className="text-[8px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-tighter"
                >
                  Clear All
                </button>
              )}
            </div>
            <div 
              className="group relative flex items-center bg-[#1a1d26] border border-gray-800 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-500/50 transition-all shadow-lg"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="block truncate text-sm font-medium text-gray-200 flex-1">
                {compareMode 
                  ? (selectedCompareItems.size > 0 ? Array.from(selectedCompareItems).slice(0, 2).join(', ') + (selectedCompareItems.size > 2 ? ` (+${selectedCompareItems.size - 2})` : '') : 'Select Symbols...')
                  : (selectedItem || 'Choose Item...')
                }
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {dropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-[#1a1d26] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                 <div className="p-3 border-b border-gray-800 bg-[#14171f]">
                  <input
                    type="text"
                    className="w-full bg-[#0f1117] border border-gray-800 rounded-lg pl-3 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
                    placeholder="Search source..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                  {benchmarkItems.length > 0 && (
                    <div className="border-b border-gray-800 bg-[#14171f]/50">
                      <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Benchmarks</div>
                      {benchmarkItems.map((item) => (
                        <div
                          key={item.name}
                          className={`px-4 py-3 text-sm cursor-pointer border-b border-gray-800/30 last:border-0 hover:bg-gray-800 flex justify-between items-center group/item ${selectedItem === item.name ? 'text-orange-400 font-semibold bg-orange-500/10' : 'text-gray-400'}`}
                          onClick={() => { setSelectedItem(item.name); setDropdownOpen(false); }}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <button 
                              onClick={(e) => toggleWatchlist(e, item.name)}
                              className={`hover:scale-125 transition-transform ${watchlist.includes(item.name) ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                              <svg className="w-4 h-4" fill={watchlist.includes(item.name) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                            <span className="truncate">{item.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-600 font-mono ml-4">Benchmark</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredItems.slice(0, 50).map((item) => (
                    <div
                      key={item.name}
                      className={`px-4 py-3 text-sm cursor-pointer border-b border-gray-800/30 last:border-0 hover:bg-gray-800 flex justify-between items-center group/item ${
                        compareMode 
                          ? (selectedCompareItems.has(item.name) ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-gray-400')
                          : (selectedItem === item.name ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-gray-400')
                      }`}
                      onClick={() => handleItemSelect(item.name)}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <button 
                          onClick={(e) => toggleWatchlist(e, item.name)}
                          className={`hover:scale-125 transition-transform ${watchlist.includes(item.name) ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                          {watchlist.includes(item.name) ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          )}
                        </button>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono ml-4">{(item as any).recordCount?.toLocaleString()} rows</span>
                    </div>
                  ))}
                  {filteredItems.length > 50 && (
                    <div className="px-4 py-2 text-[10px] text-gray-600 italic text-center bg-gray-900/20 border-t border-gray-800/30">
                      Showing first 50 matches...
                    </div>
                  )}
                  {filteredItems.length === 0 && (
                    <div className="px-4 py-6 text-gray-600 text-center text-xs">No items found</div>
                  ) }
                </div>
              </div>
            )}
          </div>

          {/* 3. Mode */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mode</label>
            <div className="flex bg-[#1a1d26] p-1 rounded-xl border border-gray-800">
                <button
                  onClick={() => setCompareMode(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    !compareMode ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Single
                </button>
                <button
                  onClick={() => setCompareMode(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    compareMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Compare
                </button>
            </div>
          </div>

          {/* 4. Resolution */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Resolution</label>
            <div className="flex bg-[#1a1d26] p-1 rounded-xl border border-gray-800">
              {['1D', '1W', '1M'].map((res) => {
                const available = compareMode ? true : currentItem?.resolutions.includes(res);
                return (
                  <button
                    key={res}
                    disabled={!available}
                    onClick={() => setResolution(res)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      resolution === res ? 'bg-blue-600 text-white shadow-lg' : available ? 'text-gray-400 hover:text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {res === '1D' ? 'D' : res === '1W' ? 'W' : 'M'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Time Range */}
          <div className={`flex flex-col gap-2 ${selectedYear.length > 0 ? 'opacity-30 pointer-events-none' : ''}`}>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Time Range</label>
            <div className="flex bg-[#1a1d26] p-1 rounded-xl border border-gray-800">
              {['1M', '3M', '6M', '1Y', '3Y', 'All'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    range === r ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          {/* Watchlist display */}
          {watchlist.length > 0 && (
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Watchlist</label>
              <div className="flex flex-wrap gap-2">
                {watchlist
                  .map(name => items.find(i => i.name === name))
                  .filter((item): item is TradingViewItem => !!item)
                  .sort((a, b) => ((a as any).recordCount || 0) - ((b as any).recordCount || 0))
                  .map(item => {
                    const abbreviation = item.name
                      .split(/[\s_]+/)
                      .map(word => word[0])
                      .join('')
                      .toUpperCase();
                      
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleItemSelect(item.name)}
                        title={item.name}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                          (compareMode ? selectedCompareItems.has(item.name) : selectedItem === item.name)
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                            : 'bg-[#1a1d26] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                        }`}
                      >
                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="truncate">{abbreviation}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 border-t border-gray-800/50 pt-4">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Technical Indicators</span>
          <div className="flex bg-[#0f1117] p-1.5 rounded-full border border-gray-800 shadow-inner">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors group">
              <input type="checkbox" checked={showSMA50} onChange={e => setShowSMA50(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-rose-500 focus:ring-rose-500" />
              <span className={`text-[10px] font-bold uppercase ${showSMA50 ? 'text-rose-500' : 'text-gray-500 group-hover:text-gray-400'}`}>MA 50</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors group border-l border-gray-800">
              <input type="checkbox" checked={showSMA200} onChange={e => setShowSMA200(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500" />
              <span className={`text-[10px] font-bold uppercase ${showSMA200 ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-400'}`}>MA 200</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors group border-l border-gray-800">
              <input type="checkbox" checked={showVolSMA50} onChange={e => setShowVolSMA50(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-orange-600 focus:ring-orange-500" />
              <span className={`text-[10px] font-bold uppercase ${showVolSMA50 ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-400'}`}>Vol MA 50</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors group border-l border-gray-800">
              <input type="checkbox" checked={showRSI} onChange={e => setShowRSI(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-purple-500" />
              <span className={`text-[10px] font-bold uppercase ${showRSI ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'}`}>RSI</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-purple-500/5 px-3 py-1 rounded transition-colors group border-l border-gray-800">
              <input type="checkbox" checked={compareBTC} onChange={e => setCompareBTC(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-purple-500 focus:ring-purple-500" />
              <span className={`text-[10px] font-bold uppercase ${compareBTC ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'}`}>BTC Compare</span>
            </label>
          </div>
        </div>
      </div>

        {/* ROW 3: FOCUS YEAR */}
        <YearSelector 
          availableYears={availableYears}
          selectedYear={selectedYear}
          onToggle={handleYearToggle}
        />

        {/* ROW 4: EVENTS LIST */}
        <EventList 
          yearPatches={yearPatches}
          selectedEventIds={selectedEventIds}
          toggleEvent={toggleEvent}
          addAll={addAllYearEvents}
          clearAll={clearAllEvents}
          hideGeneric={hideGenericUpdates}
          setHideGeneric={setHideGenericUpdates}
          hideRelease={hideReleaseNotes}
          setHideRelease={setHideReleaseNotes}
          selectedYear={selectedYear}
          filename={filename}
        />

        {/* ROW 4.5: MAJORS LIST */}
        <MajorList 
          majors={allMajors}
          selectedMajorNames={selectedMajorNames}
          toggleMajor={toggleMajor}
          addAll={addAllMajors}
          clearAll={clearAllMajors}
          filename={filename}
        />

        {/* ROW 4.6: CASES LIST */}
        <CaseList 
          cases={allCases}
          selectedCaseNames={selectedCaseNames}
          toggleCase={toggleCase}
          addAll={addAllCases}
          clearAll={clearAllCases}
          filename={filename}
          showDiscontinued={showDiscontinued}
          setShowDiscontinued={setShowDiscontinued}
        />

        {/* ROW 5: CHART */}
        <div className="lg:col-span-3">
             <div className="bg-[#1a1d26] border border-gray-800 rounded-3xl p-6 shadow-2xl relative min-h-[600px] flex flex-col overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none opacity-50"></div>
               
                <div className="flex justify-between items-center mb-6 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {compareMode ? 'Market Comparison' : (selectedItem ? selectedItem.replace(/_/g, ' ') : 'Market Trend')}
                          <span className="text-sm font-normal text-gray-500">{resolution} ({selectedYear.length > 0 ? selectedYear.join(',') : range})</span>
                        </div>
                        
                        {!compareMode && watchlist.length > 1 && (
                          <div className="flex items-center gap-1 bg-[#0f1117] p-1 rounded-xl border border-gray-800 shadow-inner group-hover:border-blue-500/30 transition-colors">
                            <button 
                              onClick={handlePrevItem}
                              className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-blue-400 transition-colors"
                              title="Previous from Watchlist"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <div className="w-px h-4 bg-gray-800"></div>
                            <button 
                              onClick={handleNextItem}
                              className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-blue-400 transition-colors"
                              title="Next from Watchlist"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </h3>
                   </div>
                  </div>
                  
                  {!compareMode && <StatsPanel stats={stats} />}
                </div>

                {selectedEventIds.size > 0 && (
                   <div className="flex items-center gap-2">
                     <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedEventIds.size} Active Markers</span>
                   </div>
                 )}

               <div className="chart-container relative w-full overflow-hidden rounded-2xl border border-gray-800/50 bg-[#0f1117]" style={{ height: '500px' }}>
                  {filename ? (
                    <canvas 
                      key={`${filename}-${range}-${selectedYear.join(',')}-${markersString}`}
                      id="admin-tradingview-chart"
                      className="blog-chart"
                      style={{ width: '100%', height: '100%', display: 'block' }}
                      data-url={compareBTC ? `${filename},Bitcoin (BTC)_1D.json` : filename}
                      data-category={selectedCategory}
                      data-start-date={customStartDate}
                      data-tradingview="true"
                      data-mode={compareMode ? 'percent' : 'price'}
                      data-range={range}
                      data-year={selectedYearString}
                      data-markers={markersString}
                      data-ranges={rangesString}
                      data-title={dynamicTitle}
                      data-sma50={showSMA50 ? 'true' : 'false'}
                      data-sma200={showSMA200 ? 'true' : 'false'}
                      data-volsma50={showVolSMA50 ? 'true' : 'false'}
                      data-rsi={showRSI ? 'true' : 'false'}
                      data-price-delta={stats?.priceChange?.toFixed(2)}
                      data-vol-delta={stats?.volumeChange?.toFixed(2)}
                      data-case-images={selectedCaseImages}
                    ></canvas>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium">Please select a data source above</div>
                  )}
               </div>
                </div>
              
              {/* Yearly Performance Table */}
              {!compareMode && selectedItem && (
                <div className="mt-8 bg-[#1a1d26] border border-gray-800 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-100 uppercase tracking-wider">Yearly Performance Table</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <th className="px-4 py-4">Year</th>
                          <th className="px-4 py-4">Start Date</th>
                          <th className="px-4 py-4">End Date</th>
                          <th className="px-4 py-4 text-right">Start Price</th>
                          <th className="px-4 py-4 text-right">End Price</th>
                          <th className="px-4 py-4 text-center">Return (%)</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {(() => {
                          const yearsMap: Record<string, any> = {};
                          // Dùng availableRawData (giả định chúng ta sẽ thêm state này) 
                          // Hoặc chúng ta fetch dữ liệu ở đây
                          // Để đơn giản, tôi sẽ tính toán từ một useEffect và lưu vào state
                          return performanceData.map((row: any) => (
                            <tr key={row.year} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                              <td className="px-4 py-4 font-bold text-gray-300">{row.year}</td>
                              <td className="px-4 py-4 text-gray-500 text-xs">{row.startDate}</td>
                              <td className="px-4 py-4 text-gray-500 text-xs">{row.endDate}</td>
                              <td className="px-4 py-4 text-right font-mono text-gray-400 group-hover:text-gray-200">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.startPrice)}
                              </td>
                              <td className="px-4 py-4 text-right font-mono text-gray-400 group-hover:text-gray-200">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.endPrice)}
                              </td>
                              <td className={`px-4 py-4 text-center font-bold font-mono text-xl ${row.return >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {row.return >= 0 ? '+' : ''}{row.return.toFixed(0)}%
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
        </div>
      </div>

      <style jsx global>{`
        .blog-chart { cursor: crosshair; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
      `}</style>
    </Main>
  );
};

export default TradingViewAdminPage;
