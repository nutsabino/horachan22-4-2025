"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import SearchBar from "./searchBar";

// ฟังก์ชันคำนวณส่วนลดจากราคาปกติและราคาปัจจุบัน
function getDiscountPercentText(price: string, originalPrice: string): string {
  const priceNum = parseFloat(price || "0");
  const originalNum = parseFloat(originalPrice || "0");

  if (originalNum <= priceNum || originalNum === 0 || priceNum === 0) {
    const fallback = Math.floor(Math.random() * 30) + 10;
    return `ส่วนลด ${fallback}%`;
  }

  const percent = Math.round(((originalNum - priceNum) / originalNum) * 100);
  return `ส่วนลด ${percent}%`;
}

// ประกาศ interface สำหรับข้อมูลที่ใช้แสดงผล
interface LocationItem {
  deal_id: string;
  deal_title?: string;
  deal_label?: {
    head_line_th?: string;
    title_th?: string;
  };
  deal_price_label?: {
    price?: string;
    original_price?: string;
    price_text?: string;
  };
  brand_label?: {
    province_th?: string;
    excerpt_th?: string;
  };
  brand_image?: string;
  brand_logo?: string;
  brand_image_webp?: string;
  brand_logo_webp?: string;
}

const CardsItems = () => {
  // สร้าง state ต่าง ๆ
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [visibleCount, setVisibleCount] = useState(6); // เริ่มต้นแสดง 6 รายการ
  const [loadingMore, setLoadingMore] = useState(false); // เพิ่ม state สำหรับแสดงการโหลดเพิ่มเติม

  // สร้าง observer ref สำหรับ infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  // สร้าง ref สำหรับ element สุดท้ายที่แสดง
  const lastCardElementRef = useRef<HTMLAnchorElement | null>(null);

  const API_TOKEN =
    process.env.NEXT_PUBLIC_API_TOKEN || "pVDKThLsIWgHKXsZaMNQ8I4G4MzfVfBP";
  // console.log("API token:", API_TOKEN);

  // ดึงข้อมูลจาก API เมื่อ component โหลด
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://dealsdatav4.thaiprivilege.com/api/v4/get/lists/deals`,
          {
            params: {
              token: API_TOKEN,
              page: 1,
              perPage: 100,
            },
          }
        );

        if (
          response.data &&
          response.data.results &&
          Array.isArray(response.data.results.items)
        ) {
          setLocations(response.data.results.items);
        } else {
          setError("รูปแบบข้อมูลไม่ถูกต้อง");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
        setLoading(false);
      }
    };

    fetchData();
  }, [API_TOKEN]);

  // สร้าง list จังหวัดไม่ซ้ำ เพื่อใช้ใน dropdown filter
  const uniqueLocations = useMemo(() => {
    return Array.from(
      new Set(
        locations
          .map((location) => location.brand_label?.province_th)
          .filter(Boolean)
      )
    );
  }, [locations]);

  // ฟิลเตอร์ข้อมูลตามเงื่อนไขการค้นหา
  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const isLocationMatch =
        !selectedLocation ||
        (location.brand_label?.province_th?.toLowerCase() || "").includes(
          selectedLocation.toLowerCase()
        );

      const headLineTh = location.deal_label?.head_line_th?.toLowerCase() || "";
      const titleTh = location.deal_label?.title_th?.toLowerCase() || "";
      const dealTitle = location.deal_title?.toLowerCase() || "";
      const excerpt = location.brand_label?.excerpt_th?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      const isSearchMatch =
        !searchTerm ||
        headLineTh.includes(searchTermLower) ||
        titleTh.includes(searchTermLower) ||
        dealTitle.includes(searchTermLower) ||
        excerpt.includes(searchTermLower);

      const price = parseFloat(location.deal_price_label?.price || "0");
      const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
      const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
      const isPriceMatch = price >= minPriceNum && price <= maxPriceNum;

      return isLocationMatch && isSearchMatch && isPriceMatch;
    });
  }, [locations, selectedLocation, searchTerm, minPrice, maxPrice]);

  // ฟังก์ชันสำหรับโหลดข้อมูลเพิ่มเติม
  const loadMoreItems = useCallback(() => {
    // ตรวจสอบว่ายังมีข้อมูลให้โหลดเพิ่มหรือไม่
    if (visibleCount < filteredLocations.length && !loadingMore) {
      setLoadingMore(true);

      // ตั้งเวลาหน่วงเป็น 1 วินาที ตามที่ต้องการ
      setTimeout(() => {
        setVisibleCount((prevCount) => prevCount + 6);
        setLoadingMore(false);
      }, 800); // เปลี่ยนเป็น 1000ms = 1 วินาที
    }
  }, [visibleCount, filteredLocations.length, loadingMore]);

  // สร้าง function สำหรับ observer callback
  const lastCardObserver = useCallback(
    (node: HTMLAnchorElement | null) => {
      if (loadingMore) return;

      // ยกเลิก observer เดิม (ถ้ามี)
      if (observer.current) {
        observer.current.disconnect();
      }

      // สร้าง observer ใหม่
      observer.current = new IntersectionObserver(
        (entries) => {
          // ถ้า element สุดท้ายปรากฏในหน้าจอ
          if (
            entries[0].isIntersecting &&
            visibleCount < filteredLocations.length
          ) {
            loadMoreItems();
          }
        },
        {
          rootMargin: "100px", // ให้ตรวจจับเมื่อใกล้ขอบล่าง 100px
        }
      );

      // ถ้ามี node (element สุดท้าย) ให้เริ่มสังเกตการณ์
      if (node) {
        observer.current.observe(node);
        lastCardElementRef.current = node;
      }
    },
    [loadMoreItems, visibleCount, filteredLocations.length, loadingMore]
  );

  // สร้าง observer ใหม่เมื่อจำนวนรายการที่แสดงหรือผลการกรองเปลี่ยนแปลง
  useEffect(() => {
    if (lastCardElementRef.current) {
      lastCardObserver(lastCardElementRef.current);
    }
  }, [filteredLocations, lastCardObserver]);

  // ติดตามการเลื่อนหน้าจอ (เพิ่มวิธีอีกแบบสำหรับบราวเซอร์เก่า)
  useEffect(() => {
    const handleScroll = () => {
      // ตรวจสอบว่าเลื่อนถึงล่างแล้วหรือยัง
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 200 && // เผื่อระยะห่าง 200px
        visibleCount < filteredLocations.length &&
        !loadingMore
      ) {
        loadMoreItems();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreItems, visibleCount, filteredLocations.length, loadingMore]);

  return (
    <div className='flex flex-col items-center px-4 min-h-screen relative bg-fixed bg-no-repeat pt-12 sm:pt-14 md:pt-16 lg:pt-20 md:bg-[url("/images/2-section/bg.png")] bg-[url("/images/2-section/bg-mobile.png")] bg-cover'>
      {/* หัวข้อ */}
      <div className="text-center py-10 -mt-11 mb-5">
        <img
          src="/images/2-section/head.png"
          alt="แพ็กเกจท่องเที่ยว"
          className="inline-block"
        />
      </div>

      {/* กล่องค้นหา */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        locations={uniqueLocations}
        onSearch={(filters) => {
          setSearchTerm(filters.searchTerm);
          setSelectedLocation(filters.selectedLocation);
          setMinPrice(filters.minPrice.toString());
          setMaxPrice(filters.maxPrice.toString());
          setVisibleCount(6); // รีเซ็ตจำนวนเมื่อค้นหาใหม่
        }}
      />

      {/* แสดงการ์ดทีละ 6 */}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 justify-items-center">
        {filteredLocations.slice(0, visibleCount).map((location, index) => {
          const price = location.deal_price_label?.price || "0";
          const original = location.deal_price_label?.original_price || "0";
          const discountText = getDiscountPercentText(price, original);

          // กำหนด ref สำหรับการ์ดสุดท้าย
          const isLastCard = index === visibleCount - 1;

          return (
            <a
              key={location.deal_id || index}
              href={`/packages/${location.deal_id || index}`}
              className="group w-full max-w-[300px] bg-white shadow-md overflow-hidden flex flex-col transition-transform duration-200 transform hover:scale-105 hover:shadow-lg mb-8"
              ref={isLastCard ? lastCardObserver : null}
            >
              <div className="relative">
                <img
                  src={
                    location.brand_image_webp ||
                    location.brand_image ||
                    "/images/1.png"
                  }
                  alt={location.deal_label?.head_line_th || "Image"}
                  onError={(e) => (e.currentTarget.src = "/images/1.png")}
                  className="w-full h-48 object-cover"
                />
                {/* โลโก้มุมซ้ายบน */}
                <div className="absolute z-10 top-0 left-0 w-14 h-14 md:w-20 md:h-20 bg-blue-300 rounded-br-full shadow-lg flex items-center justify-center">
                  <img
                    src={
                      location.brand_logo_webp ||
                      location.brand_logo ||
                      "/images/logo.png"
                    }
                    alt="brand logo"
                    className="z-20 w-8 h-8 md:w-12 md:h-12 mb-2 mr-2 md:mb-4 md:mr-4 object-contain"
                  />
                </div>
              </div>

              <div className="p-4 flex-grow">
                <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 text-center">
                  {location.deal_label?.head_line_th ||
                    `หัวข้อดีล ${index + 1}`}
                </h3>
                <p className="text-sm text-gray-600 text-center line-clamp-2">
                  {location.deal_label?.title_th || "รายละเอียดเพิ่มเติม"}
                </p>
              </div>

              {/* แถบราคารองท้าย */}
              <div className="mt-auto bg-[#e50087] text-white px-4 py-2 flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="font-bold text-xs sm:text-sm md:text-base">
                    {location.deal_price_label?.price_text || "Free"}
                  </span>
                </div>
                <span className="font-medium text-[8px] sm:text-xs md:text-sm underline">
                  ดูรายละเอียด &gt;&gt;
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* ตัวแสดงสถานะการโหลดเพิ่มเติม - ปรับให้เด่นชัดขึ้น */}
      {loadingMore && (
        <div className="flex flex-col items-center justify-center w-full my-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#490b9a]"></div>
          <div className="mt-2 text-[#490b9a] font-medium">
            กำลังโหลดเพิ่มเติม...
          </div>
        </div>
      )}

      {/* ข้อความแสดงเมื่อโหลดครบทุกรายการแล้ว */}
      {visibleCount >= filteredLocations.length &&
        filteredLocations.length > 0 && (
          <div className="text-center text-gray-600 my-6 font-medium">
            แสดงทั้งหมด {filteredLocations.length} รายการ
          </div>
        )}
    </div>
  );
};

export default CardsItems;
