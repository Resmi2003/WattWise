import React from "react";
import { useAppContext } from "../../context/AppContext";

import {
    FaBolt,
    FaChartPie,
    FaCircle,
} from "react-icons/fa";

function Analytics() {

    const { usageLogs } = useAppContext();


    if (!usageLogs || usageLogs.length === 0) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-24 h-24 rounded-full bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center mx-auto mb-6">

                        <FaChartPie className="text-4xl text-cyan-500" />

                    </div>

                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                        No Analytics Data
                    </h2>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Add usage logs to generate analytics.
                    </p>

                </div>

            </div>
        );
    }

    // ================= TOTAL ENERGY =================

    const totalEnergy = usageLogs.reduce((sum, log) => {
        return sum + Number(log.energy || 0);
    }, 0);

    // ================= APPLIANCE ENERGY =================

    const applianceEnergy = {};

    usageLogs.forEach((log) => {

        if (!applianceEnergy[log.applianceName]) {
            applianceEnergy[log.applianceName] = 0;
        }

        applianceEnergy[log.applianceName] += Number(log.energy || 0);

    });

    // ================= CONTRIBUTION =================

    const contribution = Object.entries(applianceEnergy)
        .map(([name, energy]) => ({
            name,
            energy,
            percent: totalEnergy
                ? ((energy / totalEnergy) * 100).toFixed(1)
                : 0,
        }))
        .sort((a, b) => b.energy - a.energy);

    // ================= TOP APPLIANCE =================

    let topAppliance = "None";
    let maxEnergy = 0;

    Object.entries(applianceEnergy).forEach(([name, energy]) => {

        if (energy > maxEnergy) {
            maxEnergy = energy;
            topAppliance = name;
        }

    });

    // ================= SCORE =================

    let efficiencyScore = 100;

    if (totalEnergy > 0) {
        efficiencyScore = 100 - totalEnergy * 0.1;
    }

    efficiencyScore = Math.max(
        10,
        Math.min(100, efficiencyScore)
    );

    // ================= BADGE =================

    let badge = "Eco Saver";

    if (efficiencyScore < 40) {
        badge = "High Usage";
    }

    else if (efficiencyScore < 70) {
        badge = "Balanced";
    }

    return (

        <div className="min-h-screen text-gray-900 dark:text-white overflow-hidden">


            <div className="relative overflow-hidden rounded-[40px] border border-gray-200 dark:border-[#1e293b] bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#f0f9ff] dark:from-[#020617] dark:via-[#0f172a] dark:to-[#111827] p-7 md:p-12 shadow-2xl">

                {/* GLOW */}

                <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-cyan-400/10 blur-[140px] rounded-full"></div>

                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 blur-[140px] rounded-full"></div>

                <div className="relative z-10">


                    <div className="flex items-center justify-between flex-wrap gap-5">

                        <div>

                            <p className="uppercase tracking-[0.3em] text-xs font-black text-cyan-500 mb-4">
                                Smart Analytics
                            </p>

                            <h1 className="text-4xl md:text-6xl font-black leading-tight text-gray-900 dark:text-white">
                                Energy Insights
                            </h1>

                        </div>

                        <div className="px-6 py-4 rounded-3xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-lg">

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Highest Consumption
                            </p>

                            <h2 className="text-2xl font-black text-cyan-500 mt-1">
                                {topAppliance}
                            </h2>

                        </div>

                    </div>

                    {/* ================= CENTER VISUAL ================= */}

                    <div className="mt-16 flex flex-col items-center justify-center">

                        <div className="relative w-[320px] h-[320px]">

                            {/* OUTER */}

                            <div className="absolute inset-0 rounded-full border-[14px] border-cyan-100 dark:border-cyan-500/10"></div>

                            {/* MIDDLE */}

                            <div className="absolute inset-[28px] rounded-full border-[10px] border-violet-100 dark:border-violet-500/10"></div>

                            {/* INNER */}

                            <div className="absolute inset-[55px] rounded-full bg-gradient-to-br from-cyan-500 via-sky-500 to-violet-500 shadow-[0_0_80px_rgba(6,182,212,0.35)] flex flex-col items-center justify-center text-white">

                                <span className="uppercase tracking-[0.25em] text-xs text-white/70">
                                    Efficiency
                                </span>

                                <h2 className="text-7xl font-black mt-2">
                                    {efficiencyScore.toFixed(0)}
                                </h2>

                                <p className="mt-2 text-sm text-white/80">
                                    {badge}
                                </p>

                            </div>

                            {/* FLOATING STATS */}

                            <div className="absolute -left-14 top-12 px-5 py-4 rounded-3xl bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl">

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Total Energy
                                </p>

                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                                    {totalEnergy.toFixed(1)}
                                </h3>

                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    kWh
                                </span>

                            </div>

                            <div className="absolute -right-16 bottom-10 px-5 py-4 rounded-3xl bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl">

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Status
                                </p>

                                <h3 className="text-2xl font-black text-cyan-500 mt-1">
                                    {badge}
                                </h3>

                            </div>

                        </div>

                        {/* ================= APPLIANCE CHIPS ================= */}

                        <div className="mt-14 flex flex-wrap justify-center gap-4 max-w-5xl">

                            {contribution.map((item, index) => (

                                <div
                                    key={index}
                                    className="group px-5 py-4 rounded-3xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-lg hover:scale-105 transition-all duration-300"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white shadow-lg">

                                            <FaBolt />

                                        </div>

                                        <div>

                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                {item.name}
                                            </h3>

                                            <div className="flex items-center gap-2 mt-1">

                                                <FaCircle className="text-[8px] text-cyan-500" />

                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {item.percent}% Usage
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* ================= TIMELINE ================= */}

                    <div className="mt-20">

                        <div className="flex items-center justify-between mb-8">

                            <div>

                                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                                    Consumption Overview
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Appliance-wise electricity usage
                                </p>

                            </div>

                            <FaBolt className="text-3xl text-cyan-500" />

                        </div>

                        <div className="space-y-6">

                            {contribution.map((item, index) => (

                                <div key={index}>

                                    <div className="flex items-center justify-between mb-3">

                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {item.name}
                                        </h3>

                                        <div className="flex items-center gap-3">

                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.energy.toFixed(2)} kWh
                                            </span>

                                            <span className="text-cyan-500 font-black">
                                                {item.percent}%
                                            </span>

                                        </div>

                                    </div>

                                    <div className="w-full h-[12px] rounded-full bg-gray-200 dark:bg-[#1e293b] overflow-hidden">

                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500"
                                            style={{ width: `${item.percent}%` }}
                                        ></div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Analytics;