// // src/pages/reports/ReportsPage.tsx
// import React, { useState, useMemo } from 'react';
// import type { SalesReportData, ReportStat } from '../../types/report';
// import { Download, ShoppingCart, Percent, DollarSign } from 'lucide-react'; // Icons
// import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
// // Import Chart Components
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
// import { arSA } from 'date-fns/locale';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import DatePickerInput from '../../components/ui/datepicker-input';
// import Select from '../../components/ui/select';
// import Spinner from '../../components/ui/spinner';
// import Toolbar from '../../components/ui/toolbar';
// import { useAppSelector } from '../../hooks/redux';
// import AreaChartCard from '../dashboard/components/area-chart-card';
// import StatCardEnhanced from '../dashboard/components/state-card';

// type ReportTimePeriod = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_year' | 'custom';
// type ReportType = 'sales' | 'orders' | 'products' | 'customers'; // Example report types

// // --- Dummy Data Generation (Replace with API fetch) ---
// const generateDummyReportData = (period: ReportTimePeriod): SalesReportData => {
//     const generateStat = (label: string, min: number, max: number, unit?: string, change?: boolean): ReportStat => ({
//         label,
//         value: unit === 'ر.س' ? (Math.random() * (max - min) + min).toFixed(2) : Math.floor(Math.random() * (max - min) + min),
//         unit,
//         change: change ? Math.random() * 15 - 5 : null,
//     });
//      const generateChartData = (count = 7, prefix = "يوم "): { name: string; value: number }[] => Array.from({ length: count }, (_, i) => ({ name: `${prefix}${i + 1}`, value: Math.floor(Math.random() * 500 + 50) }));

//     return {
//         summary: {
//             total_sales: generateStat("إجمالي المبيعات", 5000, 15000, 'ر.س', true),
//             total_orders: generateStat("إجمالي الطلبات", 100, 500, undefined, true),
//             average_order_value: generateStat("متوسط قيمة الطلب", 50, 150, 'ر.س', true),
//             total_discount: generateStat("إجمالي الخصم", 100, 800, 'ر.س'),
//             net_sales: generateStat("صافي المبيعات", 4500, 14000, 'ر.س', true),
//             total_tax: generateStat("إجمالي الضريبة", 700, 2000, 'ر.س'),
//         },
//         sales_trend: { title: "اتجاه المبيعات", data: generateChartData(period === 'day' ? 8 : 7, period === 'day' ? 'س ' : 'يوم '), dataKey: 'value', color: '#10B981' }, // Green
//         sales_by_order_type: {
//             title: "المبيعات حسب نوع الطلب",
//             data: [ { name: 'توصيل', value: Math.floor(Math.random()*6000)+2000 }, { name: 'استلام', value: Math.floor(Math.random()*3000)+1000 }, { name: 'محلي', value: Math.floor(Math.random()*4000)+1500 }],
//             dataKey: 'value',
//             color: '#3B82F6', // Not directly used for Pie/Bar colors
//         },
//         top_selling_items: Array.from({length: 5}, (_, i) => ({ id: i+1, name: `طبق لذيذ ${i+1}`, quantity_sold: Math.floor(Math.random()*50)+5, total_sales: (Math.random()*500+50).toFixed(2) })),
//         top_selling_categories: Array.from({length: 3}, (_, i) => ({ id: i+10, name: `صنف ${i+1}`, quantity_sold: Math.floor(Math.random()*150)+20, total_sales: (Math.random()*2000+300).toFixed(2) })),
//     };
// };
// // --- End Dummy Data ---


// const ReportsPage: React.FC = () => {
//     const [activeReportType, setActiveReportType] = useState<ReportType>('sales');
//     const [timePeriod, setTimePeriod] = useState<ReportTimePeriod>('this_week');
//     const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
//     const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
//     const { restaurant } = useAppSelector(state => state.auth_store); // For currency
//     const currencyIcon = restaurant?.currency_icon || 'ر.س';

//     const formatPrice = (value: number): string => `${value} ${currencyIcon}`;

//     // --- Calculate Date Range based on timePeriod ---
//     const dateRange = useMemo(() => {

