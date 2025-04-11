import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  
  interface SmartPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export const SmartPagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: SmartPaginationProps) => {
    const getVisiblePages = (): (number | string)[] => {
      const pages: (number | string)[] = [];
  
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
  
        if (currentPage > 3) pages.push("...");
  
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
  
        for (let i = start; i <= end; i++) pages.push(i);
  
        if (currentPage < totalPages - 2) pages.push("...");
  
        pages.push(totalPages);
      }
  
      return pages;
    };
  
    return (
      totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              />
            </PaginationItem>
  
            {getVisiblePages().map((page, idx) => (
              <PaginationItem key={idx}>
                {page === "..." ? (
                  <span className="px-2 text-muted-foreground">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={() => onPageChange(page as number)}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
  
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  onPageChange(Math.min(currentPage + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
    );
  };
  