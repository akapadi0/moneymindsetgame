"use client";

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// 1) TYPES
// ---------------------------------------------------------------------------
interface StatementData {
  statement: string;
  category: string;
}

type SelectedCountMap = { [key: string]: number };

// We'll store each choice in an array so we can save it to Mongo
interface UserSelection {
  statement: string;
  category: string;
  agreed: boolean; // true => "Agree", false => "Disagree"
}

// ---------------------------------------------------------------------------
// 2) ALL STATEMENTS (36 total: 6 categories x 6 statements each)
// ---------------------------------------------------------------------------
const allStatements: StatementData[] = [
  // Guardians
  {
    statement: "I feel secure when I maintain an ample cash reserve in my bank for unexpected emergencies.",
    category: "Guardians",
  },
  {
    statement: "I track and monitor my expenditures to keep control over my finances.",
    category: "Guardians",
  },
  {
    statement: "I prefer stable income and low risk investments over chasing speculative opportunities.",
    category: "Guardians",
  },
  {
    // Escaped single quotes
    statement: "Carrying debt makes me uncomfortable, even if is considered good debt.",
    category: "Guardians",
  },
  {
    statement:
      "I experience greater distress when my investments lose money than the satisfaction I derive from equivalent gains.",
    category: "Guardians",
  },
  {
    statement:
      "I make saving a top priority, setting aside funds for future security before indulging in discretionary spending.",
    category: "Guardians",
  },

  // Strategists
  {
    statement: "I love mapping out clear, measurable financial goals (e.g., saving for retirement).",
    category: "Strategists",
  },
  {
    statement: "I research thoroughly before making big money decisions (e.g., purchasing a home, car).",
    category: "Strategists",
  },
  {
    statement: "I compare multiple options (mortgages, credit cards, investments) to find the best deal.",
    category: "Strategists",
  },
  {
    statement: "I track my net worth or budget regularly to stay on course.",
    category: "Strategists",
  },
  {
    statement: "I reflect on past money mistakes and adjust my plan to avoid repeating them.",
    category: "Strategists",
  },
  {
    statement: "I consider potential financial setbacks well in advance to be prepared.",
    category: "Strategists",
  },

  // Impressors
  {
    statement: "The lifestyle and choices of my social circle influences what I too value in my life.",
    category: "Impressors",
  },
  {
    statement: "I find myself drawn to purchases or experiences that others view positively or recommend.",
    category: "Impressors",
  },
  {
    statement: "It is important to me that my financial choices align with the image I want to project.",
    category: "Impressors",
  },
  {
    statement: "Receiving compliments on things I own or experiences I have had feels rewarding",
    category: "Impressors",
  },
  {
    statement: "At times, I spend more to ensure my lifestyle stays comparable to those I spend time with.",
    category: "Impressors",
  },
  {
    statement: "When making purchase decisions, I am influenced by what people I admire.",
    category: "Impressors",
  },

  // Givers
  {
    statement: "I enjoy giving gifts or donating money, even if it means a tighter budget for myself.",
    category: "Givers",
  },
  {
    statement: "I feel more satisfaction when my money benefits others than when it only benefits me.",
    category: "Givers",
  },
  {
    statement: "I often offer to cover expenses or help friends or family in need.",
    category: "Givers",
  },
  {
    statement: "I believe charitable giving is more important than personal splurges.",
    category: "Givers",
  },
  {
    statement: "I rarely hesitate to lend money to people I trust.",
    category: "Givers",
  },
  {
    statement: "I measure my success by how many people I can help financially.",
    category: "Givers",
  },

  // Adventurers
  {
    statement: "I get excited at the thought of high-potential, higher-risk financial moves.",
    category: "Adventurers",
  },
  {
    statement: "I see unexpected costs as chances to learn or try unconventional solutions.",
    category: "Adventurers",
  },
  {
    statement:
      "I make spontaneous spending or investment decisions when an opportunity seems worthwhile, without overanalyzing it.",
    category: "Adventurers",
  },
  {
    statement: "I do not mind taking on debt to fund adventures or travel",
    category: "Adventurers",
  },
  {
    statement: "I am more motivated by potential gains than worried about potential losses.",
    category: "Adventurers",
  },
  {
    statement: "I often explore new side hustles or income streams for the thrill of it.",
    category: "Adventurers",
  },

  // Free Spirits
  {
    statement: "I do not stress over tracking every dollar because I trust it will work out.",
    category: "Free Spirits",
  },
  {
    statement: "I rarely create strict budgets, preferring to handle money more flexibly.",
    category: "Free Spirits",
  },
  {
    statement: "I feel limited by tight financial plans or rules.",
    category: "Free Spirits",
  },
  {
    statement: "I often make spontaneous purchases without guilt.",
    category: "Free Spirits",
  },
  {
    statement: "I believe money is just a tool; I don't obsess over it.",
    category: "Free Spirits",
  },
  {
    // Escaped single quotes
    statement: "I do not see the point in worrying too much about future and what ifs",
    category: "Free Spirits",
  },
];

