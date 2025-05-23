import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import Card from './card';

// Re-export ColumnDefinition or define here if preferred
export interface ColumnDefinition<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T, index: number) => React.ReactNode; // Pass index to render
    headerClassName?: string;
    cellClassName?: string;
    width?: string;
}

interface DataTableProps<T> {
    columns: ColumnDefinition<T>[];
    data: T[];
    isLoading?: boolean;
    error?: string | null;
    emptyStateMessage?: string;
    onRowClick?: (item: T) => void;
    rowKey?: keyof T | ((item: T) => string | number); // Allow function for complex keys
    className?: string;
}

function DataTable<T extends { id?: number | string }>({
    columns,
    data,
    isLoading = false,
    error = null,
    emptyStateMessage = "لا توجد بيانات لعرضها.",
    onRowClick,
    rowKey = 'id',
    className = ''
}: DataTableProps<T>) {

    const getRowKeyValue = (item: T, index: number): string | number => {
        if (typeof rowKey === 'function') {
            return rowKey(item);
        }
        const key = rowKey as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (item as any)[key] !== undefined ? (item as any)[key] : index;
    };

    return (
        <Card className={`!p-0 ${className}`}>
            <div className="overflow-x-auto overflow-y-auto w-full max-h-[calc(100vh-200px)]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    scope="col"
                                    style={{ width: col.width, minWidth: col.width || '100px' }}
                                    className={`px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.headerClassName || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-16">
                                    <div className="inline-flex items-center text-gray-500">
                                        <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                        <span>جاري التحميل...</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!isLoading && error && (
                             <tr>
                                <td colSpan={columns.length} className="text-center py-10 px-4">
                                     <div className="inline-flex items-center text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                         <AlertTriangle className="w-5 h-5 ml-2" />
                                         <span>{error}</span>
                                     </div>
                                </td>
                             </tr>
                        )}
                        {!isLoading && !error && data?.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-16 text-gray-400 text-sm">
                                    {emptyStateMessage}
                                </td>
                            </tr>
                        )}
                        {!isLoading && !error && data?.map((item, index) => (
                            <tr
                                key={getRowKeyValue(item, index)}
                                onClick={() => onRowClick && onRowClick(item)}
                                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50/80 transition-colors duration-100' : ''}`}
                            >
                                {columns.map((col) => {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const value = (item as any)[col.key as string];
                                    return (
                                        <td
                                            key={`${String(col.key)}-${getRowKeyValue(item, index)}`}
                                            className={`px-4 py-2 text-sm align-middle ${col.cellClassName || 'text-gray-700'}`} // Align middle
                                            style={{ minWidth: col.width || '100px' }}
                                        >
                                             {/* Pass index to render function */}
                                            {col.render ? col.render(item, index) : (value !== null && value !== undefined ? String(value) : <span className="text-gray-400">-</span>)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination can be added here */}
        </Card>
    );
}

export default DataTable;