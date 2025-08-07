import { NextResponse } from 'next/server';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';
import { existsSync } from 'fs';

import { auth } from '@/app/(auth)/auth';

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    // Update the file type based on the kind of files you want to accept
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'File type should be JPEG or PNG',
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.issues
        .map((issue) => issue.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const originalFilename = (formData.get('file') as File).name;
    const fileBuffer = await file.arrayBuffer();

    try {
      // Generate a unique filename to avoid conflicts
      const fileExtension = originalFilename.split('.').pop() || '';
      const uniqueFilename = `${nanoid()}-${originalFilename}`;
      
      // Create the full path to save the file
      const uploadDir = join(process.cwd(), 'public', 'upload');
      
      // Ensure upload directory exists
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      const filePath = join(uploadDir, uniqueFilename);
      
      // Convert ArrayBuffer to Buffer for writing
      const buffer = Buffer.from(fileBuffer);
      
      // Save file to local storage
      await writeFile(filePath, buffer);
      
      // Return data in the same format as Vercel Blob
      const data = {
        url: `/upload/${uniqueFilename}`,
        pathname: uniqueFilename,
        contentType: file.type,
        size: file.size,
      };

      return NextResponse.json(data);
    } catch (error) {
      console.error('File upload error:', error);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
