import CommonTypes "common";

module {
  public type CustomerId = CommonTypes.CustomerId;
  public type Timestamp = CommonTypes.Timestamp;

  public type Customer = {
    id : CustomerId;
    customerCode : Text;
    companyName : Text;
    customerName : Text;
    mobile : Text;
    gstNumber : Text;
    address : Text;
    openingBalance : Nat;
    createdAt : Timestamp;
  };

  public type CustomerSummary = {
    customerCode : Text;
    companyName : Text;
    customerName : Text;
    mobile : Text;
    gstNumber : Text;
    openingBalance : Nat;
    totalSale : Nat;
    totalReceipts : Nat;
    closingBalance : Int;
  };

  public type MonthlyLedgerEntry = {
    month : Text;
    openingBalance : Int;
    sales : Nat;
    receipts : Nat;
    closingBalance : Int;
  };

  public type CustomerLedger = {
    customer : Customer;
    entries : [MonthlyLedgerEntry];
  };

  public type AddCustomerRequest = {
    companyName : Text;
    customerName : Text;
    mobile : Text;
    gstNumber : Text;
    address : Text;
    openingBalance : Nat;
  };

  public type UpdateCustomerRequest = {
    id : CustomerId;
    companyName : Text;
    customerName : Text;
    mobile : Text;
    gstNumber : Text;
    address : Text;
    openingBalance : Nat;
  };
};
