// Export Utilities for CSV/Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExportOptions {
  filename?: string;
  format?: 'csv' | 'xlsx';
  headers?: string[];
}

// Export data to CSV
export function exportToCSV(data: any[], options: ExportOptions = {}) {
  const { filename = 'export', headers } = options;

  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create CSV content
  const csvRows = [
    csvHeaders.join(','), // Header row
    ...data.map((row) =>
      csvHeaders.map((header) => {
        const value = row[header];
        // Escape commas and quotes
        if (value === null || value === undefined) return '';
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(',')
    ),
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
}

// Export data to Excel
export function exportToExcel(data: any[], options: ExportOptions = {}) {
  const { filename = 'export', headers } = options;

  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Prepare data for Excel
  const worksheetData = [
    csvHeaders, // Header row
    ...data.map((row) => csvHeaders.map((header) => row[header] || '')),
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, `${filename}.xlsx`);
}

// Export properties
export function exportProperties(properties: any[]) {
  const data = properties.map((prop) => ({
    Title: prop.title,
    Location: prop.location,
    Type: prop.type,
    Status: prop.status,
    Price: prop.price || '',
    Bedrooms: prop.bedrooms || '',
    Bathrooms: prop.bathrooms || '',
    'Square Feet': prop.squareFeet || '',
    'Created At': prop.createdAt ? new Date(prop.createdAt).toLocaleDateString() : '',
  }));

  exportToExcel(data, { filename: 'properties-export' });
}

// Export blog posts
export function exportBlogPosts(posts: any[]) {
  const data = posts.map((post) => ({
    Title: post.title,
    Slug: post.slug,
    Author: post.author,
    Status: post.status,
    Category: post.category || '',
    Tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
    'Published At': post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '',
    'Created At': post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '',
  }));

  exportToExcel(data, { filename: 'blog-posts-export' });
}

// Export subscribers
export function exportSubscribers(subscribers: any[]) {
  const data = subscribers.map((sub) => ({
    Email: sub.email,
    Verified: sub.verified ? 'Yes' : 'No',
    'Subscribed At': sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : '',
    'Verified At': sub.verifiedAt ? new Date(sub.verifiedAt).toLocaleDateString() : '',
  }));

  exportToExcel(data, { filename: 'subscribers-export' });
}

// Export analytics
export function exportAnalytics(analytics: any[]) {
  const data = analytics.map((item) => ({
    Date: item.date ? new Date(item.date).toLocaleDateString() : '',
    'Event Type': item.eventType,
    'Entity Type': item.entityType || '',
    'Entity ID': item.entityId || '',
    'Page Views': item.pageViews || 0,
    'Unique Visitors': item.uniqueVisitors || 0,
  }));

  exportToExcel(data, { filename: 'analytics-export' });
}

