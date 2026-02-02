import { useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreVerticalIcon,
    Eye,
    Settings,
    Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const tableHeaders = [
    { label: "Name", className: "w-[191px]" },
    { label: "Mobile", className: "w-[189px]" },
    { label: "City", className: "w-[282px]" },
    { label: "Registration", className: "w-[166px]" },
    { label: "Followers", className: "w-[109px]" },
    { label: "Following", className: "w-[101px]" },
    { label: "No of posts", className: "w-[143px]" },
    { label: "Profile Completion", className: "w-[309px]" },
    { label: "More", className: "w-[228px]" },
];

const userData = [
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 60,
        completionColor: "bg-[#5ca0ff]",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11-7.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 20,
        completionColor: "bg-[#ff8e44]",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11-5.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 100,
        completionColor: "bg-frame-4",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 60,
        completionColor: "bg-[#5ca0ff]",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 60,
        completionColor: "bg-[#5ca0ff]",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 60,
        completionColor: "bg-[#5ca0ff]",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 60,
        completionColor: "bg-[#5ca0ff]",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 60,
        completionColor: "bg-[#5ca0ff]",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 60,
        completionColor: "bg-[#5ca0ff]",
    },
    {
        name: "John Doe",
        avatar: "/figmaAssets/ellipse-11.svg",
        mobile: "+10895XXXX550",
        city: "New York , USA,140050",
        registration: "12 -17 oct ,2025",
        followers: "50",
        following: "20",
        posts: "22",
        completion: 60,
        completionColor: "bg-[#5ca0ff]",
    },
];

const paginationPages = [
    { number: "01", active: false },
    { number: "02", active: true },
    { number: "03", active: false },
    { number: "04", active: false },
    { number: "05", active: false },
];

export const UserTableSection = (): JSX.Element => {
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(2);
    const itemsPerPage = 8;
    const totalPages = 5;

    const handleAction = (action: string, userName: string) => {
        toast({
            title: `${action} initiated`,
            description: `Performing ${action.toLowerCase()} on ${userName}`,
        });
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = userData.slice(0, itemsPerPage);

    return (
        <section className="flex flex-col items-start w-full">
            <div className="flex flex-col w-full items-start bg-white rounded-t-[20px] overflow-hidden">
                <div className="px-9 pt-[21px] pb-5">
                    <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-total-sales text-xl tracking-[-0.20px] leading-7">
                        Recent Users Registered
                    </h2>
                </div>

                <div className="w-full overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-[#efefef] opacity-70 hover:bg-[#efefef] ">
                                {tableHeaders.map((header, index) => (
                                    <TableHead
                                        key={index}
                                        className={`h-10 [font-family:'Poppins',Helvetica] font-normal text-[#666666] text-xs tracking-[0] leading-3 ${header.className} ${index === 0 ? "pl-9" : ""}`}
                                    >
                                        {header.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentUsers.map((user, index) => (
                                <TableRow
                                    key={index}
                                    className="border-b border-[#edf1f3] h-[63px]"
                                >
                                    <TableCell className="py-[19px] pl-9">
                                        <div className="flex items-center gap-1.5">
                                            <Avatar className="w-[29px] h-[29px]">
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback>
                                                    JD
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="[font-family:'Poppins',Helvetica] font-normal text-rectangle-164 text-xs tracking-[-0.12px] leading-[16.8px]">
                                                {user.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="[font-family:'Poppins',Helvetica] font-normal text-rectangle-164 text-xs tracking-[-0.12px] leading-[16.8px]">
                                        {user.mobile}
                                    </TableCell>
                                    <TableCell className="[font-family:'Poppins',Helvetica] font-normal text-rectangle-164 text-xs tracking-[-0.12px] leading-[16.8px]">
                                        {user.city}
                                    </TableCell>
                                    <TableCell className="[font-family:'Poppins',Helvetica] font-normal text-rectangle-164 text-xs tracking-[-0.12px] leading-[16.8px]">
                                        {user.registration}
                                    </TableCell>
                                    <TableCell className="[font-family:'Poppins',Helvetica] font-medium text-rectangle-164 text-xs tracking-[-0.12px] leading-[16.8px]">
                                        {user.followers}
                                    </TableCell>
                                    <TableCell className="[font-family:'Poppins',Helvetica] font-medium text-rectangle-164 text-xs tracking-[-0.12px] leading-[16.8px]">
                                        {user.following}
                                    </TableCell>
                                    <TableCell className="[font-family:'Poppins',Helvetica] font-medium text-rectangle-164 text-xs tracking-[-0.12px] leading-[16.8px]">
                                        {user.posts}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-[7.6px]">
                                            <div className="relative w-[176.78px] h-[7.6px] bg-[#d9d9d957] rounded-[95.05px] overflow-hidden">
                                                <div
                                                    className={`h-2 ${user.completionColor} rounded-[95.05px]`}
                                                    style={{
                                                        width: `${(user.completion / 100) * 176.78}px`,
                                                    }}
                                                />
                                            </div>
                                            <span className="[font-family:'Poppins',Helvetica] font-medium text-rectangle-164 text-[11.4px] tracking-[-0.11px] leading-[16.0px] whitespace-nowrap">
                                                {user.completion} %
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-auto w-5 p-0"
                                                >
                                                    <MoreVerticalIcon className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-40"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleAction(
                                                            "View",
                                                            user.name,
                                                        )
                                                    }
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />{" "}
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleAction(
                                                            "Edit",
                                                            user.name,
                                                        )
                                                    }
                                                >
                                                    <Settings className="w-4 h-4 mr-2" />{" "}
                                                    Edit User
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() =>
                                                        handleAction(
                                                            "Delete",
                                                            user.name,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />{" "}
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <footer className="flex items-center justify-between p-6 w-full bg-white rounded-b-[20px] border-t border-[#edf1f3]">
                <p className="opacity-70 [font-family:'Poppins',Helvetica] font-normal text-rectangle-164 text-sm tracking-[0] leading-[21px]">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, 100)} list in{" "}
                    {currentPage} page
                </p>

                <nav className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-auto w-10 p-0"
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Button>

                    {paginationPages.map((page, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            onClick={() => setCurrentPage(index + 1)}
                            className={cn(
                                "h-auto w-10 rounded-[190px] font-medium text-sm transition-all",
                                currentPage === index + 1
                                    ? "bg-frame-4 text-white hover:bg-frame-4 hover:text-white"
                                    : "text-rectangle-165 hover:bg-transparent",
                            )}
                        >
                            {page.number}
                        </Button>
                    ))}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-auto w-10 p-0"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </Button>
                </nav>
            </footer>
        </section>
    );
};
