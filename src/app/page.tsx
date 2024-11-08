"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { nanoid } from "nanoid";

import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import classes from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

type Post = { id: string; title: string; description: string };

type Posts = Post[];

export default function Home() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const validationCheck = () => {
    if (title.length === 0 || description.length === 0) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validationCheck()) return;
    setLoading(true);

    if (isEditing) {
      setPosts((prev: Post[]) => {
        const index = prev.findIndex((item: Post) => item.id === isEditing);
        if (index !== -1) {
          const updatedItem = [...prev];
          updatedItem[index] = { ...updatedItem[index], title, description };

          return updatedItem;
        }
        return prev;
      });
      toast.success("Post Updated Successfully");
    } else {
      const newPost: Post = {
        id: nanoid(),
        title,
        description,
      };
      setPosts((prev) => [...prev, newPost]);
      toast.success("Post Added Successfully");
    }
    setLoading(false);

    setIsEditing(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((item) => item.id !== id));
    toast.success("Post Deleted Successfully");
  };

  const handleUpdate = (item: any) => {
    setTitle(item?.title);
    setDescription(item?.description);
    setIsEditing(item?.id);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  return (
    <Container maxWidth="sm" className={classes.mainContainer}>
      <h2 className={classes.formHeading}>Form</h2>
      <TextField
        label="Title"
        className={classes.inputText}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Description"
        className={classes.inputText}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Button
        variant="contained"
        color="success"
        disabled={loading}
        onClick={(e) => handleSubmit(e)}
      >
        {loading ? "Loading....!" : isEditing ? "Update Post" : "Add Post"}
      </Button>
      {loading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      <ToastContainer autoClose={2000} />
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts?.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">{item.title}</TableCell>
                <TableCell align="right">{item.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleUpdate(item)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
