'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface BlogFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function BlogForm({ onSubmit, loading }: BlogFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onSubmit(url);
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Blog URL submission form">
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter blog URL"
        className="w-full"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !url.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          'Summarise'
        )}
      </Button>
    </form>
  );
}