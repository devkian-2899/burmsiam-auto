"use client";

import { RecordList } from "../../../../../components/admin/record-list";

export default function ProgramsPage() {
  return (
    <RecordList
      title="Programs"
      lead="Create, edit, and remove programs."
      endpoint="/api/admin/programs"
      collection="programs"
      newHref="/admin/episodes/programs/new"
      editBase="/admin/episodes/programs/edit"
      searchPlaceholder="Abbreviation or name"
      empty="No programs yet."
      columns={[
        { key: "sortingno", label: "Sorting no" },
        { key: "abbr", label: "Abbreviation" },
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
      ]}
      renderRow={(row) => (
        <>
          <td>{row.sortingno}</td>
          <td>{row.abbr}</td>
          <td>{row.name}</td>
          <td>{row.description}</td>
        </>
      )}
    />
  );
}
