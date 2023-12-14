import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { z } from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const CategoryPage = async () => {

const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const category = await db.category.findMany();

  return ( 
    <div className="p-6">
        <DataTable columns={columns} data={category} />
    </div>
   );
}
 
export default CategoryPage;