'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DraftHistory } from '@/lib/types';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<DraftHistory | null>(null);

  const historyQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'draftHistories'),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: history, isLoading } = useCollection<DraftHistory>(historyQuery);

  const handleDelete = async (id: string) => {
    if (!user || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'users', user.uid, 'draftHistories', id));
      toast({
        title: 'Deleted',
        description: 'The item has been deleted from your history.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete item.',
      });
    }
  };

  const handleView = (item: DraftHistory) => {
    setSelectedItem(item);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Writing History</CardTitle>
          <CardDescription>
            A log of all your generated outlines and drafts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Language</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {history &&
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{item.topic}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={item.type === 'Draft' ? 'default' : 'secondary'}
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.language}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => handleView(item)}>
                              View
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              {history?.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    You have no saved items.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedItem && (
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {selectedItem.topic}
            </DialogTitle>
            <DialogDescription>
              {selectedItem.type} - {formatDate(selectedItem.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full">
            <div
              className="prose prose-sm dark:prose-invert max-w-none p-1"
              dangerouslySetInnerHTML={{
                __html: selectedItem.content.replace(/\n/g, '<br />'),
              }}
            />
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
}
