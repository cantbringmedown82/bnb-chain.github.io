export default function Investors() {
  const startCheckout = async () => {
    const res = await fetch("/create-checkout-session", { method: "POST" });
    const data = await res.json();
    window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Investors</h1>
      <p>Subscribe to receive sealed weekly compliance reports.</p>
      <button onClick={startCheckout}>Subscribe via Stripe</button>
    </div>
  );
}