// ---------------------------------------------------------------------------
// 3) CATEGORY INFO
// ---------------------------------------------------------------------------
const categoryInfo: Record<string, string> = {
  Guardians: "Minimizing uncertainty and ensuring financial safety.",
  Strategists: "Achieving long-term success through structure and informed decisions.",
  Impressors: "Enhancing self-worth or social standing through financial displays.",
  Givers: "Fostering community well-being through financial generosity.",
  Adventurers: "Seeking excitement, novelty, and personal freedom in money matters.",
  "Free Spirits": "Enjoying life's flow and reducing anxiety about money details.",
};

// ---------------------------------------------------------------------------
// 4) PAGE COMPONENT
// ---------------------------------------------------------------------------
export default function MoneyMindsetGame() {
  // -- PAGE STATES --
  const [page, setPage] = useState<number>(0);

  // -- Collect name + email on PAGE 0 --
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");

  // -- For the game: statements, currentIndex, etc. --
  const [cards, setCards] = useState<StatementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCount, setSelectedCount] = useState<SelectedCountMap>({});

  // We'll track *every* user choice so we can store in Mongo
  const [selections, setSelections] = useState<UserSelection[]>([]);

  // Shuffle statements on mount
  useEffect(() => {
    const shuffled = shuffleArray(allStatements);
    setCards(shuffled);
  }, []);

  // Helper to shuffle
  function shuffleArray(array: StatementData[]): StatementData[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  // -------------------------------------------------------------------------
  // PAGE 0: INTRO (Collect Name + Email Upfront)
  // -------------------------------------------------------------------------
  if (page === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.introContent}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wiq-logo.png"
            alt="Wealth IQ Logo"
            width="120"
            height="60"
            style={styles.logo}
          />
          <h1 style={styles.title}>Welcome to the Money Mindset Game</h1>
          <p style={styles.introText}>
            This is a tool we have developed, to help us understand you better.
            Please input your name & email so you can receive a copy of your results.
            We will discuss the results in an upcoming session. Once you hit begin,
            you will be presented with 36 cards. Take a few seconds to evaluate each one.
            Then sort them into one of two piles: <strong>&quot;Agree&quot;</strong> or <strong>&quot;Disagree&quot;</strong>
          </p>

          {/* Collect Name + Email Upfront */}
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Full Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <button
            style={{ ...styles.button, marginTop: "10px" }}
            onClick={() => {
              if (!clientName || !clientEmail) {
                alert("Please enter both your name and email before proceeding.");
                return;
              }
              setPage(1);
            }}
          >
            Begin
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // PAGE 1: THE GAME
  // -------------------------------------------------------------------------
  if (page === 1) {
    if (!cards || cards.length === 0) {
      return (
        <div style={styles.container}>
          <h2>Loading...</h2>
        </div>
      );
    }

    const currentCard = cards[currentIndex];
    const totalCards = cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((currentIndex / totalCards) * 100) : 0;

    // "Agree"
    const handleSelectMe = () => {
      const cat = currentCard.category;
      // Increment category count if answer is "Agree"
      setSelectedCount((prev) => ({
        ...prev,
        [cat]: (prev[cat] || 0) + 1,
      }));
      // Store the selection
      setSelections((prev) => [
        ...prev,
        { statement: currentCard.statement, category: cat, agreed: true },
      ]);
      goToNextCard();
    };

    // "Disagree"
    const handleSelectNotMe = () => {
      // Store the selection without affecting the count
      setSelections((prev) => [
        ...prev,
        { statement: currentCard.statement, category: currentCard.category, agreed: false },
      ]);
      goToNextCard();
    };

    // "Back" handler to revise previous choice
    const handleBack = () => {
      if (currentIndex === 0) return;
      // Remove the last selection
      const newSelections = [...selections];
      const removed = newSelections.pop();
      setSelections(newSelections);
      // If the removed selection was an "Agree," decrement the count
      if (removed && removed.agreed) {
        setSelectedCount((prev) => ({
          ...prev,
          [removed.category]: Math.max((prev[removed.category] || 1) - 1, 0),
        }));
      }
      setCurrentIndex(currentIndex - 1);
    };

    const goToNextCard = () => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setPage(2);
      }
    };

    return (
      <div style={styles.container}>
        <h2 style={styles.title}>
          For each statement below, indicate if it sounds like you. Do not overthink!
        </h2>
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }} />
        </div>
        <p style={styles.progress}>
          {currentIndex + 1} / {cards.length}
        </p>

        <div style={styles.card}>
          <p style={styles.cardStatement}>{currentCard.statement}</p>
        </div>

        <div style={styles.buttonRow}>
          {currentIndex > 0 && (
            <button style={styles.backButton} onClick={handleBack}>
              ← Back
            </button>
          )}
          <button style={styles.button} onClick={handleSelectMe}>
            Agree
          </button>
          <button style={styles.button} onClick={handleSelectNotMe}>
            Disagree
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // PAGE 2: RESULTS
  // -------------------------------------------------------------------------
  if (page === 2) {
    const categories = getUniqueCategories(cards);

    // Sort categories by descending # of "Agree"
    const sortedCategories = [...categories].sort((catA, catB) => {
      const countA = selectedCount[catA] || 0;
      const countB = selectedCount[catB] || 0;
      return countB - countA;
    });

    // Build a textual summary
    const formattedResultsText = sortedCategories
      .map((cat) => {
        const count = selectedCount[cat] || 0;
        const label = getStrengthLabel(count);
        const motivation = categoryInfo[cat];
        return `• ${cat} => Count: ${count}, Strength: ${label}\n   Motivation: ${motivation}\n`;
      })
      .join("\n");

    // This sends email *and* saves to Mongo
    const handleEmailResults = async () => {
      try {
        // 1) Save results to DB
        const dbResponse = await fetch("/api/save-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: clientName,
            email: clientEmail,
            selections,
          }),
        });
        if (!dbResponse.ok) {
          throw new Error(`Error saving to DB: ${dbResponse.statusText}`);
        }

        // 2) Send the email using your existing Azure-based route
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toEmails: [clientEmail],
            subject: "Your Money Mindset Game Results",
            textBody: `Hello ${clientName},\n\nHere are your Money Mindset results:\n\n${formattedResultsText}`,
            htmlBody: `<h3>Hello ${clientName},</h3><p>Here are your Money Mindset results:</p><pre>${formattedResultsText}</pre>`,
          }),
        });
        if (!emailResponse.ok) {
          throw new Error(`Error sending email: ${emailResponse.statusText}`);
        }

        alert("Your results were saved and emailed successfully!");
      } catch (error) {
        console.error("Error emailing results:", error);
        alert("Sorry, something went wrong. Check console for details.");
      }
    };

    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Results</h2>
        <p>You have finished sorting all {cards.length} cards.</p>

        <div style={styles.resultsTable}>
          <div style={styles.resultsHeader}>
            <div style={styles.resultsHeaderCell}>Money Mindset</div>
            <div style={styles.resultsHeaderCell}># of &quot;Me&quot; Cards</div>
            <div style={styles.resultsHeaderCell}>Strength</div>
            <div style={styles.resultsHeaderCell}>Core Motivation</div>
          </div>

          {sortedCategories.map((cat) => {
            const count = selectedCount[cat] || 0;
            const label = getStrengthLabel(count);
            const motivation = categoryInfo[cat];
            return (
              <div key={cat} style={styles.resultsRow}>
                <div style={styles.resultsCell}>{cat}</div>
                <div style={styles.resultsCell}>{count}</div>
                <div style={styles.resultsCell}>{label}</div>
                <div style={styles.resultsCell}>{motivation}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "20px" }}>
          <button style={{ ...styles.button, marginRight: "10px" }} onClick={handleEmailResults}>
            Email Results
          </button>
          <button style={styles.button} onClick={() => window.location.reload()}>
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // If something goes wrong
  return null;
}

// ---------------------------------------------------------------------------
// 5) HELPER FUNCTIONS
// ---------------------------------------------------------------------------
function getUniqueCategories(arr: StatementData[]): string[] {
  return Array.from(new Set(arr.map((c) => c.category)));
}

function getStrengthLabel(count: number): string {
  if (count >= 1 && count <= 3) return "USING";
  if (count >= 4 && count <= 7) return "DOMINANT";
  if (count >= 8 && count <= 10) return "STRONG DOMINANT";
  return "-";
}

// ---------------------------------------------------------------------------
// 6) STYLES (Updated for input boxes, uniform card sizes, larger title, and Back button)
// ---------------------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    overflow: "auto",
  },
  introContent: {
    maxWidth: "600px",
    margin: "0 auto",
    marginTop: "40px",
  },
  logo: {
    maxWidth: "100%",
    height: "auto",
    marginBottom: "20px",
  },
  introText: {
    fontSize: "1rem",
    margin: "20px 0",
    lineHeight: 1.6,
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    width: "250px",
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #ccc",
    display: "block",
    margin: "0 auto 10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#D47392",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  // Increased title font size so it's not smaller than card text
  title: {
    marginBottom: "10px",
    color: "#FFD5E5",
    fontSize: "1.8rem",
  },
  progressBarContainer: {
    width: "80%",
    maxWidth: "500px",
    height: "10px",
    backgroundColor: "#444",
    borderRadius: "5px",
    margin: "10px auto",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#D47392",
    transition: "width 0.3s ease",
  },
  progress: {
    fontSize: "1rem",
    margin: "10px 0",
    color: "#FFD5E5",
  },
  card: {
    margin: "20px auto",
    padding: "20px",
    maxWidth: "600px",
    minHeight: "200px", // Uniform card height
    background: "linear-gradient(135deg, #333, #444)",
    borderRadius: "8px",
    border: "1px solid #D47392",
    boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
    display: "flex", // Center content vertically and horizontally
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  cardStatement: {
    fontSize: "1.4rem", // Larger font size within card
    marginBottom: "0", // Remove extra margin for vertical centering
    color: "#FFD5E5",
  },
  buttonRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  // New Back button style with a different color and arrow icon
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#555", // Different color from primary button
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  resultsTable: {
    margin: "20px auto",
    maxWidth: "800px",
    backgroundColor: "#222",
    borderRadius: "8px",
    border: "1px solid #D47392",
    padding: "10px",
  },
  resultsHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#333",
    padding: "8px",
    borderRadius: "4px",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  resultsHeaderCell: {
    flex: 1,
    textAlign: "center",
    color: "#FFD5E5",
    fontSize: "0.9rem",
  },
  resultsRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "4px",
  },
  resultsCell: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "#333",
    margin: "2px",
    borderRadius: "4px",
    padding: "6px",
    fontSize: "0.9rem",
    lineHeight: 1.4,
  },
};