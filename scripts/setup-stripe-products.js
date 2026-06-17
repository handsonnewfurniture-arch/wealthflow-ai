require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupProducts() {
  console.log('🎨 Creating WealthFlow AI subscription products in Stripe...\n');

  try {
    // 1. STARTER PLAN - $29/month
    console.log('Creating Starter Plan ($29/mo)...');
    const starterProduct = await stripe.products.create({
      name: 'WealthFlow AI - Starter',
      description: 'County database & basic tax lien lessons. Perfect for beginners.',
      metadata: {
        tier: 'starter',
        features: 'county_database,basic_lessons'
      }
    });

    const starterPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 2900, // $29.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        tier: 'starter'
      }
    });

    console.log(`✅ Starter created!`);
    console.log(`   Product ID: ${starterProduct.id}`);
    console.log(`   Price ID: ${starterPrice.id}\n`);

    // 2. PRO PLAN - $79/month
    console.log('Creating Pro Plan ($79/mo)...');
    const proProduct = await stripe.products.create({
      name: 'WealthFlow AI - Pro',
      description: 'Investor scores, portfolio tracking & advanced lessons. For serious investors.',
      metadata: {
        tier: 'pro',
        features: 'county_database,basic_lessons,investor_scores,portfolio_tracking,advanced_lessons'
      }
    });

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 7900, // $79.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        tier: 'pro'
      }
    });

    console.log(`✅ Pro created!`);
    console.log(`   Product ID: ${proProduct.id}`);
    console.log(`   Price ID: ${proPrice.id}\n`);

    // 3. ELITE PLAN - $199/month
    console.log('Creating Elite Plan ($199/mo)...');
    const eliteProduct = await stripe.products.create({
      name: 'WealthFlow AI - Elite',
      description: 'AI opportunity finder, capital deployment tools & priority support. Maximum returns.',
      metadata: {
        tier: 'elite',
        features: 'county_database,basic_lessons,investor_scores,portfolio_tracking,advanced_lessons,ai_finder,capital_velocity,priority_support'
      }
    });

    const elitePrice = await stripe.prices.create({
      product: eliteProduct.id,
      unit_amount: 19900, // $199.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        tier: 'elite'
      }
    });

    console.log(`✅ Elite created!`);
    console.log(`   Product ID: ${eliteProduct.id}`);
    console.log(`   Price ID: ${elitePrice.id}\n`);

    // Print summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ ALL PRODUCTS CREATED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📋 Add these Price IDs to your .env.local file:\n');
    console.log(`STRIPE_PRICE_STARTER=${starterPrice.id}`);
    console.log(`STRIPE_PRICE_PRO=${proPrice.id}`);
    console.log(`STRIPE_PRICE_ELITE=${elitePrice.id}\n`);

    console.log('🎯 Next steps:');
    console.log('   1. Copy the 3 lines above');
    console.log('   2. Update .env.local with the Price IDs');
    console.log('   3. Set up webhook endpoint (we\'ll do this next)');
    console.log('   4. Start accepting payments! 💰\n');

    // Return the price IDs so we can auto-update .env.local
    return {
      starter: starterPrice.id,
      pro: proPrice.id,
      elite: elitePrice.id
    };

  } catch (error) {
    console.error('❌ Error creating products:', error.message);

    if (error.type === 'StripeAuthenticationError') {
      console.error('\n⚠️  Authentication failed. Check your STRIPE_SECRET_KEY in .env.local');
    }

    process.exit(1);
  }
}

// Run the setup
setupProducts()
  .then(priceIds => {
    console.log('✨ Setup complete!\n');

    // Write price IDs to a temp file so we can read them
    const fs = require('fs');
    fs.writeFileSync('.stripe-price-ids.json', JSON.stringify(priceIds, null, 2));
    console.log('💾 Price IDs saved to .stripe-price-ids.json\n');
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
