import { useState } from "react";
import { Trash2, Plus, Search, Edit, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAddProduct, useDeleteProduct, useEditProduct, useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartPagination } from "@/components/ui/SmartPagination";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";



const ProductManagement = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: productData, isLoading } = useProducts({ page: currentPage, limit: 10, search });

  // Add Product States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", buyingPrice: 0, sellingPrice: 0, note: "" });
  const [editingProduct, setEditingProduct] = useState({ name: "", buyingPrice: 0, sellingPrice: 0, note: "" });
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const { mutate: addProduct } = useAddProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: editProduct } = useEditProduct();


  const handleDelete = (id: string) => {
    
      deleteProduct(id);
      setSelectedProduct(undefined);
    
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.buyingPrice || !newProduct.sellingPrice) {
      toast.error("Required Feilds", { description: "Name and prices are required!" })
      return;
    };
    addProduct(newProduct);
    setNewProduct({ name: "", buyingPrice: 0, sellingPrice: 0, note: "" });
    setIsDialogOpen(false);
  };

  const handleEditProduct = (id: string) => {
    if (!editingProduct.name || !editingProduct.buyingPrice || !editingProduct.sellingPrice) {
      toast.error("Required Feilds", { description: "Name and prices are required!" })
      return;
    }

    editProduct({ id, updates: editingProduct });
    setIsEditDialogOpen(false);
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
              <div className="flex gap-4">
                <div className="space-y-2 w-full">
                  <Label className="!px-1" htmlFor="buyingPrice">Buying Price</Label>
                  <Input
                    id="buyingPrice"
                    type="number"
                    placeholder="Enter Buying Price"
                    value={newProduct.buyingPrice || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, buyingPrice: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label className="!px-1" htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    placeholder="Enter Selling Price"
                    value={newProduct.sellingPrice || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) })
                    }
                  />
                </div>
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
                defaultValue={selectedProduct?.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
              <div className="flex gap-4">
                <div className="space-y-2 w-full">
                  <Label className="!px-1" htmlFor="buyingPrice">Buying Price</Label>
                  <Input
                    id="buyingPrice"
                    type="number"
                    placeholder="Enter Buying Price"
                    value={editingProduct.buyingPrice || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        buyingPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label className="!px-1" htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    placeholder="Enter Selling Price"
                    value={editingProduct.sellingPrice || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sellingPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <Textarea
                placeholder="Note (optional)"
                defaultValue={selectedProduct?.note}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, note: e.target.value })
                }
              />
              <Button className="w-full" onClick={() => handleEditProduct(selectedProduct!._id)}>
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <Card className="bg-white dark:bg-stone-950 text-gray-900 dark:text-gray-100 ">
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
                {isLoading ? (
                  // Loading Skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell> {/* Name */}
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>  {/* Buying Price */}
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>  {/* Selling Price */}
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell> {/* Note */}
                      <TableCell className="flex gap-2 justify-end">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </TableCell> {/* Actions */}
                    </TableRow>
                  ))
                ) : productData.data.length === 0 ? (
                  // No Products Message
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Inbox className="w-10 h-10 mb-2 text-gray-400" />
                        <p className="text-base font-medium">No Products found</p>
                        <p className="text-sm text-gray-400">Start by adding a new product to see them listed here.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Actual Product Rows
                  productData.data.map((product: Product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.buyingPrice}</TableCell>
                      <TableCell>{product.sellingPrice}</TableCell>

                      {/* Note Column with Tooltip */}
                      <TableCell className="max-w-[150px] truncate">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-pointer truncate block">{product.note || "—"}</span>
                          </TooltipTrigger>
                          <TooltipContent>{product.note || "No note provided"}</TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditDialogOpen(true);
                            setEditingProduct({ name: product.name, buyingPrice: product.buyingPrice, sellingPrice: product.sellingPrice, note: product.note });
                          }}
                        >
                          <Edit className="text-blue-600" size={16} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this Product?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action is permanent and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setSelectedProduct(undefined)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  if (selectedProduct!._id) handleDelete(selectedProduct!._id);
                                }}
                              >
                                Yes, delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}

              </TableBody>
            </Table>

          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <SmartPagination
        currentPage={currentPage}
        totalPages={productData?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ProductManagement;
