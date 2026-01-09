export async function GET() {
    const appUrl = process.env.NEXT_PUBLIC_URL;
  
    const config = {
      accountAssociation: {
        header:
          "",
        payload: "",
        signature:
          "",
      },
      frame: {
        version: "1",
        name: "Attestify",
        iconUrl: `${appUrl}/celosplash.png`,
        homeUrl: appUrl,
        imageUrl: `${appUrl}/attestify.png`,
        buttonTitle: "Launch Frame",
        splashImageUrl: `${appUrl}/celosplash.png`,
        splashBackgroundColor: "#f7f7f7",
        webhookUrl: `${appUrl}/api/webhook`,
      },
    };
  
    return Response.json(config);
  }