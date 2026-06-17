#!/bin/bash

# WealthFlow AI - Start dev server with webhook forwarding
# This script runs both Next.js and Stripe webhook listener

echo "🚀 Starting WealthFlow AI with Stripe webhooks..."
echo ""

# Check if Next.js is already running on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Killing existing process..."
    kill -9 $(lsof -t -i:3000)
    sleep 2
fi

# Start Next.js dev server in background
echo "📦 Starting Next.js dev server..."
npm run dev &
NEXTJS_PID=$!

# Wait for Next.js to start
echo "⏳ Waiting for Next.js to start..."
sleep 5

# Start Stripe webhook forwarding
echo ""
echo "🎯 Starting Stripe webhook forwarding..."
echo "   This will forward Stripe events to http://localhost:3000/api/webhooks/stripe"
echo ""
echo "   💡 TIP: The webhook signing secret will be printed below."
echo "   Copy the 'whsec_...' value and add it to your .env.local as STRIPE_WEBHOOK_SECRET"
echo ""

stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Cleanup on exit
trap "kill $NEXTJS_PID" EXIT
