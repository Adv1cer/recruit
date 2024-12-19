"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";

export default function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            const response = await fetch("/api/dashboard");
            const data = await response.json();
            if (response.ok) {
                setApplications(data || []);
            } else {
                setError(data.error || "Failed to fetch data");
            }
        } catch (error) {
            setError("Error fetching data");
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const toggleRow = (id) => {
        setExpandedRows(expandedRows.includes(id)
            ? expandedRows.filter(rowId => rowId !== id)
            : [...expandedRows, id]);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-700">Dashboard</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="overflow-x-auto">
                <table className="mx-auto w-full max-w-7xl bg-white border border-gray-300 rounded-md shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left text-gray-700 font-semibold">Application ID</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Position</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Name</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Document Date</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Salary</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Province</th>
                            <th className="p-3 text-left text-gray-700 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => (
                            <React.Fragment key={index}>
                                <tr className="hover:bg-gray-50 border-b border-gray-200 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => toggleRow(app.application_id)}>
                                    <td className="p-3 text-gray-700">{app.application_id}</td>
                                    <td className="p-3 text-gray-700">{app.position}</td>
                                    <td className="p-3 text-gray-700">{app.name}</td>
                                    <td className="p-3 text-gray-700">{new Date(app.date).toLocaleDateString()}</td>
                                    <td className="p-3 text-gray-700">{app.salary}</td>
                                    <td className="p-3 text-gray-700">{app.province}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleRow(app.application_id);
                                            }}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {expandedRows.includes(app.application_id) ? "Hide Details" : "Show Details"}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRows.includes(app.application_id) && (
                                    <tr className="bg-gray-50">
                                        <td colSpan="7" className="p-3">
                                            <div className="p-4 border border-gray-300 rounded-md">
                                                <p className="text-gray-700"><strong>Start Date:</strong> {new Date(app.start_date).toLocaleDateString()}</p>
                                                <p className="text-gray-700"><strong>End Date:</strong> {new Date(app.end_date).toLocaleDateString()}</p>
                                                <p className="text-gray-700"><strong>Citizen ID:</strong> {app.citizen_id}</p>
                                                <p className="text-gray-700"><strong>Address 1:</strong> {app.address_1}</p>
                                                <p className="text-gray-700"><strong>Address 2:</strong> {app.address_2}</p>
                                                <p className="text-gray-700"><strong>District:</strong> {app.district}</p>
                                                <p className="text-gray-700"><strong>Subdistrict:</strong> {app.subdistrict}</p>
                                                <p className="text-gray-700"><strong>Zip Code:</strong> {app.zip_code}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}