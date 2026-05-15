import List "mo:core/List";
import Map "mo:core/Map";
import CustomerTypes "../types/customer";
import SaleTypes "../types/sales";
import ReceiptTypes "../types/receipts";
import Text "mo:core/Text";

module {
  public type Customer = CustomerTypes.Customer;
  public type CustomerSummary = CustomerTypes.CustomerSummary;
  public type CustomerLedger = CustomerTypes.CustomerLedger;
  public type AddCustomerRequest = CustomerTypes.AddCustomerRequest;
  public type UpdateCustomerRequest = CustomerTypes.UpdateCustomerRequest;

  func zeroPad3(n : Nat) : Text {
    let s = n.toText();
    if (n < 10) "00" # s
    else if (n < 100) "0" # s
    else s;
  };

  public func newId(counter : Nat) : Text {
    "cust-" # counter.toText();
  };

  public func newCustomerCode(counter : Nat) : Text {
    "CUS" # zeroPad3(counter + 1);
  };

  public func new(
    id : Text,
    customerCode : Text,
    req : AddCustomerRequest,
    now : Int,
  ) : Customer {
    {
      id;
      customerCode;
      companyName = req.companyName;
      customerName = req.customerName;
      mobile = req.mobile;
      gstNumber = req.gstNumber;
      address = req.address;
      openingBalance = req.openingBalance;
      createdAt = now;
    };
  };

  public func update(
    existing : Customer,
    req : UpdateCustomerRequest,
  ) : Customer {
    {
      existing with
      companyName = req.companyName;
      customerName = req.customerName;
      mobile = req.mobile;
      gstNumber = req.gstNumber;
      address = req.address;
      openingBalance = req.openingBalance;
    };
  };

  public func toSummary(
    customer : Customer,
    sales : List.List<SaleTypes.Sale>,
    receipts : List.List<ReceiptTypes.Receipt>,
  ) : CustomerSummary {
    let totalSale = sales.foldLeft(
      0,
      func(acc, s) {
        if (s.customerId == customer.id) acc + s.amount else acc;
      },
    );
    let totalReceipts = receipts.foldLeft(
      0,
      func(acc, r) {
        if (r.customerId == customer.id) acc + r.amount else acc;
      },
    );
    let closingBalance : Int = customer.openingBalance.toInt() + totalSale.toInt() - totalReceipts.toInt();
    {
      customerCode = customer.customerCode;
      companyName = customer.companyName;
      customerName = customer.customerName;
      mobile = customer.mobile;
      gstNumber = customer.gstNumber;
      openingBalance = customer.openingBalance;
      totalSale;
      totalReceipts;
      closingBalance;
    };
  };

  // Extract "YYYY-MM" from date string "YYYY-MM-DD"
  func monthKey(date : Text) : Text {
    let parts = date.split(#char '-');
    var year = "";
    var month = "";
    var idx = 0;
    for (p in parts) {
      if (idx == 0) year := p;
      if (idx == 1) month := p;
      idx += 1;
    };
    year # "-" # month;
  };

  func monthLabel(key : Text) : Text {
    let months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
    let parts = key.split(#char '-');
    var monthNum = 0;
    var idx = 0;
    for (p in parts) {
      if (idx == 1) {
        switch (p.toNat()) {
          case (?n) monthNum := n;
          case null {};
        };
      };
      idx += 1;
    };
    if (monthNum >= 1 and monthNum <= 12) months[monthNum - 1]
    else key;
  };

  public func toLedger(
    customer : Customer,
    sales : List.List<SaleTypes.Sale>,
    receipts : List.List<ReceiptTypes.Receipt>,
  ) : CustomerLedger {
    // Collect all months that have any activity
    let monthSet = Map.empty<Text, Bool>();
    sales.forEach(func(s) {
      if (s.customerId == customer.id) {
        monthSet.add(monthKey(s.date), true);
      };
    });
    receipts.forEach(func(r) {
      if (r.customerId == customer.id) {
        monthSet.add(monthKey(r.date), true);
      };
    });

    // Sort months chronologically
    let monthKeys = monthSet.keys().toArray();
    let sortedMonths = monthKeys.sort();

    var runningBalance : Int = customer.openingBalance.toInt();
    let entries = sortedMonths.map(func(mk) {
      let salesTot = sales.foldLeft(0, func(acc, s) {
        if (s.customerId == customer.id and monthKey(s.date) == mk) acc + s.amount
        else acc;
      });
      let receiptsTot = receipts.foldLeft(0, func(acc, r) {
        if (r.customerId == customer.id and monthKey(r.date) == mk) acc + r.amount
        else acc;
      });
      let openBal = runningBalance;
      let closeBal : Int = openBal + salesTot.toInt() - receiptsTot.toInt();
      runningBalance := closeBal;
      {
        month = monthLabel(mk);
        openingBalance = openBal;
        sales = salesTot;
        receipts = receiptsTot;
        closingBalance = closeBal;
      };
    });

    { customer; entries };
  };

  public func seedCustomers(now : Int) : [Customer] {
    [
      new(
        "cust-0",
        "CUS001",
        {
          companyName = "ABC Gas Agency";
          customerName = "Rahman Traders";
          mobile = "9876543210";
          gstNumber = "36ABCDE1234F1Z5";
          address = "";
          openingBalance = 50000;
        },
        now,
      ),
      new(
        "cust-1",
        "CUS002",
        {
          companyName = "Metro Enterprises";
          customerName = "Sai Agencies";
          mobile = "9123456780";
          gstNumber = "36FGHIJ5678K1Z2";
          address = "";
          openingBalance = 25000;
        },
        now,
      ),
    ];
  };
};
