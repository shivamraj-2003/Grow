import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";

type Data = {
  id: string;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
};

const Table: React.FC = () => {
  const [detail, setDetails] = useState<Data[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Data[]>([]);
  const [page, setPage] = useState(1);
  const [visitedPages, setVisitedPages] = useState<Set<number>>(new Set()); 

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=10`
      );
      setDetails(response.data.data);
      setTotalRecords(response.data.pagination.total);

      if (visitedPages.has(page)) {
        setSelectedRows([]); 
      } else {
        setVisitedPages((prev) => new Set(prev.add(page))); 
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const onSelectionChange = (e: { value: Data[] }) => {
    setSelectedRows(e.value);
  };

  const totalPages = Math.ceil(totalRecords / 10);

  return (
    <div className="p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen">
      <div className="rounded-xl shadow-lg bg-white p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center animate-bounce">
          Table Data
        </h2>
        <DataTable
  value={detail}
  loading={loading}
  selection={selectedRows}
  onSelectionChange={onSelectionChange}
  dataKey="id"
  selectionMode="multiple" 
  className="rounded-lg overflow-hidden"
>
  <Column
    selectionMode="multiple"
    headerStyle={{ width: "3em" }}
    className="hover:bg-blue-100"
  ></Column>
  <Column
    field="title"
    header="Title"
    bodyClassName="hover:bg-yellow-100 transition duration-300"
  ></Column>
  <Column
    field="place_of_origin"
    header="Place of Origin"
    bodyClassName="hover:bg-yellow-100 transition duration-300"
  ></Column>
  <Column
    field="artist_display"
    header="Artist Display"
    bodyClassName="hover:bg-yellow-100 transition duration-300"
  ></Column>
  <Column
    field="inscriptions"
    header="Inscriptions"
    bodyClassName="hover:bg-yellow-100 transition duration-300"
  ></Column>
  <Column
    field="date_start"
    header="Start Date"
    bodyClassName="hover:bg-yellow-100 transition duration-300"
  ></Column>
  <Column
    field="date_end"
    header="End Date"
    bodyClassName="hover:bg-yellow-100 transition duration-300"
  ></Column>
</DataTable>

      </div>

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => onPageChange(1)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          disabled={page === 1}
        >
          First
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="text-white text-lg font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          disabled={page === totalPages}
        >
          Next
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          disabled={page === totalPages}
        >
          Last
        </button>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-600">Selected Rows:</h3>
        <ul className="list-disc list-inside">
          {selectedRows.map((row) => (
            <li key={row.id} className="text-gray-700">
              {row.title} (ID: {row.id})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Table;
