# Install Live Tracking Dependencies

## Required Packages

To enable live order tracking with maps, you need to install these packages:

```bash
cd frontend
npm install leaflet react-leaflet
```

## What These Packages Do

- **leaflet**: Open-source JavaScript library for interactive maps
- **react-leaflet**: React components for Leaflet maps

## After Installation

1. Restart the frontend server:
```bash
npm start
```

2. The live tracking feature will now work with:
   - Real-time order status updates
   - Interactive map showing restaurant, delivery partner, and customer locations
   - Route visualization
   - Delivery partner information
   - Auto-refresh every 10 seconds

## Features Included

✅ Live map with markers for:
  - Restaurant location
  - Delivery partner location (simulated)
  - Customer delivery address

✅ Real-time status updates:
  - Pending → Confirmed → Preparing → Ready → Out for Delivery → Nearby → Delivered

✅ Progress bar showing order status

✅ Timeline visualization

✅ Delivery partner details with call button

✅ Order details summary

✅ Auto-refresh every 10 seconds

## Usage

Navigate to: `/track-order/:orderId`

Example: `http://localhost:3000/track-order/1`
