import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./sty.css"; // Ensure CSS for modal and table

const Book = () => {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [showModal, setShowModal] = useState(false);

  const addItem = () => {
    if (itemName && itemPrice > 0 && itemQuantity > 0) {
      const newItem = {
        name: itemName,
        price: parseFloat(itemPrice),
        quantity: parseInt(itemQuantity),
      };
      setItems([...items, newItem]);
      setItemName("");
      setItemPrice("");
      setItemQuantity("");
    }
  };

  const calculateTotal = () => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Invoice", 105, 10, { align: "center" });

    // Table
    const tableData = items.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [["#", "Item Name", "Quantity", "Price", "Total"]],
      body: tableData,
      startY: 20,
    });

    // Total Price
    doc.setFontSize(14);
    doc.text(`Total Price: $${totalPrice.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);

    // Save PDF
    doc.save("invoice.pdf");
  };

  const generateInvoice = () => {
    calculateTotal();
    setShowModal(true);
  };

  return (
    <div className="container1">
      <h1>Billing System</h1>

      {/* Add Item Section */}
      <div className="add-item">
        <h2>Add Item</h2>
        <div className="input-group">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item name"
          />
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            placeholder="Item price"
          />
          <input
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            placeholder="Item quantity"
          />
          <button onClick={addItem}>Add</button>
        </div>
      </div>

      {/* Items List Section */}
      <div className="items">
        <h2>Items</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>

      {/* Total Price Section */}
      <div className="total">
        <button onClick={calculateTotal}>Calculate Total</button>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
      </div>

      {/* Invoice Section */}
      <div className="invoice">
        <h2>Invoice</h2>
        <button onClick={generateInvoice}>Show Invoice</button>
        <button onClick={downloadInvoice}>Download Invoice as PDF</button>
      </div>

      {/* Modal for Invoice */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Invoice</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
                    Total
                  </td>
                  <td style={{ fontWeight: "bold" }}>${totalPrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