//         const today = new Date();
//         switch (timePeriod) {
//             case 'today': return { start: format(today, 'yyyy-MM-dd'), end: format(today, 'yyyy-MM-dd') };
//             case 'yesterday': const yesterday = subDays(today, 1); return { start: format(yesterday, 'yyyy-MM-dd'), end: format(yesterday, 'yyyy-MM-dd') };
//             case 'this_week': return { start: format(startOfWeek(today, { locale: arSA }), 'yyyy-MM-dd'), end: format(endOfWeek(today, { locale: arSA }), 'yyyy-MM-dd') };
//             case 'last_week': const prevWeekStart = startOfWeek(subDays(today, 7), { locale: arSA }); return { start: format(prevWeekStart, 'yyyy-MM-dd'), end: format(endOfWeek(prevWeekStart, { locale: arSA }), 'yyyy-MM-dd') };
//             case 'this_month': return { start: format(startOfMonth(today), 'yyyy-MM-dd'), end: format(endOfMonth(today), 'yyyy-MM-dd') };
//             case 'last_month': const prevMonthStart = startOfMonth(subDays(startOfMonth(today), 1)); return { start: format(prevMonthStart, 'yyyy-MM-dd'), end: format(endOfMonth(prevMonthStart), 'yyyy-MM-dd') };
//             case 'this_year': return { start: format(startOfYear(today), 'yyyy-MM-dd'), end: format(endOfYear(today), 'yyyy-MM-dd') };
//             case 'custom': return { start: customStartDate ? format(customStartDate, 'yyyy-MM-dd') : null, end: customEndDate ? format(customEndDate, 'yyyy-MM-dd') : null };
//             default: return { start: null, end: null };
//         }
//     }, [timePeriod, customStartDate, customEndDate]);

//     // --- API Fetching (Using Dummy Data for now) ---
//     // const queryKey = ['reports', activeReportType, dateRange.start, dateRange.end];
//     // const { data: reportApiResponse, isLoading, error } = useGetQuery<{ data: SalesReportData }>({ // Type will change based on activeReportType
//     //     queryKey,
//     //     url: `reports?type=${activeReportType}&start_date=${dateRange.start || ''}&end_date=${dateRange.end || ''}`,
//     //     options: { enabled: !!dateRange.start && !!dateRange.end || timePeriod !== 'custom' } // Enable based on date range
//     // });
//     // const reportData = reportApiResponse?.data; // Adjust based on actual response structure
//      const isLoading = false; // Simulate
//      const error = null;      // Simulate
//      const reportData = useMemo(() => generateDummyReportData(timePeriod), [timePeriod]); // Use dummy data

//     // --- Chart Colors for Pie/Bar ---
//     const CHART_COLORS = ['#A70000', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899']; // Primary Red, Green, Blue, Amber, Violet, Pink


//     // --- Render Report Content ---
//     const renderReportContent = () => {
//         if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" message="جاري تحميل التقرير..." /></div>;
//         if (error) return <Alert variant="error" title="خطأ في التحميل" message={(error as any).message || "لم نتمكن من تحميل بيانات التقرير."} />;
//         if (!reportData) return <Alert variant="info" message="الرجاء تحديد فترة زمنية لعرض التقرير." />; // Should not happen with default

//         // --- Sales Report Specific Content ---
//         if (activeReportType === 'sales') {
//             const salesData = reportData as SalesReportData; // Type assertion
//             return (
//                  <div className="space-y-6">
//                     {/* Summary Stats */}
//                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {Object.entries(salesData.summary).map(([key, stat]) => (
//                              <StatCardEnhanced
//                                 key={key}
//                                 label={stat.label}
//                                 value={stat.value}
//                                 unit={stat.unit}
//                                 icon={key.includes('order') ? ShoppingCart : key.includes('discount') ? Percent : DollarSign} // Example icon mapping
//                                 iconColor={key.includes('sale') ? '#10B981' : key.includes('tax') ? '#EF4444' : '#3B82F6'} // Example color mapping
//                                 change={stat.change}
//                                 changePeriod={`عن ${timePeriod === 'day' ? 'اليوم السابق' : timePeriod === 'week' ? 'الأسبوع السابق' : timePeriod === 'month' ? 'الشهر السابق' : 'الفترة السابقة'}`} // Basic period text
//                             />
//                         ))}
//                      </div>

//                     {/* Sales Trend Chart */}
//                     <AreaChartCard {...salesData.sales_trend} isLoading={isLoading} />

//                     {/* Grid for Pie Chart & Top Lists */}
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                          {/* Sales by Order Type (Pie Chart) */}
//                         <Card title={salesData.sales_by_order_type.title} className="lg:col-span-1">
//                             <div className="h-64 w-full"> {/* Fixed height */}
//                                 <ResponsiveContainer>
//                                      <PieChart>
//                                          <Pie
//                                             data={salesData.sales_by_order_type.data}
//                                             cx="50%"
//                                             cy="50%"
//                                             labelLine={false}
//                                             outerRadius={80}
//                                             fill="#8884d8"
//                                             dataKey="value"
//                                             label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//                                                  const radius = innerRadius + (outerRadius - innerRadius) * 1.1; // Position label outside
//                                                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
//                                                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
//                                                   return ( <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}> {`${salesData.sales_by_order_type.data[index].name} (${(percent * 100).toFixed(0)}%)`} </text> );
//                                              }}
//                                          >
//                                             {salesData.sales_by_order_type.data.map((entry, index) => ( <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} /> ))}
//                                         </Pie>
//                                         <Tooltip formatter={(value: number) => `${formatPrice(value, currencyIcon)}`} />
//                                          {/* <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/> */}
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                              </div>
//                         </Card>

