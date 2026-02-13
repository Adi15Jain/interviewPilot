import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbacksByUserId } from "@/lib/actions/general.action";
import InterviewCard from "@/components/InterviewCard";

const FeedbacksPage = async () => {
    const user = await getCurrentUser();
    if (!user) return null;

    const feedbacks = await getFeedbacksByUserId(user.id);

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold text-primary-100">
                    Your Feedbacks
                </h1>
                <p className="text-xl text-light-100">
                    Review your performance across all completed interviews.
                </p>
            </header>

            <section className="interviews-section">
                {feedbacks && feedbacks.length > 0 ? (
                    feedbacks.map((feedback: any) => (
                        <InterviewCard
                            key={feedback.id}
                            userId={user.id}
                            interviewId={feedback.interviewId}
                            role={feedback.interview.role}
                            type={feedback.interview.type}
                            techstack={feedback.interview.techstack}
                            createdAt={feedback.createdAt}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-dark-200/50 rounded-3xl border border-dashed border-light-800 w-full">
                        <p className="text-lg">
                            You haven't received any feedback yet.
                        </p>
                        <p className="text-sm text-light-600 mt-2">
                            Complete an interview to see your results here!
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default FeedbacksPage;
