export const processCheckout = async (items: any[], total: number, clearCart: () => void) => {
  try {
    // 1. Save the order to the backend
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, total }),
    });

    if (!response.ok) {
      throw new Error('Failed to save order');
    }

    // 2. Format the WhatsApp message
    const formattedItems = items
      .map(
        (item) =>
          `- ${item.name} (${item.duration}) x ${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join('\n');

    const whatsappMessage = `🛒 *New Order From Website:*\n---\n${formattedItems}\n---\n💰 *Total Amount:* $${total.toFixed(
      2
    )}\n⚡ Please provide my activation details.`;

    const whatsappNumber = '1234567890'; // Assuming this is the global number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    // 3. Clear the cart
    clearCart();

    // 4. Redirect to WhatsApp
    window.location.href = whatsappUrl;
  } catch (error) {
    console.error('Checkout error:', error);
    alert('There was an error processing your order. Please try again.');
  }
};
