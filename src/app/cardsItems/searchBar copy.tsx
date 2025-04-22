import React, { useState } from "react";
import { provinces } from "./provinces";

interface SearchBarProps {
  onSearch: (filters: {
    searchTerm: string;
    selectedLocation: string;
    minPrice: string | number;
    maxPrice: string | number;
  }) => void;
  initialSearchTerm?: string;
  initialLocation?: string;
  initialMinPrice?: string | number;
  initialMaxPrice?: string | number;
}
// console.log("n");
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialSearchTerm = "",
  initialLocation = "",
  initialMinPrice = "",
  initialMaxPrice = "",
}) => {
  console.log("x");
  // สร้าง state ภายในสำหรับเก็บค่าข้อมูลฟอร์ม
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // เรียงลำดับจังหวัดตาม id
  const sortedProvinces = [...provinces].sort((a, b) => a.id - b.id);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value === "" ? "" : Number(e.target.value));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value === "" ? "" : Number(e.target.value));
    console.log(onSearch);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("searchTerm:", searchTerm);
    console.log("selectedLocation:", selectedLocation);
    console.log("minPrice:", minPrice);
    console.log("maxPrice:", maxPrice);

    // ส่งข้อมูลทั้งหมดไปที่คอมโพเนนต์แม่พร้อมกัน
    onSearch({
      searchTerm,
      selectedLocation,
      minPrice,
      maxPrice,
    });
  };

  return (
    <div className="block w-full max-w-5xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white px-6 py-4 rounded-4xl shadow-lg flex flex-wrap items-end justify-between gap-4 w-full max-w-5xl -translate-y-8"
      >
        {/* ค้นหาแพ็กเกจ */}
        <div className="flex flex-col flex-1 min-w-0">
          <label className="text-sm font-medium text-gray-700">
            ค้นหาแพ็กเกจ
          </label>
          <input
            type="text"
            placeholder="แพ็กเกจที่ต้องการค้นหา"
            className="p-2 border border-gray-300 rounded-full w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* จังหวัด */}
        <div className="flex flex-col flex-1 min-w-0">
          <label className="text-sm font-medium text-gray-700">จังหวัด</label>
          <select
            className="p-2 border border-gray-300 rounded-full w-full"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">เลือกจังหวัด</option>
            {sortedProvinces.map((province) => (
              <option key={province.id} value={province.name_th}>
                {province.name_th}
              </option>
            ))}
          </select>
        </div>

        {/* ราคาต่ำสุด */}
        <div className="flex flex-col flex-1 min-w-0">
          <label className="text-sm font-medium text-gray-700">
            ราคาต่ำสุด
          </label>
          <input
            type="number"
            placeholder="800"
            className="p-2 border border-gray-300 rounded-full w-full"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
        </div>

        {/* ราคาสูงสุด */}
        <div className="flex flex-col flex-1 min-w-0">
          <label className="text-sm font-medium text-gray-700">
            ราคาสูงสุด
          </label>
          <input
            type="number"
            placeholder="10000"
            className="p-2 border border-gray-300 rounded-full w-full"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>

        {/* ปุ่มค้นหา */}
        <div className="flex justify-center w-full md:w-auto md:justify-end order-last md:order-none">
          <button
            type="submit"
            className="w-full md:w-12 h-12 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-700 shadow-lg hover:opacity-90"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6M10 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
