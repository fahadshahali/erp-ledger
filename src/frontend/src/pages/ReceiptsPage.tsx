// @ts-nocheck
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers, useReceipts } from "@/hooks/useBackend";
import { formatCurrency } from "@/lib/currency";
import { Link } from "@tanstack/react-router";
import { Plus, ReceiptText } from "lucide-react";

const SKEL_ROWS = [...Array(5)].map((_, i) => (
  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
  <tr key={`skel-row-${i}`} className="border-b border-border/50">
    {[...Array(7)].map((__, j) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cols
      <td key={`skel-col-${i}-${j}`} className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>
    ))}
  </tr>
));

export function ReceiptsPage() {
  const { data: receipts, isLoading } = useReceipts();
  const { data: customers } = useCustomers();
  const customerMap = new Map((customers ?? []).map((c) => [c.id, c]));

  return (
    <div className="p-6 space-y-6" data-ocid="receipts.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Receipt Entry
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {(receipts ?? []).length} entries
          </p>
        </div>
        <Link to={"/receipts/add" as any}>
          <Button size="sm" className="gap-2" data-ocid="receipts.add_button">
            <Plus size={14} /> Add Receipt
          </Button>
        </Link>
      </div>

      <div
        className="bg-card border border-border rounded-lg overflow-hidden"
        data-ocid="receipts.table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  "Receipt No",
                  "Date",
                  "Customer",
                  "Company",
                  "Amount",
                  "Payment Mode",
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
                : (receipts ?? []).map((r, idx) => (
                    <tr
                      key={r.id}
                      className="border-b border-border/50 hover:bg-muted/20 transition-smooth"
                      data-ocid={`receipts.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-primary">
                        {r.receiptNo}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.date}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {r.customerName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground truncate max-w-[140px]">
                        {customerMap.get(r.customerId)?.companyName ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-right font-semibold text-secondary">
                        {formatCurrency(r.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs capitalize">
                          {r.paymentMode}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            to={"/receipts/$id" as any}
                            params={{ id: r.id }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              data-ocid={`receipts.view_button.${idx + 1}`}
                            >
                              View
                            </Button>
                          </Link>
                          <Link
                            to={"/receipts/$id/edit" as any}
                            params={{ id: r.id }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              data-ocid={`receipts.edit_button.${idx + 1}`}
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
          {!isLoading && (receipts ?? []).length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="receipts.empty_state"
            >
              <ReceiptText size={40} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No receipt entries yet
              </p>
              <Link to={"/receipts/add" as any}>
                <Button size="sm" data-ocid="receipts.empty_add_button">
                  Add Receipt
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
