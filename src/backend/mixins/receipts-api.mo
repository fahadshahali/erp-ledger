import List "mo:core/List";
import Time "mo:core/Time";
import ReceiptsLib "../lib/receipts";
import ReceiptTypes "../types/receipts";

mixin (
  receipts : List.List<ReceiptTypes.Receipt>,
  state : { var nextReceiptId : Nat },
) {
  public query func getAllReceipts() : async [ReceiptTypes.Receipt] {
    receipts.toArray();
  };

  public query func getReceiptsByCustomer(customerId : Text) : async [ReceiptTypes.Receipt] {
    ReceiptsLib.byCustomer(receipts, customerId);
  };

  public func addReceipt(req : ReceiptTypes.AddReceiptRequest) : async ReceiptTypes.Receipt {
    let id = ReceiptsLib.newId(state.nextReceiptId);
    let receiptNo = ReceiptsLib.newReceiptNo(state.nextReceiptId);
    let receipt = ReceiptsLib.new(id, receiptNo, req, Time.now());
    receipts.add(receipt);
    state.nextReceiptId += 1;
    receipt;
  };

  public func updateReceipt(req : ReceiptTypes.UpdateReceiptRequest) : async ?ReceiptTypes.Receipt {
    switch (receipts.findIndex(func(r) { r.id == req.id })) {
      case (?idx) {
        let updated = ReceiptsLib.update(receipts.at(idx), req);
        receipts.put(idx, updated);
        ?updated;
      };
      case null null;
    };
  };
};
