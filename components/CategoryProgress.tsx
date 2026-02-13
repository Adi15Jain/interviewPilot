"use client";

import { Progress } from "@/components/ui/progress";

interface CategoryProgressProps {
    categories: Array<{
        name: string;
        score: number;
    }>;
}

const CategoryProgress = ({ categories }: CategoryProgressProps) => {
    return (
        <div className="flex flex-col gap-6 w-full h-fit bg-dark-300/30 rounded-3xl border border-light-800/50 p-6">
            <h4 className="text-xl font-semibold text-primary-100 px-2">
                Skill Proficiency
            </h4>
            <div className="flex flex-col gap-5">
                {categories.map((category) => (
                    <div key={category.name} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center px-1">
                            <p className="text-light-100 font-medium">
                                {category.name}
                            </p>
                            <p className="text-primary-200 font-bold">
                                {category.score}%
                            </p>
                        </div>
                        <Progress
                            value={category.score}
                            className="h-2 bg-dark-200"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryProgress;
