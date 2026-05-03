import React from "react";
import { useAppContext } from "../../context/AppContext";

import {
    FaChartLine,
    FaMedal,
    FaExclamationTriangle,
    FaLightbulb,
    FaBolt
} from "react-icons/fa";

function Analytics() {

    const { usageLogs } = useAppContext();

    if (!usageLogs || usageLogs.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                No data available. Add usage logs to see analytics.
            </div>
        );
    }


    // total energy
    const totalEnergy = usageLogs.reduce((sum, log) => {
        return sum + Number(log.energy || 0);
    }, 0);


    // energy by appliance
    const applianceEnergy = {};

    usageLogs.forEach((log) => {
        if (!applianceEnergy[log.applianceName]) {
            applianceEnergy[log.applianceName] = 0;
        }
        applianceEnergy[log.applianceName] += Number(log.energy || 0);
    });


    // top appliance
    let topAppliance = "None";
    let maxEnergy = 0;

    Object.entries(applianceEnergy).forEach(([name, energy]) => {
        if (energy > maxEnergy) {
            maxEnergy = energy;
            topAppliance = name;
        }
    });


    // Contribution %
    const contribution = Object.entries(applianceEnergy).map(([name, energy]) => ({
        name,
        energy,
        percent: totalEnergy ? ((energy / totalEnergy) * 100).toFixed(1) : 0
    }));


    // Predicted weekly energy
    const predictedWeekly =
        usageLogs.length > 0
            ? (totalEnergy / usageLogs.length) * 7
            : 0;


    // Dynamic efficiency score
    let efficiencyScore = 100;

    if (predictedWeekly > 0) {
        efficiencyScore = 100 - (totalEnergy / predictedWeekly) * 50;
    }

    efficiencyScore = Math.max(10, Math.min(100, efficiencyScore));


    // Badge
    let badge = "Eco Saver";
    let badgeColor = "text-green-600";

    if (efficiencyScore < 40) {
        badge = "High Consumption";
        badgeColor = "text-red-500";
    }
    else if (efficiencyScore < 70) {
        badge = "Energy Aware";
        badgeColor = "text-yellow-500";
    }


    // alert
    let alertMessage = null;

    if (efficiencyScore < 40) {
        alertMessage =
            "Your home energy consumption is unusually high. Consider reducing appliance usage.";
    }


    // Appliance ranking
    const ranking = Object.entries(applianceEnergy)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);


    // pattern
    let patternInsight = "Your energy usage pattern is balanced.";

    if (topAppliance !== "None") {
        patternInsight = `${topAppliance} is currently the highest energy consuming appliance. Monitoring its usage may help reduce electricity consumption.`;
    }


    // tip
    let tip =
        "Regularly reviewing appliance usage can help improve overall energy efficiency.";

    if (topAppliance !== "None") {
        tip = `Consider optimizing the usage of ${topAppliance} to reduce overall energy consumption.`;
    }



    return (

        <div className="space-y-8">



            <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm flex items-center gap-4">

                    <div className="p-4 rounded-lg bg-blue-100 text-blue-600 text-2xl">
                        <FaChartLine />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Predicted Weekly Energy
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {predictedWeekly.toFixed(2)} kWh
                        </h2>
                    </div>

                </div>


                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm flex items-center gap-4">

                    <div className="p-4 rounded-lg bg-yellow-100 text-yellow-600 text-2xl">
                        <FaMedal />
                    </div>

                    <div className="w-full">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Energy Efficiency Badge
                        </p>

                        <h2 className={`text-xl font-bold ${badgeColor}`}>
                            {badge}
                        </h2>

                        <div className="mt-3">

                            <p className="text-xs text-gray-400 mb-1">
                                Energy Efficiency Score
                            </p>

                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">

                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${efficiencyScore}%` }}
                                ></div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* alert */}

            {alertMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl p-6 flex items-center gap-4">

                    <div className="text-red-500 text-2xl">
                        <FaExclamationTriangle />
                    </div>

                    <p className="text-red-700 dark:text-red-400 font-medium">
                        {alertMessage}
                    </p>

                </div>
            )}


            {/* Top Appliances */}

            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">

                <h2 className="flex items-center gap-2 font-semibold mb-4 text-gray-800 dark:text-white">
                    <FaBolt />
                    Top Energy Consuming Appliances
                </h2>

                <ul className="space-y-2">

                    {ranking.map(([name, energy], index) => (

                        <li
                            key={index}
                            className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-700 dark:text-gray-300"
                        >

                            <span>{name}</span>

                            <span className="font-semibold">
                                {energy.toFixed(2)} kWh
                            </span>

                        </li>

                    ))}

                </ul>

            </div>


            {/* Energy Distribution */}

            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">

                <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
                    Energy Contribution by Appliance
                </h2>

                <ul className="space-y-2">

                    {contribution.map((item, index) => (

                        <li
                            key={index}
                            className="flex justify-between text-gray-700 dark:text-gray-300"
                        >

                            <span>{item.name}</span>

                            <span className="font-semibold">
                                {item.percent}%
                            </span>

                        </li>

                    ))}

                </ul>

            </div>


            {/* pattern */}

            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">

                <h2 className="flex items-center gap-2 font-semibold mb-3 text-gray-800 dark:text-white">
                    <FaLightbulb />
                    Usage Pattern Insight
                </h2>

                <p className="text-gray-600 dark:text-gray-300">
                    {patternInsight}
                </p>

            </div>


            {/* tip */}

            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">

                <h2 className="flex items-center gap-2 font-semibold mb-3 text-gray-800 dark:text-white">
                    <FaLightbulb />
                    Energy Saving Recommendation
                </h2>

                <p className="text-gray-600 dark:text-gray-300">
                    {tip}
                </p>

            </div>


        </div>
    );
}

export default Analytics;