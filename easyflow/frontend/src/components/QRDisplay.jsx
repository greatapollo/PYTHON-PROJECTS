import QRCode from "react-qr-code";

export default function QRDisplay({ value }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Scan this QR Code</h3>
      <QRCode value={value} size={200} />
    </div>
  );
}
