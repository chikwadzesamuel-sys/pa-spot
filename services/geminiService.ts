
import { GoogleGenAI, Type } from "@google/genai";
import { BookingDetails, CleanerBid } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCleanerBids = async (details: BookingDetails): Promise<CleanerBid[]> => {
  const prompt = `
    Act as a professional cleaning service marketplace coordinator for "Pa Spot Cleaning Service".
    A client wants a ${details.category === 'HOUSE' ? 'House Clean' : 'Car Wash'}.
    Specifics: ${details.subType}.
    Client's suggested price: $${details.userPrice}.
    Location: ${details.location.address}.
    Notes: ${details.additionalNotes}.

    Generate 3 distinct, professional cleaner bids. 
    One bid should be close to the client's price, one should be slightly higher but with more experience, and one should be premium.
    Use realistic names and varied ratings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              completedJobs: { type: Type.NUMBER },
              price: { type: Type.NUMBER },
              timeEstimate: { type: Type.STRING },
              avatar: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['id', 'name', 'rating', 'completedJobs', 'price', 'timeEstimate', 'avatar', 'description']
          }
        }
      }
    });

    const bids = JSON.parse(response.text);
    // Add realistic avatars from picsum if not provided or to ensure quality
    return bids.map((bid: any, index: number) => ({
      ...bid,
      avatar: `https://picsum.photos/seed/${bid.id}/100/100`
    }));
  } catch (error) {
    console.error("Error fetching bids:", error);
    // Fallback bids if API fails
    return [
      {
        id: '1',
        name: 'Samuel Cleanwell',
        rating: 4.8,
        completedJobs: 124,
        price: details.userPrice + 5,
        timeEstimate: '2 hours',
        avatar: 'https://picsum.photos/seed/1/100/100',
        description: 'Professional cleaner specializing in detailed deep cleans.'
      }
    ];
  }
};
