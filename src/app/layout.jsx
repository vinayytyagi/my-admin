import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Providers } from './providers';



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          <Providers>
            {children}
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
} 