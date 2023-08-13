"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "../ui/select";

interface Props {
    routeType: string;
}

function Searchbar({ routeType }: Props) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("");

    const handleSearchType = (value: string) => {
        setSearchType(value)
        setSearch("")
    }
    // query after 0.3s of no input
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                router.push(`/${routeType}?t=${searchType}&q=` + search);
            } else {
                router.push(`/${routeType}?t=${searchType}`);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, searchType]);

    return (
        <div className='searchbar'>
            <Image
                src='/assets/search-gray.svg'
                alt='search'
                width={24}
                height={24}
                className='object-contain'
            />
            <Input
                id='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`${searchType !== "user" ? "Search communities" : "Search creators"
                    }`}
                className='no-focus searchbar_input'
            />
            <div className="flex flex-row items-center justify-end gap-2">

            <Separator orientation="vertical" className="h-10 w-[2px] bg-slate-400 rounded-full" />
            <Select onValueChange={(value) => handleSearchType(value)}>
                <SelectTrigger className="w-[180px] h-9 bg-dark-3 text-light-2 outline-none">
                    <SelectValue placeholder="Search Type" />
                </SelectTrigger>
                <SelectContent className="bg-dark-3 text-light-1 outline-none">
                    <SelectItem value="communities">Communities</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
    );
}

export default Searchbar;