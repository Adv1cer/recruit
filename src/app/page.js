"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { DateRangePicker } from "@nextui-org/date-picker";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { Swiper, SwiperSlide } from 'swiper/react';
import localFont from "next/font/local";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import "./globals.css";

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
const Aspekta800 = localFont({ src: './fonts/Aspekta-800.woff2' });

export default function Home() {
    const today = new Date();
    const currentDate = parseDate(today.toISOString().split("T")[0]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [positions, setPositions] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: currentDate, endDate: currentDate });
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [filteredSubdistricts, setFilteredSubdistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedZipCode, setSelectedZipCode] = useState("");
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ address_2: "-" });

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

    useEffect(() => {
        if (selectedProvince) {
            setFilteredDistricts(districts.filter((d) => d.province_id === selectedProvince));
            setSelectedDistrict(null);
            setFilteredSubdistricts([]);
            setSelectedZipCode("");
        } else {
            setFilteredDistricts([]);
        }
    }, [selectedProvince, districts]);

    useEffect(() => {
        if (selectedDistrict) {
            setFilteredSubdistricts(subdistricts.filter((s) => s.district_id === selectedDistrict));
            setSelectedZipCode("");
        } else {
            setFilteredSubdistricts([]);
        }
    }, [selectedDistrict, subdistricts]);

    const handleSubdistrictChange = (e) => {
        const subdistrictId = parseInt(e.target.value);
        const selectedSubdistrict = subdistricts.find((s) => s.id === subdistrictId);
        setSelectedZipCode(selectedSubdistrict?.zip_code || "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (range) => {
        const today = new Date();
        const currentDate = parseDate(today.toISOString().split("T")[0]);
        setDateRange({
            start: range?.start ? parseDate(range.start.toString()) : currentDate,
            end: range?.end ? parseDate(range.end.toString()) : currentDate,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!dateRange?.start || !dateRange?.end) {
            alert("Please select a valid date range before submitting.");
            return;
        }

        const confirmationData = {
            name: formData.name || "",
            date: formData.date || "",
            salary: formData.salary || "",
            citizen_id: formData.citizen_id || "",
            position: positions.find(p => p.position_id === parseInt(formData.position))?.position_name || "",
            address_1: formData.address_1 || "",
            address_2: formData.address_2 || "",
            province: provinces.find(p => p.id === selectedProvince)?.name_in_thai || "",
            district: districts.find(d => d.id === selectedDistrict)?.name_in_thai || "",
            subdistrict: subdistricts.find(s => s.id === parseInt(formData.subdistrict))?.name_in_thai || "",
            zip_code: selectedZipCode || "",
            start_date: dateRange.start.toDate(getLocalTimeZone()).toISOString().split("T")[0],
            end_date: dateRange.end.toDate(getLocalTimeZone()).toISOString().split("T")[0],
        };

        const submissionData = {
            name: formData.name || "",
            date: formData.date || "",
            salary: formData.salary || "",
            citizen_id: formData.citizen_id || "",
            position: formData.position || "",
            address_1: formData.address_1 || "",
            address_2: formData.address_2 || "",
            province_id: selectedProvince || null,
            district_id: selectedDistrict || null,
            subdistrict_id: parseInt(formData.subdistrict) || null,
            zip_code: selectedZipCode || "",
            start_date: dateRange.start.toDate(getLocalTimeZone()).toISOString().split("T")[0],
            end_date: dateRange.end.toDate(getLocalTimeZone()).toISOString().split("T")[0],
        };

        const confirmationMessage = `
            Please confirm your details:
            Name-Surname: ${confirmationData.name}
            Citizen ID: ${confirmationData.citizen_id}
            Document Date: ${confirmationData.date}
            Contract Duration: ${confirmationData.start_date} to ${confirmationData.end_date}
            Position: ${confirmationData.position}
            Salary: ${confirmationData.salary}
            Address 1: ${confirmationData.address_1}
            Address 2: ${confirmationData.address_2}
            Province: ${confirmationData.province}
            District: ${confirmationData.district}
            Subdistrict: ${confirmationData.subdistrict}
            Zip Code: ${confirmationData.zip_code}
        `;

        if (!window.confirm(confirmationMessage)) {
            return;
        }

        try {
            const response = await fetch("/api/formsubmit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Data submitted successfully!");
                e.target.reset();
            } else {
                setError(result.error || "An error occurred.");
            }
        } catch (error) {
            setError("An error occurred while submitting the data.");
        }
    };

    return (
        <div className="bg-slate-100 pb-10">
            <div className="block-section">
                <div className="relative">
                    <div className="h-64 w-full flex flex-col items-center justify-center bg-cover bg-center relative">
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            navigation={true}
                            modules={[Autoplay, Pagination]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <Image
                                    src="/img-asset-1.jpg"
                                    alt="img-asset-1"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className=""
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <Image
                                    src="/img-asset-2.jpg"
                                    alt="img-asset-2"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className=""
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <Image
                                    src="/img-asset-3.jpg"
                                    alt="img-asset-3.jpg"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className=""
                                />
                            </SwiperSlide>
                        </Swiper>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 bg-white opacity-80 rounded-md"></div>
                            <h1 className="relative text-white p-8 text-4xl font-bold z-10 underline hover:scale-110 transition-transform duration-300 rounded-md">
                                START YOUR CAREER WITH US
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="text-center bg-orange-500 py-4 text-white">
                    <h2>Form Application for Employment</h2>
                    <h3>Please enter the information according to the fields</h3>
                </div>
            </div>

            <div className="bg-white max-w-4xl mx-auto mt-10 p-6 text-gray-700 shadow-md rounded-md">
                <h2 className="text-center text-2xl font-bold mb-6 text-grey-700">Job Application Form</h2>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Name-Surname :</label>
                            <input
                                maxLength="40"
                                type="text"
                                name="name"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                                placeholder="Enter name-surname"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Citizen ID :</label>
                            <input
                                maxLength="13"
                                type="text"
                                name="citizen_id"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                                placeholder="Enter citizen ID"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Document Date :</label>
                            <input
                                type="date"
                                name="date"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 font-semibold">Contract Duration :</label>
                            <DateRangePicker
                                className="max-w-xs text-black"
                                label="Contract duration"
                                onChange={handleDateChange}
                                value={dateRange}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Position :</label>
                            <select
                                name="position"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                                onChange={handleChange}
                            >
                                <option value="">Select Position</option>
                                {positions.map((item) => (
                                    <option key={item.position_id} value={item.position_id}>
                                        {item.position_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Salary :</label>
                            <input
                                maxLength="7"
                                type="number"
                                name="salary"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                                placeholder="Enter expected salary"
                                onChange={handleChange}
                            />
                        </div>
                        <h3 className="text-xl font-semibold mt-10 text-gray-700">Address</h3>
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Address 1 :</label>
                            <input
                                maxLength="50"
                                type="text"
                                name="address_1"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                                placeholder="Enter address 1"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Address 2 (optional) :</label>
                            <input
                                maxLength="50"
                                type="text"
                                name="address_2"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter address 2 (Optional)"
                                onChange={handleChange}
                                value={formData.address_2}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Province :</label>
                            <select
                                name="province"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={(e) => {
                                    handleChange(e);
                                    setSelectedProvince(parseInt(e.target.value));
                                }}
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
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">District :</label>
                            <select
                                name="district"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={(e) => {
                                    handleChange(e);
                                    setSelectedDistrict(parseInt(e.target.value));
                                }}
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
                        <div className="flex items-center">
                            <label className="w-1/3 text-gray-700 font-semibold">Subdistrict :</label>
                            <select
                                name="subdistrict"
                                className="w-2/3 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={(e) => {
                                    handleChange(e);
                                    handleSubdistrictChange(e);
                                }}
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
                        {selectedZipCode && (
                            <div className="flex items-center">
                                <label className="w-1/3 text-gray-700 font-semibold">Zip Code :</label>
                                <p className="w-2/3 text-gray-700">{selectedZipCode}</p>
                            </div>
                        )}
                    </div>
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