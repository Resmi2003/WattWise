import React from "react";
import {
    Crown,
    FileText,
    ShieldCheck,
    BarChart3,
    Zap,
    CheckCircle
} from "lucide-react";

import { createCheckoutSessionAPI } from "../../services/allAPI";
import { useAppContext } from "../../context/AppContext";

function Premium() {

    const { user } = useAppContext();

    // PAYMENT
    const handlePremiumPayment = async () => {

        try {

            if (user?.isPremium) {
                return;
            }

            const result = await createCheckoutSessionAPI();

            if (result.status === 200) {

                window.location.href = result.data.url;
            }

        } catch (err) {

            console.log(err);
            alert("Payment Failed");
        }
    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 dark:from-[#0b1120] dark:via-[#111827] dark:to-[#0f172a] px-4 py-10">

            <div className="max-w-4xl w-full bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[36px] shadow-2xl overflow-hidden">


                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-10 text-white text-center">

                    <div className="flex justify-center mb-5">

                        <div className="bg-white/20 p-5 rounded-full shadow-lg">
                            <Crown size={55} />
                        </div>

                    </div>

                    <h1 className="text-4xl md:text-5xl font-black">
                        WattWise Premium
                    </h1>

                    <p className="mt-4 text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
                        Unlock premium energy reporting features and export your complete
                        appliance energy usage report instantly.
                    </p>

                </div>

                {/* FEATURES */}

                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* FEATURE 1 */}

                    <div className="bg-white/70 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-lg">

                        <div className="bg-cyan-100 dark:bg-cyan-900/30 w-fit p-4 rounded-2xl mb-5">
                            <FileText className="text-cyan-500" size={32} />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                            PDF Energy Reports
                        </h2>

                        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                            Download complete energy consumption reports including appliance
                            usage, total energy consumption, and estimated electricity bill.
                        </p>

                    </div>

                    {/* FEATURE 2 */}

                    <div className="bg-white/70 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-lg">

                        <div className="bg-emerald-100 dark:bg-emerald-900/30 w-fit p-4 rounded-2xl mb-5">
                            <ShieldCheck className="text-emerald-500" size={32} />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                            Secure Stripe Payment
                        </h2>

                        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                            Premium access is protected using secure Stripe payment gateway
                            integration for safe online transactions.
                        </p>

                    </div>

                    {/* FEATURE 3 */}

                    <div className="bg-white/70 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-lg">

                        <div className="bg-orange-100 dark:bg-orange-900/30 w-fit p-4 rounded-2xl mb-5">
                            <BarChart3 className="text-orange-500" size={32} />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                            Energy Usage Summary
                        </h2>

                        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                            Access detailed summaries of appliance-wise energy consumption
                            and overall electricity usage statistics.
                        </p>

                    </div>

                    {/* FEATURE 4 */}

                    <div className="bg-white/70 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-lg">

                        <div className="bg-yellow-100 dark:bg-yellow-900/30 w-fit p-4 rounded-2xl mb-5">
                            <Zap className="text-yellow-500" size={32} />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                            One-Time Premium Upgrade
                        </h2>

                        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                            Pay once and unlock premium report generation features without
                            recurring monthly subscription charges.
                        </p>

                    </div>

                </div>

                {/* BUTTON / PREMIUM STATUS */}

                <div className="px-8 pb-10 flex justify-center">

                    {user?.isPremium ? (

                        <div className="flex items-center gap-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg">

                            <CheckCircle size={24} />

                            <span>
                                Premium Already Activated
                            </span>

                        </div>

                    ) : (

                        <button
                            onClick={handlePremiumPayment}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 rounded-2xl text-lg font-black shadow-xl transition-all duration-300 hover:scale-[1.03]"
                        >
                            Upgrade To Premium
                        </button>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Premium;