import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
  filename: string;
  sheetName?: string;
}

export interface ExcelImportOptions {
  sheetName?: string;
}

/**
 * Export data to Excel file
 */
export async function exportToExcel(
  data: any[],
  columns: string[],
  options: ExcelExportOptions
) {
  try {
    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(data, { header: columns });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Sheet1');

    // Set column widths
    const colWidths = columns.map(() => 20);
    ws['!cols'] = colWidths.map(w => ({ wch: w }));

    // Trigger download
    XLSX.writeFile(wb, options.filename);
    
    return { success: true, message: 'File exported successfully' };
  } catch (error) {
    console.error('Export error:', error);
    throw new Error(`Failed to export Excel file: ${error}`);
  }
}

/**
 * Import data from Excel file
 */
export async function importFromExcel(
  file: File,
  options?: ExcelImportOptions
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = options?.sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          reject(new Error(`Sheet "${sheetName}" not found in Excel file`));
          return;
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: ''
        });

        resolve(jsonData);
      } catch (error) {
        reject(new Error(`Failed to import Excel file: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Create Excel file blob from data
 */
export function createExcelBlob(
  data: any[],
  columns: string[],
  sheetName: string = 'Sheet1'
): Blob {
  const ws = XLSX.utils.json_to_sheet(data, { header: columns });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Set column widths
  const colWidths = columns.map(() => 20);
  ws['!cols'] = colWidths.map(w => ({ wch: w }));

  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as unknown as Blob;
}

/**
 * Parse Excel data with validation
 */
export async function parseExcelWithValidation(
  file: File,
  requiredColumns: string[],
  options?: ExcelImportOptions
): Promise<{ data: any[]; errors: string[] }> {
  try {
    const jsonData = await importFromExcel(file, options);

    if (jsonData.length === 0) {
      return {
        data: [],
        errors: ['Excel file is empty']
      };
    }

    const errors: string[] = [];

    // Validate headers
    const actualColumns = Object.keys(jsonData[0]);
    const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));

    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Validate data
    const validatedData = jsonData.map((row, index) => {
      const validatedRow: any = { ...row };
      const rowErrors: string[] = [];

      // Check required fields
      requiredColumns.forEach(col => {
        if (!row[col] || (typeof row[col] === 'string' && row[col].trim() === '')) {
          rowErrors.push(`Row ${index + 2}: ${col} is required`);
        }
      });

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      }

      return validatedRow;
    });

    return { data: validatedData, errors };
  } catch (error) {
    return {
      data: [],
      errors: [error instanceof Error ? error.message : 'Unknown error occurred']
    };
  }
}
