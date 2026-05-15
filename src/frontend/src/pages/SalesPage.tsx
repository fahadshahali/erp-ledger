// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers, useSales } from "@/hooks/useBackend";
import { formatCurrency } from "@/lib/currency";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Plus } from "lucide-react";

const SKEL_ROWS = [...Array(5)].map((_, i) => (
  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
  <tr key={`skel-row-${i}`} className="border-b border-border/50">
    {[...Array(6)].map((__, j) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cols
      <td key={`skel-col-${i}-${j}`} className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>
    ))}
  </tr>
));

export function SalesPage() {
  const { data: sales, isLoading } = useSales();
  const { data: customers } = useCustomers();

  const customerMap = new Map((customers ?? []).map((c) => [c.id, c]));

  return (
    <div className="p-6 space-y-6" data-ocid="sales.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Sales Entry
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {(sales ?? []).length} entries
          </p>
        </div>
        <Link to={"/sales/add" as any}>
          <Button size="sm" className="gap-2" data-ocid="sales.add_button">
            <Plus size={14} /> Add Sale
          </Button>
        </Link>
      </div>

      <div
        className="bg-card border border-border rounded-lg overflow-hidden"
        data-ocid="sales.table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  "Invoice No",
                  "Date",
                  "Customer",
                  "Company",
                  "Amount",
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
                : (sales ?? []).map((s, idx) => (
                    <tr
                      key={s.id}
                      className="border-b border-border/50 hover:bg-muted/20 transition-smooth"
                      data-ocid={`sales.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-primary">
                        {s.invoiceNo}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {s.date}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {s.customerName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground truncate max-w-[140px]">
                        {customerMap.get(s.customerId)?.companyName ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-right font-semibold text-accent">
                        {formatCurrency(s.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={"/sales/$id" as any} params={{ id: s.id }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              data-ocid={`sales.view_button.${idx + 1}`}
                            >
                              View
                            </Button>
                          </Link>
                          <Link
                            to={"/sales/$id/edit" as any}
                            params={{ id: s.id }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              data-ocid={`sales.edit_button.${idx + 1}`}
                            >
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && (sales ?? []).length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="sales.empty_state"
            >
              <ClipboardList size={40} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No sales entries yet
              </p>
              <Link to={"/sales/add" as any}>
                <Button size="sm" data-ocid="sales.empty_add_button">
                  Add Sale
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
