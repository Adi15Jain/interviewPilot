"use client";

interface CategoryProgressProps {
    categories: Array<{
        name: string;
        score: number;
    }>;
}

const CategoryProgress = ({ categories }: CategoryProgressProps) => {
    return (
        <div className="w-full flex flex-col h-full">
            <h4 className="text-sm font-black text-light-600 uppercase tracking-[0.3em] mb-8 relative z-10 transition-colors group-hover/chart:text-primary-200">
                Industry Proficiency
            </h4>
            <div className="flex flex-col gap-6">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div
                            key={cat.name}
                            className="flex flex-col gap-3 group/item"
                        >
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-light-100 group-hover/item:text-primary-200 transition-colors">
                                    {cat.name}
                                </span>
                                <span className="text-xs font-black text-primary-200">
                                    {cat.score}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-200 shadow-[0_0_10px_rgba(202,197,254,0.5)] transition-all duration-1000 ease-out"
                                    style={{ width: `${cat.score}%` }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center opacity-30 h-40">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-light-600">
                            Awaiting Skill Metrics
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProgress;
