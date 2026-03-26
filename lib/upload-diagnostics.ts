/**
 * Upload Diagnostics Utility
 * 
 * Usage: Add ?debug=true to any page, then check browser console
 * Or manually call: runUploadDiagnostics()
 */

export async function runUploadDiagnostics() {
  console.log('=== UPLOAD DIAGNOSTICS START ===\n');

  try {
    // Check 1: Environment
    console.log('1. Environment Check:');
    console.log('   NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'NOT SET');
    console.log('   Current URL:', window.location.href);
    console.log('   Current hostname:', window.location.hostname);
    console.log('');

    // Check 2: API Health
    console.log('2. API Health Check:');
    try {
      const healthResponse = await fetch('/api/health');
      const health = await healthResponse.json();
      console.log('   Health status:', health.status);
      console.log('   Upload directories:', health.checks?.uploadDirs);
      console.log('   Disk space:', health.checks?.diskSpace);
      console.log('   App URL config:', health.checks?.appUrl);
    } catch (e) {
      console.error('   Health check failed:', e);
    }
    console.log('');

    // Check 3: Test Small Upload
    console.log('3. Testing Small Upload (1KB):');
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, 10, 10);
      }

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });

      const formData = new FormData();
      formData.append('file', blob, 'test.png');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadResponse.ok) {
        console.log('   ✅ Upload successful!');
        console.log('   URL returned:', uploadData.url);
        
        // Try to fetch the image
        console.log('\n4. Verifying Image Accessibility:');
        try {
          const imageResponse = await fetch(uploadData.url);
          if (imageResponse.ok) {
            console.log('   ✅ Image is accessible!');
          } else {
            console.warn(`   ⚠️ Image returned ${imageResponse.status}`);
          }
        } catch (e) {
          console.error('   ❌ Image not accessible:', e);
        }
      } else {
        console.error('   ❌ Upload failed:', uploadData);
      }
    } catch (e) {
      console.error('   ❌ Upload test error:', e);
    }
    console.log('');

    // Check 4: Recommendations
    console.log('5. Recommendations:');
    console.log('   If upload failed, check:');
    console.log('   - Environment variables: NEXT_PUBLIC_APP_URL, UPLOADS_DIR');
    console.log('   - File system permissions in /tmp/uploads/');
    console.log('   - Server disk space (df -h)');
    console.log('   - Application logs (docker logs or server logs)');
    console.log('\n=== UPLOAD DIAGNOSTICS END ===');

  } catch (error) {
    console.error('Diagnostics error:', error);
  }
}

// Auto-run if debug flag is set
if (typeof window !== 'undefined') {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('debug')) {
    runUploadDiagnostics();
  }
}
