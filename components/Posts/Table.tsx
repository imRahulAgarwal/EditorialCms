"use client";

import { deletePost, fetchPosts, updatePostStatus } from "@/lib/api/post";
import { RootState } from "@/store";
import { flexRender, getCoreRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type TPost = {
	_id: string;
	title?: string;
	publishStatus?: string;
	createdAt?: Date;
};

const STATUSES = ["all", "draft", "published", "archived"];

export default function PostsTable() {
	const role = useSelector((state: RootState) => state.user.user?.role);

	const [data, setData] = useState<TPost[]>([]);
	const [totalDocuments, setTotalDocuments] = useState(0);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [showFilter, setShowFilter] = useState(false);

	const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
	const [postIdToUpdateStatus, setPostIdToUpdateStatus] = useState<string | null>(null);
	const [updateStatus, setUpdateStatus] = useState("draft");

	useEffect(() => {
		fetchPosts({
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
			search,
			status: statusFilter !== "all" ? statusFilter : undefined,
			sort: sorting[0]?.id,
			order: sorting[0]?.desc === true ? "desc" : "asc",
		}).then((res) => {
			if (res.success) {
				setData(res.posts ?? []);
				setTotalDocuments(res.filteredDocuments ?? 0);
			}
		});
	}, [pagination, sorting, search, statusFilter]);

	const table = useReactTable({
		data,
		columns: [
			{
				header: "Title",
				accessorKey: "title",
				cell: ({ getValue }) => getValue() || "-",
			},
			{
				header: "Created At",
				accessorKey: "createdAt",
				cell: ({ getValue }) => {
					const createdAt = getValue<Date>();
					return createdAt ? dayjs(createdAt).format("DD-MMM-YYYY") : "-";
				},
			},
			{
				header: "Status",
				accessorKey: "publishStatus",
				cell: ({ getValue }) => {
					const publishStatus = getValue<string>();
					if (publishStatus === "published") {
						return "Published";
					} else if (publishStatus === "archived") {
						return "Archived";
					} else if (publishStatus === "draft") {
						return "Draft";
					}
				},
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-2">
						{/* View - everyone */}
						<Link
							href={`/posts/${row.original._id}`}
							className="rounded-md px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
							View
						</Link>

						{/* Update - super_admin, admin, editor */}
						{(role === "super_admin" || role === "admin" || role === "editor") && (
							<Link
								href={`/posts/${row.original._id}/update`}
								className="rounded-md px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
								Update
							</Link>
						)}

						{/* Status - super_admin, admin */}
						{(role === "super_admin" || role === "admin") && (
							<button
								onClick={() => {
									setPostIdToUpdateStatus(row.original._id);
									setShowUpdateStatusModal(true);
								}}
								className="rounded-md px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700">
								Status
							</button>
						)}

						{/* Delete - super_admin only */}
						{role === "super_admin" && (
							<button
								onClick={() => deletePost(row.original._id)}
								className="rounded-md px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700">
								Delete
							</button>
						)}
					</div>
				),
			},
		],
		getCoreRowModel: getCoreRowModel(),
		pageCount: totalDocuments,
		state: { pagination, sorting },
		manualPagination: true,
		manualSorting: true,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
	});

	if (!role) return null;

	return (
		<div className="bg-white border border-slate-200 rounded-md p-4">
			{/* Top controls */}
			<div className="mb-4 flex flex-wrap gap-3 justify-between items-center">
				<div className="flex gap-2">
					<input
						value={search}
						onChange={(e) => {
							setPagination({ ...pagination, pageIndex: 0 });
							setSearch(e.target.value);
						}}
						placeholder="Search posts"
						className="rounded-md border border-slate-200 px-3 py-2 text-sm"
					/>

					<div className="relative">
						<button
							onClick={() => setShowFilter((v) => !v)}
							className="rounded-md px-3 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
							Filter
						</button>

						{showFilter && (
							<div className="absolute z-10 mt-2 w-40 rounded-md border border-slate-200 bg-white shadow-sm">
								{STATUSES.map((s) => (
									<button
										key={s}
										onClick={() => {
											setStatusFilter(s);
											setPagination({
												...pagination,
												pageIndex: 0,
											});
											setShowFilter(false);
										}}
										className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50">
										{s}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{role !== "viewer" && (
					<Link
						href="/posts/new"
						className="rounded-md px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700">
						Add New Post
					</Link>
				)}
			</div>

			{/* Table info */}
			<p className="mb-2 text-sm text-slate-500">
				Showing {data.length ? pagination.pageIndex * pagination.pageSize + 1 : 0}–
				{pagination.pageIndex * pagination.pageSize + data.length} of {totalDocuments}
			</p>

			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id} className="border-b border-slate-200">
								{hg.headers.map((header) => (
									<th
										key={header.id}
										onClick={header.column.getToggleSortingHandler()}
										className="px-4 py-3 text-left text-sm font-semibold text-slate-900 cursor-pointer">
										{flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody>
						{data.length ? (
							table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-4 py-3 text-sm text-slate-700">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={table.getHeaderGroups()[0].headers.length}
									className="px-4 py-6 text-center text-sm text-slate-500">
									No posts found
								</td>
							</tr>
						)}
					</tbody>

					<tfoot>
						<tr>
							<td colSpan={4} className="pt-4">
								<div className="flex gap-2">
									<button
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
										className="rounded-md px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50">
										Prev
									</button>
									<button
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
										className="rounded-md px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50">
										Next
									</button>
								</div>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			{/* Update status modal */}
			{showUpdateStatusModal && postIdToUpdateStatus && (
				<>
					<div className="fixed inset-0 bg-black/40" />
					<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
						<div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-sm">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									updatePostStatus(postIdToUpdateStatus, updateStatus);
									setShowUpdateStatusModal(false);
								}}
								className="flex flex-col gap-4">
								<label className="text-sm font-medium text-slate-700">Update Status</label>
								<select
									value={updateStatus}
									onChange={(e) => setUpdateStatus(e.target.value)}
									className="h-9 rounded-md border border-slate-200 px-2 text-sm">
									<option value="draft">Draft</option>
									<option value="published">Published</option>
									<option value="archived">Archived</option>
								</select>

								<div className="flex justify-end gap-2">
									<button
										type="button"
										onClick={() => setShowUpdateStatusModal(false)}
										className="rounded-md px-4 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
										Close
									</button>
									<button
										type="submit"
										className="rounded-md px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700">
										Save
									</button>
								</div>
							</form>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
