'use client';

import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image as ImageIcon, File } from 'lucide-react';

interface DocumentDownloadProps {
  property: Property;
}

interface Document {
  id: string;
  name: string;
  type: 'brochure' | 'floorplan' | 'legal' | 'other';
  url: string;
  size?: string;
}

export function DocumentDownload({ property }: DocumentDownloadProps) {
  // In a real implementation, documents would come from the property data or API
  // For now, we'll create a structure that can be extended
  const documents: Document[] = [];

  // Add documents if they exist in property data (using type assertion for optional fields)
  const propertyWithDocs = property as Property & { documents?: Document[]; floorPlan?: string };
  
  if (propertyWithDocs.documents && Array.isArray(propertyWithDocs.documents)) {
    documents.push(...propertyWithDocs.documents);
  }

  // Example: If property has a floor plan image, add it
  if (propertyWithDocs.floorPlan) {
    documents.push({
      id: 'floorplan',
      name: `${property.title} - Floor Plan`,
      type: 'floorplan',
      url: propertyWithDocs.floorPlan,
      size: '~500 KB',
    });
  }

  if (documents.length === 0) {
    return null;
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'brochure':
        return <FileText className="h-5 w-5" />;
      case 'floorplan':
        return <ImageIcon className="h-5 w-5" />;
      case 'legal':
        return <File className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'brochure':
        return 'Property Brochure';
      case 'floorplan':
        return 'Floor Plan';
      case 'legal':
        return 'Legal Documents';
      default:
        return 'Document';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Download className="h-6 w-6" />
          Documents & Downloads
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Download property brochures, floor plans, and legal documents
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {getDocumentIcon(doc.type)}
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {getDocumentTypeLabel(doc.type)}
                    {doc.size && ` • ${doc.size}`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Open in new tab or trigger download
                  window.open(doc.url, '_blank');
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No documents available for this property.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

