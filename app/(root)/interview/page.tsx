import InterviewForm from "@/components/InterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
    const user = await getCurrentUser();

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-black text-white tracking-tight">
                    Create New Interview
                </h1>
            </div>

            <InterviewForm userId={user?.id!} />
        </div>
    );
};

export default Page;
