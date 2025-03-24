import { useState } from "react";
import { Trash2, Plus, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";



const ProductManagement = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Laptop", buyingPrice: 500, sellingPrice: 700, note: "High-performance business laptop" },
    { id: 2, name: "Smartphone", buyingPrice: 200, sellingPrice: 350, note: "Latest model with 5G support" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  // Add Product States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", buyingPrice: "", sellingPrice: "", note: "" });
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.buyingPrice || !newProduct.sellingPrice) return;
    setProducts([
      ...products,
      {
        id: products.length + 1,
        name: newProduct.name,
        buyingPrice: Number(newProduct.buyingPrice),
        sellingPrice: Number(newProduct.sellingPrice),
        note: "No notes available",
      },
    ]);
    setNewProduct({ name: "", buyingPrice: "", sellingPrice: "", note: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Page Heading */}
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Manage Products
      </h1>

      <div className="flex justify-between items-center">
        <div className="relative w-full mr-5">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Add Product Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            {/* Add Product Form */}
            <div className="space-y-3">
              <Input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Buying Price"
                  type="number"
                  value={newProduct.buyingPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, buyingPrice: e.target.value })}
                />
                <Input
                  placeholder="Selling Price"
                  type="number"
                  value={newProduct.sellingPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Note (optional)"
                value={newProduct?.note}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, note: e.target.value })
                }
              />
              <Button className="w-full" onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Product dialog */}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Product</DialogTitle>
            </DialogHeader>
            {/* Add Product Form */}
            <div className="space-y-3">
              <Input
                placeholder="Product Name"
                value={selectedProduct?.name}

              />
              <div className="flex gap-2">
                <Input
                  placeholder="Buying Price"
                  type="number"
                  value={selectedProduct?.buyingPrice}

                />
                <Input
                  placeholder="Selling Price"
                  type="number"
                  value={selectedProduct?.sellingPrice}

                />
              </div>
              <Textarea
                placeholder="Note (optional)"
                value={selectedProduct?.note}
              />
              <Button className="w-full" onClick={handleAddProduct}>
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Buying Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.buyingPrice}</TableCell>
                      <TableCell>{product.sellingPrice}</TableCell>
                      {/* Note Column with Tooltip */}
                      <TableCell className="max-w-[150px] truncate">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-pointer truncate block">{product.note}</span>
                          </TooltipTrigger>
                          <TooltipContent>{product.note}</TooltipContent>
                        </Tooltip>
                      </TableCell>
                      {/* Actions */}
                      <TableCell className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedProduct(product); setIsEditDialogOpen(true) }}>
                          <Edit className="text-blue-600" size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductManagement;
