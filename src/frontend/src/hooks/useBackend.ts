import { createActor } from "@/backend";
import type {
  AddCustomerRequest,
  AddReceiptRequest,
  AddSaleRequest,
  CustomerLedger,
  DashboardStats,
  UpdateCustomerRequest,
  UpdateReceiptRequest,
  UpdateSaleRequest,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomerSummaries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["customerSummaries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerSummaries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomerById(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCustomerById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCustomerLedger(customerId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CustomerLedger | null>({
    queryKey: ["customerLedger", customerId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCustomerLedger(customerId);
    },
    enabled: !!actor && !isFetching && !!customerId,
  });
}

export function useSales() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSales();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSalesByCustomer(customerId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["sales", "customer", customerId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSalesByCustomer(customerId);
    },
    enabled: !!actor && !isFetching && !!customerId,
  });
}

export function useReceipts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReceipts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReceiptsByCustomer(customerId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["receipts", "customer", customerId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReceiptsByCustomer(customerId);
    },
    enabled: !!actor && !isFetching && !!customerId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useAddCustomer() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: AddCustomerRequest) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCustomer(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customerSummaries"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateCustomer() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdateCustomerRequest) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCustomer(req);
    },
    onSuccess: (_data, req) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customerSummaries"] });
      qc.invalidateQueries({ queryKey: ["customer", req.id] });
      qc.invalidateQueries({ queryKey: ["customerLedger", req.id] });
    },
  });
}

export function useAddSale() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: AddSaleRequest) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addSale(req);
    },
    onSuccess: (_data, req) => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["sales", "customer", req.customerId] });
      qc.invalidateQueries({ queryKey: ["customerSummaries"] });
      qc.invalidateQueries({ queryKey: ["customerLedger", req.customerId] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateSale() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdateSaleRequest) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSale(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["customerSummaries"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useAddReceipt() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: AddReceiptRequest) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addReceipt(req);
    },
    onSuccess: (_data, req) => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({
        queryKey: ["receipts", "customer", req.customerId],
      });
      qc.invalidateQueries({ queryKey: ["customerSummaries"] });
      qc.invalidateQueries({ queryKey: ["customerLedger", req.customerId] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateReceipt() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdateReceiptRequest) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateReceipt(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["customerSummaries"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
