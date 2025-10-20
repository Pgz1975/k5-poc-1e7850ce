import React from 'react';
import { PDFUploader } from '@/components/PDFUploader';

const PDFDemo = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">K5 PDF Parsing System</h1>
          <p className="text-xl text-muted-foreground">
            Bilingual Educational PDF Processing for K-5 Students
          </p>
        </div>

        <PDFUploader />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">🌍 Bilingual Support</h3>
            <p className="text-sm text-muted-foreground">
              Extract and process both Spanish and English text with 95%+ accuracy
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">📚 8 Core Tables</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive data model with FERPA/COPPA compliance
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">⚡ Fast Processing</h3>
            <p className="text-sm text-muted-foreground">
              Single pages in &lt;3s, full documents in &lt;45s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDemo;
