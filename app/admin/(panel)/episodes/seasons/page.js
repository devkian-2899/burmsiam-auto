"use client";

import { RecordList } from "../../../../../components/admin/record-list";

export default function SeasonsPage() {
  return (
    <RecordList
      title="Seasons"
      lead="A season and volume pair can be chosen on any episode."
      endpoint="/api/admin/seasons"
      collection="seasons"
      newHref="/admin/episodes/seasons/new"
      editBase="/admin/episodes/seasons/edit"
      searchPlaceholder="Season or volume"
      empty="No seasons yet."
      columns={[
        { key: "label", label: "Season" },
        { key: "season", label: "Season number" },
        { key: "volume", label: "Volume" },
      ]}
      renderRow={(row) => (
        <>
          <td>{row.label}</td>
          <td>{row.season}</td>
          <td>{row.volume}</td>
        </>
      )}
    />
  );
}
