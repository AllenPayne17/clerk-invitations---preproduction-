import { UserButton } from "@clerk/nextjs";
import  {OrgDashboard}  from "@/components/dashboard";

export default function Home() {
  return (
    <div className="h-screen">
      <OrgDashboard />
    </div>
  )
}