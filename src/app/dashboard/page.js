"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    app.position.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    app.province.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mx-auto w-full max-w-7xl">
        <div className="nav-color text-white py-2 px-4 flex items-center justify-between rounded-t-md">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <input
            type="text"
            placeholder="searcg by name, position, or province"
            className="border rounded px-4 py-2 w-full max-w-xs text-black"
            onChange={handleSearchChange}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-b-md shadow-md">
            <thead className="bg-orange-500">
              <tr>
                <th className="p-3 text-left text-white font-semibold">Application ID</th>
                <th className="p-3 text-left text-white font-semibold">Position</th>
                <th className="p-3 text-left text-white font-semibold">Name</th>
                <th className="p-3 text-left text-white font-semibold">Document Date</th>
                <th className="p-3 text-left text-white font-semibold">Salary</th>
                <th className="p-3 text-left text-white font-semibold">Province</th>
                <th className="p-3 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app, index) => (
                <React.Fragment key={index}>
                  <tr
                    className={`border-b border-gray-200 cursor-pointer transition-transform duration-300 ${expandedRows.includes(app.application_id) ? 'bg-gray-50 scale-95' : 'hover:bg-gray-50 hover:scale-95'}`}
                    onClick={() => toggleRow(app.application_id)}
                  >
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
                        <div className="p-4 border border-gray-300 rounded-md overflow-x-auto bg-white">
                          <div className="grid grid-cols-1">
                            <p className="text-gray-700"><strong>Application ID:</strong> {app.application_id}</p>
                            <p className="text-gray-700"><strong>Position:</strong> {app.position}</p>
                            <p className="text-gray-700"><strong>Name:</strong> {app.name}</p>
                            <p className="text-gray-700"><strong>Citizen ID:</strong> {app.citizen_id}</p>
                            <p className="text-gray-700"><strong>Document Date:</strong> {new Date(app.date).toLocaleDateString()}</p>
                            <p className="text-gray-700"><strong>Salary:</strong> {app.salary}</p>
                          </div>
                          <br />
                          <hr className="solid"></hr>
                          <br />
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-gray-700"><strong>Start Date:</strong> {new Date(app.start_date).toLocaleDateString()}</p>
                            <p className="text-gray-700"><strong>End Date:</strong> {new Date(app.end_date).toLocaleDateString()}</p>
                          </div>
                          <br />
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-gray-700"><strong>Address 1:</strong> {app.address_1}</p>
                            <p className="text-gray-700"><strong>Address 2:</strong> {app.address_2}</p>
                            <p className="text-gray-700"><strong>Subdistrict:</strong> {app.subdistrict}</p>
                            <p className="text-gray-700"><strong>District:</strong> {app.district}</p>
                            <p className="text-gray-700"><strong>Province:</strong> {app.province}</p>
                            <p className="text-gray-700"><strong>Zip Code:</strong> {app.zip_code}</p>
                          </div>
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
    </div>
  );
}