//                          {/* Top Selling Items */}
//                         <Card title="الأصناف الأكثر مبيعاً" className="lg:col-span-1">
//                              <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
//                                  {salesData.top_selling_items.map((item, index) => (
//                                     <li key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-1.5 last:border-0">
//                                          <span className="text-gray-700">{index+1}. {item.name}</span>
//                                          <span className="font-medium text-gray-900">{item.quantity_sold} <span className='text-xs text-gray-500'>طلب</span></span>
//                                          {/* <span className="font-medium text-gray-900">{formatPrice(item.total_sales, currencyIcon)}</span> */}
//                                     </li>
//                                  ))}
//                              </ul>
//                          </Card>

//                          {/* Top Selling Categories */}
//                         <Card title="الأصناف الأعلى مبيعاً" className="lg:col-span-1">
//                             <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
//                                 {salesData.top_selling_categories.map((cat, index) => (
//                                     <li key={cat.id} className="flex justify-between items-center border-b border-gray-100 pb-1.5 last:border-0">
//                                         <span className="text-gray-700">{index+1}. {cat.name}</span>
//                                          <span className="font-medium text-gray-900">{formatPrice(cat.total_sales, currencyIcon)}</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </Card>
//                     </div>
//                  </div>
//             );
//         }
//         // Add `else if (activeReportType === 'orders')` etc. for other reports
//         else {
//              return <Card><p className="text-center text-gray-500 py-10">تقرير <strong className="font-medium text-primary">{activeReportType}</strong> سيتم عرضه هنا قريباً...</p></Card>;
//         }
//     };

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "التقارير" }, ];
//     const toolbarActions = (
//         <Button variant="secondary" size="sm" icon={Download} disabled={isLoading}>
//             تصدير التقرير
//         </Button>
//     );

//     // --- Time Period Select Buttons ---
//      const timePeriodOptions: { key: ReportTimePeriod; label: string }[] = [
//         { key: 'today', label: 'اليوم' }, { key: 'yesterday', label: 'الأمس' },
//         { key: 'this_week', label: 'هذا الأسبوع' }, { key: 'last_week', label: 'الأسبوع الماضي' },
//         { key: 'this_month', label: 'هذا الشهر' }, { key: 'last_month', label: 'الشهر الماضي' },
//         { key: 'this_year', label: 'هذه السنة' }, { key: 'custom', label: 'فترة مخصصة' },
//      ];


//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

//             {/* --- Filters Row --- */}
//             <Card>
//                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                     {/* Report Type Selector */}
//                      <div>
//                          <label htmlFor="reportType" className="sr-only">نوع التقرير</label>
//                          <Select id="reportType" name="reportType" size="md" value={activeReportType}
//                             onChange={(e) => setActiveReportType(e.target.value as ReportType)}
//                             options={[
//                                 {value: 'sales', label: 'تقرير المبيعات'},
//                                 {value: 'orders', label: 'تقرير الطلبات'},
//                                 {value: 'products', label: 'تقرير المنتجات'},
//                                 {value: 'customers', label: 'تقرير العملاء'},
//                             ]}
//                          />
//                      </div>

//                     {/* Time Period Selector */}
//                      <div className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg p-1 flex-wrap justify-center">
//                          {timePeriodOptions.map(period => (
//                              <button
//                                 key={period.key}
//                                 onClick={() => setTimePeriod(period.key)}
//                                 className={`px-3 py-1 text-xs font-medium rounded-md ${ timePeriod === period.key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/60' } transition-all`}
//                              >
//                                  {period.label}
//                              </button>
//                          ))}
//                      </div>

//                     {/* Custom Date Range Pickers (Show only when 'custom' is selected) */}
//                     {timePeriod === 'custom' && (
//                          <div className="flex items-center gap-2 mt-2 md:mt-0">
//                              <div className="w-40">
//                                  <DatePickerInput
//                                      selectedDate={customStartDate}
//                                      onChange={(date) => setCustomStartDate(date)}
//                                      placeholder='تاريخ البدء'
//                                      selectsStart
//                                      startDate={customStartDate}
//                                      endDate={customEndDate}
//                                      maxDate={customEndDate || new Date()} // Prevent start after end
//                                   />
//                              </div>
//                               <span className="text-gray-400">-</span>
//                               <div className="w-40">
//                                   <DatePickerInput
//                                      selectedDate={customEndDate}
//                                      onChange={(date) => setCustomEndDate(date)}
//                                      placeholder='تاريخ الانتهاء'
//                                      selectsEnd
//                                      startDate={customStartDate}
//                                      endDate={customEndDate}
//                                      minDate={customStartDate} // Prevent end before start
//                                      maxDate={new Date()} // Prevent selecting future dates
//                                   />
//                              </div>
//                          </div>
//                     )}
//                 </div>
//              </Card>


//              {/* --- Report Content Area --- */}
//              {renderReportContent()}

//         </div>
//     );
// };

// export default ReportsPage;