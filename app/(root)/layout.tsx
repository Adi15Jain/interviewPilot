import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="root-layout">
            <Navbar />
            {children}
            <Footer />
        </main>
    );
};

export default RootLayout;
