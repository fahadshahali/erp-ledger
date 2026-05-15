import CommonTypes "common";

module {
  public type ReceiptId = CommonTypes.ReceiptId;
  public type CustomerId = CommonTypes.CustomerId;
  public type Timestamp = CommonTypes.Timestamp;

  public type Receipt = {
    id : ReceiptId;
    receiptNo : Text;
    date : Text;
    customerId : CustomerId;
    customerName : Text;
    amount : Nat;
    paymentMode : Text;
    createdAt : Timestamp;
  };

  public type AddReceiptRequest = {
    date : Text;
    customerId : CustomerId;
    customerName : Text;
    amount : Nat;
    paymentMode : Text;
  };

  public type UpdateReceiptRequest = {
    id : ReceiptId;
    date : Text;
    customerId : CustomerId;
    customerName : Text;
    amount : Nat;
    paymentMode : Text;
  };
};
