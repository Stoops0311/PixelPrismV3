"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DS2Column<T = any> {
  key: string
  label: string
  align?: "left" | "right"
  isData?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

interface DS2PaginationConfig {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

function DS2DataTable<T extends Record<string, any>>({
  columns,
  data,
  pagination,
}: {
  columns: DS2Column<T>[]
  data: T[]
  pagination?: DS2PaginationConfig
}) {
  return (
    <div
      className="border border-[rgba(244,185,100,0.12)] sb-table-dimming"
      style={{
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
      }}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.align === "right" ? "text-right" : ""}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => {
                const value = row[col.key]
                const content = col.render ? col.render(value, row) : value

                return (
                  <TableCell
                    key={col.key}
                    className={cn(
                      col.align === "right" && "text-right",
                      col.isData && "sb-data"
                    )}
                  >
                    {content}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(244,185,100,0.06)]">
          <span
            className="sb-data"
            style={{ color: "#6d8d9f", fontSize: 12 }}
          >
            {(pagination.page - 1) * pagination.pageSize + 1} &mdash;{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            of {pagination.total}
          </span>
          <div className="flex gap-2">
            <Button
              className="sb-btn-secondary !min-h-[36px] !px-3 !py-1 !text-xs"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              &larr;
            </Button>
            <Button
              className="sb-btn-secondary !min-h-[36px] !px-3 !py-1 !text-xs"
              disabled={
                pagination.page * pagination.pageSize >= pagination.total
              }
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              &rarr;
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { DS2DataTable }
export type { DS2Column, DS2PaginationConfig }
