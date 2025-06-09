"use client";

import React, { FormEvent, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CreateDoc() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const URL = process.env.NEXT_PUBLIC_HTTP_URL ?? "http://localhost:8080";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const userId = Cookies.get("userId");
    console.log(userId);
    if (!userId) {
      console.error("User ID not found in cookies");
      return;
    }
    try {
      const response = await axios.post(
        `${URL}/docs/create-docs`,
        {
          title,
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      router.push(`/documents/${response.data.data._id}`);
      console.log("Document created successfully:", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Create Document</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Document Title</label>
        <br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          placeholder="Document Title"
          required
        />
        <br />
        <button type="submit" className="hover:cursor-pointer bg-red-500">
          Create Document
        </button>
      </form>
    </div>
  );
}
