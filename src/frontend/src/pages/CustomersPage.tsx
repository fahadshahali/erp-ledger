// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerSummaries } from "@/hooks/useBackend";
import { formatCurrency } from "@/lib/currency";
import { Link } from "@tanstack/react-router";
import { Plus, Search, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

const SKEL_ROWS = [...Array(6)].map((_, i) => (
  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
  <tr key={`skel-row-${i}`} className="border-b border-border/50">
    {[...Array(10)].map((__, j) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cols
      <td key={`skel-col-${i}-${j}`} className="px-4 py-3">
        <Skeleton className="h-4 w-16" />
      </td>
    ))}
  </tr>
));

export function CustomersPage() {
  const { data: summaries, isLoading } = useCustomerSummaries();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const all = summaries ?? [];
    if (!searchQuery.trim()) return all;
    const q = searchQuery.trim().toLowerCase();
    return all.filter(
      (s) =>
        s.companyName.toLowerCase().includes(q) ||
        s.mobile.toLowerCase().includes(q),
    );
  }, [summaries, searchQuery]);

  return (
    <div className="p-6 space-y-6" data-ocid="customers.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Customer Master
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {searchQuery
              ? `${filtered.length} of ${(summaries ?? []).length} customers`
              : `${(summaries ?? []).length} customers registered`}
          </p>
        </div>
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
              className="pl-8 pr-8 h-9 w-60 text-sm"
              data-ocid="customers.search_input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <Link to={"/customers/add" as any}>
            <Button
              size="sm"
              className="gap-2"
              data-ocid="customers.add_button"
            >
              <Plus size={14} />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      <div
        className="bg-card border border-border rounded-lg overflow-hidden"
        data-ocid="customers.table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  "Code",
                  "Company",
                  "Customer",
                  "Mobile",
                  "GST Number",
                  "Opening Bal.",
                  "Total Sale",
                  "Receipts",
                  "Closing Bal.",
                  "Actions",
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
              {isLoading
                ? SKEL_ROWS
                : filtered.map((s, idx) => (
                    <tr
                      key={s.customerCode}
                      className="border-b border-border/50 hover:bg-muted/20 transition-smooth"
                      data-ocid={`customers.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {s.customerCode}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground truncate max-w-[130px]">
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
                      <td className="px-4 py-3 font-mono text-right">
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
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            to={"/customers/$id" as any}
                            params={{ id: s.customerCode }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              data-ocid={`customers.view_button.${idx + 1}`}
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="customers.empty_state"
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
                    data-ocid="customers.clear_search_button"
                  >
                    Clear search
                  </Button>
                </>
              ) : (
                <>
                  <Users size={40} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No customers yet. Add your first customer.
                  </p>
                  <Link to={"/customers/add" as any}>
                    <Button size="sm" data-ocid="customers.empty_add_button">
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
