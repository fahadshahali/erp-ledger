import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerSummaries, useDashboardStats } from "@/hooks/useBackend";
import { formatCurrency } from "@/lib/currency";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  Plus,
  Receipt,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const STAT_CARDS = [
  {
    key: "totalCustomers" as const,
    label: "Total Customers",
    icon: Users,
    format: "count",
    color: "text-primary",
  },
  {
    key: "totalSales" as const,
    label: "Total Sales",
    icon: TrendingUp,
    format: "currency",
    color: "text-accent",
  },
  {
    key: "totalReceipts" as const,
    label: "Total Receipts",
    icon: Receipt,
    format: "currency",
    color: "text-secondary",
  },
  {
    key: "totalOutstanding" as const,
    label: "Outstanding",
    icon: AlertTriangle,
    format: "currency",
    color: "text-destructive",
  },
  {
    key: "monthlyCollection" as const,
    label: "Monthly Collection",
    icon: CalendarDays,
    format: "currency",
    color: "text-chart-2",
  },
  {
    key: "pendingPayments" as const,
    label: "Pending Payments",
    icon: Clock,
    format: "currency",
    color: "text-chart-4",
  },
];

const SKEL_ROWS = [...Array(5)].map((_, i) => (
  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
  <tr key={`skel-row-${i}`} className="border-b border-border/50">
    {[...Array(9)].map((__, j) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cols
      <td key={`skel-col-${i}-${j}`} className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>
    ))}
  </tr>
));

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: summaries, isLoading: summariesLoading } =
    useCustomerSummaries();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSummaries = useMemo(() => {
    const all = summaries ?? [];
    if (!searchQuery.trim()) return all.slice(0, 10);
    const q = searchQuery.trim().toLowerCase();
    return all
      .filter(
        (s) =>
          s.companyName.toLowerCase().includes(q) ||
          s.mobile.toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [summaries, searchQuery]);

  return (
    <div className="p-6 space-y-6" data-ocid="dashboard.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Customer Ledger Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track sales, receipts & outstanding balances
          </p>
        </div>
        <Link to={"/sales/add" as any}>
          <Button
            size="sm"
            data-ocid="dashboard.new_sale_button"
            className="gap-2"
          >
            <Plus size={14} />
            New Sale Entry
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        data-ocid="dashboard.stats_section"
      >
        {STAT_CARDS.map(({ key, label, icon: Icon, format, color }) => (
          <div
            key={key}
            className="bg-card border border-border rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">
                {label}
              </p>
              <Icon size={14} className={color} />
            </div>
            {statsLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className={`font-mono text-xl font-bold ${color}`}>
                {stats
                  ? format === "currency"
                    ? formatCurrency(stats[key])
                    : stats[key].toString()
                  : "—"}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Customer Ledger Table */}
      <div
        className="bg-card border border-border rounded-lg overflow-hidden"
        data-ocid="dashboard.ledger_section"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border gap-3">
          <h2 className="font-display font-semibold text-foreground text-base">
            Customer Ledger
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                placeholder="Search company or phone…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 h-8 w-56 text-xs"
                data-ocid="dashboard.search_input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <Link to={"/customers" as any}>
              <Button
                variant="outline"
                size="sm"
                data-ocid="dashboard.view_all_button"
              >
                View All
              </Button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="dashboard.ledger_table">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  "Customer Code",
                  "Company Name",
                  "Customer Name",
                  "Mobile",
                  "GST",
                  "Opening Balance",
                  "Total Sale",
                  "Total Receipts",
                  "Closing Balance",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summariesLoading
                ? SKEL_ROWS
                : filteredSummaries.map((s, idx) => (
                    <tr
                      key={s.customerCode}
                      className="border-b border-border/50 hover:bg-muted/20 transition-smooth cursor-pointer"
                      data-ocid={`dashboard.ledger_table.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {s.customerCode}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground truncate max-w-[140px]">
                        {s.companyName}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {s.customerName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {s.mobile}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {s.gstNumber}
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-foreground">
                        {formatCurrency(s.openingBalance)}
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-accent">
                        {formatCurrency(s.totalSale)}
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-secondary">
                        {formatCurrency(s.totalReceipts)}
                      </td>
                      <td className="px-4 py-3 font-mono text-right font-semibold text-foreground">
                        {formatCurrency(s.closingBalance)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!summariesLoading && filteredSummaries.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="dashboard.ledger_table.empty_state"
            >
              {searchQuery ? (
                <>
                  <Search size={40} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No customers match &ldquo;{searchQuery}&rdquo;
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    data-ocid="dashboard.clear_search_button"
                  >
                    Clear search
                  </Button>
                </>
              ) : (
                <>
                  <Users size={40} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No customers yet
                  </p>
                  <Link to={"/customers/add" as any}>
                    <Button size="sm" data-ocid="dashboard.add_customer_button">
                      Add Customer
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
