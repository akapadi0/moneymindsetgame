'use client';

import React, { useEffect, useState } from 'react';

//
// 1) Define Types
//
interface StatementData {
  statement: string;
  category: string;
}

type SelectedCountMap = Record<string, number>;

//
// 2) Main Component
//
export default function MoneyMindsetSorter() {
  // ---------------------------------------------------------------------------
  // DATA
  // ---------------------------------------------------------------------------
  const allStatements: StatementData[] = [
    // Guardians
    { statement: "I keep track of my bank balances at least weekly.", category: "Guardians" },
    { statement: "I feel anxious if I do not have a financial safety net.", category: "Guardians" },
    { statement: "I believe it is risky to spend money on non-essentials when not fully prepared for emergencies.", category: "Guardians" },
    { statement: "Having insurance policies or warranties gives me peace of mind.", category: "Guardians" },
    { statement: "I prefer stable, predictable income over bigger but uncertain earnings.", category: "Guardians" },
    { statement: "I question purchases carefully, even small ones, to ensure necessity.", category: "Guardians" },
    { statement: "I would rather budget conservatively and be pleasantly surprised than overshoot.", category: "Guardians" },
    { statement: "I feel uneasy if I do not know exactly where my money goes each month.", category: "Guardians" },
    { statement: "I avoid high-risk investments, even if it means missing bigger returns.", category: "Guardians" },
    { statement: "I sometimes worry that letting my guard down means facing financial disaster.", category: "Guardians" },

    // Strategists
    { statement: "I enjoy creating detailed budgets or spreadsheets.", category: "Strategists" },
    { statement: "I set short and long-term money goals and track progress.", category: "Strategists" },
    { statement: "A written financial plan is essential to avoid mistakes.", category: "Strategists" },
    { statement: "I research major purchases for days or weeks before committing.", category: "Strategists" },
    { statement: "I regularly study personal finance or investing strategies.", category: "Strategists" },
    { statement: "I tweak my budget when new circumstances arise.", category: "Strategists" },
    { statement: "I track bills, due dates, and receipts meticulously.", category: "Strategists" },
    { statement: "I feel accomplished checking off financial to-do items.", category: "Strategists" },
    { statement: "A step-by-step approach can solve most money issues.", category: "Strategists" },
    { statement: "I map out a timeline for paying off debt or saving up for a goal.", category: "Strategists" },

    // Impressors
    { statement: "I compare my possessions or income to friends or coworkers.", category: "Impressors" },
    { statement: "I feel proud when people notice my home, car, or clothes.", category: "Impressors" },
    { statement: "I am willing to take on debt to maintain a certain image.", category: "Impressors" },
    { statement: "Deep down, I believe people judge my worth by financial achievements.", category: "Impressors" },
    { statement: "I enjoy talking about raises or big purchases with friends.", category: "Impressors" },
    { statement: "I feel left behind if I cannot afford the latest status symbol.", category: "Impressors" },
    { statement: "I like spending on brand names or high-end items to stand out.", category: "Impressors" },
    { statement: "When I earn more, I upgrade my lifestyle quickly.", category: "Impressors" },
    { statement: "I sometimes measure my value by how much I have vs. others.", category: "Impressors" },
    { statement: "I am motivated to make more money because it shows I am doing well.", category: "Impressors" },

    // Givers
    { statement: "I am the first to offer help if someone has a financial shortfall.", category: "Givers" },
    { statement: "Giving gifts or money makes me feel connected to others.", category: "Givers" },
    { statement: "I would rather share what I have than watch someone struggle.", category: "Givers" },
    { statement: "I sometimes neglect my own savings to help others.", category: "Givers" },
    { statement: "Having money is meaningless if I cannot use it to help people.", category: "Givers" },
    { statement: "I often pick up the check, even if it is a stretch for my budget.", category: "Givers" },
    { statement: "I feel guilty buying luxuries for myself if I have not donated recently.", category: "Givers" },
    { statement: "I think about sharing it whenever I receive extra money.", category: "Givers" },
    { statement: "I worry I will seem selfish if I do not offer help when asked.", category: "Givers" },
    { statement: "I place a higher value on generosity than on personal wealth.", category: "Givers" },

    // Adventurers
    { statement: "I love making spontaneous purchases that spark joy.", category: "Adventurers" },
    { statement: "Budgets feel stifling; I would rather see how things go.", category: "Adventurers" },
    { statement: "I would rather spend money now to create fun memories than wait.", category: "Adventurers" },
    { statement: "I believe more money means more fun and experiences.", category: "Adventurers" },
    { statement: "I rarely let affordability stop me if I am truly excited.", category: "Adventurers" },
    { statement: "I enjoy taking financial risks for a chance at a big payoff.", category: "Adventurers" },
    { statement: "I sometimes regret impulsive buys, but cannot imagine living otherwise.", category: "Adventurers" },
    { statement: "A once-in-a-lifetime trip is worth a bit of debt.", category: "Adventurers" },
    { statement: "I hate feeling constrained by strict financial rules.", category: "Adventurers" },
    { statement: "I would rather fix financial issues later than miss out now.", category: "Adventurers" },

    // Free Spirits
    { statement: "I dislike worrying about money details; it will work out somehow.", category: "Free Spirits" },
    { statement: "I rarely check balances unless there is a big reason to.", category: "Free Spirits" },
    { statement: "Focusing heavily on finances seems obsessive or unhealthy.", category: "Free Spirits" },
    { statement: "I go with my gut rather than strict planning.", category: "Free Spirits" },
    { statement: "If I cover the basics, I am satisfied.", category: "Free Spirits" },
    { statement: "I prefer a flexible lifestyle without rigid budgets.", category: "Free Spirits" },
    { statement: "I tune out if someone starts discussing complex financial planning.", category: "Free Spirits" },
    { statement: "I believe life will present opportunities, so I do not worry long-term.", category: "Free Spirits" },
    { statement: "I do not sweat small overspending; it usually balances out.", category: "Free Spirits" },
    { statement: "If I have enough for essentials, I do not feel the need to hoard more.", category: "Free Spirits" },
  ];

  // Provide a type for the categoryInfo object
  const categoryInfo: Record<string, string> = {
    Guardians: "Seek safety and protection through saving and being financially prepared.",
    Strategists: "Value planning, structure, and long-term goal-setting.",
    Impressors: "Use money to project success, achievement, or social standing.",
    Givers: "Express generosity and connection through monetary help or gifts.",
    Adventurers: "Live in the moment, seek excitement, and embrace spontaneity in finances.",
    "Free Spirits": "Maintain a relaxed, low-stress approach to money, trusting it will work out.",
  };

  // ---------------------------------------------------------------------------
  // STATE HOOKS
  // ---------------------------------------------------------------------------
  const [page, setPage] = useState<number>(0);
  const [cards, setCards] = useState<StatementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCount, setSelectedCount] = useState<SelectedCountMap>({});

  // ---------------------------------------------------------------------------
  // SHUFFLE ARRAY ON MOUNT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const shuffled = shuffleArray(allStatements);
    setCards(shuffled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function shuffleArray(array: StatementData[]): StatementData[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  const handleStartGame = () => setPage(1);

  const handleSelectMe = () => {
    const cat = cards[currentIndex].category;
    setSelectedCount((prev) => ({
      ...prev,
      [cat]: (prev[cat] || 0) + 1,
    }));
    goToNextCard();
  };

  const handleSelectNotMe = () => {
    // No increment for that category
    goToNextCard();
  };

  const goToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPage(2);
    }
  };

  // Returns an array of unique category strings
  const getUniqueCategories = (arrayOfCards: StatementData[]): string[] => {
    const setCat = new Set(arrayOfCards.map((c) => c.category));
    return Array.from(setCat);
  };

  // Classify "Me" count
  const getStrengthLabel = (count: number): string => {
    if (count >= 1 && count <= 3) return "USING";
    if (count >= 4 && count <= 7) return "DOMINANT";
    if (count >= 8 && count <= 10) return "STRONG DOMINANT";
    return "—";
  };

  // ---------------------------------------------------------------------------
  // PROGRESS BAR
  // ---------------------------------------------------------------------------
  const totalCards = cards.length;
  const progressPercentage = totalCards > 0
    ? Math.round((currentIndex / totalCards) * 100)
    : 0;

  // ---------------------------------------------------------------------------
  // RENDER LOGIC
  // ---------------------------------------------------------------------------

  // PAGE 0: INTRO
  if (page === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.introContent}>
          {/* Disable ESLint rule for using <img> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wiq-logo.png" // Absolute path
            alt="Wealth IQ Logo"
            width="120" // Changed to string for consistency
            height="60"
            style={styles.logo}
          />
          <h1>Welcome to the Money Mindset Game</h1>
          <p style={styles.introText}>
            This is a game to help you understand your money mindset better.
            You will be presented with several cards in random order. Take a few
            seconds to evaluate each one, then sort it into one of two piles:
            <strong> “Agree”</strong> or{" "}
            <strong>“Disagree”</strong>
          </p>
          <button style={styles.button} onClick={handleStartGame}>
            Begin
          </button>
        </div>
      </div>
    );
  }

  // PAGE 1: GAME
  if (page === 1) {
    if (!cards || cards.length === 0) {
      return (
        <div style={styles.container}>
          <h2>Loading...</h2>
        </div>
      );
    }

    const currentCard = cards[currentIndex];

    return (
      <div style={styles.container}>
        <h2 style={styles.title}>
          For each statement below, please indicate whether it sounds like you or not, do not overthink
        </h2>
        <div style={styles.progressBarContainer}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${progressPercentage}%`,
            }}
          />
        </div>
        <p style={styles.progress}>
          {currentIndex + 1} / {cards.length}
        </p>

        <div style={styles.card}>
          <p style={styles.cardStatement}>{currentCard.statement}</p>
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={handleSelectMe}>
            This sounds like me
          </button>
          <button style={styles.button} onClick={handleSelectNotMe}>
            This does not sound like me
          </button>
        </div>
      </div>
    );
  }

  // PAGE 2: RESULTS
  if (page === 2) {
    const categories = getUniqueCategories(cards);

    // Sort categories by descending # of "Me" statements
    const sortedCategories = [...categories].sort((catA, catB) => {
      const countA = selectedCount[catA] || 0;
      const countB = selectedCount[catB] || 0;
      return countB - countA;
    });

    return (
      <div style={styles.container}>
        <h2>Results</h2>
        <p>You have finished sorting all {cards.length} cards.</p>

        <div style={styles.resultsTable}>
          <div style={styles.resultsHeader}>
            <div style={styles.resultsHeaderCell}>Money Mindset</div>
            <div style={styles.resultsHeaderCell}># of “Me” Cards</div>
            <div style={styles.resultsHeaderCell}>Strength</div>
            <div style={styles.resultsHeaderCell}>Core Motivation</div>
          </div>

          {sortedCategories.map((cat) => {
            const count = selectedCount[cat] || 0;
            const label = getStrengthLabel(count);
            const motivation = categoryInfo[cat];

            return (
              <div key={cat} style={styles.resultsRow}>
                {/* Mindset */}
                <div style={styles.resultsCell}>{cat}</div>
                {/* # of "Me" */}
                <div style={styles.resultsCell}>{count}</div>
                {/* Strength */}
                <div style={styles.resultsCell}>{label}</div>
                {/* Core Motivation */}
                <div style={styles.resultsCell}>{motivation}</div>
              </div>
            );
          })}
        </div>

        <button
          style={{ ...styles.button, marginTop: 20 }}
          onClick={() => window.location.reload()}
        >
          Start Over
        </button>
      </div>
    );
  }

  return null;
}

//
// 3) STYLES
//
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
  button: {
    padding: "10px 20px",
    backgroundColor: "#D47392",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  title: {
    marginBottom: "10px",
    color: "#FFD5E5",
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
    background: "linear-gradient(135deg, #333, #444)",
    borderRadius: "8px",
    border: "1px solid #D47392",
    boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
  },
  cardStatement: {
    fontSize: "1.2rem",
    marginBottom: "10px",
    color: "#FFD5E5",
  },
  buttonRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
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
