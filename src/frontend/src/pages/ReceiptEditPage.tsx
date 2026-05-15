// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCustomers,
  useReceipts,
  useUpdateReceipt,
} from "@/hooks/useBackend";
import { parseCurrency } from "@/lib/currency";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const PAYMENT_MODES = ["Bank", "Cash", "Cheque", "UPI", "NEFT", "RTGS"];

interface FormValues {
  customerId: string;
  date: string;
  amount: string;
  paymentMode: string;
}

export function ReceiptEditPage() {
  const { id } = useParams({ from: "/receipts/$id/edit" as any });
  const navigate = useNavigate();
  const { data: receipts, isLoading } = useReceipts();
  const { data: customers } = useCustomers();
  const { mutateAsync, isPending } = useUpdateReceipt();
  const receipt = (receipts ?? []).find((r) => r.id === id);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (receipt)
      reset({
        customerId: receipt.customerId,
        date: receipt.date,
        amount: receipt.amount.toString(),
        paymentMode: receipt.paymentMode,
      });
  }, [receipt, reset]);

  const onSubmit = async (values: FormValues) => {
    const customer = (customers ?? []).find((c) => c.id === values.customerId);
    if (!customer) {
      toast.error("Please select a customer");
      return;
    }
    try {
      await mutateAsync({
        id,
        customerId: values.customerId,
        customerName: customer.customerName,
        date: values.date,
        amount: parseCurrency(values.amount),
        paymentMode: values.paymentMode,
      });
      toast.success("Receipt updated");
      navigate({ to: "/receipts/$id" as any, params: { id } });
    } catch {
      toast.error("Failed to update receipt");
    }
  };

  return (
    <div className="p-6 max-w-xl" data-ocid="receipt_edit.page">
      <div className="flex items-center gap-3 mb-6">
        <Link to={"/receipts/$id" as any} params={{ id }}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            data-ocid="receipt_edit.back_button"
          >
            <ArrowLeft size={14} /> Back
          </Button>
        </Link>
        <h1 className="text-xl font-display font-bold text-foreground">
          Edit Receipt
        </h1>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={`skel-${i}`} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card border border-border rounded-lg p-6 space-y-5"
          data-ocid="receipt_edit.form"
        >
          <div className="space-y-1.5">
            <Label>Customer *</Label>
            <Controller
              name="customerId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger data-ocid="receipt_edit.customer_select">
                    <SelectValue placeholder="Select customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(customers ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.customerId && (
              <p
                className="text-xs text-destructive"
                data-ocid="receipt_edit.customer_field_error"
              >
                Required
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date">Date *</Label>
            <Input
              type="date"
              id="date"
              {...register("date", { required: true })}
              data-ocid="receipt_edit.date_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              {...register("amount", { required: true })}
              data-ocid="receipt_edit.amount_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Payment Mode *</Label>
            <Controller
              name="paymentMode"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger data-ocid="receipt_edit.payment_mode_select">
                    <SelectValue placeholder="Select mode..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="receipt_edit.submit_button"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Link to={"/receipts/$id" as any} params={{ id }}>
              <Button
                type="button"
                variant="outline"
                data-ocid="receipt_edit.cancel_button"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
