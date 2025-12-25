"use client";

import { fetchKpiCardData } from "@/lib/api/dashboard";
import { useEffect, useState } from "react";

type KpiCard = {
	title: string;
	number: number;
	getData: boolean;
	status: string;
};

export default function DashboardPage() {
	const [kpiCards, setKpiCards] = useState<KpiCard[]>([
		{ title: "Total", number: 0, getData: false, status: "" },
		{ title: "Published", number: 0, getData: true, status: "published" },
		{ title: "Draft", number: 0, getData: true, status: "draft" },
		{ title: "Archived", number: 0, getData: true, status: "archived" },
	]);

	useEffect(() => {
		kpiCards.forEach((kpiCard) => {
			if (!kpiCard.getData) return;

			fetchKpiCardData({ status: kpiCard.status }).then((data) => {
				if (!data.success) return;

				setKpiCards((prev) => {
					const updated = prev.map((item) =>
						item.status === kpiCard.status ? { ...item, number: data.totalDocuments } : item
					);

					const total = updated.filter((i) => i.getData).reduce((sum, i) => sum + i.number, 0);

					return updated.map((item) => (item.title === "Total" ? { ...item, number: total } : item));
				});
			});
		});
	}, []);

	return (
		<>
			<h1 className="text-lg font-medium text-slate-900">Dashboard</h1>

			<div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{kpiCards.map((kpiCard) => (
					<div key={kpiCard.title} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
						<p className="text-sm text-slate-500">{kpiCard.title}</p>
						<p className="mt-2 text-2xl font-semibold text-slate-900">{kpiCard.number}</p>
					</div>
				))}
			</div>
		</>
	);
}
