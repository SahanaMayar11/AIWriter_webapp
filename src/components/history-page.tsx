'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase, useUser } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';

interface HistoryItem {
  id: string;
  topic: string;
  date: string;
  language: string;
  type: 'outline' | 'draft';
  content: string;
}

const { firestore: db } = initializeFirebase();

export default function HistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      if (user) {
        setLoading(true);
        const q = query(
          collection(db, 'history'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HistoryItem[];
        setHistory(historyData);
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  const handleDelete = async () => {
    if (selectedItem) {
      await deleteDoc(doc(db, 'history', selectedItem.id));
      setHistory(history.filter((item) => item.id !== selectedItem.id));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  if (loading) {
    return <Spinner text="Loading history..." />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">History</h1>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.topic}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.language}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      // router.push(item.type === 'draft' ? `/draft?id=${item.id}` : `/outline?id=${item.id}`)
                      // For now, we'll just log the action
                      console.log('Edit item:', item.id);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog
                    open={isDeleteModalOpen && selectedItem?.id === item.id}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setSelectedItem(null);
                      }
                      setIsDeleteModalOpen(isOpen);
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the history item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedItem?.topic}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="prose">
            <p>{selectedItem?.content}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
