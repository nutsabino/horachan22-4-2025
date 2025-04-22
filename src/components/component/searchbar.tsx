"use client";

import { FC, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { provinces } from '@/src/data/provinces';
import { Input } from "@/src/components/ui/input";
import { Search } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/src/components/ui/form";
import { SearchBoxProps } from '../../../types/props';

const formSchema = z.object({
    keyword: z.string(),
    province: z.string(),
    minprice: z.string().optional(),
    maxprice: z.string().optional(),
});

const MobileSearchBar: FC<SearchBoxProps> = ({ setSearch }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keyword: searchParams.get("keyword") || "",
            province: searchParams.get("province") || "",
            minprice: searchParams.get("minprice") || "",
            maxprice: searchParams.get("maxprice") || "",
        },
    });

    useEffect(() => {
        const keyword = searchParams.get("keyword") || "";
        const province = searchParams.get("province") || "";
        const minprice = searchParams.get("minprice") || "";
        const maxprice = searchParams.get("maxprice") || "";

        form.reset({
            keyword,
            province,
            minprice,
            maxprice,
        });
        if (setSearch) {
            setSearch({
                keyword,
                province,
                minprice,
                maxprice,
            });
        }
    }, [searchParams, form, setSearch]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const queryParams = new URLSearchParams();
        queryParams.append("order", "special");
        queryParams.append("page", "1");

        if (values.keyword) {
            queryParams.append("keyword", values.keyword);
        }
        if (values.province) {
            queryParams.append("province", values.province);
        }
        if (values.minprice) {
            queryParams.append("minprice", values.minprice);
        }
        if (values.maxprice) {
            queryParams.append("maxprice", values.maxprice);
        }

        const url = `/packages?${queryParams.toString()}`;
        router.push(url);
    };

    return (
        <div className="block md:hidden w-full max-w-5xl mx-auto p-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 bg-white rounded-2xl shadow-lg p-3">
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4 flex flex-col gap-0.5">
                            <label className="text-xs font-normal text-gray-700 whitespace-nowrap">
                                ค้นหาแพ็กเกจ
                            </label>
                            <FormField
                                control={form.control}
                                name="keyword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder=""
                                                className="h-8 text-sm px-2 rounded-full"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-3 flex flex-col gap-0.5">
                            <label className="text-xs font-normal text-gray-700">
                                จังหวัด
                            </label>
                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full h-8 text-sm px-2 rounded-full">
                                                    <SelectValue placeholder="เลือกจังหวัด" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {provinces.map((province) => (
                                                    <SelectItem
                                                        key={province.id}
                                                        value={province.id.toString()}
                                                        className="text-sm"
                                                    >
                                                        {province.name_th}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-5 flex gap-1">
                            <div className="w-1/2 flex flex-col gap-0.5">
                                <label className="text-xs font-normal text-gray-700">
                                    ราคาต่ำสุด
                                </label>
                                <FormField
                                    control={form.control}
                                    name="minprice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    className="h-8 text-sm px-2 rounded-full"
                                                    placeholder='800'
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-end pb-2">
                                <span className="text-gray-500 text-sm">-</span>
                            </div>
                            <div className="w-1/2 flex flex-col gap-0.5">
                                <label className="text-xs font-normal text-gray-700">
                                    ราคาสูงสุด
                                </label>
                                <FormField
                                    control={form.control}
                                    name="maxprice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    className="h-8 text-sm px-2 rounded-full"
                                                    placeholder='10000'
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-2 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2 text-sm shadow-lg bg-gradient-to-r from-pink-500 to-purple-700 hover:opacity-90"
                    >
                        <Search className="h-4 w-4" />
                        <span>ค้นหา</span>
                    </Button>
                </form>
            </Form>
        </div>
    );
};

const DesktopSearchBar: FC<SearchBoxProps> = ({ setSearch }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keyword: searchParams.get("keyword") || "",
            province: searchParams.get("province") || "",
            minprice: searchParams.get("minprice") || "",
            maxprice: searchParams.get("maxprice") || "",
        },
    });

    useEffect(() => {
        const keyword = searchParams.get("keyword") || "";
        const province = searchParams.get("province") || "";
        const minprice = searchParams.get("minprice") || "";
        const maxprice = searchParams.get("maxprice") || "";

        form.reset({
            keyword,
            province,
            minprice,
            maxprice,
        });
        if (setSearch) {
            setSearch({
                keyword,
                province,
                minprice,
                maxprice,
            });
        }
    }, [searchParams, form, setSearch]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const queryParams = new URLSearchParams();
        queryParams.append("order", "special");
        queryParams.append("page", "1");

        if (values.keyword) {
            queryParams.append("keyword", values.keyword);
        }
        if (values.province) {
            queryParams.append("province", values.province);
        }
        if (values.minprice) {
            queryParams.append("minprice", values.minprice);
        }
        if (values.maxprice) {
            queryParams.append("maxprice", values.maxprice);
        }

        const url = `/packages?${queryParams.toString()}`;
        router.push(url);
    };

    return (
        <div className="hidden md:block w-full max-w-5xl mx-auto p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row items-end bg-white rounded-full shadow-lg p-4 px-10 gap-4">
                    <div className="w-1/3 flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            แพ็กเกจที่ต้องการค้นหา
                        </label>
                        <FormField
                            control={form.control}
                            name="keyword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder=""
                                            className="rounded-full"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-1/3 flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            จังหวัด
                        </label>
                        <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full rounded-full">
                                                <SelectValue placeholder="เลือกจังหวัด" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {provinces.map((province) => (
                                                <SelectItem
                                                    key={province.id}
                                                    value={province.id.toString()}
                                                >
                                                    {province.name_th}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-1/3 flex gap-2">
                        <div className="w-1/2 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                ราคาต่ำสุด
                            </label>
                            <FormField
                                control={form.control}
                                name="minprice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                className="rounded-full"
                                                placeholder='800'
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex items-end pb-2">
                            <span className="text-gray-500">-</span>
                        </div>
                        <div className="w-1/2 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                ราคาสูงสุด
                            </label>
                            <FormField
                                control={form.control}
                                name="maxprice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                className="rounded-full"
                                                placeholder='10000'
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="p-5 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg bg-gradient-to-r from-pink-500 to-purple-700 hover:opacity-90"
                    >
                        <Search className="h-6 w-6" />
                    </Button>
                </form>
            </Form>
        </div>
    );
};

import { Suspense } from 'react';

const SearchBar: FC<SearchBoxProps> = ({ setSearch }) => {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <MobileSearchBar setSearch={setSearch} />
            <DesktopSearchBar setSearch={setSearch} />
        </Suspense>
    );
};

export default SearchBar;