"use client";
import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import { MdMenu } from "react-icons/md"; // icon menu
import Link from "next/link";

export default function PopupMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Icon Menu ở góc phải trên */}
      <IconButton
        onClick={() => setOpen(true)}
        color="primary"
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": { bgcolor: "grey.100" },
        }}
      >
        <MdMenu size={26} />
      </IconButton>

      {/* Popup */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 240,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: "center", pb: 1 }}>
          Menu
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          <List>
            <ListItemButton
              component={Link}
              href="/"
              onClick={() => setOpen(false)}
            >
              <ListItemText primary=" Trang chủ" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              href="/test"
              onClick={() => setOpen(false)}
            >
              <ListItemText primary=" Test" />
            </ListItemButton>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
