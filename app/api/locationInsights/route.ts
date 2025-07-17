import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { location, idea } = await req.json()

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    // This is a placeholder for OpenRoute API integration.
    // OpenRoute Service primarily provides routing, geocoding, and places data.
    // Directly getting "business density" or "competition" for a specific industry
    // might require more advanced data sources or a combination of OpenRoute's
    // geocoding with other business listing APIs.

    // For demonstration, we'll simulate a basic location insight.
    // In a real application, you would use process.env.OPENROUTE_API_KEY
    // and make a fetch request to the OpenRoute API.

    // Example OpenRoute Geocoding API endpoint (replace with actual endpoint and parameters)
    // const openRouteApiKey = process.env.OPENROUTE_API_KEY;
    // const geocodingUrl = `https://api.openrouteservice.org/geocode/search?api_key=${openRouteApiKey}&text=${encodeURIComponent(location)}`;
    // const response = await fetch(geocodingUrl);
    // const data = await response.json();

    // Simulate some insights based on the location and idea
    let insights = `Based in ${location}, your startup idea "${idea}" has potential.`
    if (location.toLowerCase().includes("delhi")) {
      insights +=
        " Delhi is a bustling tech hub with a growing startup ecosystem, but also high competition in many sectors."
    } else if (location.toLowerCase().includes("san francisco")) {
      insights +=
        " San Francisco offers access to venture capital and a strong talent pool, but also faces high operational costs."
    } else {
      insights +=
        " Further local market research would be beneficial to understand specific opportunities and challenges."
    }

    return NextResponse.json({
      location,
      idea,
      insights,
      // You would add more structured data from OpenRoute API here, e.g.,
      // geocoded_coordinates: data.features[0].geometry.coordinates,
      // nearby_places_of_interest: ...
    })
  } catch (error) {
    console.error("Error fetching location insights:", error)
    return NextResponse.json({ error: "Failed to get location insights" }, { status: 500 })
  }
}
