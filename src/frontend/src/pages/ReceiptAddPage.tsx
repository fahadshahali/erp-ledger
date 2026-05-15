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
import { useAddReceipt, useCustomers } from "@/hooks/useBackend";
import { parseCurrency } from "@/lib/currency";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const PAYMENT_MODES = ["Bank", "Cash", "Cheque", "UPI", "NEFT", "RTGS"];

interface FormValues {
  customerId: string;
  date: string;
  amount: string;
  paymentMode: string;
}

export function ReceiptAddPage() {
  const navigate = useNavigate();
  const { data: customers } = useCustomers();
  const { mutateAsync, isPending } = useAddReceipt();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      customerId: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      paymentMode: "Bank",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const customer = (customers ?? []).find((c) => c.id === values.customerId);
    if (!customer) {
      toast.error("Please select a customer");
      return;
    }
    try {
      await mutateAsync({
        customerId: values.customerId,
        customerName: customer.customerName,
        date: values.date,
        amount: parseCurrency(values.amount),
        paymentMode: values.paymentMode,
      });
      toast.success("Receipt added successfully");
      navigate({ to: "/receipts" as any });
    } catch {
      toast.error("Failed to add receipt");
    }
  };

  return (
    <div className="p-6 max-w-xl" data-ocid="receipt_add.page">
      <div className="flex items-center gap-3 mb-6">
        <Link to={"/receipts" as any}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            data-ocid="receipt_add.back_button"
          >
            <ArrowLeft size={14} /> Back
          </Button>
        </Link>
        <h1 className="text-xl font-display font-bold text-foreground">
          Add Receipt
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card border border-border rounded-lg p-6 space-y-5"
        data-ocid="receipt_add.form"
      >
        <div className="space-y-1.5">
          <Label>Customer *</Label>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger data-ocid="receipt_add.customer_select">
                  <SelectValue placeholder="Select customer..." />
                </SelectTrigger>
                <SelectContent>
                  {(customers ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.customerName} — {c.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.customerId && (
            <p
              className="text-xs text-destructive"
              data-ocid="receipt_add.customer_field_error"
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
            data-ocid="receipt_add.date_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount (₹) *</Label>
          <Input
            id="amount"
            {...register("amount", { required: true })}
            placeholder="10000"
            data-ocid="receipt_add.amount_input"
          />
          {errors.amount && (
            <p
              className="text-xs text-destructive"
              data-ocid="receipt_add.amount_field_error"
            >
              Required
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Payment Mode *</Label>
          <Controller
            name="paymentMode"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger data-ocid="receipt_add.payment_mode_select">
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
          {errors.paymentMode && (
            <p
              className="text-xs text-destructive"
              data-ocid="receipt_add.payment_mode_field_error"
            >
              Required
            </p>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            data-ocid="receipt_add.submit_button"
          >
            {isPending ? "Saving..." : "Add Receipt"}
          </Button>
          <Link to={"/receipts" as any}>
            <Button
              type="button"
              variant="outline"
              data-ocid="receipt_add.cancel_button"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
