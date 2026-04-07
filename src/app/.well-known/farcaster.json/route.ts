// Keep this route for local dev only; on Vercel we redirect via vercel.json to hosted manifest
export async function GET() {
  if (process.env.VERCEL === '1') {
    return new Response('Redirecting to hosted Farcaster manifest', {
      status: 307,
      headers: {
        Location:
          'https://api.farcaster.xyz/miniapps/hosted-manifest/019d6703-1d43-426a-b45f-e6a6daa0c5ff',
      },
    })
  }
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const config = {
    frame: {
      name: 'Liquifi',
      version: '1',
      iconUrl: `${appUrl}/liquifi_icon.png`,
      homeUrl: appUrl.endsWith('/') ? appUrl : `${appUrl}/`,
      buttonTitle: 'Start Earning',
      splashImageUrl: `${appUrl}/liquifi_splashscreen.png`,
      splashBackgroundColor: '#0E0E11',
      subtitle: 'AI yield on Celo stablecoins',
      description:
        'Liquifi is an AI agent that helps you earn yield on USDC, USDT and usdM on Celo by automatically routing your funds to Aave.',
      primaryCategory: 'finance',
      tagline: 'Earn yield on Celo with AI',
      ogTitle: 'Liquifi — AI Yield on Celo',
      ogDescription:
        "Liquifi's AI agent automatically routes your funds to Aave for maximum returns.",
      ogImageUrl: `${appUrl}/liquifi_splashscreen.png`,
      castShareUrl: appUrl.endsWith('/') ? appUrl : `${appUrl}/`,
    },
    // Keep the latest association for local testing; production uses hosted manifest via vercel.json
    accountAssociation: {
      header:
        'eyJmaWQiOjE0MjgxMjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhhNWNmQTRFZjFmNDZiRTNiNDgyMmVjZjQzNTYyZjMxMmY5NjcxMjUyIn0',
      payload:
        'eyJkb21haW4iOiJsaXF1aWZpaWkudmVyY2VsLmFwcCJ9',
      signature:
        'sUV6iZs/vO95sCjdpB1TCUEI+238e/4qbdFse0TIwK5b++PmOPOM6CV4DZIZ4hE/2MqB4JxV27X6hqUQ3DncrRs=',
    },
  }
  return Response.json(config)
}