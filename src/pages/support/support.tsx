import React from 'react';
import { Phone, Mail, MapPin, Clock, Globe, HeadphonesIcon, LucideIcon } from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';

const SupportPage: React.FC = () => {
  const primaryColor = "#A70000";
  const supportData = {
    egypt: {
      phone: '+20 123 456 7890',
      email: 'support.eg@orbisq.com',
      address: 'القاهرة، مصر',
      hours: 'السبت - الخميس: 9:00 ص - 6:00 م',
      whatsapp: '+20 123 456 7890',
    },
    jordan: {
      phone: '+962 78 123 4567',
      email: 'support.jo@orbisq.com',
      address: 'عمان، الأردن',
      hours: 'الأحد - الخميس: 9:00 ص - 6:00 م',
      whatsapp: '+962 78 123 4567',
    }
  };

  const ContactItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
    <div className="flex items-start gap-x-4 space-x-reverse">
      <div className="flex-shrink-0 mt-1">
        <Icon className="w-5 h-5" style={{ color: primaryColor }} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base">{value}</p>
      </div>
    </div>
  );

  const CountrySupport = ({ country, data }: { country: 'egypt' | 'jordan'; data: typeof supportData.egypt }) => (
    <Card className="p-6">
      <div className="flex items-center gap-x-4 space-x-reverse mb-6">
        <Globe className="w-8 h-8" style={{ color: primaryColor }} />
        <h2 className="text-2xl font-bold">
          {country === 'egypt' ? 'الدعم الفني - مصر' : 'الدعم الفني - الأردن'}
        </h2>
      </div>

      <div className="grid gap-6">
        <ContactItem
          icon={Phone}
          label="رقم الهاتف"
          value={data.phone}
        />

        <ContactItem
          icon={Mail}
          label="البريد الإلكتروني"
          value={data.email}
        />

        <ContactItem
          icon={MapPin}
          label="العنوان"
          value={data.address}
        />

        <ContactItem
          icon={Clock}
          label="ساعات العمل"
          value={data.hours}
        />

        <ContactItem
          icon={HeadphonesIcon}
          label="واتساب"
          value={data.whatsapp}
        />
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <HeadphonesIcon className="w-16 h-16 mx-auto mb-4" style={{ color: primaryColor }} />
        <h1 className="text-3xl font-bold mb-2">مركز الدعم</h1>
        <p className="text-gray-500 text-lg">
          فريق الدعم الفني متواجد لمساعدتك في أي وقت
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <CountrySupport country="egypt" data={supportData.egypt} />
        <CountrySupport country="jordan" data={supportData.jordan} />
      </div>

      <div className="mt-12 text-center">
        <Card className="p-4">
          <h2 className="text-xl font-bold mb-2">هل تحتاج إلى مساعدة إضافية؟</h2>
          <p className="text-gray-600 mb-4">
            يمكنك التواصل معنا عبر أي من قنوات الدعم المذكورة أعلاه
            <br />
            فريقنا جاهز للرد على استفساراتك على مدار الساعة
          </p>
          <Button variant="primary" size='md'>
            إرسال استفسار
          </Button>  
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;