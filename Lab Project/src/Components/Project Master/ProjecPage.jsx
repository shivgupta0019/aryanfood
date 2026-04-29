

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import ProjectTable from './ProjectTable';

export default function ProjecPage() {
  const [records, setRecords] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("project")) || [];
    setRecords(stored);
  }, [location]);

  function handleDelete(index) {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");

    if (confirmDelete) {
      const filtered = records.filter((_, i) => i !== index);
      setRecords(filtered);
      localStorage.setItem("project", JSON.stringify(filtered));
    }
  }

  return (
    <ProjectTable
      records={records}
      handleDelete={handleDelete}
    />
  );
}
