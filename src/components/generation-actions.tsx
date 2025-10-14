'use client';

import { Check, Clipboard, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GenerationActionsProps {
  textToCopy: string;
  fileName: string;
}

export function GenerationActions({
  textToCopy,
  fileName,
}: GenerationActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExport = () => {
    const blob = new Blob([textToCopy], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy to clipboard</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Export as TXT</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export as .txt</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}