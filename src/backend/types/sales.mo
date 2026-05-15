import CommonTypes "common";

module {
  public type SaleId = CommonTypes.SaleId;
  public type CustomerId = CommonTypes.CustomerId;
  public type Timestamp = CommonTypes.Timestamp;

  public type Sale = {
    id : SaleId;
    invoiceNo : Text;
    date : Text;
    customerId : CustomerId;
    customerName : Text;
    amount : Nat;
    createdAt : Timestamp;
  };

  public type AddSaleRequest = {
    date : Text;
    customerId : CustomerId;
    customerName : Text;
    amount : Nat;
  };

  public type UpdateSaleRequest = {
    id : SaleId;
    date : Text;
    customerId : CustomerId;
    customerName : Text;
    amount : Nat;
  };
};
