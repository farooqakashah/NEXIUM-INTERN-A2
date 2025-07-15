import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryDisplayProps {
  title: string;
  summary: string;
  urduSummary: string;
}

export default function SummaryDisplay({ title, summary, urduSummary }: SummaryDisplayProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{title || 'Untitled Blog'}</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-2">English Summary</h3>
          <p>{summary}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Urdu Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p dir="rtl" lang="ur">{urduSummary}</p>
        </CardContent>
      </Card>
    </div>
  );
}