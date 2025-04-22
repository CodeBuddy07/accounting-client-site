import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEditTemplate, useTemplates } from "@/hooks/useTemplates"




export function SmsTemplatesPage() {

  const [currentTemplate, setCurrentTemplate] = useState<ITemplate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Use the template query hook
  const { data: templates, isLoading } = useTemplates();
  const { mutate: editTemplate } = useEditTemplate()

  const useableVariables = [
    "name", 
    "balance",
    "amount"
  ]

  const extractVariables = (content: string): string[] => {
    const regex = /\{([^}]+)\}/g
    const matches = []
    let match
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1])
    }
    return [...new Set(matches)] // Remove duplicates
  }

  const handleContentChange = (content: string) => {
    if (currentTemplate) {
      setCurrentTemplate({
        ...currentTemplate,
        content,
      })
    }
  }

  const handleSubmit = async () => {
    if (!currentTemplate) return
    
    try {
      // Call the edit mutation
      editTemplate({
        id: currentTemplate._id!,
        updates: {
          name: currentTemplate.name, // Include name even if not editable
          content: currentTemplate.content
        }
      })
      
      setIsDialogOpen(false)
      setCurrentTemplate(null)
    } catch (error) {
      console.error("Error updating template:", error)
    }
  }

  const handleEdit = (template: ITemplate) => {
    setCurrentTemplate(template)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">SMS Templates</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Templates</CardTitle>
          <CardDescription>
            Manage SMS templates with dynamic variables
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Loading templates...</div>
          ) : templates.length > 0 ? (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead>Variables</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template: ITemplate) => (
                    <TableRow key={template._id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <div className="line-clamp-2">
                          {template.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {extractVariables(template.content).map((variable) => (
                            <Badge
                              key={variable}
                              variant="secondary"
                              className="text-xs"
                            >
                              {`{${variable}}`}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(template)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-2">No templates found</p>
              <p className="text-sm text-muted-foreground">Try editing your search query or contact your administrator to create new templates.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Name field (read-only) */}
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input
                value={currentTemplate?.name || ''}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Template Content</label>
              <Textarea
                placeholder="Enter your template content here..."
                value={currentTemplate?.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="text-sm text-muted-foreground">
                Use curly braces for variables like {`{user}`}, {`{code}`}, etc.
              </div>
            </div>

            {currentTemplate && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Variables You Can Use:</div>
                <div className="flex flex-wrap gap-2">
                  {useableVariables.map((variable) => (
                    <Badge key={variable} className={extractVariables(currentTemplate?.content).includes(variable)? "bg-green-500" : ""} variant="outline">
                      {`{${variable}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setCurrentTemplate(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Update Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}