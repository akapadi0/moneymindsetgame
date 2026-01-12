import { useSubmissions } from "@/hooks/use-game";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Download } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Admin() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { data: submissions, isLoading: dataLoading } = useSubmissions();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [authLoading, user]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null; // Redirect handled in effect

  const downloadCSV = () => {
    if (!submissions) return;
    const headers = ["ID", "Name", "Email", "Date", "Top Archetype"];
    const rows = submissions.map(sub => {
      // Calculate top archetype
      const scores = sub.results as Record<string, number>;
      const top = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b, ["Unknown", 0]);
      return [sub.id, sub.name, sub.email, new Date(sub.createdAt!).toLocaleDateString(), top[0]];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold font-display text-primary">WealthIQ Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Logged in as {user.firstName || user.email}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Leads & Submissions</h2>
            <p className="text-muted-foreground">Total: {submissions?.length || 0}</p>
          </div>
          <Button onClick={downloadCSV} variant="secondary">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Date</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Name</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Email</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Archetype</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions?.map((sub) => {
                   const scores = sub.results as Record<string, number>;
                   const top = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b, ["Unknown", 0]);
                   
                   return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(sub.createdAt!).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">{sub.name || "Anonymous"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{sub.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {top[0]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <button className="hover:text-primary transition-colors">View Details</button>
                      </td>
                    </tr>
                   );
                })}
                {submissions?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No submissions found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
