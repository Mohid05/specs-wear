import { inquiries } from "@/data/mockData";

export default function AdminInquiries() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Inquiries</h1>
      <div className="mt-6 overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Phone</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{inq.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{inq.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{inq.product}</td>
                <td className="px-4 py-3 text-muted-foreground">{inq.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${inq.status === "New" ? "bg-primary/10 text-primary" : inq.status === "Responded" ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"}`}>
                    {inq.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
