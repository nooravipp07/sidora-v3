import { NextRequest, NextResponse } from 'next/server';
import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  const health: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    checks: {},
  };

  try {
    // Check 1: NEXT_PUBLIC_APP_URL
    health.checks.appUrl = {
      configured: !!process.env.NEXT_PUBLIC_APP_URL,
      value: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
      status: process.env.NEXT_PUBLIC_APP_URL ? 'OK' : 'WARNING',
    };

    // Check 2: Upload directories
    const uploadPaths = [
      process.env.UPLOADS_DIR,
      '/app/public/uploads/berita',
      '/tmp/uploads/berita',
      join(process.cwd(), 'public', 'uploads', 'berita'),
    ].filter(Boolean) as string[];

    health.checks.uploadDirs = [];
    for (const path of uploadPaths) {
      try {
        const exists = existsSync(path);
        if (exists) {
          const stats = statSync(path);
          health.checks.uploadDirs.push({
            path,
            exists: true,
            isDirectory: stats.isDirectory(),
            status: 'OK',
          });
        } else {
          health.checks.uploadDirs.push({
            path,
            exists: false,
            status: 'NOT_FOUND',
          });
        }
      } catch (e) {
        health.checks.uploadDirs.push({
          path,
          error: (e as Error).message,
          status: 'ERROR',
        });
      }
    }

    // Check 3: Database connection (if possible)
    health.checks.database = {
      configured: !!process.env.DATABASE_URL,
      url: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
    };

    // Check 4: Disk space
    try {
      const { stdout } = await execAsync('df -h /tmp | tail -1');
      const parts = stdout.trim().split(/\s+/);
      health.checks.diskSpace = {
        filesystem: parts[0],
        total: parts[1],
        used: parts[2],
        available: parts[3],
        percentUsed: parts[4],
        status: parseInt(parts[4]) > 80 ? 'WARNING' : 'OK',
      };
    } catch (e) {
      health.checks.diskSpace = {
        status: 'UNAVAILABLE',
        error: (e as Error).message,
      };
    }

    // Overall status
    const hasErrors = Object.values(health.checks).some((check: any) => 
      check.status === 'ERROR' || (typeof check.status === 'string' && check.status === 'NOT_FOUND')
    );
    const hasWarnings = Object.values(health.checks).some((check: any) => 
      check.status === 'WARNING' || (Array.isArray(check) && check.some((c: any) => c.status === 'WARNING'))
    );

    health.status = hasErrors ? 'CRITICAL' : hasWarnings ? 'WARNING' : 'HEALTHY';

    return NextResponse.json(health, {
      status: hasErrors ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
