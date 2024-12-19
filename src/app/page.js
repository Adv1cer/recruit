"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { DateRangePicker } from "@nextui-org/date-picker";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

export default function Home() {
  const [subdistricts, setSubdistricts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [positions, setPositions] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubdistricts, setFilteredSubdistricts] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedZipCode, setSelectedZipCode] = useState(""); // State for ZIP Code

  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/location");
      const data = await response.json();
      if (response.ok) {
        setSubdistricts(data.subdistricts || []);
        setDistricts(data.districts || []);
        setProvinces(data.provinces || []);
      } else {
        setError(data.error || "Failed to fetch data");
      }
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/position");
      const data = await response.json();
      if (response.ok) {
        setPositions(data || []);
      } else {
        setError(data.error || "Failed to fetch positions");
      }
    } catch (error) {
      setError("Error fetching positions");
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPositions();
  }, []);

  // Filter districts when province is selected
  useEffect(() => {
    if (selectedProvince) {
      setFilteredDistricts(
        districts.filter((d) => d.province_id === selectedProvince)
      );
      setSelectedDistrict(null);
      setFilteredSubdistricts([]);
      setSelectedZipCode("");
    } else {
      setFilteredDistricts([]);
    }
  }, [selectedProvince, districts]);

  // Filter subdistricts when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      setFilteredSubdistricts(
        subdistricts.filter((s) => s.district_id === selectedDistrict)
      );
      setSelectedZipCode("");
    } else {
      setFilteredSubdistricts([]);
    }
  }, [selectedDistrict, subdistricts]);

  const handleSubdistrictChange = (e) => {
    const subdistrictId = parseInt(e.target.value);
    const selectedSubdistrict = subdistricts.find(
      (s) => s.id === subdistrictId
    );
    setSelectedZipCode(selectedSubdistrict?.zip_code || ""); // Set ZIP code
  };



  const handleDateChange = (range) => {
    const startDate = range?.start ?? null;
    const endDate = range?.end ?? null;

    setDateRange({ startDate, endDate });

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract form data
    const formData = new FormData(e.target);

    // Validate dateRange before proceeding
    if (!dateRange?.startDate || !dateRange?.endDate) {
      alert("Please select a valid date range before submitting.");
      return;
    }

    // Construct the data payload
    const data = {
      name: formData.get("name") || "",
      date: formData.get("date") || "",
      salary: formData.get("salary") || "",
      citizen_id: formData.get("citizen_id") || "",
      position: formData.get("position") || "",
      address_1: formData.get("address_1") || "",
      address_2: formData.get("address_2") || "",
      province_id: selectedProvince || null,
      district_id: selectedDistrict || null,
      subdistrict_id: parseInt(formData.get("subdistrict")) || null,
      zip_code: selectedZipCode || "",
      start_date: dateRange.startDate.toDate(getLocalTimeZone()).toISOString().split("T")[0], // Format as YYYY-MM-DD
      end_date: dateRange.endDate.toDate(getLocalTimeZone()).toISOString().split("T")[0],     // Format as YYYY-MM-DD
    };

    console.log("Submitting Form Data:", data);

    try {
      const response = await fetch("/api/formsubmit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data submitted successfully!");
        console.log("Server response:", result);
        // Optionally reset the form or state here
        e.target.reset();
      } else {
        setError(result.error || "Failed to submit data.");
        console.error("Error response from server:", result.error);
      }
    } catch (error) {
      setError("An error occurred while submitting the data.");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="bg-slate-100">
      <div className="relative">
        <div className="h-64 w-full flex flex-col items-center justify-center bg-cover bg-center relative">
          <Image
            src="/bg.png"
            alt="bg"
            layout="fill"
            objectFit="cover"
            className=""
          />
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white opacity-80 rounded-md"></div>
            <h1 className="relative text-black p-8 text-4xl font-bold z-10 underline hover:scale-110 transition-transform duration-300 rounded-md">
              START YOUR CAREER WITH US
            </h1>
          </div>
        </div>
      </div>

      <div className="text-center bg-orange-500 py-4 text-white">
        <h2>Form Application for Employment</h2>
        <h3>Please enter the information according to the fields</h3>
      </div>

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-center text-2xl font-bold mb-6">Job Application Form</h2>
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          {/* Form Row */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4">
            {/* Name-Surname */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Name-Surname:</label>
              <input
                type="text"
                name="name"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Citizen ID */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Citizen ID:</label>
              <input
                type="text"
                name="citizen_id"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Document Date */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Document Date:</label>
              <input
                type="date"
                name="date"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Stay Duration:</label>
              <DateRangePicker
                className="max-w-xs"
                label="Stay duration"
                onChange={handleDateChange}
                value={dateRange}
              />
            </div>

            {/* Position */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Position:</label>
              <select
                name="position"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Position</option>
                {positions.map((item) => (
                  <option key={item.position_id} value={item.position_id}>
                    {item.position_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Salary:</label>
              <input
                type="number"
                name="salary"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <h3 className="text-xl font-semibold mt-10">
              Address
            </h3>
            {/* Address 1 */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Address 1:</label>
              <input
                type="text"
                name="address_1"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                placeholder="Enter address 1"
              />
            </div>

            {/* Address 2 */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Address 2:</label>
              <input
                type="text"
                name="address_2"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                placeholder="Enter address 2"
              />
            </div>
            {/* Province Dropdown */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Province:</label>
              <select
                name="province"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setSelectedProvince(parseInt(e.target.value))}
                required
              >
                <option value="">Select Province</option>
                {provinces.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name_in_thai}
                  </option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">District:</label>
              <select
                name="district"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setSelectedDistrict(parseInt(e.target.value))}
                disabled={!filteredDistricts.length}
                required
              >
                <option value="">Select District</option>
                {filteredDistricts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name_in_thai}
                  </option>
                ))}
              </select>
            </div>

            {/* Subdistrict Dropdown */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">Subdistrict:</label>
              <select
                name="subdistrict"
                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={handleSubdistrictChange}
                disabled={!filteredSubdistricts.length}
                required
              >
                <option value="">Select Subdistrict</option>
                {filteredSubdistricts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name_in_thai}
                  </option>
                ))}
              </select>
            </div>

            {/* Zip Code */}
            {selectedZipCode && (
              <div className="flex items-center">
                <label className="w-1/3 text-gray-700 font-semibold">Zip Code:</label>
                <p className="w-2/3 text-gray-700">{selectedZipCode}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-right mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}