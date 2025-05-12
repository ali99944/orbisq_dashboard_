// import React from 'react';
// import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts'; // Removed XAxis, YAxis, CartesianGrid
// import { ChartDataPoint } from '../../../types/dashboard';
// import Spinner from '../../../components/ui/spinner';

// interface AreaChartCardProps {
//     title: string;
//     data: ChartDataPoint[] | undefined | null;
//     dataKey: string;
//     color?: string;
//     isLoading?: boolean;
//     // Optional: Height override
//     height?: number;
// }

// const AreaChartCard: React.FC<AreaChartCardProps> = ({
//     title,
//     data,
//     dataKey,
//     color = "#A70000", // Default Orbis Q primary
//     isLoading = false,
//     height = 120, // Default shorter height for minimalist view
// }) => {

//     // Simple value formatter for Tooltip
//     const formatValue = (value: number) => {
//         // Keep it simple or use localeString etc.
//         return value?.toLocaleString('ar-EG') ?? '-';
//     };

//     // Custom Tooltip remains useful
//     const CustomTooltip = ({ active, payload, label }: any) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div className="bg-black/70 backdrop-blur-sm border border-gray-600/50 shadow-lg rounded-md p-2 text-xs">
//                     {/* Show label (e.g., day/week name) if meaningful */}
//                     <p className="font-medium text-gray-300 mb-0.5">{`${label}`}</p>
//                     {/* Use title passed to the card */}
//                     <p style={{ color: '#FFF' }}>{`${title}: `}<span className='font-semibold'>{formatValue(payload[0].value)}</span></p>
//                 </div>
//             );
//         }
//         return null;
//     };

//      // Find the latest value to display
//      const latestValue = data && data.length > 0 ? data[data.length - 1]?.[dataKey] : null;
//      const formattedLatestValue = latestValue !== null ? formatValue(Number(latestValue)) : '-';


//     return (
//         // Use border, no shadow
//         <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
//             {/* Header: Title and latest value */}
//             <div className="flex justify-between items-baseline mb-2 p-2">
//                  <h3 className="text-sm font-medium text-gray-600">{title}</h3>
//                  <p className="text-lg font-bold text-gray-900">{formattedLatestValue}</p>
//             </div>

//             {/* Chart Area */}
//             <div style={{ height: `${height}px` }} className="w-full flex-grow"> {/* Use prop height */}
//                 {isLoading && (
//                      <div className="flex items-center justify-center h-full w-full text-gray-500">
//                          <Spinner message="جاري التحميل..." size="sm"/>
//                      </div>
//                 )}
//                  {!isLoading && (!data || data.length === 0) && (
//                      <div className="flex items-center justify-center h-full w-full text-gray-400 text-xs italic">
//                         لا توجد بيانات كافية للعرض.
//                      </div>
//                 )}
//                  {!isLoading && data && data.length > 0 && (
//                     <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart
//                             data={data}
//                             // Adjust margins: Remove space previously needed for axes labels
//                             margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
//                         >
//                              {/* Gradient definition */}
//                             <defs>
//                                 <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="5%" stopColor={color} stopOpacity={0.4}/> {/* Slightly stronger start opacity */}
//                                 <stop offset="95%" stopColor={color} stopOpacity={0}/>
//                                 </linearGradient>
//                             </defs>

//                             {/* Tooltip is still useful for seeing values on hover */}
//                             <Tooltip
//                                 content={<CustomTooltip />}
//                                 cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }} // Subtle dashed line cursor
//                             />

//                             {/* The Area itself */}
//                             <Area
//                                 type="monotone" // Smooth curve
//                                 dataKey={dataKey}
//                                 stroke={color} // Line color
//                                 fillOpacity={1}
//                                 fill={`url(#gradient-${dataKey})`} // Gradient fill
//                                 strokeWidth={2}
//                                 // activeDot={{ r: 5, strokeWidth: 1, fill: color, stroke: '#fff' }} // Optional: style active dot
//                                 dot={false} // Hide dots on the line for cleaner look
//                             />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AreaChartCard;