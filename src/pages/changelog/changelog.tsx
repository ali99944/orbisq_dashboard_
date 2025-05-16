import React from 'react';
import Card from '../../components/ui/card';
import { Tag, Bug, Zap, Star, AlertTriangle, ArrowUp } from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'feature' | 'improvement' | 'bugfix' | 'critical' | 'performance';
    description: string;
  }[];
}

const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2024-01-15',
    changes: [
      {
        type: 'feature',
        description: 'أضفنا صفحة الدعم الفني مع معلومات الاتصال لمصر والأردن'
      },
      {
        type: 'improvement',
        description: 'تحسين واجهة المستخدم لصفحة الكوبونات مع التحقق من الصحة المحسن'
      },
      {
        type: 'bugfix',
        description: 'إصلاح مشكلة في عرض التواريخ في التقارير'
      },
      {
        type: 'critical',
        description: 'تحسين أمان عملية تغيير كلمة المرور'
      },
      {
        type: 'performance',
        description: 'تحسين أداء تحميل الصفحة في قسم المنتجات'
      }
    ]
  },
  {
    version: '1.1.0',
    date: '2023-12-20',
    changes: [
      {
        type: 'feature',
        description: 'إضافة نظام إدارة الكوبونات الجديد'
      },
      {
        type: 'improvement',
        description: 'تحديث تصميم لوحة التحكم الرئيسية'
      },
      {
        type: 'bugfix',
        description: 'إصلاح مشكلات في نظام إدارة المخزون'
      }
    ]
  },
  {
    version: '1.0.0',
    date: '2023-12-01',
    changes: [
      {
        type: 'feature',
        description: 'إطلاق النسخة الأولى من نظام Orbis Q'
      },
      {
        type: 'feature',
        description: 'نظام إدارة الطلبات الأساسي'
      },
      {
        type: 'feature',
        description: 'نظام إدارة المنتجات والمخزون'
      }
    ]
  }
];

const getChangeIcon = (type: string) => {
  switch (type) {
    case 'feature':
      return <Tag className="w-5 h-5 text-blue-500" />;
    case 'improvement':
      return <ArrowUp className="w-5 h-5 text-green-500" />;
    case 'bugfix':
      return <Bug className="w-5 h-5 text-orange-500" />;
    case 'critical':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'performance':
      return <Zap className="w-5 h-5 text-purple-500" />;
    default:
      return <Star className="w-5 h-5 text-gray-500" />;
  }
};

const getChangeTypeLabel = (type: string): string => {
  switch (type) {
    case 'feature':
      return 'ميزة جديدة';
    case 'improvement':
      return 'تحسين';
    case 'bugfix':
      return 'إصلاح خطأ';
    case 'critical':
      return 'تحديث هام';
    case 'performance':
      return 'تحسين الأداء';
    default:
      return 'تغيير';
  }
};

const ChangelogPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#A70000]">سجل التحديثات</h1>
      
      <div className="space-y-8 max-w-4xl mx-auto">
        {CHANGELOG_DATA.map((release) => (
          <Card key={release.version} className="p-4  duration-300 border-[#A70000]/20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#A70000]/20">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-[#A70000]">الإصدار {release.version}</h2>
                <span className="text-sm text-[#A70000]/60 bg-[#A70000]/5 px-3 py-1 rounded-full">{release.date}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {release.changes.map((change, index) => (
                <div key={index} className="flex items-start gap-4 hover:bg-[#A70000]/5 p-2 rounded-lg transition-colors duration-200">
                  <div className="mt-1 bg-white p-2 rounded-full">{getChangeIcon(change.type)}</div>
                  <div className="flex-1">
                    <span className="font-medium text-[#A70000] inline-block mb-1">{getChangeTypeLabel(change.type)}</span>
                    <span className="text-gray-700 block">{change.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChangelogPage;