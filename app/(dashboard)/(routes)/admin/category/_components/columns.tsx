"use client"

import { Category } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Delete, Trash } from "lucide-react"
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';
import { useState } from 'react';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { useRouter } from 'next/navigation';
import axios from 'axios';


const ConfirmDeleteButton: React.FC<{ categoryId: string }> = ({ categoryId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
  
	const onDelete = async () => {
	  try {
		setIsLoading(true);
  
		await axios.delete(`/api/category/${categoryId}`);
  
		toast.success("Category deleted");
		router.refresh();
		router.push(`/admin/category`);
	  } catch (error) {
		console.error("Error deleting category:", error);
		toast.error("Something went wrong");
	  } finally {
		setIsLoading(false);
	  }
	};
  
	return (
	  <ConfirmModal onConfirm={onDelete}>
		<Button size="sm" disabled={isLoading}>
		  <Trash className="h-4 w-4" />
		</Button>
	  </ConfirmModal>
	);
  };
  
export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
	  return <ConfirmDeleteButton categoryId={id} />;
    }
  }
]
