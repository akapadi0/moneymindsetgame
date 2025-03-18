// src/app/api/save-results/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb"; // Adjust the path if needed

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body from the request
    const { name, email, selections } = await request.json();

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { message: "Missing 'name' or 'email'" },
        { status: 400 }
      );
    }

    // Connect to your MongoDB
    const client = await clientPromise;
    const db = client.db("MoneyMindsetGame"); // Adjust DB name if needed
    const resultsColl = db.collection("moneyMindsetResults"); // Adjust collection name if needed

    // Insert the user's data into MongoDB
    const result = await resultsColl.insertOne({
      name,
      email,
      selections, // array of { statement, category, agreed: boolean }
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Results saved successfully", insertedId: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("DB Insertion Error:", error);
    return NextResponse.json(
      { message: "Error saving results to database." },
      { status: 500 }
    );
  }
}