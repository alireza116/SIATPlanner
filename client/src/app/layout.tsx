"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from '@/stores/StoreProvider';
import NavBar from '@/components/NavBar/NavBar';
import { Box, Stack } from "@mui/material";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Stack direction="column" height="100%">
          <NavBar />
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {children}
            </Box>

          </Stack>
        </StoreProvider>
      </body>
    </html>
  );
}
