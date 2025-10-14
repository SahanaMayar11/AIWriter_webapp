import Link from "next/link";
import { ArrowRight, FileText, PenSquare, SpellCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { HistoryItem } from "@/lib/types";

const quickActions = [
  {
    title: "New Outline",
    description: "Generate a structured outline for your essay or article.",
    href: "/outline",
    icon: FileText,
  },
  {
    title: "New Draft",
    description: "Create a complete draft based on your topic and tone.",
    href: "/draft",
    icon: PenSquare,
  },
  {
    title: "Grammar Check",
    description: "Proofread and enhance your existing text.",
    href: "/grammar-check",
    icon: SpellCheck,
  },
];

const recentHistory: HistoryItem[] = [
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
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">
          Welcome back, User!
        </h1>
        <p className="text-muted-foreground mt-2">
          Ready to craft your next masterpiece? Let&apos;s get writing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium font-headline">
                {action.title}
              </CardTitle>
              <action.icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
              <Button asChild variant="link" className="px-0 mt-4">
                <Link href={action.href}>
                  Start Writing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline">Recent Activity</CardTitle>
              <CardDescription>
                A quick look at your latest creations.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/history">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Language</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.topic}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={item.type === "Draft" ? "secondary" : "outline"}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.language}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {item.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
