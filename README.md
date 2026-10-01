# Ecomma — List. Sell. Deliver.

> Modern multi-vendor e-commerce marketplace web app bridging Indian artisan workshops with patrons across India. Built with React, TypeScript, Tailwind CSS, Express, and Google Gemini API (`@google/genai`).

---

## 🛍️ Highlights & Architecture

- **Multi-Role Personas**: 
  - **Buyer**: Natural-language search, rich filters, variant selection, delivery pincode checker, Cash on Delivery (COD) & UPI simulation, order tracking with real-time progress simulation, printable GST invoices.
  - **Seller**: KPI overview, multimodal AI Listing Studio (Gemini generates title, description, tags, features, and price range from photos/notes), barcoded shipping labels, 24h payout wallet, order fulfillment workflow.
  - **Admin**: Platform GMV governance, seller KYC approvals, commission management, content quality moderation, and Gemini Strategic AI Insights.
- **Design Aesthetic**: Modern Indian editorial marketplace ("Indian bazaar meets clean fintech"). Warm Cream (`#FBF7F0`), Ink Navy (`#0F1B2D`), Saffron (`#F59E0B`), Coral (`#FF6B4A`), and Teal (`#14B8A6`). Fraunces serif display typography paired with Inter.
- **AI Integration**: Powered server-side by `@google/genai` (model: `gemini-3.8-flash`) for:
  - Multimodal Product Listing Generator
  - Natural Language Search Parser
  - Product Q&A Assistant on PDP
  - Verified Review Summarization
  - Strategic Business Insights

---

## 🚀 Getting Started

### 1. Installation & Local Development
```bash
# Install dependencies
npm install

# Run the full-stack Express + Vite dev server (port 3000)
npm run dev
```

### 2. Environment Variables (`.env`)
```bash
# Required for Gemini AI capabilities
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

---

## 🔌 Plugging in Real Backends & Payment Gateways

This application uses a clean, typed repository service layer (`src/services/storageService.ts`) with localStorage persistence, allowing full end-to-end functionality right out of the box.

To connect production backends:

### 1. Payment Gateways (Razorpay / Cashfree)
- In `src/pages/buyer/CheckoutPage.tsx`:
  - Replace the mock timer in `handlePlaceOrder()` with the Razorpay Checkout SDK:
    ```ts
    // Example Razorpay integration
    const rzp = new (window as any).Razorpay({
      key: process.env.VITE_RAZORPAY_KEY_ID,
      amount: grandTotal * 100, // paise
      currency: "INR",
      name: "Ecomma Marketplace",
      order_id: razorpayOrderId,
      handler: async (response) => {
        // verify signature on backend: POST /api/payment/verify
      }
    });
    rzp.open();
    ```

### 2. Database & Auth (PostgreSQL / Cloud SQL / Supabase / Firebase)
- Replace calls in `src/services/storageService.ts` with API client calls to your Express routes (`/api/products`, `/api/orders`, `/api/sellers`).
- Authenticate requests using JWT or Firebase Auth bearer tokens in the `Authorization: Bearer <token>` header.

### 3. Courier Logistics APIs (Delhivery / Shiprocket / BlueDart)
- In `src/services/storageService.ts` (`advanceSubOrderStatus`), connect the dispatch trigger to create real airway bills (AWBs) and courier manifests via Delhivery B2C or Shiprocket APIs.
