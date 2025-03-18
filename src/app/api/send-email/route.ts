import { NextResponse } from "next/server";
import { ConfidentialClientApplication } from "@azure/msal-node";

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET as string,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getAccessToken(): Promise<string> {
  const tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };
  const response = await cca.acquireTokenByClientCredential(tokenRequest);
  if (!response || !response.accessToken) {
    throw new Error("Could not acquire access token from Azure AD");
  }
  return response.accessToken;
}

export async function POST(req: Request) {
  try {
    const { toEmails, subject, textBody, htmlBody } = await req.json();

    const accessToken = await getAccessToken();

    // Replace with the mailbox user you want to send from
    const mailboxUser = process.env.OUTLOOK_USER; // e.g., "hello@wealthiqco.com"

    const message = {
      subject,
      body: {
        contentType: "HTML",
        content: htmlBody || textBody,
      },
      toRecipients: Array.isArray(toEmails)
        ? toEmails.map((email: string) => ({ emailAddress: { address: email } }))
        : [{ emailAddress: { address: toEmails } }],
    };

    const graphResponse = await fetch(
      `https://graph.microsoft.com/v1.0/users/${mailboxUser}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          saveToSentItems: true,
        }),
      }
    );

    if (!graphResponse.ok) {
      const errorText = await graphResponse.text();
      throw new Error(`Graph API returned ${graphResponse.status}: ${errorText}`);
    }

    return NextResponse.json({ message: "Email sent successfully via Graph" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email via Graph:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}