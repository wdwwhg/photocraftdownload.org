type CheckRecord = {
  checkedAt: string;
  version: string;
  latestVersion: string;
  checkedFiles: number;
  status: string;
};

export function ReleaseCheckRecords({
  records,
  labels,
}: {
  records: CheckRecord[];
  labels: Record<string, string>;
}) {
  return (
    <div className="pc-guide-table">
      <table>
        <caption>{labels.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{labels.time}</th>
            <th scope="col">{labels.version}</th>
            <th scope="col">{labels.files}</th>
            <th scope="col">{labels.latest}</th>
            <th scope="col">{labels.result}</th>
          </tr>
        </thead>
        <tbody>
          {[...records].reverse().map((record) => (
            <tr key={record.checkedAt}>
              <td>
                <time dateTime={record.checkedAt}>
                  {record.checkedAt.replace('T', ' ').replace('Z', ' UTC')}
                </time>
              </td>
              <td>v{record.version}</td>
              <td>{record.checkedFiles}</td>
              <td>v{record.latestVersion}</td>
              <td>
                {record.status === 'passed' ? labels.passed : record.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
