import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all successful charges in the last 30 days
    const charges = await stripe.charges.list({
      created: {
        gte: Math.floor(thirtyDaysAgo.getTime() / 1000),
      },
      limit: 100,
    });

    // Group by day
    const dailyRevenue: Record<string, { amount: number; count: number }> = {};

    // Initialize all 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      dailyRevenue[key] = { amount: 0, count: 0 };
    }

    // Fill in actual charges
    let totalRevenue = 0;
    let totalBookings = 0;

    for (const charge of charges.data) {
      if (charge.status === 'succeeded' && !charge.refunded) {
        const date = new Date(charge.created * 1000);
        const key = date.toISOString().split('T')[0];
        const amountUsd = charge.amount / 100; // Stripe stores in cents

        if (dailyRevenue[key]) {
          dailyRevenue[key].amount += amountUsd;
          dailyRevenue[key].count += 1;
        }

        totalRevenue += amountUsd;
        totalBookings += 1;
      }
    }

    // Convert to array sorted by date
    const chartData = Object.entries(dailyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        amount: Math.round(data.amount * 100) / 100,
        count: data.count,
      }));

    // Get current month revenue
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCharges = charges.data.filter((c) => {
      const chargeDate = new Date(c.created * 1000);
      return c.status === 'succeeded' && !c.refunded && chargeDate >= firstDayOfMonth;
    });
    const monthlyRevenue = monthlyCharges.reduce((sum, c) => sum + c.amount / 100, 0);

    return NextResponse.json({
      chartData,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalBookings,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      monthlyBookings: monthlyCharges.length,
      averageBooking: totalBookings > 0 ? Math.round((totalRevenue / totalBookings) * 100) / 100 : 0,
    });
  } catch (error) {
    console.error('Error fetching Stripe revenue:', error);
    return NextResponse.json({ error: 'Error al obtener datos de Stripe' }, { status: 500 });
  }
}
