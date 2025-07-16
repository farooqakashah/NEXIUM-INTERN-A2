import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryDisplayProps {
  title: string;
  summary: string;
  urduSummary: string;
}

export default function SummaryDisplay({ title, summary, urduSummary }: SummaryDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Title card */}
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
        <CardHeader>
          <CardTitle className="text-white">{title || 'Untitled Blog'}</CardTitle>
        </CardHeader>
      </Card>

      {/* Side-by-side summaries */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">English Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200">{summary}</p>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Urdu Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p dir="rtl" lang="ur" className="text-gray-200">{urduSummary}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
