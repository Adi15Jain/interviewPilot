import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/actions/auth.action";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCurrentUser();

    if (!user) redirect("/sign-in");

    return (
        <main className="root-layout">
            <Navbar />
            {children}
            <Footer />
        </main>
    );
};

export default RootLayout;
