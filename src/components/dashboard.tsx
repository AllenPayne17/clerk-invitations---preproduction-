"use client";

import {Protect, useOrganization } from "@clerk/nextjs";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  

export const OrgDashboard = () => {

    const { isLoaded, memberships, invitations} = useOrganization(
        { 
          memberships: {
          },
          invitations: true,
        }
      );

    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }

    return(
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Invited</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { (invitations?.data?.length !== 0) ? invitations?.data?.map((inv: any, index: any) => (
            <TableRow key={index}>
              <TableCell className="font-medium"><p>{inv.emailAddress}</p></TableCell>
              <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{inv.role.split("org:").map((word:any) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <Protect
                permission="org:sys_memberships:manage"
              >
              <TableCell>
              <Popover>
                <PopoverTrigger>
                  <p className="text-lg text-right font-bold cursor-pointe">...</p>
                </PopoverTrigger>
                <PopoverContent className="w-[130px]">
                  <p className="text-xs text-center text-red-500 cursor-pointer" 
                  onClick={async () => {
                    await inv.revoke()
                    await Promise.all([
                      memberships?.revalidate,
                      invitations?.revalidate,
                    ])
                  }}
                  >
                    revoke invitation
                  </p>
                </PopoverContent>
              </Popover>
              </TableCell>
              </Protect>
            </TableRow> 
          ))
          : 
          <TableRow>
            <TableCell colSpan={5} className="text-center">No invitations found.</TableCell>
          </TableRow>
          }
        </TableBody>
        </Table>  
    )
}