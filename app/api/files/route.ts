import { NextResponse } from 'next/server';
import { getAllFiles } from '@/lib/data';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const headersList = headers();
  const accept = headersList.get('accept');

  // If client accepts text/event-stream, set up SSE
  if (accept === 'text/event-stream') {
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        const sendUpdate = () => {
          try {
            const allFiles = getAllFiles();
            const data = `data: ${JSON.stringify(allFiles)}\n\n`;
            controller.enqueue(encoder.encode(data));
          } catch (error) {
            console.error('Error sending SSE update:', error);
          }
        };

        // Send initial data
        sendUpdate();

        // Keep connection alive
        const keepAlive = setInterval(() => {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        }, 30000);

        // Clean up on close
        request.signal.addEventListener('abort', () => {
          clearInterval(keepAlive);
          controller.close();
        });
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  // Regular JSON response for normal requests
  try {
    const allFiles = getAllFiles();
    return NextResponse.json(allFiles, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to get files:', error);
    return NextResponse.json({ error: 'Failed to get files' }, { status: 500 });
  }
}
