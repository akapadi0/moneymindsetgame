export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-6 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
        <p>
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/aditikapadia1/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Aditi Kapadia
          </a>{" "}
          &amp;{" "}
          <a
            href="https://www.linkedin.com/in/manalipatel19/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Manali Patel
          </a>
        </p>
      </div>
    </footer>
  );
}
