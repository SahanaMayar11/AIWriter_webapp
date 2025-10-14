import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { HistoryItem } from "@/lib/types";

const history: HistoryItem[] = [
    {
      id: "1",
      topic: "The Future of Renewable Energy",
      type: "Outline",
      language: "English",
      date: "2024-05-20",
    },
    {
      id: "2",
      topic: "A History of Indian Cinema",
      type: "Draft",
      language: "Hindi",
      date: "2024-05-19",
    },
    {
      id: "3",
      topic: "The Impact of AI on Society",
      type: "Draft",
      language: "English",
      date: "2024-05-18",
    },
    {
      id: "4",
      topic: "Benefits of a Healthy Diet",
      type: "Outline",
      language: "Tamil",
      date: "2024-05-17",
    },
    {
      id: "5",
      topic: "Exploring the Wonders of Space",
      type: "Draft",
      language: "Telugu",
      date: "2024-05-16",
    },
    {
      id: "6",
      topic: "Traditional Bengali Cuisine",
      type: "Outline",
      language: "Bengali",
      date: "2024-05-15",
    },
    {
        id: "7",
        topic: "The Rise of E-commerce in India",
        type: "Draft",
        language: "Kannada",
        date: "2024-05-14",
    }
  ];

export default function HistoryPage() {
  return (
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
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.topic}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={item.type === "Draft" ? "default" : "secondary"}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.language}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{item.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
