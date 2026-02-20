const InterviewLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="min-h-screen bg-dark-100 flex flex-col items-center p-4 sm:p-16 relative">
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
                {children}
            </div>
        </main>
    );
};

export default InterviewLayout;
