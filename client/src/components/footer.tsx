export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-6 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
        <p>
          Built by{" "}
          <button
            onClick={() => window.open("https://www.linkedin.com/in/aditikapadia1/", "_blank")}
            className="text-primary hover:underline font-medium cursor-pointer bg-transparent border-none p-0"
          >
            Aditi Kapadia
          </button>{" "}
          &amp;{" "}
          <button
            onClick={() => window.open("https://www.linkedin.com/in/manalipatel19/", "_blank")}
            className="text-primary hover:underline font-medium cursor-pointer bg-transparent border-none p-0"
          >
            Manali Patel
          </button>
        </p>
      </div>
    </footer>
  );
}
