import Image from "next/image";
import Link from "next/link";
import { getLeaderboard } from "@/lib/actions/general.action";
import { Trophy, Medal, Star, Target, Users, TrendingUp } from "lucide-react";

const LeaderboardPage = async () => {
    const leaderboard = await getLeaderboard(50);

    const topThree = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    return (
        <div className="flex flex-col gap-12 pb-20 animate-in fade-in duration-1000">
            {/* Header Section */}
            <header className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary-200/10 text-primary-200">
                        <Trophy className="size-8" />
                    </div>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercaem">
                    Global <span className="text-primary-200">Leaderboard</span>
                </h1>
                <p className="text-light-400 text-lg font-medium leading-relaxed">
                    Celebrating the most dedicated and high-performing students
                    on the InterviewPilot.
                </p>
            </header>

            {/* Podium Section */}
            {topThree.length > 0 && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto w-full px-4">
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <div className="order-2 md:order-1 flex flex-col items-center gap-6 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 group-hover:bg-blue-500/30 transition-all duration-700" />
                                <div className="size-28 rounded-full border-4 border-blue-500/30 overflow-hidden relative z-10 p-1.5 bg-[#020408]">
                                    <Image
                                        src={
                                            topThree[1].image ||
                                            "/user-avatar.png"
                                        }
                                        alt={topThree[1].name}
                                        width={112}
                                        height={112}
                                        className="rounded-full object-cover size-full"
                                    />
                                    <div className="absolute -bottom-2 -right-2 size-10 bg-blue-500 text-white rounded-full flex items-center justify-center border-4 border-[#020408] font-black text-lg">
                                        2
                                    </div>
                                </div>
                            </div>
                            <div className="text-center z-10 glass-card p-6 rounded-3xl border-blue-500/10 w-full hover:border-blue-500/30 transition-all">
                                <h3 className="text-xl font-black text-white truncate px-2">
                                    {topThree[1].name}
                                </h3>
                                <div className="flex items-center justify-center gap-4 mt-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-light-600">
                                            Avg Score
                                        </span>
                                        <span className="text-xl font-black text-blue-400">
                                            {topThree[1].avgScore}%
                                        </span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-light-600">
                                            Interviews
                                        </span>
                                        <span className="text-xl font-black text-white">
                                            {topThree[1].interviewCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rank 1 */}
                    <div className="order-1 md:order-2 flex flex-col items-center gap-8 group scale-110 relative z-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-200/30 blur-[100px] rounded-full scale-[2] group-hover:bg-primary-200/40 transition-all duration-1000" />
                            <div className="size-36 rounded-full border-4 border-primary-200 overflow-hidden relative z-10 p-2 bg-[#020408] shadow-[0_0_50px_rgba(202,197,254,0.3)]">
                                <Image
                                    src={
                                        topThree[0].image || "/user-avatar.png"
                                    }
                                    alt={topThree[0].name}
                                    width={144}
                                    height={144}
                                    className="rounded-full object-cover size-full"
                                />
                                <div className="absolute -bottom-2 -right-2 size-12 bg-primary-200 text-dark-100 rounded-full flex items-center justify-center border-4 border-[#020408] font-black text-2xl shadow-xl animate-bounce">
                                    <Trophy className="size-6" />
                                </div>
                            </div>
                        </div>
                        <div className="text-center z-10 glass-card-extreme p-8 rounded-[2.5rem] border-primary-200/20 w-full hover:border-primary-200/40 transition-all">
                            <h3 className="text-2xl font-black text-white truncate px-2">
                                {topThree[0].name}
                            </h3>
                            <div className="flex items-center justify-center gap-6 mt-4">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-200">
                                        Master Level
                                    </span>
                                    <span className="text-2xl font-black text-primary-200">
                                        {topThree[0].avgScore}%
                                    </span>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-light-400">
                                        Total Runs
                                    </span>
                                    <span className="text-2xl font-black text-white">
                                        {topThree[0].interviewCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rank 3 */}
                    {topThree[2] && (
                        <div className="order-3 flex flex-col items-center gap-6 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-amber-600/20 blur-3xl rounded-full scale-150 group-hover:bg-amber-600/30 transition-all duration-700" />
                                <div className="size-28 rounded-full border-4 border-amber-600/30 overflow-hidden relative z-10 p-1.5 bg-[#020408]">
                                    <Image
                                        src={
                                            topThree[2].image ||
                                            "/user-avatar.png"
                                        }
                                        alt={topThree[2].name}
                                        width={112}
                                        height={112}
                                        className="rounded-full object-cover size-full"
                                    />
                                    <div className="absolute -bottom-2 -right-2 size-10 bg-amber-600 text-white rounded-full flex items-center justify-center border-4 border-[#020408] font-black text-lg">
                                        3
                                    </div>
                                </div>
                            </div>
                            <div className="text-center z-10 glass-card p-6 rounded-3xl border-amber-600/10 w-full hover:border-amber-600/30 transition-all">
                                <h3 className="text-xl font-black text-white truncate px-2">
                                    {topThree[2].name}
                                </h3>
                                <div className="flex items-center justify-center gap-4 mt-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-light-600">
                                            Avg Score
                                        </span>
                                        <span className="text-xl font-black text-amber-500">
                                            {topThree[2].avgScore}%
                                        </span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-light-600">
                                            Interviews
                                        </span>
                                        <span className="text-xl font-black text-white">
                                            {topThree[2].interviewCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Table Section */}
            <section className="max-w-5xl mx-auto w-full px-4 mt-8">
                <div className="glass-card-extreme rounded-[2.5rem] border border-white/5 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-8 py-6 bg-white/5 border-b border-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-light-600">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-6">Candidate</div>
                        <div className="col-span-3 text-center">Efficiency</div>
                        <div className="col-span-2 text-right">Interviews</div>
                    </div>

                    <div className="flex flex-col transition-all duration-500">
                        {others.length > 0
                            ? others.map((player, idx) => (
                                  <div
                                      key={player.userId}
                                      className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0 group"
                                  >
                                      <div className="col-span-1 text-lg font-black text-light-600 group-hover:text-primary-200 transition-colors">
                                          {idx + 4}
                                      </div>
                                      <div className="col-span-6 flex items-center gap-4">
                                          <div className="size-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                                              <Image
                                                  src={
                                                      player.image ||
                                                      "/user-avatar.png"
                                                  }
                                                  alt={player.name}
                                                  width={40}
                                                  height={40}
                                                  className="object-cover size-full"
                                              />
                                          </div>
                                          <span className="text-base font-bold text-white tracking-tight leading-tight">
                                              {player.name}
                                          </span>
                                      </div>
                                      <div className="col-span-3">
                                          <div className="flex flex-col items-center gap-1.5 w-full">
                                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                  <div
                                                      className="h-full bg-gradient-to-r from-primary-200 to-primary-100 shadow-[0_0_8px_rgba(202,197,254,0.4)]"
                                                      style={{
                                                          width: `${player.avgScore}%`,
                                                      }}
                                                  />
                                              </div>
                                              <span className="text-sm font-black text-white tabular-nums">
                                                  {player.avgScore}%
                                              </span>
                                          </div>
                                      </div>
                                      <div className="col-span-2 text-right">
                                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-sm font-black text-light-400 group-hover:text-white transition-colors">
                                              {player.interviewCount}
                                          </span>
                                      </div>
                                  </div>
                              ))
                            : topThree.length === 0 && (
                                  <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-40">
                                      <Users className="size-12" />
                                      <p className="font-black uppercase tracking-widest text-xs">
                                          No performance data yet
                                      </p>
                                  </div>
                              )}
                    </div>
                </div>
            </section>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full px-4">
                <div className="glass-card p-6 rounded-3xl border-white/5 flex gap-4 items-start">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                        <TrendingUp className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">
                            Dynamic Ranking
                        </h4>
                        <p className="text-sm text-light-600 leading-relaxed font-medium">
                            Rankings are updated in real-time as soon as an
                            interview is completed and analyzed.
                        </p>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border-white/5 flex gap-4 items-start">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                        <Star className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">
                            Consistency Key
                        </h4>
                        <p className="text-sm text-light-600 leading-relaxed font-medium">
                            Top performers exhibit consistent growth across
                            technical and behavioral metrics over multiple runs.
                        </p>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border-white/5 flex gap-4 items-start">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
                        <Target className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">
                            AI Precision
                        </h4>
                        <p className="text-sm text-light-600 leading-relaxed font-medium">
                            Evaluation is powered by Gemini 2.5 Flash, ensuring
                            highly accurate and unbiased performance grading.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
