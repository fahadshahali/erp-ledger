import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AddCustomerRequest {
    customerName: string;
    gstNumber: string;
    address: string;
    companyName: string;
    openingBalance: bigint;
    mobile: string;
}
export type Timestamp = bigint;
export interface UpdateCustomerRequest {
    id: CustomerId;
    customerName: string;
    gstNumber: string;
    address: string;
    companyName: string;
    openingBalance: bigint;
    mobile: string;
}
export interface AddSaleRequest {
    customerName: string;
    date: string;
    customerId: CustomerId;
    amount: bigint;
}
export interface CustomerLedger {
    customer: Customer;
    entries: Array<MonthlyLedgerEntry>;
}
export interface AddReceiptRequest {
    customerName: string;
    date: string;
    paymentMode: string;
    customerId: CustomerId;
    amount: bigint;
}
export interface Sale {
    id: SaleId;
    customerName: string;
    date: string;
    createdAt: Timestamp;
    invoiceNo: string;
    customerId: CustomerId;
    amount: bigint;
}
export interface DashboardStats {
    pendingPayments: bigint;
    totalReceipts: bigint;
    totalOutstanding: bigint;
    monthlyCollection: bigint;
    totalSales: bigint;
    totalCustomers: bigint;
}
export interface Customer {
    id: CustomerId;
    customerName: string;
    gstNumber: string;
    createdAt: Timestamp;
    address: string;
    companyName: string;
    openingBalance: bigint;
    mobile: string;
    customerCode: string;
}
export type ReceiptId = string;
export interface MonthlyLedgerEntry {
    month: string;
    sales: bigint;
    closingBalance: bigint;
    openingBalance: bigint;
    receipts: bigint;
}
export interface Receipt {
    id: ReceiptId;
    customerName: string;
    date: string;
    createdAt: Timestamp;
    paymentMode: string;
    customerId: CustomerId;
    receiptNo: string;
    amount: bigint;
}
export interface UpdateSaleRequest {
    id: SaleId;
    customerName: string;
    date: string;
    customerId: CustomerId;
    amount: bigint;
}
export type CustomerId = string;
export type SaleId = string;
export interface CustomerSummary {
    customerName: string;
    totalReceipts: bigint;
    gstNumber: string;
    totalSale: bigint;
    closingBalance: bigint;
    companyName: string;
    openingBalance: bigint;
    mobile: string;
    customerCode: string;
}
export interface UpdateReceiptRequest {
    id: ReceiptId;
    customerName: string;
    date: string;
    paymentMode: string;
    customerId: CustomerId;
    amount: bigint;
}
export interface backendInterface {
    addCustomer(req: AddCustomerRequest): Promise<Customer>;
    addReceipt(req: AddReceiptRequest): Promise<Receipt>;
    addSale(req: AddSaleRequest): Promise<Sale>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllReceipts(): Promise<Array<Receipt>>;
    getAllSales(): Promise<Array<Sale>>;
    getCustomerById(id: string): Promise<Customer | null>;
    getCustomerLedger(customerId: string): Promise<CustomerLedger | null>;
    getCustomerSummaries(): Promise<Array<CustomerSummary>>;
    getDashboardStats(): Promise<DashboardStats>;
    getReceiptsByCustomer(customerId: string): Promise<Array<Receipt>>;
    getSalesByCustomer(customerId: string): Promise<Array<Sale>>;
    updateCustomer(req: UpdateCustomerRequest): Promise<Customer | null>;
    updateReceipt(req: UpdateReceiptRequest): Promise<Receipt | null>;
    updateSale(req: UpdateSaleRequest): Promise<Sale | null>;
}
